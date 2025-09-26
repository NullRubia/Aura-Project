"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

export default function RiskSettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [state, setState] = useState({ warning: 30, danger: 60, critical: 80 });

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
            위험도 임계값
          </h1>
        </div>
        <div className="mt-6 space-y-5">
          {[
            { key: "warning", label: "주의" },
            { key: "danger", label: "위험" },
            { key: "critical", label: "긴급" },
          ].map((i) => (
            <div
              key={i.key}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i.label}
                </span>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {(state as any)[i.key]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={(state as any)[i.key]}
                onChange={(e) =>
                  setState((s) => ({ ...s, [i.key]: parseInt(e.target.value) }))
                }
                className="w-full mt-3"
              />
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
