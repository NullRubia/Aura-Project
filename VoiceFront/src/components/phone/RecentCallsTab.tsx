/* 파일 설명: 최근 통화 기록 탭 (이미지 스타일 맞춤 리디자인)
   - iOS 통화기록 유사 카드/리스트, 세그먼트 탭, 추천 카드, 방향 아이콘 */
import React, { useState, useMemo, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import { RecentCall } from '@/types/phone.types';

interface RecentCallsTabProps {
  recentCalls: RecentCall[];
  searchQuery: string;
  onMakeCall: (phoneNumber: string, contactName?: string) => void;
  onAddContact: (contact: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const RecentCallsTab: React.FC<RecentCallsTabProps> = ({
  recentCalls,
  searchQuery,
  onMakeCall,
  onAddContact,
}) => {
  const [tab, setTab] = useState<'all' | 'ai'>('all');
  const [selectedCall, setSelectedCall] = useState<RecentCall | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'risk'>('time');
  const [filterBy, setFilterBy] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // 통화 기록 필터링 및 정렬
  const filteredAndSortedCalls = useMemo(() => {
    let base = tab === 'ai' ? recentCalls.filter(c => c.riskLevel >= 60 || c.isBlocked) : recentCalls;
    let filtered = base.filter(call => {
      // 검색 쿼리 필터링
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        call.contactName?.toLowerCase().includes(query) ||
        call.phoneNumber.includes(query);

      // 방향 필터링
      const matchesFilter = filterBy === 'all' || call.direction === filterBy;

      return matchesQuery && matchesFilter;
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return b.startTime.getTime() - a.startTime.getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'risk':
          return b.riskLevel - a.riskLevel;
        default:
          return 0;
      }
    });

    return filtered;
  }, [recentCalls, searchQuery, sortBy, filterBy]);

  // 통계 정보
  const stats = useMemo(() => {
    const total = recentCalls.length;
    const incoming = recentCalls.filter(call => call.direction === 'incoming').length;
    const outgoing = recentCalls.filter(call => call.direction === 'outgoing').length;
    const missed = recentCalls.filter(call => call.direction === 'missed').length;
    const highRisk = recentCalls.filter(call => call.riskLevel >= 70).length;

    return { total, incoming, outgoing, missed, highRisk };
  }, [recentCalls]);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '통화 없음';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (d: Date) => new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }).format(d);

  const relativeTime = (d: Date) => {
    const diff = Date.now() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `약 ${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `약 ${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `약 ${days}일 전`;
  };

  const buildSummaryBullets = (call: RecentCall) => {
    if (!call.transcript) {
      return [
        '통화 요약을 준비했어요.',
        '주요 키워드를 기반으로 핵심만 정리했어요.',
      ];
    }
    const base = call.transcript
      .replace(/[\n\r]+/g, ' ')
      .split(/[\.\!\?\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    return base.slice(0, 4);
  };

  const buildTags = (call: RecentCall) => {
    const text = (call.transcript || '').toLowerCase();
    const tags: string[] = [];
    if (text.includes('회의') || text.includes('미팅')) tags.push('#업무');
    if (text.includes('주소') || text.includes('지도') || text.includes('길')) tags.push('#위치');
    if (text.includes('가게') || text.includes('식당') || text.includes('빵')) tags.push('#일상');
    if (tags.length === 0) tags.push('#일상');
    return tags.slice(0, 3);
  };

  const DirectionIcon = ({ dir }: { dir: RecentCall['direction'] }) => {
    const baseIconSrc = dir === 'missed' ? '/images/Call(dark).png' : dir === 'incoming' ? '/images/Call(blue).png' : '/images/Call(light).png';
    const arrowColor = dir === 'incoming' ? 'text-green-600' : dir === 'outgoing' ? 'text-blue-600' : 'text-red-500';
    return (
      <div className="relative w-5 h-5">
        <img src={baseIconSrc} alt={dir === 'incoming' ? '수신' : dir === 'outgoing' ? '발신' : '부재중'} className="w-5 h-5" />
        {dir === 'incoming' && (
          <svg className={`absolute -bottom-1 -right-1 w-3 h-3 ${arrowColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 10v8h8" />
          </svg>
        )}
        {dir === 'outgoing' && (
          <svg className={`absolute -bottom-1 -right-1 w-3 h-3 ${arrowColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6h8v8" transform="translate(-2,0)" />
          </svg>
        )}
        {dir === 'missed' && (
          <svg className={`absolute -bottom-1 -right-1 w-3 h-3 ${arrowColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 6h4v4" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* 상단 세그먼트/필터 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 inline-flex">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-1.5 rounded-2xl text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
          >전체</button>
          <button
            onClick={() => setTab('ai')}
            className={`px-4 py-1.5 rounded-2xl text-sm font-semibold transition-colors ${tab === 'ai' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
          >AI 제안</button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">전체</option>
            <option value="incoming">수신</option>
            <option value="outgoing">발신</option>
            <option value="missed">부재중</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="time">시간순</option>
            <option value="duration">통화시간</option>
            <option value="risk">위험도</option>
          </select>
        </div>
      </div>

      {/* 선택 카드: 리스트 항목 내부에서 인라인 확장으로 표시하므로 상단 카드는 제거 */}

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-lg font-medium mb-2">통화 기록이 없습니다</p>
            <p className="text-sm text-center">{searchQuery ? '검색 결과가 없습니다' : '아직 통화 기록이 없습니다'}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">오늘</div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredAndSortedCalls.map((call) => {
                const isSelected = selectedCall?.id === call.id;
                return (
                  <div key={call.id} className="w-full">
                    {isSelected ? (
                      <div className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 text-lg font-bold">
                              {(call.contactName?.[0] || call.phoneNumber.slice(-2))}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{call.contactName || call.phoneNumber}</span>
                                {call.isBlocked && (<span className="px-1.5 py-0.5 text-[10px] rounded bg-red-100 text-red-700">차단됨</span>)}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">휴대전화 | {call.phoneNumber}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{call.direction === 'outgoing' ? '발신 전화' : call.direction === 'incoming' ? '수신 전화' : '부재중 전화'} | {formatDuration(call.duration)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatTime(call.startTime)}</div>
                            <button onClick={() => setSelectedCall(null)} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">닫기</button>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-4">
                          <button onClick={() => setIsSummaryOpen(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 13V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 10-2 0v2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2z"/></svg>
                            <span className="mt-2 text-xs font-medium">통화 요약</span>
                          </button>
                          <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span className="mt-2 text-xs font-medium">연락처</span>
                          </button>
                          <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 18l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                            <span className="mt-2 text-xs font-medium">메시지</span>
                          </button>
                          <button onClick={() => onMakeCall(call.phoneNumber, call.contactName)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <span className="mt-2 text-xs font-medium">전화</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedCall(call)} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 flex items-center justify-center mt-1"><DirectionIcon dir={call.direction} /></div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{call.contactName || call.phoneNumber}</span>
                                {call.isBlocked && (<span className="px-1.5 py-0.5 text-[10px] rounded bg-red-100 text-red-700">차단됨</span>)}
                              </div>
                              {call.transcript && <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">“{call.transcript}”</div>}
                              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">발신 · {formatDuration(call.duration)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatTime(call.startTime)}</div>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedCall && (
        <SummaryModal
          open={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          call={selectedCall}
          relativeTime={relativeTime}
          DirectionIcon={DirectionIcon}
          buildSummaryBullets={buildSummaryBullets}
          buildTags={buildTags}
        />
      )}
    </div>
  );
};

export default RecentCallsTab;

// 통화 요약 모달 렌더링
// 선택된 통화가 있을 때만 모달을 하단에 포털 형태로 그려줌
// 이미지처럼: 제목, 메타(방향 아이콘, 유형/시간, 상대/번호, 상대 시간 텍스트), 불릿 요약, 태그, 액션 버튼
// 주: 파일 하단에 선언해도 상단 컴포넌트 내 상태를 그대로 사용 가능(동일 파일 내 클로저)
function SummaryModal({
  open,
  onClose,
  call,
  relativeTime,
  DirectionIcon,
  buildSummaryBullets,
  buildTags,
}: any) {
  if (!open || !call) return null;
  const bullets: string[] = buildSummaryBullets(call);
  const tags: string[] = buildTags(call);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const hasRecording = Boolean((call as any).recordingUrl);
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };
  return (
    <Modal isOpen={open} onClose={onClose} title="통화 요약" size="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DirectionIcon dir={call.direction} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {call.direction === 'outgoing' ? '발신 전화' : call.direction === 'incoming' ? '수신 전화' : '부재중 전화'} · {Math.max(0, Math.round(call.duration))}초
            </span>
          </div>
          <span className="text-sm text-primary-500">{relativeTime(call.startTime)}</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{call.contactName || call.phoneNumber}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">휴대전화 · {call.phoneNumber}</p>
        </div>

        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-800 dark:text-gray-200">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span className="text-[15px] leading-6">{b}</span>
            </li>
          ))}
        </ul>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-200">{t}</span>
            ))}
          </div>
        )}

        <div className="pt-2 flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 text-sm font-semibold">
            AI 제안
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 text-sm font-semibold">
            지도에서 찾아보기
          </button>
        </div>

        {/* 통화녹음 듣기 */}
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6a3 3 0 116 0v13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14" /></svg>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">통화녹음 듣기</span>
            </div>
            <button
              onClick={togglePlay}
              disabled={!hasRecording}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow ${hasRecording ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4h3v12H6zM11 4h3v12h-3z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4l12 6-12 6V4z"/></svg>
              )}
            </button>
          </div>
          <audio
            ref={audioRef}
            src={(call as any).recordingUrl || ''}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
          {!hasRecording && (
            <p className="mt-2 text-xs text-gray-500">녹음 파일이 없습니다.</p>
          )}
        </div>

        {/* 대화 내용 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">대화 내용</span>
            <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${showTranscript ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </button>
          {showTranscript && (
            <div className="px-4 pb-4 space-y-3">
              {((call.transcript || '').split(/\n|(?<=[.!?])\s+/).filter(Boolean).slice(0, 6)).map((line: string, idx: number) => (
                <div key={idx} className="max-w-[85%] rounded-2xl bg-gray-100 dark:bg-gray-700 px-4 py-2 text-[15px] text-gray-900 dark:text-gray-100">{line}</div>
              ))}
              {!call.transcript && (
                <div className="text-sm text-gray-500">대화 내용이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
