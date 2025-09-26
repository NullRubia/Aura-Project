/* 파일 설명: 더보기(설정) 메인 메뉴
   - 각 설정 섹션으로 들어가는 링크 목록을 제공
*/
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // 로그인 여부 확인 로직(스토리지 토큰 확인)
  useEffect(() => {
    let token =
      localStorage.getItem("auth_refresh_token") ||
      sessionStorage.getItem("auth_refresh_token");

    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);
  if (isAuthenticated === null) {
    // 로딩 스피너나 빈 화면 보여주기
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const items = [
    {
      href: "/settings/theme",
      title: "테마",
      desc: "라이트/다크/시스템 모드 설정",
    },
    {
      href: "/settings/notifications",
      title: "알림",
      desc: "위험 경고, 이메일/푸시/소리 알림",
    },
    {
      href: "/settings/risk",
      title: "위험도 임계값",
      desc: "주의/위험/긴급 임계값",
    },
    {
      href: "/settings/audio",
      title: "오디오",
      desc: "마이크 감도, 잡음 제거, 자동 음소거",
    },
    {
      href: "/settings/privacy",
      title: "개인정보",
      desc: "데이터 보관, 분석 데이터 공유",
    },
    { href: "/settings/account", title: "계정", desc: "이름/이메일/전화번호" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          더보기
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          설정할 항목을 선택하세요.
        </p>

        <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.desc}
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <form
            action="/login"
            method="get"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "/login";
            }}>
            <button
              type="submit"
              className="w-full mt-4 px-4 py-3 text-sm font-semibold rounded-lg bg-danger-50 text-danger-700 hover:bg-danger-100 border border-danger-200">
              로그아웃
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
