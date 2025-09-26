package com.aura.voiceback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class SummaryResponse {
    private Long id;
    private String summaryText;
    private LocalDateTime dateTime;
}