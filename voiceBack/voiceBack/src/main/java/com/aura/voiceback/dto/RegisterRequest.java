package com.aura.voiceback.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;     // 사용자 이름
    private String email;    // 이메일
    private String phone;   // 전화번호
    private String password; // 비밀번호
}
