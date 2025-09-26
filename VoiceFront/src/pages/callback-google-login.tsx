"use client";

import { useEffect } from "react";
import { authService } from "../services/api/auth";

export default function OAuthCallbackGoogleLogin() {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hashParams.get("access_token");
    const code = new URL(window.location.href).searchParams.get("code");

    const provider = "google";

    const tokenOrCode = access_token ?? code; // access_token이 없으면 code 사용

    if (tokenOrCode) {
      (async () => {
        try {
          await authService.socialLogin(provider, tokenOrCode, true);
          window.location.replace("/phone"); // 로그인 완료 후 이동
        } catch (err: any) {
          console.error(err);
          alert(
            err.message || "소셜 로그인 실패. 소셜 연동을 먼저 진행해주세요."
          );
          window.location.replace("/login"); // 실패 시 로그인 페이지로
        }
      })();
    }
  }, []);

  return <div>로그인 처리중...</div>;
}
