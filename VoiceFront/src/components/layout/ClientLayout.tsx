'use client';

import React from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  // 중복 내비게이션 방지: 전역에서는 단순 래퍼만 제공하고,
  // 실제 사이드바/하단 네비는 페이지 내부의 `Layout`에서 렌더합니다.
  return <>{children}</>;
};

export default ClientLayout;


