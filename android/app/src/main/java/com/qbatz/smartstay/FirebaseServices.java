package com.qbatz.smartstay;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.RingtoneManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

import javax.annotation.Nonnull;

public class FirebaseServices extends FirebaseMessagingService {

    private static final String CHANNEL_ID = "smartstay_notifications";

    @Override
    public void onNewToken(@Nonnull String token) {
        super.onNewToken(token);
        Log.e("token ----->", token);

        SharedPreferences mpref = getSharedPreferences("user_details", Context.MODE_PRIVATE);
        SharedPreferences.Editor edt = mpref.edit();
        edt.putString("token", token);
        edt.putBoolean("is_token_set", false);
        edt.apply();
    }

    @Override
    public void onMessageReceived(@Nonnull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        Map<String, String> data = remoteMessage.getData();
        Log.e("FirebaseMessaging--->>", data.toString());

        String title = "SmartStay";
        String description = "You have a new notification";

        if (data.containsKey("type")) {
            String type = data.get("type");
            if (type != null && type.equalsIgnoreCase(NotificationType.COMPLAINTS_RAISED.name())) {
                if (data.get("title") != null) {
                    title = data.get("title");
                }
                if (data.get("description") != null) {
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
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                .setContentIntent(pendingIntent)
                .build();

        NotificationManager manager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        if (manager != null) {
            manager.notify((int) System.currentTimeMillis(), notification);
        }
    }

    private void createNotificationChannel() {
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "SmartStay Notifications",
                NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("SmartStay alerts and updates");

        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.createNotificationChannel(channel);
        }
    }
}
