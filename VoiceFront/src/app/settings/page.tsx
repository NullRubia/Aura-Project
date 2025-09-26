"use client";

import dynamic from "next/dynamic";

// 클라이언트 전용으로 Settings 페이지 불러오기
const SettingsPageContent = dynamic(() => import("../../pages/Settings"), {
  ssr: false,
});

export default function SettingsPage() {
  return <SettingsPageContent />;
}
