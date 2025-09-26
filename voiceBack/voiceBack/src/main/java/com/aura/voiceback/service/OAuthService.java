package com.aura.voiceback.service;

import com.aura.voiceback.dto.GoogleUser;
import com.aura.voiceback.dto.KakaoUser;
import com.aura.voiceback.dto.NaverUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class OAuthService {

    private final WebClient webClient = WebClient.builder().build();

    // Kakao REST API 키와 Redirect URI는 환경변수나 application.yml에 넣는 게 안전
    @Value("${kakao-rest-api-key}")
    private String KAKAO_REST_API_KEY;
    @Value("${kakao-login-redirect-url}")
    public String KAKAO_LOGIN_REDIRECT_URI;

    @Value("${kakao-link-redirect-url}")
    public String KAKAO_LINK_REDIRECT_URI;

    public String fetchProviderUserId(String provider, String accessToken) {
        switch (provider.toLowerCase()) {
            case "google":
                return webClient.get()
                        .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                        .headers(h -> h.setBearerAuth(accessToken))
                        .retrieve()
                        .bodyToMono(GoogleUser.class)
                        .block()
                        .getSub();
            case "kakao":
                return String.valueOf(
                        webClient.post()
                                .uri("https://kapi.kakao.com/v2/user/me")
                                .headers(h -> h.setBearerAuth(accessToken))
                                .retrieve()
                                .bodyToMono(KakaoUser.class)
                                .block()
                                .getId()
                );
            case "naver":
                return webClient.get()
                        .uri("https://openapi.naver.com/v1/nid/me")
                        .headers(h -> h.setBearerAuth(accessToken))
                        .retrieve()
                        .bodyToMono(NaverUser.class)
                        .block()
                        .getResponse().getId();
            default:
                throw new IllegalArgumentException("Unsupported provider");
        }
    }

    /**
     * Kakao Authorization Code → Access Token 변환
     */
    public String getKakaoAccessToken(String code, String redirectUri) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", KAKAO_REST_API_KEY);
        formData.add("redirect_uri", redirectUri); // 전달받은 URI 사용
        formData.add("code", code);

        Map<String, Object> response = webClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response.get("access_token").toString();
    }
}
