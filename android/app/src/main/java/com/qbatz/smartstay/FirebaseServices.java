package com.qbatz.smartstay;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.firebase.messaging.FirebaseMessagingService;

import javax.annotation.Nonnull;

public class FirebaseServices extends FirebaseMessagingService {


    @Override
    public void onNewToken(@Nonnull String token){
        super.onNewToken(token);
        Log.e("token ----->", token);
        System.out.println(token);

        SharedPreferences mpref=getSharedPreferences("user_details", Context.MODE_PRIVATE);
        SharedPreferences.Editor edt=mpref.edit();
        edt.putString("token", token);
        edt.putBoolean("is_token_set", false);
        edt.apply();
    }
}
