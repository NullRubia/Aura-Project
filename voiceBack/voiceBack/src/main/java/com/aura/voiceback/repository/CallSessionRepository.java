package com.aura.voiceback.repository;

import com.aura.voiceback.entity.CallSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CallSessionRepository extends JpaRepository<CallSession, String> {
}
