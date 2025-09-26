/* 파일 설명: 위험도(0-100)를 원형 프로그레스 형태로 시각화하는 컴포넌트.
   - 값에 따라 색상/라벨(안전/주의/위험)이 동적으로 변경됩니다. */
import React from 'react';

/**
 * 위험도 미터 속성
 * @property riskLevel 위험도 (0-100)
 * @property size 미터 크기 (sm|md|lg)
 */
interface RiskMeterProps {
  riskLevel: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, size = 'lg' }) => {
  /** 위험도에 따른 텍스트 색상 클래스 */
  const getRiskColor = (level: number) => {
    if (level < 30) return 'text-success-600';
    if (level < 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  /** 위험도에 따른 라벨 텍스트 */
  const getRiskLabel = (level: number) => {
    if (level < 30) return '안전';
    if (level < 60) return '주의';
    return '위험';
  };

  /** 위험도에 따른 진행률 원의 배경 색상 */
  const getRiskBgColor = (level: number) => {
    if (level < 30) return 'bg-success-500';
    if (level < 60) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const conicStops = `conic-gradient(${riskLevel < 30 ? '#22c55e' : riskLevel < 60 ? '#f59e0b' : '#ef4444'} ${riskLevel}%, rgba(0,0,0,0.06) ${riskLevel}% 100%)`;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
        {/* 글로우 */}
        <div
          className="absolute -inset-3 rounded-full blur-2xl opacity-40"
          style={{ background: conicStops }}
          aria-hidden="true"
        />

        {/* 코닉 링 */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: conicStops }}
        />

        {/* 안쪽 배경 */}
        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800" />

        {/* 중앙 텍스트 */}
        <div className="relative z-10 text-center">
          <div className={`font-bold ${textSizeClasses[size]} ${getRiskColor(riskLevel)}`}>
            {riskLevel}%
          </div>
          <div className={`text-sm ${getRiskColor(riskLevel)}`}>
            {getRiskLabel(riskLevel)}
          </div>
        </div>
      </div>

      {/* 위험도 설명 */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {riskLevel < 30 && '통화가 안전하게 진행되고 있습니다.'}
          {riskLevel >= 30 && riskLevel < 60 && '의심스러운 패턴이 감지되었습니다.'}
          {riskLevel >= 60 && '보이스피싱 위험이 높습니다. 주의하세요!'}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;
