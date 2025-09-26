'use client';

/* 파일 설명: 통화 기록 페이지 컴포넌트.
   - 통화 목록, 필터(전체/고위험/차단됨), 상세 모달, 신고 액션을 제공합니다.
   - 현재는 더미 데이터를 사용하며, 실제 운영에서는 API 연동으로 대체합니다. */

import React, { useMemo, useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

/**
 * 통화 기록 페이지 컴포넌트
 * - 통화 목록 필터링/선택 및 상세 모달 표시
 */
const CallHistoryPage: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 상단 탭: 전체 / AI 제안(고위험/차단)
  const [tab, setTab] = useState<'all' | 'ai'>('all');

  // 임시 데이터
  const calls = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:30:00'),
      duration: 180,
      riskLevel: 25,
      phoneNumber: '010-1234-5678',
      name: '김희연',
      note: '빵집 관련 이야기 나눔',
      transcript: '안녕하세요, 고객님. 저희 은행에서 연락드리는 건데요. 계좌 정보를 확인해드리겠습니다. 개인정보 보호를 위해 몇 가지 질문을 드릴게요.',
      isBlocked: false,
      direction: 'outgoing',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T14:20:00'),
      duration: 320,
      riskLevel: 75,
      phoneNumber: '02-1234-5678',
      name: '김희연',
      transcript: '지금 당장 계좌 정보를 확인해야 합니다. 급한 일이에요. 비밀번호를 알려주세요. 지금 당장 말씀해주세요!',
      isBlocked: true,
      direction: 'incoming',
    },
    {
      id: '3',
      timestamp: new Date('2024-01-15T16:45:00'),
      duration: 90,
      riskLevel: 15,
      phoneNumber: '010-9876-5432',
      transcript: '네, 알겠습니다. 감사합니다. 좋은 하루 되세요.',
      isBlocked: false,
      direction: 'missed',
    },
    {
      id: '4',
      timestamp: new Date('2024-01-14T09:15:00'),
      duration: 240,
      riskLevel: 60,
      phoneNumber: '031-1234-5678',
      transcript: '고객님, 계좌에 문제가 생겼습니다. 지금 바로 해결해드리겠습니다. 카드 번호를 알려주세요.',
      isBlocked: true,
      direction: 'incoming',
    },
    {
      id: '5',
      timestamp: new Date('2024-01-14T15:30:00'),
      duration: 120,
      riskLevel: 20,
      phoneNumber: '010-5555-1234',
      transcript: '안녕하세요. 배송 관련해서 연락드렸습니다. 내일 배송 예정입니다.',
      isBlocked: false,
      direction: 'outgoing',
    },
  ];

  // 디스플레이용 필터링
  const displayedCalls = useMemo(() => {
    if (tab === 'ai') {
      return calls.filter(c => c.riskLevel >= 60 || c.isBlocked);
    }
    return calls;
  }, [tab, calls]);

  /** 통화 아이템 클릭 시 상단 선택 카드만 표시 */
  const handleCallClick = (call: any) => {
    setSelectedCall(call);
  };

  /** 상세 모달을 닫고 선택 상태를 초기화 */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  /** 통화 신고 액션 트리거 (실제 구현시 API 호출) */
  const handleReportCall = (callId: string) => {
    console.log('Report call:', callId);
    // 실제 구현에서는 신고 API를 호출합니다
  };

  /** 통화 지속 시간을 mm:ss 또는 hh:mm:ss 형태로 포맷 */
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /** 날짜를 한국어 로케일로 포맷 */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 통화 방향 아이콘
  const DirectionIcon: React.FC<{ d: string }> = ({ d }) => {
    switch (d) {
      case 'incoming':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20l-6-6M20 20V8m0 12H8" />
          </svg>
        );
      case 'outgoing':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4v6h-6M4 20l6-6M4 20V8m0 12h12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10h4M12 3v7m0 4v7" />
          </svg>
        );
    }
  };

  return (
    <Layout currentPath="/call-history">
      <div className="space-y-6">
        {/* 상단 헤더 + 검색 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">최근 기록</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300" aria-label="검색">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
          </button>
        </div>

        {/* 탭/카테고리 영역 */}
        <div className="flex items-center justify-between">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 inline-flex">
            <button
              onClick={() => setTab('all')}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              전체
            </button>
            <button
              onClick={() => setTab('ai')}
              className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-colors ${tab === 'ai' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              AI 전화 제안
            </button>
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 018 18v-4.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            AI 통화 카테고리
          </button>
        </div>

        {/* 선택된 통화 퀵 액션 카드 (선택 시에만 표시) */}
        {selectedCall && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 text-lg font-bold">
                  {(selectedCall.name?.[0] || selectedCall.phoneNumber.slice(-2))}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedCall.name || selectedCall.phoneNumber}</span>
                  </div>
                  {selectedCall.note && <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{selectedCall.note}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">휴대전화 | {selectedCall.phoneNumber}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedCall.direction === 'outgoing' ? '발신 전화' : selectedCall.direction === 'incoming' ? '수신 전화' : '부재중 전화'} | {formatDuration(selectedCall.duration)}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }).format(selectedCall.timestamp)}</div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4">
              <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M18 13V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 10-2 0v2H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2z"/></svg>
                <span className="mt-2 text-xs font-medium">통화 요약</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span className="mt-2 text-xs font-medium">연락처 상세</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 10c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 18l1.395-3.72C3.512 13.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span className="mt-2 text-xs font-medium">메시지</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="mt-2 text-xs font-medium">전화</span>
              </button>
            </div>
          </div>
        )}

        {/* 리스트: 오늘 그룹 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {/* 그룹 라벨 */}
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">오늘</div>
          {displayedCalls.slice(0).map((call, idx) => (
            <button
              key={call.id}
              onClick={() => handleCallClick(call)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-1"><DirectionIcon d={(call as any).direction as string} /></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{(call as any).name || call.phoneNumber}</span>
                      {call.isBlocked && (<span className="px-1.5 py-0.5 text-[10px] rounded bg-red-100 text-red-700">차단됨</span>)}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{call.transcript}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">발신 · {formatDuration(call.duration)}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true }).format(call.timestamp)}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 통화 상세 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="통화 상세 정보"
          size="lg"
        >
          {selectedCall && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">전화번호</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedCall.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">통화 시간</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedCall.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">통화 지속 시간</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">위험도</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedCall.riskLevel}%</p>
                </div>
              </div>

              {/* 통화 내용 */}
              <div>
                <label className="text-sm font-medium text-gray-500">통화 내용</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{selectedCall.transcript}</p>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  닫기
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleReportCall(selectedCall.id)}
                >
                  신고하기
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default CallHistoryPage;
