package com.aura.voiceback.service;

import com.aura.voiceback.entity.RefreshToken;
import com.aura.voiceback.entity.User;
import com.aura.voiceback.repository.RefreshTokenRepository;
import com.aura.voiceback.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    // 예: 14일
    private final long refreshTokenDurationSec = 14 * 24 * 3600L;

    @Transactional
    public TokenPair createTokensForUser(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = UUID.randomUUID().toString();

        refreshTokenRepository.deleteAllByUser(user);

        RefreshToken rt = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiryDate(Instant.now().plusSeconds(refreshTokenDurationSec))
                .build();
        refreshTokenRepository.save(rt);

        return new TokenPair(accessToken, refreshToken);
    }

    public Optional<User> validateAndGetUserByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .filter(rt -> rt.getExpiryDate().isAfter(Instant.now()))
                .map(RefreshToken::getUser);
    }

    @Transactional
    public TokenPair rotateRefreshToken(String oldRefreshToken) {
        RefreshToken old = refreshTokenRepository.findByToken(oldRefreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (old.getExpiryDate().isBefore(Instant.now())) throw new RuntimeException("Expired refresh token");

        User user = old.getUser();
        // 삭제(혹은 무효화)
        refreshTokenRepository.delete(old);

        // 새 토큰 발급
        return createTokensForUser(user);
    }

    // DTO for responses
    public static record TokenPair(String accessToken, String refreshToken) {}
}

