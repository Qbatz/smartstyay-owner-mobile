// Apple subscription purchase flow (iOS). Free of React and native imports so it
// can be unit tested; AppleSubscriptionContext wires in the real dependencies.
//
// Purchase: App Store checks -> StoreKit purchase -> onPurchaseCompleted
// (post-purchase step) -> finish the transaction. No backend call before the
// purchase. It also handles transactions StoreKit delivers outside a purchase
// (relaunch after an interrupted purchase, Ask to Buy approval, renewals) and restores.

export const APPLE_PURCHASE_STATUS = {
  IDLE: "idle",
  PREPARING: "preparing", // App Store checks
  PURCHASING: "purchasing", // App Store payment sheet
  COMPLETING: "completing", // post-purchase step + finishing the transaction
  RESTORING: "restoring",
};

export const APPLE_PURCHASE_SOURCE = {
  PURCHASE: "purchase", // purchase started in this session
  RECOVERED: "recovered", // completed outside it: interrupted purchase, Ask to Buy approval, another device
  RENEWAL: "renewal",
  RESTORE: "restore",
};

// StoreKit's result event normally arrives before requestSubscription resolves.
// This only keeps the UI from waiting forever if it doesn't; a late event is
// still handled as a recovered transaction.
const PURCHASE_EVENT_TIMEOUT_MS = 5000;

const isRenewal = (purchase) => purchase.transactionReasonIOS === "RENEWAL";

export const createAppleSubscriptionFlow = ({
  iap,
  productId,
  onPurchaseCompleted,
  pendingPurchaseStore,
  notify,
  onStatusChange = () => {},
  log = console.log,
  eventTimeoutMs = PURCHASE_EVENT_TIMEOUT_MS,
}) => {
  let status = APPLE_PURCHASE_STATUS.IDLE;
  // Bumped by stop() so work started before a logout doesn't touch the next session.
  let generation = 0;
  let startPromise = null;
  let removeListeners = null;
  let product = null;
  let inFlight = null;
  // StoreKit can deliver the same transaction through more than one path.
  const handledTransactionIds = new Set();

  const setStatus = (next) => {
    status = next;
    onStatusChange(next);
  };

  const settle = (entry, outcome) => {
    if (!entry || entry.settled) return;
    entry.settled = true;
    clearTimeout(entry.timer);
    entry.resolve(outcome);
  };

  const finishQuietly = async (purchase) => {
    try {
      await iap.finish(purchase);
    } catch (error) {
      // Still unfinished, so StoreKit redelivers it on the next launch.
      log("Apple IAP: finishing transaction failed", purchase.id, error);
    }
  };

  // Runs the post-purchase step once per transaction, then finishes it. If the
  // step throws, the transaction stays unfinished and StoreKit redelivers it.
  const handleTransaction = async (purchase, source, context) => {
    const transactionId = purchase?.id;
    if (!transactionId || handledTransactionIds.has(transactionId)) return false;
    handledTransactionIds.add(transactionId);

    try {
      await onPurchaseCompleted({
        purchase,
        planCode: context?.planCode ?? null,
        source,
      });
    } catch (error) {
      handledTransactionIds.delete(transactionId);
      throw error;
    }

    await finishQuietly(purchase);
    if (source !== APPLE_PURCHASE_SOURCE.RENEWAL) {
      await pendingPurchaseStore.clear();
    }
    return true;
  };

  const handleDeliveredTransaction = async (purchase) => {
    if (handledTransactionIds.has(purchase.id)) return;
    const source = isRenewal(purchase)
      ? APPLE_PURCHASE_SOURCE.RENEWAL
      : APPLE_PURCHASE_SOURCE.RECOVERED;
    try {
      const context =
        source === APPLE_PURCHASE_SOURCE.RECOVERED ? await pendingPurchaseStore.load() : null;
      await handleTransaction(purchase, source, context);
    } catch (error) {
      log("Apple IAP: post-purchase step failed, StoreKit will redeliver", purchase.id, error);
    }
  };

  const onPurchaseUpdated = (purchase) => {
    if (purchase?.productId !== productId || purchase.purchaseState !== "purchased") return;

    if (inFlight && !inFlight.settled && !isRenewal(purchase)) {
      settle(inFlight, { type: "purchased", purchase });
      return;
    }
    handleDeliveredTransaction(purchase);
  };

  const onPurchaseError = (error) => {
    if (!inFlight || inFlight.settled) {
      log("Apple IAP: purchase error outside a purchase", error);
      return;
    }
    if (error?.productId && error.productId !== productId) return;
    settle(inFlight, { type: "error", error });
  };

  const recoverUnfinishedTransactions = async () => {
    let unfinished = [];
    try {
      unfinished = await iap.getUnfinishedTransactions();
    } catch (error) {
      log("Apple IAP: could not read unfinished transactions", error);
      return;
    }
    for (const purchase of unfinished) {
      if (purchase?.productId === productId) {
        await handleDeliveredTransaction(purchase);
      }
    }
  };

  const loadProduct = async () => {
    if (!product) {
      product = await iap.getSubscriptionProduct(productId);
    }
    return product;
  };

  // Connects to the App Store and picks up transactions an earlier session left
  // unfinished. Safe to call repeatedly; a failed start is retried on the next call.
  const start = () => {
    if (!startPromise) {
      if (!removeListeners) {
        removeListeners = iap.addPurchaseListeners(onPurchaseUpdated, onPurchaseError);
      }
      startPromise = (async () => {
        await iap.connect();
        await recoverUnfinishedTransactions();
        loadProduct().catch((error) => log("Apple IAP: product prefetch failed", error));
      })();
      startPromise.catch(() => {
        startPromise = null;
      });
    }
    return startPromise;
  };

  const stop = async () => {
    generation += 1;
    settle(inFlight, { type: "stopped" });
    inFlight = null;
    startPromise = null;
    product = null;
    setStatus(APPLE_PURCHASE_STATUS.IDLE);
    if (removeListeners) {
      removeListeners();
      removeListeners = null;
    }
    try {
      await iap.disconnect();
    } catch (error) {
      log("Apple IAP: disconnect failed", error);
    }
  };

  const requestAndWait = () =>
    new Promise((resolve) => {
      const entry = { settled: false, resolve, timer: null };
      inFlight = entry;
      iap
        .requestSubscription({ productId })
        .then(() => {
          if (!entry.settled) {
            entry.timer = setTimeout(
              () => settle(entry, { type: "unconfirmed" }),
              eventTimeoutMs,
            );
          }
        })
        .catch((error) => settle(entry, { type: "error", error }));
    });

  const handlePurchaseError = async (error) => {
    const kind = iap.getErrorKind(error);
    if (kind === "pending") {
      // Keep the saved context: the approved transaction arrives later as "recovered".
      notify("purchase-pending");
      return "pending";
    }
    await pendingPurchaseStore.clear();
    if (kind === "cancelled") return "cancelled";
    if (kind === "already-subscribed") {
      notify("already-subscribed");
      return "already-subscribed";
    }
    notify(kind === "network" ? "network-error" : "purchase-failed", {
      message: iap.getErrorMessage(error),
    });
    return "failed";
  };

  const purchase = async (planCode) => {
    // Checked and set synchronously, so repeated taps can't start a second purchase.
    if (status !== APPLE_PURCHASE_STATUS.IDLE) return "busy";
    const gen = generation;
    const stale = () => gen !== generation;
    setStatus(APPLE_PURCHASE_STATUS.PREPARING);

    try {
      await start();
      if (stale()) return "stopped";

      const subscriptionProduct = await loadProduct().catch((error) => {
        log("Apple IAP: product not available", error);
        return null;
      });
      if (stale()) return "stopped";
      if (!subscriptionProduct) {
        notify("product-unavailable");
        return "product-unavailable";
      }

      const alreadySubscribed = await iap.hasActiveSubscription(productId);
      if (stale()) return "stopped";
      if (alreadySubscribed) {
        notify("already-subscribed");
        return "already-subscribed";
      }

      const context = { planCode, startedAt: Date.now() };
      // Saved so the selected plan is still known if the app is closed mid-purchase.
      await pendingPurchaseStore.save(context);
      if (stale()) return "stopped";

      setStatus(APPLE_PURCHASE_STATUS.PURCHASING);
      const outcome = await requestAndWait();

      switch (outcome.type) {
        case "stopped":
          return "stopped";
        case "purchased":
          setStatus(APPLE_PURCHASE_STATUS.COMPLETING);
          try {
            await handleTransaction(outcome.purchase, APPLE_PURCHASE_SOURCE.PURCHASE, context);
          } catch (error) {
            log("Apple IAP: post-purchase step failed, StoreKit will redeliver", error);
            notify("completion-failed");
            return "completion-failed";
          }
          return "purchased";
        case "unconfirmed":
          notify("purchase-unconfirmed");
          return "unconfirmed";
        default:
          return await handlePurchaseError(outcome.error);
      }
    } catch (error) {
      if (stale()) return "stopped";
      log("Apple IAP: purchase failed", error);
      notify("purchase-failed", { message: iap.getErrorMessage(error) });
      return "failed";
    } finally {
      if (!stale()) {
        inFlight = null;
        setStatus(APPLE_PURCHASE_STATUS.IDLE);
      }
    }
  };

  const restore = async () => {
    if (status !== APPLE_PURCHASE_STATUS.IDLE) return "busy";
    const gen = generation;
    const stale = () => gen !== generation;
    setStatus(APPLE_PURCHASE_STATUS.RESTORING);

    try {
      await start();
      const purchases = await iap.restoreSubscriptions(productId);
      if (stale()) return "stopped";

      const latest = [...purchases].sort(
        (a, b) => (b.transactionDate ?? 0) - (a.transactionDate ?? 0),
      )[0];
      if (!latest) {
        notify("restore-empty");
        return "empty";
      }

      await onPurchaseCompleted({
        purchase: latest,
        planCode: null,
        source: APPLE_PURCHASE_SOURCE.RESTORE,
      });
      handledTransactionIds.add(latest.id);
      await finishQuietly(latest);
      return "restored";
    } catch (error) {
      if (stale()) return "stopped";
      // Cancelling the App Store sign-in prompt is not an error.
      if (iap.getErrorKind(error) === "cancelled") return "cancelled";
      log("Apple IAP: restore failed", error);
      notify("restore-failed", { message: iap.getErrorMessage(error) });
      return "failed";
    } finally {
      if (!stale()) setStatus(APPLE_PURCHASE_STATUS.IDLE);
    }
  };

  return {
    start,
    stop,
    purchase,
    restore,
    getStatus: () => status,
  };
};
