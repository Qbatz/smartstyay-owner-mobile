import { Alert } from "react-native";

const TITLES = {
  purchase: "Subscription purchased",
  recovered: "Subscription purchase completed",
  restore: "Subscription restored",
};

/**
 * Post-purchase step for Apple subscriptions. Runs for every completed App Store
 * transaction before it is finished (see AppleSubscriptionFlow).
 *
 * - Resolve when the purchase has been handled; the transaction is then finished.
 * - Throw to leave it unfinished; StoreKit redelivers it on the next app launch
 *   and the user is told it will be retried.
 *
 * For now this only shows the details. The backend verification / account
 * entitlement call belongs here later: send purchase.purchaseToken (the App Store
 * signed transaction, JWS) and throw if the backend doesn't accept it.
 *
 * @param {object} params
 * @param {object} params.purchase react-native-iap purchase (iOS)
 * @param {string|null} params.planCode plan selected on the plans screen, when known
 * @param {"purchase"|"recovered"|"renewal"|"restore"} params.source
 */
export const handleApplePurchaseCompleted = async ({ purchase, planCode, source }) => {
  const details = { source, planCode, applePurchase: purchase };
  console.log("Apple subscription →", JSON.stringify(details));

  // Renewals happen in the background; nothing to show until the backend sync exists.
  if (source === "renewal") return;

  Alert.alert(TITLES[source] || "Subscription", JSON.stringify(details, null, 2));
};
