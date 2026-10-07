// Thin wrapper around react-native-iap (StoreKit 2). This is the only file that
// imports the library, and Metro bundles it for iOS only; every other platform
// gets the no-op version in AppleIAP.js.
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  getActiveSubscriptions,
  getAvailablePurchases,
  getPendingTransactionsIOS,
  restorePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getUserFriendlyErrorMessage,
  ErrorCode,
} from "react-native-iap";

export const isAppleIAPAvailable = true;

export const connect = () => initConnection();

export const disconnect = () => endConnection();

export const addPurchaseListeners = (onPurchase, onError) => {
  const purchaseSubscription = purchaseUpdatedListener(onPurchase);
  const errorSubscription = purchaseErrorListener(onError);

  return () => {
    purchaseSubscription.remove();
    errorSubscription.remove();
  };
};

export const getSubscriptionProduct = async (productId) => {
  const products = await fetchProducts({ skus: [productId], type: "subs" });
  return products?.find((product) => product.id === productId) ?? null;
};

export const hasActiveSubscription = async (productId) => {
  const subscriptions = await getActiveSubscriptions([productId]);
  return subscriptions.some((sub) => sub.productId === productId && sub.isActive);
};

// The outcome arrives through the purchase listeners, not this promise.
export const requestSubscription = ({ productId, appAccountToken }) =>
  requestPurchase({
    request: {
      apple: appAccountToken ? { sku: productId, appAccountToken } : { sku: productId },
    },
    type: "subs",
  });

export const finish = (purchase) => finishTransaction({ purchase, isConsumable: false });

// Transactions StoreKit still holds as unfinished, e.g. after the app was closed mid-purchase.
export const getUnfinishedTransactions = () => getPendingTransactionsIOS();

// Syncs with the App Store (may ask the user to sign in), then returns active purchases.
export const restoreSubscriptions = async (productId) => {
  await restorePurchases();
  const purchases = await getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
  return purchases.filter((purchase) => purchase.productId === productId);
};

export const getErrorKind = (error) => {
  switch (error?.code) {
    case ErrorCode.UserCancelled:
      return "cancelled";
    case ErrorCode.DeferredPayment:
    case ErrorCode.Pending:
      return "pending";
    case ErrorCode.AlreadyOwned:
      return "already-subscribed";
    case ErrorCode.NetworkError:
    case ErrorCode.ServiceTimeout:
      return "network";
    default:
      return "failed";
  }
};

export const getErrorMessage = (error) => getUserFriendlyErrorMessage(error);
