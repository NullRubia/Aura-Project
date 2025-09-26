package com.aura.voiceback.dto;

import lombok.Data;

@Data
public class NaverUser {
    private NaverResponse response;

    @Data
    public static class NaverResponse {
        private String id;    // Naver user ID
        private String email;
        private String name;
    }
}
