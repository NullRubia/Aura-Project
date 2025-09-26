package com.aura.voiceback.websocket;

import com.aura.voiceback.service.VoIPService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;


@Component
public class VoIPWebSocketHandler extends AbstractWebSocketHandler {

    private final VoIPService voipService;

    public VoIPWebSocketHandler(VoIPService voipService) {
        this.voipService = voipService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        voipService.registerSession(session.getId(), session);
        System.out.println("✅ WebSocket connected: " + session.getId());
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        byte[] audioBytes = message.getPayload().array();
        // 여기서 다른 세션으로 브로드캐스트
        voipService.forwardAudio(session.getId(), audioBytes);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        voipService.removeSession(session.getId());
        System.out.println("⚠️ WebSocket disconnected: " + session.getId());
    }
}
