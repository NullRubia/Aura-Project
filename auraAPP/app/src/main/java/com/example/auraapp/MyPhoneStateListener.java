package com.example.auraapp;

import android.content.Context;
import android.content.Intent;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.webkit.WebView;

//통화종료 감지
public class MyPhoneStateListener extends PhoneStateListener {
    private Context context;
    private WebView webView;

    public MyPhoneStateListener(WebView webView) {
        this.context = context;
        this.webView = webView;
    }

    @Override
    public void onCallStateChanged(int state, String phoneNumber) {
        super.onCallStateChanged(state, phoneNumber);

        if (state == TelephonyManager.CALL_STATE_IDLE) {
            // 통화 종료 시 JS 콜백 실행
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript(
                            "window.onCallEnded && window.onCallEnded();",
                            null
                    );
                }
            });
        } else if (state == TelephonyManager.CALL_STATE_RINGING) {
            // 전화 수신 시 MainActivity 실행
            Intent intent = new Intent(webView.getContext(), MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            intent.putExtra("incomingNumber", phoneNumber);
            webView.getContext().startActivity(intent);
        }
    }
}
