"use client";
/* 파일 설명: 전화 앱 헤더 컴포넌트
   - 탭 네비게이션과 검색 기능을 포함 */
import React from "react";
import { PhoneTab } from "@/types/phone.types";
import { useTheme } from "@/components/theme/ThemeProvider";

interface PhoneHeaderProps {
  activeTab: PhoneTab;
  onTabChange: (tab: PhoneTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCalling: boolean;
}

const PhoneHeader: React.FC<PhoneHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isCalling,
}) => {
  const { resolvedTheme } = useTheme();

  const getIconSrc = (key: string, active: boolean) => {
    const variant = active
      ? "blue"
      : resolvedTheme === "dark"
      ? "dark"
      : "light";
    const baseMap: Record<string, string> = {
      contacts: "3 User",
      recent: "Time Circle",
      keypad: "dial-sqare",
      voice: "Voice",
    };
    const base = baseMap[key] || key;
    // 모든 아이콘을 png 확장자로 사용 (dial-sqare도 png)
    return `/images/${base}(${variant}).png`;
  };
  const tabs = [
    {
      id: "contacts" as PhoneTab,
      name: "연락처",
      key: "contacts",
    },
    {
      id: "recent" as PhoneTab,
      name: "최근 기록",
      key: "recent",
    },
    {
      id: "keypad" as PhoneTab,
      name: "키패드",
      key: "keypad",
    },
    {
      id: "voice" as PhoneTab,
      name: "음성분석",
      key: "voice",
    },
  ];
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeTab));

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* 탭 네비게이션: 세그먼트 스타일 */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          {/* 슬라이딩 인디케이터 */}
          <div
            className="absolute top-1 bottom-1 left-1 rounded-lg bg-white dark:bg-gray-600 shadow transition-transform duration-300 ease-out"
            style={{
              width: 'calc((100% - 0.5rem) / 4)',
              transform: `translateX(${activeIndex * 100}%)`,
            }}
            aria-hidden="true"
          />
          {/* 탭들 */}
          <div className="relative z-10 flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`min-w-0 flex-1 flex items-center justify-center gap-1.5 md:gap-2 py-2 rounded-lg text-[12px] md:text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#2563EB]'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                  aria-pressed={isActive}
                  disabled={isCalling}>
                  <span className="flex items-center justify-center">
                    <img
                      src={getIconSrc(tab.key as string, isActive)}
                      alt={tab.name}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                  </span>
                  <span className="whitespace-nowrap leading-none">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 검색 바 (연락처와 최근기록 탭에서만 표시) */}
      {!isCalling && (activeTab === "contacts" || activeTab === "recent") && (
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder={"검색"}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full px-3 py-2 rounded-lg leading-5 bg-white/70 dark:bg-gray-700/70 backdrop-blur border border-gray-200 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      )}
    </div>
  );
};

export default PhoneHeader;
