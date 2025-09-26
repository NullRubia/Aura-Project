package com.aura.voiceback.dto;

import lombok.Data;

@Data
public class SocialLinkRequest {
    private String provider;
    private String accessToken;
}
