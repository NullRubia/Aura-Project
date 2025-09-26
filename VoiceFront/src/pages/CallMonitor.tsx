'use client';

/* 파일 설명: 통화 모니터링 페이지 컴포넌트.
   - 마이크 권한 요청, 통화 시작/종료, 음소거 토글, 위험도/자막 시뮬레이션을 포함합니다.
   - 실제 운영에서는 WebSocket 및 오디오 스트림 처리 로직을 연동합니다. */

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import CallInterface from '../components/call/CallInterface';

/**
 * 통화 모니터링 페이지 컴포넌트
 * - 마이크 권한 요청, 통화 시작/종료, 음소거, 위험도/자막 상태 관리
 */
const CallMonitor: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [riskLevel, setRiskLevel] = useState(0);
  const [transcript, setTranscript] = useState('');

  // 마이크 권한 요청
  /** 마이크 권한을 요청하고 거부 시 안내를 표시 */
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('마이크 권한이 허용되었습니다.');
      } catch (error) {
        console.error('마이크 권한이 거부되었습니다:', error);
        alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
      }
    };

    requestMicrophonePermission();
  }, []);

  // 통화 시작
  /**
   * 통화 시작 핸들러
   * - 상태 초기화 및 위험도/자막 시뮬레이션 시작
   */
  const handleStartCall = () => {
    setIsCallActive(true);
    setRiskLevel(0);
    setTranscript('');
    
    // 실제 구현에서는 WebSocket 연결을 시작하고 오디오 스트림을 캡처합니다
    console.log('통화 시작');
    
    // 시뮬레이션: 위험도 업데이트
    const interval = setInterval(() => {
      setRiskLevel(prev => {
        const newLevel = prev + Math.random() * 10;
        return Math.min(newLevel, 100);
      });
    }, 2000);

    // 시뮬레이션: 텍스트 업데이트
    const transcriptInterval = setInterval(() => {
      setTranscript(prev => prev + '안녕하세요, 고객님. 저희 은행에서 연락드리는 건데요...\n');
    }, 3000);

    // 30초 후 정리
    setTimeout(() => {
      clearInterval(interval);
      clearInterval(transcriptInterval);
    }, 30000);
  };

  // 통화 종료
  /**
   * 통화 종료 핸들러
   * - 통화/음소거/위험도/자막 상태 초기화
   */
  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setRiskLevel(0);
    setTranscript('');
    console.log('통화 종료');
  };

  // 음소거 토글
  /** 음소거 상태 토글 */
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    console.log('음소거:', !isMuted);
  };

  return (
    <Layout currentPath="/call-monitor">
      <div className="min-h-screen">
        <CallInterface
          isCallActive={isCallActive}
          riskLevel={riskLevel}
          transcript={transcript}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onMuteToggle={handleMuteToggle}
          isMuted={isMuted}
        />
      </div>
    </Layout>
  );
};

export default CallMonitor;
