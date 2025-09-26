package com.aura.voiceback.controller;

import com.aura.voiceback.dto.*;
import com.aura.voiceback.entity.User;
import com.aura.voiceback.repository.UserRepository;
import com.aura.voiceback.service.SummaryService;
import com.aura.voiceback.service.TokenService;
import com.aura.voiceback.service.SocialAuthService;
import com.aura.voiceback.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final SocialAuthService socialAuthService;
    private final EmailService emailService;
    private final SummaryService summaryService;
    private final Map<String, String> resetCodeStore = new ConcurrentHashMap<>();

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest().body("이미 존재하는 전화번호입니다.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);

        return ResponseEntity.ok("회원가입 성공");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) throw new RuntimeException("비번 불일치");

        TokenService.TokenPair pair = tokenService.createTokensForUser(user);
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer " + pair.refreshToken()));
    }

    // 인증 확인 (JWT 필요)
    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(@RequestAttribute("email") String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        return ResponseEntity.ok(new MeResponse(user.getEmail(), user.getName(), user.getPhone()));
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateUser(
            @RequestAttribute("email") String email,
            @RequestBody Map<String, String> updateRequest // name, email, phone, password
    ) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 없음"));

        // 이름 업데이트
        if (updateRequest.containsKey("name")) {
            user.setName(updateRequest.get("name"));
        }

        // 이메일 업데이트
        if (updateRequest.containsKey("email")) {
            String newEmail = updateRequest.get("email");
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
            }
            user.setEmail(newEmail);
        }

        // 전화번호 업데이트
        if (updateRequest.containsKey("phone")) {
            String newPhone = updateRequest.get("phone");
            if (!newPhone.equals(user.getPhone()) && userRepository.existsByPhone(newPhone)) {
                return ResponseEntity.badRequest().body("이미 존재하는 전화번호입니다.");
            }
            user.setPhone(newPhone);
        }

        // 비밀번호 업데이트 (선택사항)
        if (updateRequest.containsKey("password") && updateRequest.get("password") != null && !updateRequest.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.get("password")));
        }

        userRepository.save(user);
        return ResponseEntity.ok("사용자 정보가 업데이트되었습니다.");
    }

    // 소셜 로그인 (익명 접근 허용)
    @PostMapping("/social/login")
    public ResponseEntity<TokenResponse> socialLogin(@RequestBody SocialLoginRequest req) {
        User user = socialAuthService.loginWithSocial(req.getProvider(), req.getAccessToken());
        TokenService.TokenPair pair = tokenService.createTokensForUser(user);
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer " + pair.refreshToken()));
    }

    // 소셜 연동 (인증 필요) -- 현재 로그인한 email를 request attribute로부터 가져온다고 가정
    @PostMapping("/social/link")
    public ResponseEntity<String> linkSocial(@RequestAttribute("email") String email,
                                             @RequestBody SocialLinkRequest req) {
        User user = userRepository.findByEmail(email).orElseThrow();
        socialAuthService.linkSocialAccount(user, req.getProvider(), req.getAccessToken());
        return ResponseEntity.ok("linked");
    }

    // 리프레시 토큰 -> 새 토큰 발급
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest req) {
        User user = tokenService.validateAndGetUserByRefreshToken(req.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        // rotate (새 refresh + access) 권장
        TokenService.TokenPair pair = tokenService.rotateRefreshToken(req.getRefreshToken());
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer " + pair.refreshToken()));
    }
    //이메일 찾기
    @PostMapping("/find-email")
    public ResponseEntity<String> findEmailByPhone(@RequestBody FindEmailRequest request) {
        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("해당 전화번호로 가입된 사용자가 없습니다."));
        return ResponseEntity.ok(user.getEmail());
    }
    // 1. 비밀번호 재설정 요청 (이메일 → 인증코드 발송)
    @PostMapping("/password/reset/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 사용자가 없습니다."));

        String code = String.format("%06d", new Random().nextInt(999999)); // 6자리 인증코드
        resetCodeStore.put(request.getEmail(), code);

        emailService.sendEmail(request.getEmail(), "비밀번호 재설정 코드", "인증코드: " + code);

        return ResponseEntity.ok("인증코드가 이메일로 전송되었습니다.");
    }

    // 2. 인증코드 확인 후 비밀번호 재설정
    @PostMapping("/password/reset/confirm")
    public ResponseEntity<String> confirmPasswordReset(@RequestBody PasswordResetConfirmRequest request) {
        String storedCode = resetCodeStore.get(request.getEmail());
        if (storedCode == null || !storedCode.equals(request.getCode())) {
            return ResponseEntity.badRequest().body("잘못된 인증코드입니다.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자 없음"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetCodeStore.remove(request.getEmail()); // 사용 후 코드 삭제

        return ResponseEntity.ok("비밀번호가 성공적으로 재설정되었습니다.");
    }

    // 요약 저장
    @PostMapping("/summary")
    public ResponseEntity<SummaryResponse> saveSummary(
            @RequestAttribute("email") String email,
            @RequestBody SummaryRequest request
    ) {
        return ResponseEntity.ok(summaryService.saveSummary(email, request));
    }

    // 요약 리스트 조회
    @GetMapping("/summary")
    public ResponseEntity<List<SummaryResponse>> getSummaries(
            @RequestAttribute("email") String email
    ) {
        return ResponseEntity.ok(summaryService.getSummaries(email));
    }
}