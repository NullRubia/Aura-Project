package com.example.auraapp;

import android.app.Activity;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.content.Intent;
import android.net.Uri;

public class MyWebChromeClient extends WebChromeClient {
    private WebView webView;
    public ValueCallback<Uri[]> filePathCallback;

    public MyWebChromeClient(WebView webView) {
        this.webView = webView;
    }

    // 마이크 권한 요청
    @Override
    public void onPermissionRequest(final PermissionRequest request) {
        Activity activity = (Activity) webView.getContext();
        activity.runOnUiThread(() -> {
            request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        });
    }

    // 파일 선택
    @Override
    public boolean onShowFileChooser(WebView webView,
                                     ValueCallback<Uri[]> filePathCallback,
                                     FileChooserParams fileChooserParams) {
        this.filePathCallback = filePathCallback;
        try {
            Intent intent = fileChooserParams.createIntent();
            ((Activity) webView.getContext()).startActivityForResult(intent, 1000);
        } catch (Exception e) {
            this.filePathCallback = null;
            return false;
        }
        return true;
    }

    public void resetFilePathCallback() {
        filePathCallback = null;
    }
}
