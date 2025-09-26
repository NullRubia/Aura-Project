'use client';

/* 파일 설명: 대시보드 페이지 컴포넌트.
   - 상단 통계 카드, 위험도 분석 그래프, 최근 경고, 통화 기록 섹션으로 구성됩니다.
   - 현재는 임시 더미 데이터를 사용하며, 실제 운영에서는 API 연동으로 대체합니다. */

import React from 'react';
import Layout from '../components/layout/Layout';
import StatCards from '../components/dashboard/StatCards';
import CallHistory from '../components/dashboard/CallHistory';
import RecentAlerts from '../components/dashboard/RecentAlerts';

const Dashboard: React.FC = () => {
  // 임시 데이터 (실제로는 API에서 가져올 데이터)
  const stats = {
    totalCalls: 156,
    highRiskCalls: 23,
    blockedCalls: 8,
    avgRiskLevel: 35,
  };

  const changes = {
    totalCalls: 12,
    highRiskCalls: -5,
    blockedCalls: 2,
    avgRiskLevel: -8,
  };

  

  const calls = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:30:00'),
      duration: 180,
      riskLevel: 25,
      phoneNumber: '010-1234-5678',
      transcript: '안녕하세요, 고객님. 저희 은행에서 연락드리는 건데요...',
      isBlocked: false,
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T14:20:00'),
      duration: 320,
      riskLevel: 75,
      phoneNumber: '02-1234-5678',
      transcript: '지금 당장 계좌 정보를 확인해야 합니다. 급한 일이에요...',
      isBlocked: true,
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T16:45:00'),
      duration: 90,
      riskLevel: 15,
      phoneNumber: '010-9876-5432',
      transcript: '네, 알겠습니다. 감사합니다.',
      isBlocked: false,
    },
  ];

  const alerts = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T14:20:00'),
      type: 'critical' as const,
      message: '높은 보이스피싱 위험이 감지되었습니다',
      callId: '2',
      riskLevel: 75,
      isRead: false,
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'warning' as const,
      message: '의심스러운 통화 패턴이 감지되었습니다',
      callId: '1',
      riskLevel: 45,
      isRead: true,
    },
  ];

  const handleCallClick = (call: any) => {
    console.log('Call clicked:', call);
  };

  const handleAlertClick = (alert: any) => {
    console.log('Alert clicked:', alert);
  };

  const handleMarkAsRead = (alertId: string) => {
    console.log('Mark as read:', alertId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  

  return (
    <Layout currentPath="/dashboard">
      <div className="space-y-6">
        {/* 간결 헤더 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">홈</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">오늘도 안전한 통화 되세요</span>
        </div>

        {/* 핵심 카드만 간소화 */}
        <StatCards stats={stats} changes={changes} />

        {/* 최근 경고 */}
        <RecentAlerts
          alerts={alerts}
          onAlertClick={handleAlertClick}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {/* 최근 통화만 간단 표시 */}
        <CallHistory
          calls={calls.slice(0, 5)}
          onCallClick={handleCallClick}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
