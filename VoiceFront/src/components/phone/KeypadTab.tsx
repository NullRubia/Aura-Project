/* 파일 설명: 키패드 탭 컴포넌트
   - 전화번호 입력, 통화, 연락처 추가 기능 제공 */
import React, { useState, useEffect, useRef } from 'react';

interface KeypadTabProps {
  onMakeCall: (phoneNumber: string, contactName?: string) => void;
  onAddContact: (contact: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const KeypadTab: React.FC<KeypadTabProps> = ({ onMakeCall, onAddContact }) => {
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const displayContainerRef = useRef<HTMLDivElement | null>(null);
  const displayTextRef = useRef<HTMLDivElement | null>(null);
  const displayFontSize = 32;

  // 통화 시간 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const keypadRows: Array<Array<{ value: string | null; letters?: string }>> = [
    [
      { value: '1', letters: '' },
      { value: '2', letters: 'ABC' },
      { value: '3', letters: 'DEF' },
    ],
    [
      { value: '4', letters: 'GHI' },
      { value: '5', letters: 'JKL' },
      { value: '6', letters: 'MNO' },
    ],
    [
      { value: '7', letters: 'PQRS' },
      { value: '8', letters: 'TUV' },
      { value: '9', letters: 'WXYZ' },
    ],
    [
      { value: '*', letters: '' },
      { value: '0', letters: '+' },
      { value: '#', letters: '' },
    ],
  ];

  const handleNumberPress = (value: string) => {
    if (isCalling) return;
    setInput(prev => prev + value);
  };

  const handleDelete = () => {
    if (isCalling) return;
    setInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isCalling) return;
    setInput('');
  };

  // 길게 누르면 + 입력(0), 전체 삭제(백스페이스)
  const longPressTimerRef = useRef<number | null>(null);

  const startLongPressZero = () => {
    if (isCalling) return;
    clearLongPress();
    longPressTimerRef.current = window.setTimeout(() => {
      setInput(prev => prev + '+');
    }, 500);
  };
  const startLongPressBackspace = () => {
    if (isCalling) return;
    clearLongPress();
    longPressTimerRef.current = window.setTimeout(() => {
      setInput('');
    }, 600);
  };
  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // 고정 폰트 크기를 사용하여 일관된 표시 (자동 축소 비활성)
  // 입력시 가로 스크롤 자동으로 끝으로 이동 (더 긴 번호도 바로 보이도록)
  useEffect(() => {
    const el = displayTextRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [input]);

  const handleCall = () => {
    if (!input.trim()) return;
    
    if (isCalling) {
      // 통화 종료
      setIsCalling(false);
      setCallDuration(0);
    } else {
      // 통화 시작
      setIsCalling(true);
      setCallDuration(0);
      onMakeCall(input);
    }
  };

  const handleAddContact = () => {
    if (!input.trim()) return;
    onAddContact({
      name: '알 수 없음',
      phoneNumber: input,
      isFavorite: false,
      lastCallTime: undefined,
      callCount: 0,
      riskLevel: 0,
      isBlocked: false,
      tags: [],
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (number: string) => {
    // 전화번호 자동 포맷팅 (길이 제한 없음)
    const cleaned = number.replace(/\D/g, '');
    // 10자리이면서 '02'로 시작하면 02-####-#### 패턴
    if (cleaned.length === 10 && cleaned.startsWith('02')) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    // 3-4-나머지 형태로 표시 (나머지는 제한 없이 표시)
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  };

  const formatDisplay = (raw: string) => {
    // 숫자/플러스만 포함할 때만 하이픈 포맷 적용, 그 외에는 원문 그대로 표시(*, # 등 DTMF 포함)
    if (/^[0-9+]+$/.test(raw)) return formatPhoneNumber(raw);
    return raw;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* 전화번호 표시 영역 (상단바) */}
      <div className="px-4 bg-white dark:bg-gray-900">
        {/* 번호 표시 영역을 상단 메뉴와 키패드 사이의 가운데에 배치하기 위해 고정 높이 박스에 센터 정렬 */}
        <div className="mx-auto w-full max-w-[560px] h-28 sm:h-32 flex items-center mt-10 sm:mt-14">
          {/* 좌측 공간 */}
          <div className="w-9 h-9" />
          {/* 중앙 번호 표시 (가운데, 가로 폭 확장) */}
          <div className="flex-1 text-center">
            <div ref={displayContainerRef} className="mx-auto max-w-[520px]">
              <div ref={displayTextRef} style={{ fontSize: displayFontSize, lineHeight: 1.1 }} className={`font-mono whitespace-nowrap overflow-x-auto px-1 hide-scrollbar ${input ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900/60 dark:text-gray-300'}`}>
                {input ? formatDisplay(input) : ''}
              </div>
            </div>
          </div>
          {/* 우측 공간 */}
          <div className="w-9 h-9" />
        </div>
        <div className="mx-auto w-full max-w-[360px] text-center mt-1 h-6 flex items-center justify-center">
          {isCalling ? (
            <div className="text-lg text-primary-600 font-medium">
              통화 중... {formatDuration(callDuration)}
            </div>
          ) : null}
        </div>
      </div>

      {/* 키패드 (세로 중앙 정렬) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6">
        <div className="w-full max-w-[360px]">
          <div className="grid grid-cols-3 gap-4 place-items-center">
          {keypadRows.flatMap((row, rowIdx) =>
            row.map((btn, colIdx) => {
              if (!btn.value) {
                return <div key={`spacer-${rowIdx}-${colIdx}`} className="w-16 h-16 opacity-0 pointer-events-none" />;
              }
              const isZero = btn.value === '0';
              const isSymbol = btn.value === '*' || btn.value === '#';
              return (
                <button
                  key={`${btn.value}-${rowIdx}-${colIdx}`}
                  onClick={() => handleNumberPress(btn.value as string)}
                  onMouseDown={isZero ? startLongPressZero : undefined}
                  onMouseUp={isZero ? clearLongPress : undefined}
                  onMouseLeave={isZero ? clearLongPress : undefined}
                  onTouchStart={isZero ? startLongPressZero : undefined}
                  onTouchEnd={isZero ? clearLongPress : undefined}
                  disabled={isCalling}
                  className={`select-none relative w-[72px] h-[72px] rounded-full transition-all ${
                    isCalling
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-300 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md active:shadow-sm active:scale-[0.98]'
                  }`}
                >
                  {/* 숫자/문자 블록을 중앙 정렬 후 살짝 위로 */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${isSymbol ? '' : '-translate-y-0.5'}`}>
                    <span className="text-2xl font-semibold leading-none">{btn.value}</span>
                    {isSymbol ? null : (
                      <span className={`text-[11px] tracking-wide uppercase text-gray-400 mt-0.5 h-4 ${btn.letters ? '' : 'invisible'}`}>
                        {btn.letters || '•'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
          </div>
        </div>

        {/* 통화/삭제 버튼 라인: 키패드 그리드(3열, gap-4)와 동일 정렬 → 3·6·9 라인 맞춤 */}
        <div className="mx-auto w-full max-w-[360px] grid grid-cols-3 gap-4 place-items-center mt-6">
          {/* 1열: 비우기 (3열 정렬 보정) */}
          <div />

          {/* 2열: 가운데 통화 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleCall}
              disabled={!input.trim()}
              className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-medium transition-all shadow-lg ${
                isCalling
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  : input.trim()
                  ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isCalling ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              )}
            </button>
          </div>

          {/* 3열: 3·6·9 라인에 정렬된 삭제 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={handleDelete}
              onMouseDown={startLongPressBackspace}
              onMouseUp={clearLongPress}
              onMouseLeave={clearLongPress}
              onTouchStart={startLongPressBackspace}
              onTouchEnd={clearLongPress}
              aria-label="지우기"
              disabled={isCalling || !input}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isCalling || !input ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeypadTab;
