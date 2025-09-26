'use client';

/* 파일 설명: 앱 공통 레이아웃 컴포넌트.
   - 좌측 사이드바, 상단 헤더, 메인 콘텐츠 영역으로 구성됩니다.
   - 모바일 환경에서 사이드바 토글 버튼을 제공하며, 현재 경로를 이용해 메뉴 활성화를 관리합니다. */

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/**
 * 레이아웃 컴포넌트 속성
 * @property children 페이지 컨텐츠
 * @property currentPath 현재 경로(사이드바 활성화)
 * @property user 사용자 정보(헤더 표시용)
 * @property onLogout 로그아웃 콜백
 * @property onSettingsClick 설정 버튼 콜백
 */
interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onSettingsClick?: () => void;
}

/**
 * 앱 전체 공통 레이아웃
 * - 좌측 사이드바, 상단 헤더, 메인 컨텐츠 영역을 제공합니다.
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  currentPath = '/',
  user,
  onLogout,
  onSettingsClick,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const hideHeader = pathname === '/login';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 사이드바 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPath={currentPath}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="lg:pl-64">
        {/* 헤더: 로그인/회원가입 페이지에서는 숨김 */}
        {!hideHeader && (
          <Header
            user={user}
            onLogout={onLogout}
            onSettingsClick={onSettingsClick}
            onMenuToggle={toggleSidebar}
          />
        )}

        {/* 모바일 메뉴 버튼은 헤더 우측에 배치 (중복 제거) */}

        {/* 페이지 콘텐츠 */}
        <main className="py-6 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        {/* 하단 네비게이션 (모바일) */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
