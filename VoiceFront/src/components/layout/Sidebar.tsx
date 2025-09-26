/* 파일 설명: 좌측 사이드바 내비게이션 컴포넌트.
   - 현재 경로에 따라 활성 상태를 표시하고, 모바일에서는 오버레이와 함께 토글됩니다. */
import React from 'react';
import { useRouter } from 'next/navigation';
import { defaultStorage, sessionStorageInstance, cookieStorage } from '@/utils/storage';
import { STORAGE_KEYS, COOKIE_CONFIG } from '@/utils/constants';

/**
 * 사이드바 컴포넌트 속성
 * @property isOpen 모바일에서 열림 여부
 * @property onClose 모바일에서 닫기 콜백
 * @property currentPath 현재 경로(활성 메뉴 표시)
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

/**
 * 좌측 사이드바 내비게이션 컴포넌트
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPath }) => {
  const router = useRouter();

  const handleLogout = () => {
    try {
      // 토큰/세션/쿠키 정리
      defaultStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      defaultStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      sessionStorageInstance.clear();
      cookieStorage.removeItem(COOKIE_CONFIG.AUTH_TOKEN.name);
      cookieStorage.removeItem(COOKIE_CONFIG.REFRESH_TOKEN.name);
    } catch {}
    // 로그인 페이지로 이동
    router.replace('/login');
  };
  const navigation = [
    {
      name: '통화 모니터링',
      href: '/call-monitor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: '설정',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  /** 현재 경로와 메뉴 href를 비교해 활성 상태를 반환 */
  const isActive = (href: string) => {
    return currentPath === href;
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">Voice Guard</h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 네비게이션 메뉴 (스크롤 가능) */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group sidebar-nav-item ${
                  isActive(item.href)
                    ? 'active'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span
                  className={`mr-3 ${
                    isActive(item.href) ? 'text-primary-500' : 'text-gray-400 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200'
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* 하단: 로그아웃 */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-danger-50 text-danger-700 hover:bg-danger-100 border border-danger-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
