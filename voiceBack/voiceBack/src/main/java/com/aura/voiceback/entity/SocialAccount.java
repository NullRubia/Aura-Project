package com.aura.voiceback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "social_account", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider", "provider_user_id"})
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class SocialAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // "google", "kakao", "naver"
    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User user;
}

