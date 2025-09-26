/* 파일 설명: 통화 제어 버튼 묶음 컴포넌트.
   - 통화 시작/종료, 음소거 토글을 제공합니다. */
import React from 'react';
import Button from '../ui/Button';

/**
 * 통화 제어 버튼 속성
 * @property isCallActive 통화 진행 여부
 * @property isMuted 음소거 여부
 * @property onStartCall 통화 시작 핸들러
 * @property onEndCall 통화 종료 핸들러
 * @property onMuteToggle 음소거 토글 핸들러
 */
interface CallControlsProps {
  isCallActive: boolean;
  isMuted: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onMuteToggle: () => void;
}

/**
 * 통화 제어 버튼 묶음
 */
const CallControls: React.FC<CallControlsProps> = ({
  isCallActive,
  isMuted,
  onStartCall,
  onEndCall,
  onMuteToggle,
}) => {
  return (
    <div className="flex items-center space-x-4">
      {!isCallActive ? (
        <Button
          onClick={onStartCall}
          variant="success"
          size="lg"
          className="px-8 py-4 rounded-full"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>통화 시작</span>
          </div>
        </Button>
      ) : (
        <>
          {/* 음소거 토글 */}
          <Button
            onClick={onMuteToggle}
            variant={isMuted ? 'danger' : 'secondary'}
            size="lg"
            className="px-6 py-4 rounded-full"
          >
            <div className="flex items-center space-x-2">
              {isMuted ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              <span>{isMuted ? '음소거 해제' : '음소거'}</span>
            </div>
          </Button>

          {/* 통화 종료 */}
          <Button
            onClick={onEndCall}
            variant="danger"
            size="lg"
            className="px-8 py-4 rounded-full"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>통화 종료</span>
            </div>
          </Button>
        </>
      )}
    </div>
  );
};

export default CallControls;
