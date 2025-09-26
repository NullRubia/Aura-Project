package com.aura.voiceback.dto;

import lombok.Data;

// 비밀번호 재설정 확인 DTO
@Data
public class PasswordResetConfirmRequest {
    private String email;
    private String code;
    private String newPassword;
}
