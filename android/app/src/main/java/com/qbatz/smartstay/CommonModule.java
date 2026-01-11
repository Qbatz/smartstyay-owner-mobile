package com.qbatz.smartstay;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.qbatz.utils.Constants;

public class CommonModule extends ReactContextBaseJavaModule {

    @NonNull
    @Override
    public String getName() {
        return "CommonModule";
    }

    @ReactMethod
    public void fetchBaseUrl(Promise promise) {
        promise.resolve(Constants.BASE_URL);
    }
}
