import {
  APPLE_PURCHASE_STATUS,
  createAppleSubscriptionFlow,
} from '../src/Utils/AppleSubscriptionFlow';

const PRODUCT_ID = 'com.smartstay.subscription.monthly';

const makePurchase = (overrides = {}) => ({
  id: '2000000123',
  productId: PRODUCT_ID,
  purchaseState: 'purchased',
  transactionReasonIOS: 'PURCHASE',
  transactionDate: 1,
  purchaseToken: 'signed-transaction-jws',
  ...overrides,
});

const setup = ({ iap: iapOverrides = {}, savedContext = null, ...options } = {}) => {
  const listeners = {};
  let stored = savedContext;

  const iap = {
    connect: jest.fn(async () => true),
    disconnect: jest.fn(async () => true),
    addPurchaseListeners: jest.fn((onPurchase, onError) => {
      listeners.purchase = onPurchase;
      listeners.error = onError;
      return (listeners.remove = jest.fn());
    }),
    getSubscriptionProduct: jest.fn(async () => ({ id: PRODUCT_ID, displayPrice: '₹999.00' })),
    hasActiveSubscription: jest.fn(async () => false),
    // By default StoreKit completes the purchase before requestPurchase resolves.
    requestSubscription: jest.fn(async () => listeners.purchase(makePurchase())),
    finish: jest.fn(async () => {}),
    getUnfinishedTransactions: jest.fn(async () => []),
    restoreSubscriptions: jest.fn(async () => []),
    getErrorKind: error =>
      ({
        'user-cancelled': 'cancelled',
        'deferred-payment': 'pending',
        'network-error': 'network',
      })[error?.code] || 'failed',
    getErrorMessage: error => error?.message,
    ...iapOverrides,
  };

  const pendingPurchaseStore = {
    save: jest.fn(async context => {
      stored = context;
    }),
    load: jest.fn(async () => stored),
    clear: jest.fn(async () => {
      stored = null;
    }),
  };

  const onPurchaseCompleted = jest.fn(async () => {});
  const notify = jest.fn();
  const statuses = [];

  const flow = createAppleSubscriptionFlow({
    iap,
    productId: PRODUCT_ID,
    onPurchaseCompleted,
    pendingPurchaseStore,
    notify,
    onStatusChange: status => statuses.push(status),
    log: () => {},
    ...options,
  });

  return {
    flow,
    iap,
    listeners,
    onPurchaseCompleted,
    notify,
    pendingPurchaseStore,
    statuses,
    getStored: () => stored,
  };
};

describe('Apple subscription purchase', () => {
  it('opens the App Store purchase directly, runs the post-purchase step and finishes', async () => {
    const t = setup();

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('purchased');

    expect(t.iap.requestSubscription).toHaveBeenCalledWith({ productId: PRODUCT_ID });
    expect(t.onPurchaseCompleted).toHaveBeenCalledWith({
      purchase: makePurchase(),
      planCode: 'PLAN_MONTHLY',
      source: 'purchase',
    });
    expect(t.onPurchaseCompleted.mock.invocationCallOrder[0]).toBeLessThan(
      t.iap.finish.mock.invocationCallOrder[0],
    );
    expect(t.iap.finish).toHaveBeenCalledWith(makePurchase());
    expect(t.getStored()).toBeNull();
    expect(t.notify).not.toHaveBeenCalled();
    expect(t.statuses).toEqual([
      APPLE_PURCHASE_STATUS.PREPARING,
      APPLE_PURCHASE_STATUS.PURCHASING,
      APPLE_PURCHASE_STATUS.COMPLETING,
      APPLE_PURCHASE_STATUS.IDLE,
    ]);
  });

  it('ignores repeated taps while a purchase is running', async () => {
    const t = setup();

    const first = t.flow.purchase('PLAN_MONTHLY');
    const second = t.flow.purchase('PLAN_MONTHLY');

    await expect(second).resolves.toBe('busy');
    await expect(first).resolves.toBe('purchased');
    expect(t.iap.requestSubscription).toHaveBeenCalledTimes(1);
  });

  it('does not open the purchase when this Apple ID is already subscribed', async () => {
    const t = setup({ iap: { hasActiveSubscription: jest.fn(async () => true) } });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('already-subscribed');

    expect(t.notify).toHaveBeenCalledWith('already-subscribed');
    expect(t.iap.requestSubscription).not.toHaveBeenCalled();
  });

  it('does not open the purchase when the App Store product cannot be loaded', async () => {
    const t = setup({ iap: { getSubscriptionProduct: jest.fn(async () => null) } });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('product-unavailable');

    expect(t.notify).toHaveBeenCalledWith('product-unavailable');
    expect(t.iap.requestSubscription).not.toHaveBeenCalled();
  });

  it('treats cancellation silently and clears the saved purchase', async () => {
    const t = setup({
      iap: { requestSubscription: jest.fn(async () => t.listeners.error({ code: 'user-cancelled' })) },
    });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('cancelled');

    expect(t.notify).not.toHaveBeenCalled();
    expect(t.onPurchaseCompleted).not.toHaveBeenCalled();
    expect(t.getStored()).toBeNull();
  });

  it('keeps the saved purchase when approval is pending (Ask to Buy)', async () => {
    const t = setup({
      iap: { requestSubscription: jest.fn(async () => t.listeners.error({ code: 'deferred-payment' })) },
    });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('pending');

    expect(t.notify).toHaveBeenCalledWith('purchase-pending');
    expect(t.getStored()).toMatchObject({ planCode: 'PLAN_MONTHLY' });
  });

  it('reports store failures', async () => {
    const t = setup({
      iap: {
        requestSubscription: jest.fn(async () =>
          t.listeners.error({ code: 'purchase-error', message: 'Store error' }),
        ),
      },
    });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('failed');

    expect(t.notify).toHaveBeenCalledWith('purchase-failed', { message: 'Store error' });
    expect(t.flow.getStatus()).toBe(APPLE_PURCHASE_STATUS.IDLE);
  });

  it('does not finish the transaction when the post-purchase step fails', async () => {
    const t = setup();
    t.onPurchaseCompleted.mockRejectedValueOnce(new Error('verification failed'));

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('completion-failed');

    expect(t.iap.finish).not.toHaveBeenCalled();
    expect(t.notify).toHaveBeenCalledWith('completion-failed');

    // StoreKit redelivers it later; this time the step succeeds.
    t.listeners.purchase(makePurchase());
    await new Promise(setImmediate);
    expect(t.onPurchaseCompleted).toHaveBeenCalledTimes(2);
    expect(t.iap.finish).toHaveBeenCalledTimes(1);
  });

  it('handles each transaction once even if StoreKit delivers it again', async () => {
    const t = setup();
    await t.flow.purchase('PLAN_MONTHLY');

    t.listeners.purchase(makePurchase());
    await new Promise(setImmediate);

    expect(t.onPurchaseCompleted).toHaveBeenCalledTimes(1);
    expect(t.iap.finish).toHaveBeenCalledTimes(1);
  });

  it('gives up waiting if StoreKit returns without a result event', async () => {
    const t = setup({ iap: { requestSubscription: jest.fn(async () => {}) }, eventTimeoutMs: 5 });

    await expect(t.flow.purchase('PLAN_MONTHLY')).resolves.toBe('unconfirmed');

    expect(t.notify).toHaveBeenCalledWith('purchase-unconfirmed');
    expect(t.flow.getStatus()).toBe(APPLE_PURCHASE_STATUS.IDLE);
  });

  it('stops quietly when the session ends mid-purchase (logout)', async () => {
    let dispatched;
    const t = setup({
      iap: {
        requestSubscription: jest.fn(
          () =>
            new Promise(resolve => {
              dispatched = resolve;
            }),
        ),
      },
    });

    const purchase = t.flow.purchase('PLAN_MONTHLY');
    await new Promise(setImmediate);
    expect(t.iap.requestSubscription).toHaveBeenCalled();

    await t.flow.stop();
    dispatched();

    await expect(purchase).resolves.toBe('stopped');
    expect(t.notify).not.toHaveBeenCalled();
    expect(t.listeners.remove).toHaveBeenCalled();
    expect(t.iap.disconnect).toHaveBeenCalled();
    expect(t.flow.getStatus()).toBe(APPLE_PURCHASE_STATUS.IDLE);
  });
});

describe('transactions delivered outside a purchase', () => {
  it('completes a purchase interrupted in an earlier session when starting', async () => {
    const t = setup({
      savedContext: { planCode: 'PLAN_MONTHLY', startedAt: 1 },
      iap: { getUnfinishedTransactions: jest.fn(async () => [makePurchase()]) },
    });

    await t.flow.start();

    expect(t.onPurchaseCompleted).toHaveBeenCalledWith({
      purchase: makePurchase(),
      planCode: 'PLAN_MONTHLY',
      source: 'recovered',
    });
    expect(t.iap.finish).toHaveBeenCalledWith(makePurchase());
    expect(t.getStored()).toBeNull();
  });

  it('handles renewals without touching the saved purchase', async () => {
    const savedContext = { planCode: 'PLAN_MONTHLY', startedAt: 1 };
    const t = setup({ savedContext });
    await t.flow.start();

    const renewal = makePurchase({ id: '2000000999', transactionReasonIOS: 'RENEWAL' });
    t.listeners.purchase(renewal);
    await new Promise(setImmediate);

    expect(t.onPurchaseCompleted).toHaveBeenCalledWith({ purchase: renewal, planCode: null, source: 'renewal' });
    expect(t.iap.finish).toHaveBeenCalledWith(renewal);
    expect(t.getStored()).toEqual(savedContext);
  });
});

describe('restore', () => {
  it('runs the post-purchase step for the latest active subscription', async () => {
    const older = makePurchase({ id: '1', transactionDate: 10 });
    const latest = makePurchase({ id: '2', transactionDate: 20 });
    const t = setup({ iap: { restoreSubscriptions: jest.fn(async () => [older, latest]) } });

    await expect(t.flow.restore()).resolves.toBe('restored');

    expect(t.onPurchaseCompleted).toHaveBeenCalledWith({ purchase: latest, planCode: null, source: 'restore' });
    expect(t.iap.finish).toHaveBeenCalledWith(latest);
  });

  it('tells the user when there is nothing to restore', async () => {
    const t = setup();

    await expect(t.flow.restore()).resolves.toBe('empty');

    expect(t.notify).toHaveBeenCalledWith('restore-empty');
    expect(t.onPurchaseCompleted).not.toHaveBeenCalled();
  });
});
