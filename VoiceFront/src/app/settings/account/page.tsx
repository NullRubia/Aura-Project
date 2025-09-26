"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import BottomNav from "@/components/layout/BottomNav";
import Button from "@/components/ui/Button";
import { authService, MeResponse } from "../../../services/api/auth";

export default function AccountSettingsPage() {
  const google_url = process.env.NEXT_PUBLIC_LINK_GOOGLE_URL!;
  const naver_url = process.env.NEXT_PUBLIC_LINK_NAVER_URL!;
  const kakao_url = process.env.NEXT_PUBLIC_LINK_KAKAO_URL!;
  const callback_url = process.env.NEXT_PUBLIC_CALL_BACK!;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  // -------------------
  // 회원정보 저장
  // -------------------
  const handleSave = async () => {
    setSaving(true);
    try {
      const phoneRegex = /^010-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(form.phone)) {
        alert("전화번호 형식이 올바르지 않습니다. 예: 010-1234-1234");
        setSaving(false);
        return;
      }

      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
      };
      if (form.password?.trim() !== "") {
        if (form.password.length < 6) {
          alert("비밀번호는 최소 6자 이상이어야 합니다.");
          setSaving(false);
          return;
        }
        payload.password = form.password;
      }

      await authService.updateUser(payload);
      alert("회원정보가 저장되었습니다.");
      setForm((s) => ({ ...s, password: "" }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "회원정보 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // -------------------
  // 소셜 계정 연동 (PostMessage 방식)
  // -------------------
  const handleSocialLink = (provider: "google" | "kakao" | "naver") => {
    let oauthUrl = "";
    switch (provider) {
      case "google":
        oauthUrl = google_url;
        break;
      case "kakao":
        oauthUrl = kakao_url;
        break;
      case "naver":
        oauthUrl = naver_url;
        break;
    }
    // 동일 창에서 이동
    window.location.href = oauthUrl;
  };

  // -------------------
  // 사용자 정보 조회
  // -------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me: MeResponse = await authService.me();
        setForm((prev) => ({
          ...prev,
          name: me.name,
          email: me.email,
          phone: me.phone,
        }));
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err);
      }
    };
    fetchUser();
  }, []);

  // -------------------
  // 로그인 여부 확인
  // -------------------
  useEffect(() => {
    const token =
      localStorage.getItem("auth_refresh_token") ||
      sessionStorage.getItem("auth_refresh_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (isAuthenticated === null) {
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
            계정
          </h1>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label="이름"
            value={form.name}
            onChange={(v) => setForm((s) => ({ ...s, name: v }))}
            placeholder="이름"
          />
          <Input
            label="이메일"
            type="email"
            value={form.email}
            onChange={(v) => setForm((s) => ({ ...s, email: v }))}
            placeholder="이메일"
          />
          <Input
            label="전화번호"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
            placeholder="전화번호(하이픈(-) 반드시 포함)"
          />
          <Input
            label="비밀번호"
            type="password"
            value={form.password}
            onChange={(v) => setForm((s) => ({ ...s, password: v }))}
            placeholder="비밀번호를 변경하지 않을시 공백"
          />

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
              onClick={handleSave}
              disabled={saving}>
              {saving ? "저장 중..." : "저장"}
            </Button>
          </div>

          {/* 소셜 계정 연동 아이콘 (로그인 화면과 동일 스타일) */}
          <div className="pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">계정 연동</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleSocialLink("google")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleSocialLink("kakao")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/Kakao.png" alt="Kakao" className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleSocialLink("naver")}
                className="w-12 h-12 rounded-full flex items-center justify-center border shadow hover:shadow">
                <img src="/icons/Naver.png" alt="Naver" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
