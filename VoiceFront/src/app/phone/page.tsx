/* 파일 설명: 전화 앱 메인 페이지
   - 연락처, 최근기록, 키패드 탭을 포함한 전화 앱 인터페이스 */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PhoneTab,
  Contact,
  RecentCall,
  PhoneAppState,
} from "@/types/phone.types";
import ContactsTab from "@/components/phone/ContactsTab";
import RecentCallsTab from "@/components/phone/RecentCallsTab";
import KeypadTab from "@/components/phone/KeypadTab";
import VoiceTab from "@/components/phone/VoiceTab";
import PhoneHeader from "@/components/phone/PhoneHeader";
import CallInterface from "@/components/call/CallInterface";
import BottomNav from "@/components/layout/BottomNav";
import { authService } from "../../services/api/auth";

declare global {
  interface Window {
    Android?: any;
    populateContacts?: (jsonStr: string) => void;
    populateRecentCalls?: (jsonStr: string) => void;
    onCallResult?: (ok: boolean, msg?: string) => void;
    onCallEnded?: () => void; // 여기를 추가
  }
}

/**
 * 전화 앱 메인 페이지 컴포넌트
 */
const PhonePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PhoneTab>("keypad");
  const [isCalling, setIsCalling] = useState(false);
  const [currentCall, setCurrentCall] =
    useState<PhoneAppState["currentCall"]>(undefined);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 네이티브에서 호출할 때 JSON 문자열로 전달됨
    window.populateContacts = (jsonStr: string) => {
      try {
        const arr = JSON.parse(jsonStr);
        // arr -> 연락처 형태에 매핑해서 상태 업데이트
        setContacts(
          arr.map((c: any, idx: number) => ({
            id: String(idx),
            name: c.name || "",
            phoneNumber: c.phoneNumber || "",
            // 추가 필드 기본값
            isFavorite: false,
            lastCallTime: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: [],
          }))
        );
      } catch (e) {
        console.error(e);
      }
    };

    window.populateRecentCalls = (jsonStr: string) => {
      try {
        const arr = JSON.parse(jsonStr);
        setRecentCalls(
          arr.map((r: any, idx: number) => ({
            id: String(idx),
            contactId: undefined,
            contactName: r.name || null,
            phoneNumber: r.phoneNumber,
            direction:
              r.type === "1"
                ? "incoming"
                : r.type === "2"
                ? "outgoing"
                : "missed",
            startTime: new Date(r.startTime),
            endTime: new Date(r.startTime + (r.duration || 0) * 1000),
            duration: r.duration || 0,
            riskLevel: 0,
            isBlocked: false,
            isFavorite: false,
            callQuality: "unknown",
          }))
        );
      } catch (e) {
        console.error(e);
      }
    };

    window.onCallResult = (ok: boolean, msg?: string) => {
      if (!ok) alert("전화 시도 실패: " + msg);
    };

    // 요청: 네이티브에게 연락처/통화기록 불러오라고 요청 (예: 페이지 로드 시)
    if (window.Android && window.Android.requestContacts) {
      try {
        window.Android.requestContacts();
      } catch (e) {
        console.error(e);
      }
    }
    if (window.Android && window.Android.requestRecentCalls) {
      try {
        window.Android.requestRecentCalls();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    window.onCallEnded = () => {
      handleEndCall(); // 통화 종료 UI로 전환
    };
  }, [currentCall]);

  // 로그인 여부 확인(로그인 안됐을시 login페이지로)+샘플 데이터 로드
  useEffect(() => {
    // 1. 로그인 검증(토큰 확인)
    const checkAuth = async () => {
      let token =
        localStorage.getItem("auth_refresh_token") ||
        sessionStorage.getItem("auth_refresh_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
    };
    checkAuth();

    // 2. localStorage에만 토큰이 있는 경우 1회 /auth/refresh 호출
    const refreshIfLocalToken = async () => {
      const localToken = localStorage.getItem("auth_refresh_token");
      const sessionToken = sessionStorage.getItem("auth_refresh_token");

      if (localToken && !sessionToken) {
        try {
          await authService.refresh(localToken);
          console.log("Refresh token updated from localStorage");
        } catch (err) {
          console.error("Refresh token update failed:", err);
        }
      }
    };

    refreshIfLocalToken();

    // 샘플 연락처 데이터
    const sampleContacts: Contact[] = [
      {
        id: "1",
        name: "김철수",
        phoneNumber: "010-1234-5678",
        email: "kim@example.com",
        isFavorite: true,
        lastCallTime: new Date("2024-01-15T10:30:00"),
        callCount: 15,
        riskLevel: 25,
        isBlocked: false,
        tags: ["가족", "중요"],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "이영희",
        phoneNumber: "010-2345-6789",
        isFavorite: false,
        lastCallTime: new Date("2024-01-14T15:20:00"),
        callCount: 8,
        riskLevel: 15,
        isBlocked: false,
        tags: ["친구"],
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-14"),
      },
      {
        id: "3",
        name: "박민수",
        phoneNumber: "010-3456-7890",
        isFavorite: true,
        lastCallTime: new Date("2024-01-13T09:15:00"),
        callCount: 22,
        riskLevel: 5,
        isBlocked: false,
        tags: ["직장", "중요"],
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-13"),
      },
    ];

    // 샘플 최근 통화 기록
    const sampleRecentCalls: RecentCall[] = [
      {
        id: "1",
        contactId: "1",
        contactName: "김철수",
        phoneNumber: "010-1234-5678",
        direction: "incoming",
        startTime: new Date("2024-01-15T10:30:00"),
        endTime: new Date("2024-01-15T10:45:00"),
        duration: 900,
        riskLevel: 25,
        isBlocked: false,
        isFavorite: true,
        callQuality: "good",
      },
      {
        id: "2",
        contactId: "2",
        contactName: "이영희",
        phoneNumber: "010-2345-6789",
        direction: "outgoing",
        startTime: new Date("2024-01-14T15:20:00"),
        endTime: new Date("2024-01-14T15:35:00"),
        duration: 900,
        riskLevel: 15,
        isBlocked: false,
        isFavorite: false,
        callQuality: "excellent",
      },
      {
        id: "3",
        phoneNumber: "010-9999-8888",
        direction: "missed",
        startTime: new Date("2024-01-14T12:00:00"),
        duration: 0,
        riskLevel: 85,
        isBlocked: true,
        isFavorite: false,
        callQuality: "poor",
      },
    ];

    setContacts(sampleContacts);
    setRecentCalls(sampleRecentCalls);
  }, [router]);

  // 렌더링 시점에서는 항상 훅이 호출되므로 안전
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const callNumber = (number: string) => {
    if (window.Android && window.Android.makeCall) {
      window.Android.makeCall(number);
    } else {
      // 웹 환경(브라우저)에서는 tel: 링크 사용
      window.location.href = `tel:${number}`;
    }
  };

  // 통화 시작
  const handleMakeCall = (phoneNumber: string, contactName?: string) => {
    callNumber(phoneNumber); //전화걸기
    setCurrentCall({
      phoneNumber,
      contactName,
      startTime: new Date(),
      duration: 0,
      riskLevel: 0,
    });
    setIsCalling(true);
  };

  // 통화 종료
  const handleEndCall = () => {
    if (currentCall) {
      // 통화 기록에 추가
      const newCall: RecentCall = {
        id: Date.now().toString(),
        contactName: currentCall.contactName,
        phoneNumber: currentCall.phoneNumber,
        direction: "outgoing",
        startTime: currentCall.startTime,
        endTime: new Date(),
        duration: Math.floor(
          (Date.now() - currentCall.startTime.getTime()) / 1000
        ),
        riskLevel: currentCall.riskLevel,
        isBlocked: false,
        isFavorite: false,
        callQuality: "good",
      };
      setRecentCalls((prev) => [newCall, ...prev]);
    }
    setCurrentCall(undefined);
    setIsCalling(false);
  };

  // 연락처 추가
  const handleAddContact = (
    contact: Omit<Contact, "id" | "createdAt" | "updatedAt">
  ) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContacts((prev) => [...prev, newContact]);
  };

  // 연락처 업데이트
  const handleUpdateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id
          ? { ...contact, ...updates, updatedAt: new Date() }
          : contact
      )
    );
  };

  // 연락처 삭제
  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  };

  // 탭 변경
  const handleTabChange = (tab: PhoneTab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  // 검색 쿼리 변경
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 전화 헤더 */}
      <PhoneHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isCalling={isCalling}
      />

      {/* 메인 콘텐츠 */}
      <div className={`flex-1 overflow-hidden pb-20 ${
        activeTab === 'keypad' || activeTab === 'voice' || activeTab === 'recent' || activeTab === 'contacts'
          ? 'bg-white dark:bg-gray-900'
          : ''
      }`}>
        {isCalling && currentCall ? (
          <CallInterface
            isCallActive={true}
            riskLevel={currentCall.riskLevel}
            transcript=""
            onStartCall={() => {}}
            onEndCall={handleEndCall}
            onMuteToggle={() => {}}
            isMuted={false}
          />
        ) : (
          <>
            {activeTab === "contacts" && (
              <ContactsTab
                contacts={contacts}
                searchQuery={searchQuery}
                onMakeCall={handleMakeCall}
                onAddContact={handleAddContact}
                onUpdateContact={handleUpdateContact}
                onDeleteContact={handleDeleteContact}
              />
            )}
            {activeTab === "recent" && (
              <RecentCallsTab
                recentCalls={recentCalls}
                searchQuery={searchQuery}
                onMakeCall={handleMakeCall}
                onAddContact={handleAddContact}
              />
            )}
            {activeTab === "keypad" && (
              <KeypadTab
                onMakeCall={handleMakeCall}
                onAddContact={handleAddContact}
              />
            )}
            {activeTab === "voice" && <VoiceTab />}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default PhonePage;
