package com.qbatz.smartstay;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qbatz.utils.Constants;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class CommonModule extends ReactContextBaseJavaModule {
//    Context context;

    private final ReactApplicationContext reactContext;
    private final ConnectivityManager connectivityManager;

    CommonModule(ReactApplicationContext context){
        super(context);
        this.reactContext=context;

        connectivityManager =(ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        registerNetworkListener();
    }

    @NonNull
    @Override
    public String getName() {
        return "CommonModule";
    }

//    @ReactMethod
//    public void checkInternet(Promise promise){
//        ConnectivityManager connectivityManager=(ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
//
//        boolean connected=(connectivityManager.getNetworkInfo(connectivityManager.TYPE_MOBILE).getState() == NetworkInfo.State.CONNECTED ||
//                connectivityManager.getNetworkInfo(connectivityManager.TYPE_WIFI).getState() == NetworkInfo.State.CONNECTED);
//
//        System.out.println("connne ," + connected);
//        promise.resolve(connected);
//    }

    @ReactMethod
    public void checkInternet(Promise promise) {
        try {

            if (connectivityManager == null) {
                promise.resolve(false);
                return;
            }

            Network network = connectivityManager.getActiveNetwork();
            if (network == null) {
                promise.resolve(false);
                return;
            }

            NetworkCapabilities capabilities =
                    connectivityManager.getNetworkCapabilities(network);

            boolean connected = capabilities != null &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                    capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);

            promise.resolve(connected);

        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    private void registerNetworkListener() {

        if (connectivityManager == null) return;

        connectivityManager.registerDefaultNetworkCallback(
                new ConnectivityManager.NetworkCallback() {

                    @Override
                    public void onAvailable(Network network) {
//                        sendEvent(true);
                        NetworkCapabilities capabilities =
                                connectivityManager.getNetworkCapabilities(network);

                        boolean isConnected = capabilities != null &&
                                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) &&
                                capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);

                        sendEvent(isConnected);
                    }

                    @Override
                    public void onLost(Network network) {
                        sendEvent(false);
                    }
                }
        );
    }

    private void sendEvent(boolean isConnected) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("networkStatus", isConnected);
    }


    @ReactMethod
    public void fetchBaseUrl(Promise promise) {
        promise.resolve(Constants.BASE_URL);
    }


}


