/* 파일 설명: 최근 통화 기록 아이템 컴포넌트
   - 개별 통화 기록 정보 표시 및 액션 버튼 제공 */
import React, { useState } from 'react';
import { RecentCall } from '@/types/phone.types';

interface RecentCallItemProps {
  call: RecentCall;
  onMakeCall: (phoneNumber: string, contactName?: string) => void;
  onAddContact: (contact: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const RecentCallItem: React.FC<RecentCallItemProps> = ({
  call,
  onMakeCall,
  onAddContact,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleMakeCall = () => {
    onMakeCall(call.phoneNumber, call.contactName);
  };

  const handleAddToContacts = () => {
    onAddContact({
      name: call.contactName || '알 수 없음',
      phoneNumber: call.phoneNumber,
      isFavorite: call.isFavorite,
      lastCallTime: call.startTime,
      callCount: 1,
      riskLevel: call.riskLevel,
      isBlocked: call.isBlocked,
      tags: [],
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR');
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'incoming':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      case 'outgoing':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      case 'missed':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getDirectionText = (direction: string) => {
    switch (direction) {
      case 'incoming': return '수신';
      case 'outgoing': return '발신';
      case 'missed': return '부재중';
      default: return '';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'incoming': return 'text-green-600 bg-green-100';
      case 'outgoing': return 'text-blue-600 bg-blue-100';
      case 'missed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelColor = (riskLevel: number) => {
    if (riskLevel <= 30) return 'text-green-600 bg-green-100';
    if (riskLevel <= 60) return 'text-yellow-600 bg-yellow-100';
    if (riskLevel <= 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCallQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        {/* 통화 정보 */}
        <div className="flex items-center flex-1 min-w-0">
          {/* 방향 아이콘 */}
          <div className="flex-shrink-0 mr-3">
            {getDirectionIcon(call.direction)}
          </div>

          {/* 통화 세부 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {call.contactName || call.phoneNumber}
              </h3>
              {call.contactName && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{call.phoneNumber}</span>
              )}
              {call.isFavorite && (
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {call.isBlocked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  차단됨
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDirectionColor(call.direction)}`}>
                {getDirectionText(call.direction)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(call.startTime)}
              </span>
              {call.duration > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDuration(call.duration)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getRiskLevelColor(call.riskLevel)}`}>
                위험도 {call.riskLevel}%
              </span>
              <span className={`text-xs ${getCallQualityColor(call.callQuality)}`}>
                품질: {call.callQuality}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2">
          {call.direction !== 'missed' && (
            <button
              onClick={handleMakeCall}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="다시 통화"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493.74a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}
          
          {!call.contactName && (
            <button
              onClick={handleAddToContacts}
              className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="연락처에 추가"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="더보기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 액션 메뉴 */}
      {showActions && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleMakeCall}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
            >
              다시 통화
            </button>
            {!call.contactName && (
              <button
                onClick={handleAddToContacts}
                className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                연락처에 추가
              </button>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(call.phoneNumber)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              번호 복사
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentCallItem;
