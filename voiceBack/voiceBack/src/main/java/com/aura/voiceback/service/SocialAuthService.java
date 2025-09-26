package com.aura.voiceback.service;

import com.aura.voiceback.entity.SocialAccount;
import com.aura.voiceback.entity.User;
import com.aura.voiceback.repository.SocialAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SocialAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final OAuthService oAuthService;


    @Transactional
    public void linkSocialAccount(User currentUser, String provider, String codeOrToken) {
        String accessToken = provider.equalsIgnoreCase("kakao")
                ? oAuthService.getKakaoAccessToken(codeOrToken, oAuthService.KAKAO_LINK_REDIRECT_URI)
                : codeOrToken; // Google, Naver는 그대로

        String providerUserId = oAuthService.fetchProviderUserId(provider, accessToken);

        socialAccountRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .ifPresent(a -> { throw new RuntimeException("이미 연동된 소셜 계정입니다."); });

        SocialAccount account = SocialAccount.builder()
                .provider(provider)
                .providerUserId(providerUserId)
                .user(currentUser)
                .build();
        socialAccountRepository.save(account);
    }

    public User loginWithSocial(String provider, String codeOrToken) {
        String accessToken = provider.equalsIgnoreCase("kakao")
                ? oAuthService.getKakaoAccessToken(codeOrToken, oAuthService.KAKAO_LOGIN_REDIRECT_URI)
                : codeOrToken; // Google, Naver는 그대로

        String providerUserId = oAuthService.fetchProviderUserId(provider, accessToken);

        return socialAccountRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .orElseThrow(() -> new RuntimeException("소셜 계정이 연동되어 있지 않습니다."))
                .getUser();
    }
}


