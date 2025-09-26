package com.aura.voiceback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleUser {
    @JsonProperty("sub")
    private String sub; // Google user ID

    private String email;
    private String name;
    @JsonProperty("picture")
    private String pictureUrl;
}
