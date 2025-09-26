package com.aura.voiceback.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;  // JWT 액세스 토큰
    private String refreshToken;
    private String tokenType = "Bearer"; // 기본값 Bearer
}