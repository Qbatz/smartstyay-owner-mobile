export const ACCESS_TOKEN="access_token";
export const LOGGEDIN="loggedin";
export const USER_ID = "user_id";
export const PROFILEDETAILS= "profileDetails";
export const ACTIVEHOSTELID = "activeHostelId";
export const PENDING_APPLE_PURCHASE = "pendingApplePurchase";

// Apple auto-renewable subscription (iOS only). App Store Connect: reference name
// "Smartstay - monthly", subscription group 22361834, Apple ID 6809024306.
export const APPLE_SUBSCRIPTION_PRODUCT_ID = "com.smartstay.subscription.monthly";

let _BASE_URL;         
let _initialized = false;

export function initBaseUrl(value) {
  if (_initialized) {
    return;
  }

  _BASE_URL = value;
  _initialized = true;
}

export function BASE_URL() {
  if (!_initialized) {
    // throw new Error("BASE_URL not initialized yet");
  }
  return _BASE_URL;
}