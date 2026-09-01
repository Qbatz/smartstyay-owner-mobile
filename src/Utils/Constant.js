export const ACCESS_TOKEN="access_token";
export const LOGGEDIN="loggedin";
export const USER_ID = "user_id";
export const PROFILEDETAILS= "profileDetails";
export const ACTIVEHOSTELID = "activeHostelId";

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