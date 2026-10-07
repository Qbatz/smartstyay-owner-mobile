// Apple In-App Purchase exists on iOS only (see AppleIAP.ios.js). Metro picks
// the .ios.js file on iOS; Android gets these no-ops, so react-native-iap is
// never part of the Android bundle.
const unavailable = () =>
  Promise.reject(new Error("Apple In-App Purchase is only available on iOS"));

export const isAppleIAPAvailable = false;
export const connect = unavailable;
export const disconnect = () => Promise.resolve(true);
export const addPurchaseListeners = () => () => {};
export const getSubscriptionProduct = unavailable;
export const hasActiveSubscription = unavailable;
export const requestSubscription = unavailable;
export const finish = unavailable;
export const getUnfinishedTransactions = unavailable;
export const restoreSubscriptions = unavailable;
export const getErrorKind = () => "failed";
export const getErrorMessage = (error) => error?.message;
