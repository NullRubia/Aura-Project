"use client";

import dynamic from "next/dynamic";

// 기존 페이지를 클라이언트 전용으로 로드
const CallMonitorContent = dynamic(
  () => import("../../pages/CallMonitor"), // 실제 페이지 경로
  { ssr: false } // 서버 사이드 렌더링 금지
);

export default function CallMonitorPage() {
  return <CallMonitorContent />;
}
