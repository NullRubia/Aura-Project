"use client";

import dynamic from "next/dynamic";

// 기존 페이지를 클라이언트 전용으로 로드
const DashboardContent = dynamic(
  () => import("../../pages/Dashboard"),
  { ssr: false } // 서버 렌더링 금지
);

export default function DashboardPage() {
  return <DashboardContent />;
}
