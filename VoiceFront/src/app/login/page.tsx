"use client";

import dynamic from "next/dynamic";

// 기존 페이지를 클라이언트 전용으로 로드
const LoginContent = dynamic(
  () => import("../../pages/Login"),
  { ssr: false } // 서버 사이드 렌더링 금지
);

export default function LoginPage() {
  return <LoginContent />;
}
