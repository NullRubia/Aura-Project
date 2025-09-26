package com.aura.voiceback.service;

import com.aura.voiceback.dto.SummaryRequest;
import com.aura.voiceback.dto.SummaryResponse;
import com.aura.voiceback.entity.Summary;
import com.aura.voiceback.entity.User;
import com.aura.voiceback.repository.SummaryRepository;
import com.aura.voiceback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SummaryService {

    private final SummaryRepository summaryRepository;
    private final UserRepository userRepository;

    public SummaryResponse saveSummary(String email, SummaryRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        Summary summary = Summary.builder()
                .user(user)
                .summaryText(request.getSummaryText())
                .build();

        Summary saved = summaryRepository.save(summary);
        return new SummaryResponse(saved.getId(), saved.getSummaryText(), saved.getDateTime());
    }

    public List<SummaryResponse> getSummaries(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        return summaryRepository.findByUser(user).stream()
                .map(s -> new SummaryResponse(s.getId(), s.getSummaryText(), s.getDateTime()))
                .collect(Collectors.toList());
    }
}