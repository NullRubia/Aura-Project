package com.aura.voiceback.repository;

import com.aura.voiceback.entity.RefreshToken;
import com.aura.voiceback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser(User user);
}

