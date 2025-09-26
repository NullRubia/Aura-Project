package com.aura.voiceback.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    private String provider;
    private String accessToken;
}