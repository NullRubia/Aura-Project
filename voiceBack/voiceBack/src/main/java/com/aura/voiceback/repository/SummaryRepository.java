package com.aura.voiceback.repository;

import com.aura.voiceback.entity.Summary;
import com.aura.voiceback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
    List<Summary> findByUser(User user);
}
