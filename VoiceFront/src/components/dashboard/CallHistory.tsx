/* 파일 설명: 대시보드 내 통화 기록 리스트 컴포넌트.
   - 통화 시간, 위험도 뱃지, 차단 여부 등을 표시합니다. */
import React from 'react';
import Card from '../ui/Card';

/**
 * 통화 기록 아이템 타입
 */
interface CallRecord {
  id: string;
  timestamp: Date;
  duration: number;
  riskLevel: number;
  phoneNumber: string;
  transcript: string;
  isBlocked: boolean;
}

/**
 * 통화 기록 컴포넌트 속성
 * @property calls 통화 기록 배열
 * @property onCallClick 통화 클릭 콜백
 */
interface CallHistoryProps {
  calls: CallRecord[];
  onCallClick: (call: CallRecord) => void;
}

/**
 * 대시보드용 통화 기록 리스트
 */
const CallHistory: React.FC<CallHistoryProps> = ({ calls, onCallClick }) => {
  /** 통화 시간 포맷(mm:ss 또는 hh:mm:ss) */
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /** 한국어 로케일 날짜 포맷 */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  /** 위험도 뱃지 JSX 반환 */
  const getRiskBadge = (riskLevel: number) => {
    if (riskLevel < 30) {
      return <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">안전</span>;
    } else if (riskLevel < 60) {
      return <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">주의</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-danger-100 text-danger-800 rounded-full">위험</span>;
    }
  };

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">통화 기록</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{calls.length}건</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {calls.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p>통화 기록이 없습니다</p>
          </div>
        ) : (
          calls.map((call) => (
            <div
              key={call.id}
              onClick={() => onCallClick(call)}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{call.phoneNumber}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(call.timestamp)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getRiskBadge(call.riskLevel)}
                  {call.isBlocked && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">차단됨</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>통화 시간: {formatDuration(call.duration)}</span>
                <span>위험도: {call.riskLevel}%</span>
              </div>
              
              {call.transcript && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-100">
                  {call.transcript.length > 100 
                    ? `${call.transcript.substring(0, 100)}...` 
                    : call.transcript
                  }
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default CallHistory;
