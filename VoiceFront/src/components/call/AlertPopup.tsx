/* 파일 설명: 위험도에 따라 경고 메시지를 표시하는 팝업 컴포넌트.
   - 위험도 임계값에 따라 스타일과 문구가 달라집니다.
   - 5초 후 자동으로 닫히며, 수동 닫기(onDismiss)도 지원합니다. */
import React, { useState, useEffect } from 'react';

/**
 * 경고 팝업 컴포넌트 속성
 * @property riskLevel 위험도 점수 (0-100)
 * @property onDismiss 팝업이 닫힐 때 호출되는 콜백
 */
interface AlertPopupProps {
  riskLevel: number;
  onDismiss?: () => void;
}

/**
 * 위험도에 따라 경고 메시지를 표시하는 팝업
 * - 위험도 구간(주의/경고/긴급)에 따라 색상과 문구가 달라집니다.
 */
const AlertPopup: React.FC<AlertPopupProps> = ({ riskLevel, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  /** 5초 후 자동으로 닫히는 타이머를 설정 */
  useEffect(() => {
    // 자동으로 5초 후 사라지기
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  /**
   * 위험도 점수에 따른 경고 타입 계산
   * @param level 위험도 점수 (0-100)
   * @returns 'critical' | 'warning' | 'caution'
   */
  const getAlertType = (level: number) => {
    if (level >= 80) return 'critical';
    if (level >= 60) return 'warning';
    return 'caution';
  };

  const alertType = getAlertType(riskLevel);

  const alertStyles = {
    critical: {
      bg: 'bg-danger-50',
      border: 'border-danger-200',
      text: 'text-danger-800',
      icon: 'text-danger-400',
      title: '긴급 경고',
      message: '높은 보이스피싱 위험! 즉시 통화를 종료하세요.',
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-200',
      text: 'text-warning-800',
      icon: 'text-warning-400',
      title: '주의 경고',
      message: '의심스러운 통화 패턴이 감지되었습니다.',
    },
    caution: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
      title: '주의',
      message: '통화 내용을 주의깊게 확인하세요.',
    },
  };

  const currentStyle = alertStyles[alertType];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`rounded-lg border-l-4 ${currentStyle.bg} ${currentStyle.border} p-4 shadow-lg`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className={`h-5 w-5 ${currentStyle.icon}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${currentStyle.text}`}>
              {currentStyle.title}
            </h3>
            <div className={`mt-2 text-sm ${currentStyle.text}`}>
              <p>{currentStyle.message}</p>
              <p className="mt-1">위험도: {riskLevel}%</p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  onClick={() => {
                    setIsVisible(false);
                    onDismiss?.();
                  }}
                  className={`rounded-md px-2 py-1.5 text-sm font-medium ${currentStyle.text} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-600`}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
