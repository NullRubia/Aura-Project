package com.aura.voiceback.config;

import com.aura.voiceback.websocket.VoIPWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final VoIPWebSocketHandler voipHandler;

    public WebSocketConfig(VoIPWebSocketHandler voipHandler) {
        this.voipHandler = voipHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(voipHandler, "/ws/voip")
                .setAllowedOrigins("*");
    }
}
