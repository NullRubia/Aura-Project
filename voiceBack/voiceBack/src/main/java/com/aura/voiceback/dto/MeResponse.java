package com.aura.voiceback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MeResponse {
    private String email;
    private String name;
    private String phone;
}
