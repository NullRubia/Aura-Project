"use client";

import { useEffect } from "react";
import { authService, getStoredAccessToken } from "@/services/api/auth";

export default function OAuthCallback({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  useEffect(() => {
    const hash = window.location.hash;
    const accessTokenInHash = new URLSearchParams(hash.replace(/^#/, "")).get(
      "access_token"
    );

    const code = searchParams?.code || null;
    const provider = detectProvider();

    const remember = window.localStorage.getItem("remember_me") === "true";

    (async () => {
      try {
        if (!provider) return;

        const tokenOrCode =
          provider === "kakao" ? code || "" : accessTokenInHash || "";
        if (!tokenOrCode) return;

        const access = getStoredAccessToken() || null;
        if (access) {
          await authService.linkSocial(provider as any, tokenOrCode);
          alert("소셜 계정이 연동되었습니다.");
          window.close?.();
        } else {
          await authService.socialLogin(provider as any, tokenOrCode, remember);
          window.location.href = "/phone";
        }
      } catch (e) {
        console.error(e);
        alert("소셜 인증 처리 중 오류가 발생했습니다.");
      }
    })();
  }, [searchParams]);

  const detectProvider = (): "google" | "kakao" | "naver" | null => {
    const href = window.location.href;
    if (href.includes("oauth/callback")) return "kakao";

    if (href.startsWith("http://localhost#")) {
      const params = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );
      const state = params.get("state");
      return state === "TEST" ? "naver" : "google";
    }
    return null;
  };

  return null;
}
