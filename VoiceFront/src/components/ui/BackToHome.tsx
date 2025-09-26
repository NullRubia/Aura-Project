'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BackToHomeProps {
  label?: string;
  className?: string;
  href?: string; // 기본은 '/'로 이동, 필요시 커스텀 경로
}

const BackToHome: React.FC<BackToHomeProps> = ({ label = '초기 메뉴로', className = '', href = '/phone' }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-sm ${className}`}
      aria-label={label}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001 1h4a1 1 0 001-1m-6 0V9" />
      </svg>
      {label}
    </button>
  );
};

export default BackToHome;


