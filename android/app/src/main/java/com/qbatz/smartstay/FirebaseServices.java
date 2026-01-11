package com.qbatz.smartstay;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.RingtoneManager;
import android.os.Build;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

import javax.annotation.Nonnull;

public class FirebaseServices extends FirebaseMessagingService {

    private static final String CHANNEL_ID = "smartstay_notifications";


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

    @Override
    public void onMessageReceived(@Nonnull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        Log.e("FirebaseMessafing--->>",remoteMessage.getData().toString());

        String title = "SmartStay";
        String description = "You have a new notification";

        if (remoteMessage.getData() != null) {
            Map<String, String> data = remoteMessage.getData();
            if (data.containsKey("type")) {
                String type = data.get("type");
                if (type != null && type.equalsIgnoreCase(NotificationType.COMPLAINTS_RAISED.name())) {
                    title = data.get("title");
                    description = data.get("description");
                }

            }
        }

        showNotification(title, description);
    }

    private void showNotification(String title, String message) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
        );

        createNotificationChannel();

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
//                .setSmallIcon(com.facebook.react.R.drawable.ic_resume)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                .setContentIntent(pendingIntent)
                .build();

        NotificationManager manager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        manager.notify((int) System.currentTimeMillis(), notification);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "SmartStay Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("SmartStay alerts and updates");

            NotificationManager manager =
                    getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }
}
