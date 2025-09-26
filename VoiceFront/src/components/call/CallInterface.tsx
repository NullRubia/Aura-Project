/* 파일 설명: 통화 모니터링 UI 통합 컴포넌트.
   - 위험도 미터, 경고 팝업, 실시간 텍스트, 제어 버튼을 포함합니다. */
import React from 'react';
import RiskMeter from './RiskMeter';
import AlertPopup from './AlertPopup';
import CallControls from './CallControls';
import TranscriptDisplay from './TranscriptDisplay';

/**
 * 통화 인터페이스 속성
 * @property isCallActive 통화 진행 여부
 * @property riskLevel 현재 위험도 (0-100)
 * @property transcript 실시간 텍스트
 * @property onStartCall 통화 시작 콜백
 * @property onEndCall 통화 종료 콜백
 * @property onMuteToggle 음소거 토글 콜백
 * @property isMuted 음소거 여부
 */
interface CallInterfaceProps {
  isCallActive: boolean;
  riskLevel: number;
  transcript: string;
  onStartCall: () => void;
  onEndCall: () => void;
  onMuteToggle: () => void;
  isMuted: boolean;
}

/**
 * 통화 모니터링 화면 구성 컴포넌트
 * - 위험도/경고/자막/제어 UI를 통합합니다.
 */
const CallInterface: React.FC<CallInterfaceProps> = ({
  isCallActive,
  riskLevel,
  transcript,
  onStartCall,
  onEndCall,
  onMuteToggle,
  isMuted,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        {/* 위험도 미터 */}
        <div className="mb-8">
          <RiskMeter riskLevel={riskLevel} />
        </div>

        {/* 경고 팝업 */}
        {riskLevel > 70 && (
          <div className="mb-6">
            <AlertPopup riskLevel={riskLevel} />
          </div>
        )}

        {/* 실시간 텍스트 표시 */}
        <div className="mb-8">
          <TranscriptDisplay transcript={transcript} />
        </div>

        {/* 통화 제어 */}
        <div className="flex justify-center">
          <CallControls
            isCallActive={isCallActive}
            isMuted={isMuted}
            onStartCall={onStartCall}
            onEndCall={onEndCall}
            onMuteToggle={onMuteToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
