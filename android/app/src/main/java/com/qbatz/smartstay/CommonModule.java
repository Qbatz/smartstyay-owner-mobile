package com.qbatz.smartstay;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;
import android.net.Uri;
import android.content.ActivityNotFoundException;
import com.qbatz.utils.Constants;
import android.webkit.MimeTypeMap;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CommonModule extends ReactContextBaseJavaModule {
    Context context;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    CommonModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "CommonModule";
    }

    @ReactMethod
    public void checkInternet(Promise promise) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);

        boolean connected = (connectivityManager.getNetworkInfo(connectivityManager.TYPE_MOBILE)
                .getState() == NetworkInfo.State.CONNECTED ||
                connectivityManager.getNetworkInfo(connectivityManager.TYPE_WIFI)
                        .getState() == NetworkInfo.State.CONNECTED);

        System.out.println("connne ," + connected);
        promise.resolve(connected);
    }

    @ReactMethod
    public void fetchBaseUrl(Promise promise) {
        promise.resolve(Constants.BASE_URL);
    }

    @ReactMethod
    public void downloadAndViewDocument(String url, Promise promise) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setPackage("com.android.chrome");
            context.startActivity(intent);
            promise.resolve(true);
        } catch (ActivityNotFoundException e) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
                promise.resolve(true);
            } catch (Exception ex) {
                promise.reject("VIEW_ERROR", ex.getMessage());
            }
        } catch (Exception e) {
            promise.reject("VIEW_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void downloadAndShareFile(String fileUrl, Promise promise) {
        executorService.execute(() -> {
            try {
                URL url = new URL(fileUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.connect();

                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    promise.reject("DOWNLOAD_ERROR", "Server returned HTTP " + connection.getResponseCode());
                    return;
                }

                String fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                if (fileName.contains("?")) {
                    fileName = fileName.substring(0, fileName.indexOf("?"));
                }

                File cachePath = new File(context.getCacheDir(), "shared_files");
                if (!cachePath.exists())
                    cachePath.mkdirs();

                File outputFile = new File(cachePath, fileName);
                InputStream inputStream = connection.getInputStream();
                FileOutputStream outputStream = new FileOutputStream(outputFile);

                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }

                outputStream.close();
                inputStream.close();

                shareDownloadedFile(outputFile, promise);

            } catch (Exception e) {
                promise.reject("DOWNLOAD_ERROR", e.getMessage());
            }
        });
    }

    private void shareDownloadedFile(File file, Promise promise) {
        try {
            Uri contentUri = FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", file);

            if (contentUri != null) {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                shareIntent.setType(getMimeType(file.getAbsolutePath()));
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                Intent chooser = Intent.createChooser(shareIntent, "Share File");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(chooser);

                promise.resolve("File shared successfully");
            } else {
                promise.reject("SHARE_ERROR", "Could not generate content URI");
            }
        } catch (Exception e) {
            promise.reject("SHARE_ERROR", e.getMessage());
        }
    }

    private String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.toLowerCase());
        }
        if (type == null) {
            type = "*/*";
        }
        return type;
    }
}
