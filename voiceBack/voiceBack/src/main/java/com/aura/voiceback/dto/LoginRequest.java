package com.aura.voiceback.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String email;   // 이메일
    private String password; // 비밀번호
}