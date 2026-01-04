package com.qbatz.smartstay;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {

  private Context context;

  NotificationModule(ReactApplicationContext context){
      super(context);
        this.context=context;
  }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

   @ReactMethod
public  void fetchFcmToken(Promise promise){
       SharedPreferences mpref=context.getSharedPreferences("user_details",Context.MODE_PRIVATE);
        if(!mpref.getBoolean("is_token_set", false)) {
            SharedPreferences.Editor editor = mpref.edit();
            editor.putBoolean("is_token_set", true);
            editor.apply();
            promise.resolve(mpref.getString("token", null));
        }
        else {
            promise.reject("-1","Not available");
        }
   }
}
