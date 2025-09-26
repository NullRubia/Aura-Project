package com.aura.voiceback.repository;
import com.aura.voiceback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // username(email)로 조회
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    // email 중복 체크
    boolean existsByEmail(String email);

    // phone 중복 체크
    boolean existsByPhone(String phone);
}
