/* 파일 설명: 대시보드 상단 통계 카드를 렌더링하는 컴포넌트 묶음.
   - 개별 카드(StatCard)와 카드 그룹(StatCards)을 제공합니다. */
import React from 'react';
import Card from '../ui/Card';

/**
 * 단일 통계 카드 속성
 * @property title 카드 제목
 * @property value 표시 값(문자열 또는 숫자)
 * @property change 증감 정보(값/유형)
 * @property icon 카드 아이콘 JSX
 * @property color 카드 테마 색상 키
 */
// 개별 카드를 분리하지 않고, 하나의 블록(Card) 안에 배치합니다.

/**
 * 통계 카드 그룹 속성
 * @property stats 통계 원본 값
 * @property changes 통계 증감 값
 */
interface StatCardsProps {
  stats: {
    totalCalls: number;
    highRiskCalls: number;
    blockedCalls: number;
    avgRiskLevel: number;
  };
  changes?: {
    totalCalls: number;
    highRiskCalls: number;
    blockedCalls: number;
    avgRiskLevel: number;
  };
}

/**
 * 대시보드 상단 통계 카드 영역을 렌더링합니다
 */
const StatCards: React.FC<StatCardsProps> = ({ stats, changes }) => {
  /** 증감 유형에 따른 텍스트 색상 클래스 반환 */
  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-success-600';
      case 'decrease':
        return 'text-danger-600';
      default:
        return 'text-gray-600';
    }
  };

  /** 증감 유형에 따른 아이콘 반환 */
  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'decrease':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const statCards = [
    {
      title: '총 통화 수',
      value: stats.totalCalls.toLocaleString(),
      change: changes ? { value: changes.totalCalls, type: changes.totalCalls > 0 ? 'increase' as const : changes.totalCalls < 0 ? 'decrease' as const : 'neutral' as const } : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'primary' as const,
    },
    {
      title: '고위험 통화',
      value: stats.highRiskCalls.toLocaleString(),
      change: changes ? { value: changes.highRiskCalls, type: changes.highRiskCalls > 0 ? 'increase' as const : changes.highRiskCalls < 0 ? 'decrease' as const : 'neutral' as const } : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: 'danger' as const,
    },
    {
      title: '차단된 통화',
      value: stats.blockedCalls.toLocaleString(),
      change: changes ? { value: changes.blockedCalls, type: changes.blockedCalls > 0 ? 'increase' as const : changes.blockedCalls < 0 ? 'decrease' as const : 'neutral' as const } : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
      color: 'warning' as const,
    },
    {
      title: '평균 위험도',
      value: `${stats.avgRiskLevel}%`,
      change: changes ? { value: changes.avgRiskLevel, type: changes.avgRiskLevel > 0 ? 'increase' as const : changes.avgRiskLevel < 0 ? 'decrease' as const : 'neutral' as const } : undefined,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'success' as const,
    },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
              <div className="text-gray-700 dark:text-gray-200">
                {card.icon}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{card.value}</p>
              {card.change && (
                <div className={`flex items-center mt-1 ${getChangeColor(card.change.type)}`}>
                  {getChangeIcon(card.change.type)}
                  <span className="ml-1 text-sm font-medium">
                    {card.change.value > 0 ? '+' : ''}{card.change.value}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatCards;
