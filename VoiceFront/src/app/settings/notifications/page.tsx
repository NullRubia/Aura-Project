"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [state, setState] = useState({
    riskAlerts: true,
    email: false,
    push: true,
    sound: true,
  });

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            알림
          </h1>
        </div>
        <div className="mt-6 space-y-4">
          {[
            {
              key: "riskAlerts",
              label: "위험도 경고",
              desc: "위험한 통화가 감지될 때 알림",
            },
            {
              key: "email",
              label: "이메일 알림",
              desc: "중요 알림을 이메일로 수신",
            },
            { key: "push", label: "푸시 알림", desc: "브라우저 푸시 알림" },
            { key: "sound", label: "소리 알림", desc: "알림 소리 재생" },
          ].map((i) => (
            <div
              key={i.key}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {i.desc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={(state as any)[i.key]}
                onChange={(e) =>
                  setState((s) => ({ ...s, [i.key]: e.target.checked }))
                }
                className="h-4 w-4"
              />
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
