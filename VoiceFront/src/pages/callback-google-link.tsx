"use client";

import { useEffect } from "react";
import { authService } from "../services/api/auth";

export default function OAuthCallbackGoogleLink() {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hashParams.get("access_token");
    const code = new URL(window.location.href).searchParams.get("code");

    const provider = "google";

    const tokenOrCode = access_token ?? code; // access_token이 없으면 code 사용

    if (tokenOrCode) {
      (async () => {
        try {
          await authService.linkSocial(provider, tokenOrCode);
          window.location.replace("/settings/account"); // 로그인 완료 후 이동
        } catch (err: any) {
          console.error(err);
          alert(err.message || "소셜 연동 실패");
          window.location.replace("/settings/account"); // 실패 시 로그인 페이지로
        }
      })();
    }
  }, []);

  return <div>로그인 처리중...</div>;
}
