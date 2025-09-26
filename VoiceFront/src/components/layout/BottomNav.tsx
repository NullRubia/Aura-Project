'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/ThemeProvider';

interface BottomNavProps {
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  // 로그인/회원가입 페이지에서는 하단바 숨김
  if (pathname === '/login') {
    return null;
  }

  const getIconSrc = (key: string, active: boolean) => {
    const variant = active ? 'blue' : (resolvedTheme === 'dark' ? 'dark' : 'light');
    const baseMap: Record<string, string> = {
      phone: 'Call',
      schedule: 'Calendar',
      chat: 'aichat',
      more: 'Category',
    };
    const base = baseMap[key] || key;
    return `/images/${base}(${variant}).png`;
  };

  const items = [
    { name: '전화', href: '/phone', key: 'phone' },
    { name: '일정', href: '/schedule', key: 'schedule' },
    { name: '챗봇', href: '/chat', key: 'chat' },
    { name: '더보기', href: '/settings', key: 'more' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-sm md:hidden ${className}`}>
      <div className="max-w-3xl mx-auto">
        <ul className="grid grid-cols-4">
          {items.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 text-xs ${
                  isActive(item.href)
                    ? 'text-[#2563EB]'
                    : (resolvedTheme === 'dark' ? 'text-white' : 'text-gray-500')
                }`}
              >
                <span className="mb-1">
                  <img
                    src={getIconSrc(item.key, isActive(item.href))}
                    alt={item.name}
                    className="w-6 h-6"
                  />
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;


