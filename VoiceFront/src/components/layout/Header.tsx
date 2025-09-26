"use client";
/* 파일 설명: 상단 헤더 컴포넌트.
   - 로고/내비/사용자 메뉴(알림/설정/프로필)를 포함합니다. */
import React from 'react';
import Button from '../ui/Button';
import { useRouter, usePathname } from 'next/navigation';

/**
 * 헤더 컴포넌트 속성
 * @property user 현재 사용자 정보
 * @property onLogout 로그아웃 콜백
 * @property onSettingsClick 설정 버튼 클릭 콜백
 */
interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onSettingsClick?: () => void;
  onMenuToggle?: () => void;
}

/**
 * 상단 헤더 컴포넌트
 * - 로고/내비게이션/사용자 메뉴(알림/설정/프로필/로그인)를 표시합니다.
 */
const Header: React.FC<HeaderProps> = ({ user, onLogout, onSettingsClick, onMenuToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  // 로그인/회원가입 페이지에서는 헤더 숨김
  if (pathname === '/login') return null;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 제목 */}
          <div className="flex items-center">
            {/* 뒤로가기 버튼 */}
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => router.back()}
              className="mr-2 p-2 h-10 w-10 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-2">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">AURA</h1>
                <p className="hidden md:block text-sm text-gray-500 dark:text-gray-300">실시간 보이스피싱 탐지</p>
              </div>
            </div>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/dashboard"
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              대시보드
            </a>
            <a
              href="/call-monitor"
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              통화 모니터링
            </a>
            <a
              href="/call-history"
              className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              통화 기록
            </a>
            
          </nav>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-2">
            {/* 모바일 햄버거 버튼 (우측) */}
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={onMenuToggle}
              className="md:hidden p-2 h-10 w-10 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* 데스크톱 아이콘/프로필 */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 알림 아이콘 */}
              <button className="relative p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4 7h8l-2 2H6l-2-2z" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-400 ring-2 ring-white"></span>
              </button>
              {/* 설정 버튼 */}
              <button
                onClick={onSettingsClick}
                className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {/* 사용자 프로필 */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">{user.email}</p>
                  </div>
                  <Button
                    onClick={onLogout}
                    variant="secondary"
                    size="sm"
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    로그인
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    회원가입
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
