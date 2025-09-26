package com.aura.voiceback.dto;

import lombok.Data;

// 비밀번호 재설정 요청 DTO
@Data
public class PasswordResetRequest {
    private String email;
}
