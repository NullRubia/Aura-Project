"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/layout/BottomNav";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [state, setState] = useState({
    retention: 30,
    share: false,
    local: true,
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
            개인정보
          </h1>
        </div>
        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              데이터 보관 기간
            </label>
            <select
              value={state.retention}
              onChange={(e) =>
                setState((s) => ({ ...s, retention: parseInt(e.target.value) }))
              }
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
              <option value={7}>7일</option>
              <option value={30}>30일</option>
              <option value={90}>90일</option>
              <option value={365}>1년</option>
            </select>
          </div>
          {[
            {
              key: "local",
              label: "로컬 처리",
              desc: "오디오를 기기에서 처리",
            },
            {
              key: "share",
              label: "분석 데이터 공유",
              desc: "개선을 위한 익명 데이터 공유",
            },
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
