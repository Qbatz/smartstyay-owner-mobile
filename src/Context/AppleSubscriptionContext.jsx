import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleIAP from "../Utils/AppleIAP";
import { APPLE_PURCHASE_STATUS, createAppleSubscriptionFlow } from "../Utils/AppleSubscriptionFlow";
import { handleApplePurchaseCompleted } from "../Utils/ApplePostPurchase";
import { APPLE_SUBSCRIPTION_PRODUCT_ID, PENDING_APPLE_PURCHASE } from "../Utils/Constant";

const DEFAULT_ERROR = "Something went wrong. Please try again.";

// [title, message]; a null message falls back to the error's own message.
const MESSAGES = {
  "product-unavailable": ["Subscription unavailable", "We couldn't load the subscription from the App Store. Please check your connection and try again."],
  "already-subscribed": ["Already subscribed", "This Apple ID already has an active Smartstay subscription. Tap Restore Purchases to see its details."],
  "purchase-pending": ["Purchase pending", "Your purchase is waiting for approval. It will be completed as soon as it's approved."],
  "purchase-unconfirmed": ["Purchase not confirmed", "We couldn't confirm your purchase yet. If you completed the payment it will be processed automatically, or you can tap Restore Purchases."],
  "network-error": ["No internet connection", "Please check your connection and try again."],
  "purchase-failed": ["Purchase failed", null],
  "completion-failed": ["Purchase not completed", "Your payment went through, but we couldn't finish setting up your subscription. We'll retry automatically the next time you open the app."],
  "restore-empty": ["Nothing to restore", "No active Smartstay subscription was found for this Apple ID."],
  "restore-failed": ["Restore failed", null],
};

const showMessage = (kind, info) => {
  const [title, message] = MESSAGES[kind] || ["Subscription", null];
  Alert.alert(title, message || info?.message || DEFAULT_ERROR);
};

// The purchase in progress, kept across app restarts until StoreKit reports its outcome.
const pendingPurchaseStore = {
  save: (context) => AsyncStorage.setItem(PENDING_APPLE_PURCHASE, JSON.stringify(context)),
  load: async () => {
    const saved = await AsyncStorage.getItem(PENDING_APPLE_PURCHASE);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  },
  clear: () => AsyncStorage.removeItem(PENDING_APPLE_PURCHASE),
};

const AppleSubscriptionContext = createContext({
  isAvailable: false,
  status: APPLE_PURCHASE_STATUS.IDLE,
  isBusy: false,
  purchase: async () => "unavailable",
  restore: async () => "unavailable",
});

export const useAppleSubscription = () => useContext(AppleSubscriptionContext);

// Owns the Apple purchase flow for the logged-in session: listens for App Store
// transactions from login until logout, including ones completed while the app
// was closed. On Android it only renders its children.
export const AppleSubscriptionProvider = ({ children }) => {
  const [status, setStatus] = useState(APPLE_PURCHASE_STATUS.IDLE);

  const [flow] = useState(() =>
    AppleIAP.isAppleIAPAvailable
      ? createAppleSubscriptionFlow({
          iap: AppleIAP,
          productId: APPLE_SUBSCRIPTION_PRODUCT_ID,
          onPurchaseCompleted: handleApplePurchaseCompleted,
          pendingPurchaseStore,
          notify: showMessage,
          onStatusChange: setStatus,
        })
      : null,
  );

  useEffect(() => {
    if (!flow) return undefined;

    const start = () =>
      flow.start().catch((error) => console.log("Apple IAP: start failed", error));
    start();

    // Retries a failed start (e.g. offline at login) when the app comes back to the foreground.
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") start();
    });

    return () => {
      appStateSubscription.remove();
      flow.stop();
    };
  }, [flow]);

  const value = useMemo(
    () => ({
      isAvailable: Boolean(flow),
      status,
      isBusy: status !== APPLE_PURCHASE_STATUS.IDLE,
      purchase: (planCode) => (flow ? flow.purchase(planCode) : Promise.resolve("unavailable")),
      restore: () => (flow ? flow.restore() : Promise.resolve("unavailable")),
    }),
    [flow, status],
  );

  return (
    <AppleSubscriptionContext.Provider value={value}>{children}</AppleSubscriptionContext.Provider>
  );
};
