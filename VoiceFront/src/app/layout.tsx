/* 파일 설명: Next.js App Router의 루트 레이아웃 컴포넌트.
   - 전역 메타데이터와 폰트, 전역 스타일을 설정합니다.
   - 모든 페이지를 감싸며 공통 <html>/<body> 구조를 제공합니다. */
// layout.tsx (서버 컴포넌트)
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "../styles/components.css";
import "../styles/variables.css";
import ClientLayoutWrapper from "../components/layout/ClientLayoutWrapper"; // 클라이언트 기능만 분리
import localFont from "next/font/local";

// 전역 UI 폰트: Pretendard Variable (로컬)
const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/woff2/PretendardVariable.woff2",
      weight: "45 920",
      style: "normal",
    },
  ],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Voice Guard - 실시간 보이스피싱 탐지",
  description:
    "AI 기반 실시간 통화 분석 시스템으로 보이스피싱 시도를 탐지하고 통화 중 즉시 경고를 제공합니다.",
  keywords: "보이스피싱, AI, 실시간, 통화, 보안, 탐지",
  authors: [{ name: "Voice Guard Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Voice Guard - 실시간 보이스피싱 탐지",
    description:
      "AI 기반 실시간 통화 분석 시스템으로 보이스피싱 시도를 탐지하고 통화 중 즉시 경고를 제공합니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice Guard - 실시간 보이스피싱 탐지",
    description:
      "AI 기반 실시간 통화 분석 시스템으로 보이스피싱 시도를 탐지하고 통화 중 즉시 경고를 제공합니다.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <head />
      <body className="font-sans antialiased">
        {/* 클라이언트 기능은 분리된 컴포넌트로 감쌈 */}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
