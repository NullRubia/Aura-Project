/* 파일 설명: 실시간 STT 텍스트를 표시하는 컴포넌트.
   - 새로운 문장이 추가될 때 자동 스크롤을 수행합니다. */
import React, { useEffect, useRef } from 'react';

/**
 * 실시간 텍스트 표시 컴포넌트 속성
 * @property transcript 표시할 텍스트
 * @property isActive 활성 상태(실시간 표시 여부)
 */
interface TranscriptDisplayProps {
  transcript: string;
  isActive?: boolean;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  transcript, 
  isActive = true 
}) => {
  const transcriptRef = useRef<HTMLDivElement>(null);

  /** 텍스트가 갱신될 때 자동으로 스크롤을 최하단으로 이동 */
  useEffect(() => {
    // 자동 스크롤을 위한 효과
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-indigo-500">
              실시간 통화 내용
            </h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-success-500 animate-pulse' : 'bg-gray-400'}`} />
                {isActive ? '분석 중' : '중지'}
              </span>
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div 
          ref={transcriptRef}
          className="px-6 py-4 h-64 overflow-y-auto"
        >
          {transcript ? (
            <div className="space-y-2">
              {transcript.split('\n').map((line, index) => (
                <p 
                  key={index} 
                  className="text-gray-800 dark:text-gray-100 leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <p className="text-lg font-medium">통화 내용이 여기에 표시됩니다</p>
                <p className="text-sm">마이크를 활성화하고 통화를 시작하세요</p>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>AI가 실시간으로 분석 중입니다</span>
            <span>{transcript.length}자</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
