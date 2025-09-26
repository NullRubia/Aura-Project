/* 파일 설명: 위험도 분석 카드 컴포넌트.
   - 기간 선택(일/주/월)과 간단한 막대형 추이를 표시하고 요약 수치를 제공합니다. */
import React from 'react';
import Card from '../ui/Card';

/**
 * 위험도 분석 데이터 포인트
 * @property date 라벨(일/주/월 단위)
 * @property riskLevel 위험도 점수(0-100)
 * @property callCount 통화 수
 */
interface RiskData {
  date: string;
  riskLevel: number;
  callCount: number;
}

/**
 * 위험도 분석 컴포넌트 속성
 * @property riskData 분석 데이터 배열
 * @property timeRange 기간 단위(일/주/월)
 * @property onTimeRangeChange 기간 변경 콜백
 */
interface RiskAnalyticsProps {
  riskData: RiskData[];
  timeRange: 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
}

/**
 * 위험도 분석 카드
 * - 기간 선택, 통계 요약, 간단한 막대형 추이 표시
 */
const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ 
  riskData, 
  timeRange, 
  onTimeRangeChange 
}) => {
  /** 데이터 내 최고 위험도 */
  const getMaxRisk = () => Math.max(...riskData.map(d => d.riskLevel), 0);
  /** 데이터 내 평균 위험도(반올림) */
  const getAvgRisk = () => {
    if (riskData.length === 0) return 0;
    return Math.round(riskData.reduce((sum, d) => sum + d.riskLevel, 0) / riskData.length);
  };
  /** 총 통화 수 */
  const getTotalCalls = () => riskData.reduce((sum, d) => sum + d.callCount, 0);
  /** 고위험(>=60) 통화 수 */
  const getHighRiskCalls = () => riskData.filter(d => d.riskLevel >= 60).reduce((sum, d) => sum + d.callCount, 0);

  const timeRangeOptions = [
    { value: 'day', label: '일간' },
    { value: 'week', label: '주간' },
    { value: 'month', label: '월간' },
  ];

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">위험도 분석</h3>
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value as 'day' | 'week' | 'month')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-primary-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-600">총 통화</p>
              <p className="text-2xl font-bold text-primary-900">{getTotalCalls()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-danger-50 to-danger-100 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-danger-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-danger-600">고위험 통화</p>
              <p className="text-2xl font-bold text-danger-900">{getHighRiskCalls()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 위험도 차트 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">위험도 추이</h4>
        <div className="h-32 flex items-end space-x-1">
          {riskData.map((data, index) => {
            const height = (data.riskLevel / 100) * 100;
            const color = data.riskLevel < 30 ? 'bg-success-400' : 
                         data.riskLevel < 60 ? 'bg-warning-400' : 'bg-danger-400';
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${color} rounded-t transition-all duration-300`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {data.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 요약 정보 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">평균 위험도</span>
          <span className="text-lg font-semibold text-gray-900">{getAvgRisk()}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">최고 위험도</span>
          <span className="text-lg font-semibold text-gray-900">{getMaxRisk()}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">고위험 비율</span>
          <span className="text-lg font-semibold text-gray-900">
            {getTotalCalls() > 0 ? Math.round((getHighRiskCalls() / getTotalCalls()) * 100) : 0}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RiskAnalytics;
