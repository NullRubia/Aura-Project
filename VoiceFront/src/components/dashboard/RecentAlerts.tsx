/* 파일 설명: 최근 경고 리스트 컴포넌트.
   - 경고 유형/아이콘/시간/읽음 상태 및 일괄 읽기 기능을 제공합니다. */
import React from 'react';
import Card from '../ui/Card';

/**
 * 최근 경고 아이템 타입
 */
interface Alert {
  id: string;
  timestamp: Date;
  type: 'critical' | 'warning' | 'info';
  message: string;
  callId?: string;
  riskLevel: number;
  isRead: boolean;
}

/**
 * 최근 경고 컴포넌트 속성
 * @property alerts 경고 목록
 * @property onAlertClick 경고 클릭 콜백
 * @property onMarkAsRead 단건 읽음 처리 콜백
 * @property onMarkAllAsRead 전체 읽음 처리 콜백
 */
interface RecentAlertsProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

/**
 * 대시보드용 최근 경고 리스트
 */
const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  onAlertClick,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  /** 경고 유형에 따른 아이콘 JSX */
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return (
          <svg className="w-5 h-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  /** 경고 유형 라벨 텍스트 */
  const getAlertTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return '긴급';
      case 'warning':
        return '경고';
      default:
        return '정보';
    }
  };

  /** 경고 유형 배지 색상 클래스 */
  const getAlertTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'bg-danger-100 text-danger-800';
      case 'warning':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  /** "방금 전/분 전/시간 전/일 전" 상대 시각 포맷 */
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">최근 경고</h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-danger-100 text-danger-800 rounded-full">
              {unreadCount}개 미읽음
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              모두 읽음
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>최근 경고가 없습니다</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                alert.isRead 
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' 
                  : 'border-danger-200 bg-danger-50 hover:bg-danger-100'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getAlertTypeColor(alert.type)}`}>
                      {getAlertTypeLabel(alert.type)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(alert.timestamp)}</span>
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">위험도: {alert.riskLevel}%</span>
                    {alert.callId && (
                      <span className="text-xs text-primary-600 hover:text-primary-800">
                        통화 상세보기 →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentAlerts;
