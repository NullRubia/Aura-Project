"use client";

import React, { useState, useEffect } from "react";
import ChatUI from "@/components/chat/ChatUI";
import BottomNav from "@/components/layout/BottomNav";
import { useRouter } from "next/navigation";

export default function ChatPage() {
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
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-hidden pb-20 bg-white dark:bg-gray-900">
        <ChatUI className="h-full" />
      </div>
      <BottomNav />
    </div>
  );
}
