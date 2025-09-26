"use client";

/* 파일 설명: 로그인/회원가입 페이지 컴포넌트.
   - 로그인/회원가입 모드 전환, 폼 검증, 임시 제출 흐름을 포함합니다.
   - 실제 운영에서는 API 연동을 통해 인증을 처리합니다. */

import React, { useState } from "react";
import { authService, Provider } from "../services/api/auth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

const Login: React.FC = () => {
  //로컬스토리지 및 세션스토리지 초기화
  React.useEffect(() => {
    try {
      // 인증 관련 토큰 및 remember me 초기화
      localStorage.removeItem("auth_access_token");
      localStorage.removeItem("auth_refresh_token");
      localStorage.removeItem("auth_token_type");
      localStorage.removeItem("remember_me");
      localStorage.removeItem("remember_email");

      sessionStorage.removeItem("auth_access_token");
      sessionStorage.removeItem("auth_refresh_token");
      sessionStorage.removeItem("auth_token_type");
    } catch (err) {
      console.error("스토리지 초기화 실패:", err);
    }
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showFindEmail, setShowFindEmail] = useState(false);
  const [showFindPassword, setShowFindPassword] = useState(false);
  const [findPhone, setFindPhone] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [resetStep, setResetStep] = useState<"request" | "confirm">("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const google_url = process.env.NEXT_PUBLIC_LOGIN_GOOGLE_URL!;
  const naver_url = process.env.NEXT_PUBLIC_LOGIN_NAVER_URL!;
  const kakao_url = process.env.NEXT_PUBLIC_LOGIN_KAKAO_URL!;
  const callback_url = process.env.NEXT_PUBLIC_CALL_BACK!;

  /**
   * 입력 필드 변경 핸들러
   * @param field 변경할 필드 키 (email | password | confirmPassword | name | phone)
   * @param value 변경 값
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 메시지 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  /**
   * 폼 유효성 검사
   * @returns 모든 필드가 유효하면 true
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "이름을 입력해주세요";
      }

      if (!formData.phone) {
        newErrors.phone = "전화번호를 입력해주세요";
      } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
        newErrors.phone = "올바른 전화번호 형식이 아닙니다 (010-1234-5678)";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호 확인을 입력해주세요";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 폼 제출 핸들러
   * - 로그인: 대시보드로 이동
   * - 회원가입: 폼 리셋 후 로그인 모드로 전환
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await authService.login(
          { email: formData.email, password: formData.password },
          rememberMe
        );
        try {
          if (rememberMe) {
            localStorage.setItem("remember_me", "true");
            localStorage.setItem("remember_email", formData.email || "");
          } else {
            localStorage.removeItem("remember_me");
            localStorage.removeItem("remember_email");
          }
        } catch {}
        window.location.href = "/phone";
      } else {
        await authService.register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setIsLogin(true);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          phone: "",
        });
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      alert(isLogin ? "로그인에 실패했습니다." : "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인/회원가입 모드 전환
   * - 폼 값/에러 초기화 포함
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    });
    setErrors({});
  };

  // remember me 초기화
  React.useEffect(() => {
    try {
      const remembered = localStorage.getItem("remember_me") === "true";
      const rememberedEmail = localStorage.getItem("remember_email") || "";
      setRememberMe(remembered);
      if (remembered && rememberedEmail) {
        setFormData((prev) => ({ ...prev, email: rememberedEmail }));
      }
    } catch {}
  }, []);

  // 소셜 로그인
  const handleSocialLogin = async (provider: Provider) => {
    let oauthUrl = "";
    switch (provider) {
      case "google":
        oauthUrl = `${google_url}`;
        break;
      case "kakao":
        oauthUrl = `${kakao_url}`;
        break;
      case "naver":
        oauthUrl = `${naver_url}`;
        break;
    }

    // 현재 창에서 이동
    window.location.href = oauthUrl;
  };

  // 전화번호 자동 하이픈 포맷팅 (예: 010-1234-5678)
  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 11);
    if (digits.startsWith('010')) {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    // 기타 번호에 대한 일반 규칙(10자리: 3-3-4, 11자리: 3-4-4)
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {isLogin ? (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col items-center gap-3">
            <img src="/logos/aura1.png" alt="AURA" className="h-16 md:h-20 w-auto" />
            <div className="wave-eq" aria-hidden="true">
              <span style={{height:'40%'}}></span>
              <span style={{height:'70%'}}></span>
              <span style={{height:'100%'}}></span>
              <span style={{height:'70%'}}></span>
              <span style={{height:'40%'}}></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button
            type="button"
            aria-label="로그인으로 돌아가기"
            onClick={toggleMode}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">로그인으로</span>
          </button>
          <div className="mt-4 flex flex-col items-center gap-3">
            <img src="/logos/aura1.png" alt="AURA" className="h-16 md:h-20 w-auto" />
            <div className="wave-eq" aria-hidden="true">
              <span style={{height:'40%'}}></span>
              <span style={{height:'70%'}}></span>
              <span style={{height:'100%'}}></span>
              <span style={{height:'70%'}}></span>
              <span style={{height:'40%'}}></span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow rounded-lg border border-gray-200 dark:border-gray-700 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                label="이름"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                error={errors.name}
                placeholder="이름을 입력하세요"
                required
              />
            )}

            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              error={errors.email}
              placeholder="이메일을 입력하세요"
              required
            />

            {!isLogin && (
              <Input
                label="전화번호"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", formatPhone(value))}
                error={errors.phone}
                placeholder="010-1234-5678"
                required
              />
            )}

            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              error={errors.password}
              placeholder="비밀번호를 입력하세요"
              required
            />

            {!isLogin && (
              <Input
                label="비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                error={errors.confirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            )}

            {/* 로그인 유지 & 유틸 링크 (로그인 모드에서만 표시) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  로그인 유지
                </label>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setShowFindEmail(true)}
                    className="hover:text-primary-600">
                    이메일 찾기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setShowFindPassword(true)}
                    className="hover:text-primary-600">
                    비밀번호 찾기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary-600 hover:text-primary-500">
                    회원가입
                  </button>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}>
                {isLoading ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
              </Button>
            </div>
          </form>

          {/* 이메일 찾기 모달 */}
          <Modal
            isOpen={showFindEmail}
            onClose={() => setShowFindEmail(false)}
            title="이메일 찾기"
            size="sm">
            <div className="space-y-4">
              <Input
                label="전화번호"
                value={findPhone}
                onChange={setFindPhone}
                placeholder="010-1234-5678"
              />
              {findEmail && (
                <p className="text-sm text-green-600">
                  가입된 이메일: <b>{findEmail}</b>
                </p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowFindEmail(false);
                    setFindPhone("");
                    setFindEmail("");
                  }}>
                  닫기
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    try {
                      const email = await authService.findEmail({
                        phone: findPhone,
                      });
                      setFindEmail(email);
                    } catch (err: any) {
                      alert(err.message || "이메일 조회 실패");
                    }
                  }}>
                  조회하기
                </Button>
              </div>
            </div>
          </Modal>

          {/* 비밀번호 찾기 모달 */}
          <Modal
            isOpen={showFindPassword}
            onClose={() => {
              setShowFindPassword(false);
              setResetStep("request");
              setFindEmail("");
              setResetCode("");
              setNewPassword("");
            }}
            title="비밀번호 찾기"
            size="sm">
            <div className="space-y-4">
              <Input
                label="이메일"
                value={findEmail}
                onChange={setFindEmail}
                placeholder="example@email.com"
                disabled={resetStep === "confirm"}
              />

              {resetStep === "confirm" && (
                <>
                  <Input
                    label="인증 코드"
                    value={resetCode}
                    onChange={setResetCode}
                    placeholder="이메일로 받은 6자리 코드"
                  />
                  <Input
                    label="새 비밀번호"
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="새 비밀번호 입력"
                  />
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowFindPassword(false);
                    setResetStep("request");
                  }}>
                  취소
                </Button>
                {resetStep === "request" ? (
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        await authService.requestPasswordReset({
                          email: findEmail,
                        });
                        alert("재설정 코드가 이메일로 전송되었습니다.");
                        setResetStep("confirm");
                      } catch (err: any) {
                        alert(err.message || "재설정 코드 요청 실패");
                      }
                    }}>
                    재설정 코드 보내기
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        await authService.confirmPasswordReset({
                          email: findEmail,
                          code: resetCode,
                          newPassword: newPassword,
                        });
                        alert(
                          "비밀번호가 변경되었습니다. 다시 로그인해주세요."
                        );
                        setShowFindPassword(false);
                        setResetStep("request");
                        setFindEmail("");
                        setResetCode("");
                        setNewPassword("");
                      } catch (err: any) {
                        alert(err.message || "비밀번호 재설정 실패");
                      }
                    }}>
                    비밀번호 변경하기
                  </Button>
                )}
              </div>
            </div>
          </Modal>

          {/* 소셜 로그인: 로그인 모드에서만 표시 */}
          {isLogin && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleSocialLogin("kakao")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/Kakao.png" alt="Kakao" className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleSocialLogin("naver")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/Naver.png" alt="Naver" className="w-6 h-6" />
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
