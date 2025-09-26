import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// 주의: 프로젝트에는 이미 app/layout.tsx에서 글로벌 CSS를 임포트하고 있으므로
// 여기서는 globals.css를 중복 임포트하지 않는 것이 안전합니다.

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
