// components/phone/VoiceTab.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { authService, MeResponse } from "../../services/api/auth";

interface Room {
  id: string;
  name: string;
  participants: number;
}

const VoiceTab: React.FC = () => {
  const [sttLogs, setSttLogs] = useState<string[]>([]);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stt" | "ai">("stt");

  const wsRef = useRef<WebSocket | null>(null); // AI 분석 WS
  const callWsRef = useRef<WebSocket | null>(null); // 통화용 WS
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingRef = useRef(false);
  const callBufferRef = useRef<Int16Array[]>([]); // 내음성 통화로 전송
  const aiMyBufferRef = useRef<Int16Array[]>([]); // 내 음성누적
  const peerBufferRef = useRef<Int16Array[]>([]); // 상대 음성누적
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const sessionIdRef = useRef(`s_${Date.now()}`);
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const vizLastUpdateRef = useRef<number>(0);
  // 최근 spoof_prob 기록 (최대 10개 유지)
  const spoofHistoryRef = useRef<number[]>([]);
  const [vizLevels, setVizLevels] = useState<number[]>(
    Array.from({ length: 16 }, () => 0)
  );

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;
  const callWsUrl = process.env.NEXT_PUBLIC_CALL_WS!;
  const AI_SERVER_URL = process.env.NEXT_PUBLIC_AI_SERVER_URL!;
  const CALL_API_URL = process.env.NEXT_PUBLIC_API_URL!; // /call API 서버
  const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN!;

  const logSTT = (msg: string) => setSttLogs((prev) => [...prev, msg]);
  const logAI = (msg: string) => setAiLogs((prev) => [...prev, msg]);

  /** ---------------- Helper ---------------- */
  const triggerFileSelect = () => fileInputRef.current?.click();

  /** ---------------- WAV 인코딩 ---------------- */
  const encodeWAV = (samples: Int16Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2)
      view.setInt16(offset, samples[i], true);

    return new Blob([view], { type: "audio/wav" });
  };

  /** ---------------- AI WS ---------------- */
  const connectWS = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => logSTT("✅ AI WebSocket connected");
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.stt_segment) {
          const speaker = data.stt_segment.speaker.replace(
            "SPEAKER_",
            "대화자"
          );
          const text = data.stt_segment.text;
          logSTT(`${speaker}: ${text}`);

          // ⚡ STT → AI 서버 POST
          sendSTTToAI({ speaker, text });
        } else if (data.spoof_prob !== undefined) {
          const prob = data.spoof_prob;
          const prob2 = 1 - prob;
          console.log(prob2 * 100);
          spoofHistoryRef.current.push(prob2);
          if (spoofHistoryRef.current.length > 10) {
            spoofHistoryRef.current.shift();
          }
          const aboveThreshold = spoofHistoryRef.current.filter(
            (p) => p >= 0.5
          );
          if (aboveThreshold.length >= 4) {
            const avgProb =
              aboveThreshold.reduce((sum, p) => sum + p, 0) /
              aboveThreshold.length;
            logSTT(
              `🛑주의! 변조음성 감지!\n가능성: ${(avgProb * 100).toFixed(1)}%`
            );
          }
        } else if (data.error) logSTT(`❌ Error: ${data.error}`);
      } catch {
        logSTT(`📩 Raw message: ${event.data}`);
      }
    };
    wsRef.current.onclose = () => logSTT("⚠️ AI WebSocket disconnected");
  };

  /** ---------------- 통화용 WS ---------------- */
  const connectCallWS = (roomId: string) => {
    if (callWsRef.current && callWsRef.current.readyState === WebSocket.OPEN)
      return;

    const url = `${callWsUrl}?roomId=${roomId}`;
    callWsRef.current = new WebSocket(url);

    callWsRef.current.onopen = () =>
      logSTT(`✅ Call WebSocket connected (room: ${roomId})`);

    callWsRef.current.onerror = (err) =>
      logSTT(`❌ Call WS error: ${JSON.stringify(err)}`);

    callWsRef.current.onmessage = async (evt) => {
      const arrayBuffer = await (evt.data as Blob).arrayBuffer();
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

      try {
        const audioBuffer = await audioCtxRef.current.decodeAudioData(
          arrayBuffer
        );
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtxRef.current.destination);
        source.start();

        // 🎯 상대방 음성을 Int16Array로 변환 후 AI 전송 버퍼에 추가
        const channelData = audioBuffer.getChannelData(0);
        const int16 = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          int16[i] = Math.max(-1, Math.min(1, channelData[i])) * 0x7fff;
        }
        peerBufferRef.current.push(int16);
      } catch (e) {
        console.error("재생 실패, raw PCM일 수 있음:", e);
        const pcm = new Int16Array(arrayBuffer);
        playPCM(pcm);
        peerBufferRef.current.push(pcm); // raw PCM fallback도 AI WS에 추가
      }
    };
    callWsRef.current.onclose = (evt) =>
      logSTT(
        `⚠️ Call WebSocket disconnected (code: ${evt.code}, reason: ${evt.reason})`
      );
  };

  /** ---------------- 마이크 스트리밍 ---------------- */
  // ✅ AI WS 전송 (5초 주기, 내/상대 음성 별도 전송)
  const startAIInterval = () => {
    intervalRef.current = window.setInterval(async () => {
      if (!recordingRef.current) return;

      // --------- 내 음성 전송 ---------
      if (
        aiMyBufferRef.current.length > 0 &&
        wsRef.current?.readyState === WebSocket.OPEN
      ) {
        const myLength = aiMyBufferRef.current.reduce(
          (acc, cur) => acc + cur.length,
          0
        );
        const myMerged = new Int16Array(myLength);
        let offset = 0;
        aiMyBufferRef.current.forEach((chunk) => {
          myMerged.set(chunk, offset);
          offset += chunk.length;
        });

        const myBlob = encodeWAV(myMerged, audioCtxRef.current!.sampleRate);
        const myArrayBuffer = await myBlob.arrayBuffer(); // await로 순차 처리
        wsRef.current.send(myArrayBuffer);

        aiMyBufferRef.current = []; // 초기화
      }

      // --------- 상대 음성 전송 ---------
      if (
        peerBufferRef.current.length > 0 &&
        wsRef.current?.readyState === WebSocket.OPEN
      ) {
        const peerLength = peerBufferRef.current.reduce(
          (acc, cur) => acc + cur.length,
          0
        );
        const peerMerged = new Int16Array(peerLength);
        let offset = 0;
        peerBufferRef.current.forEach((chunk) => {
          peerMerged.set(chunk, offset);
          offset += chunk.length;
        });

        const peerBlob = encodeWAV(peerMerged, audioCtxRef.current!.sampleRate);
        const peerArrayBuffer = await peerBlob.arrayBuffer(); // await로 순차 처리
        wsRef.current.send(peerArrayBuffer);

        peerBufferRef.current = []; // 초기화
      }
    }, 5000);
  };

  // ✅ 통화 WS 전송 (2초 주기, 내 음성만)
  const startCallInterval = () => {
    const callInterval = window.setInterval(() => {
      if (!recordingRef.current) return;
      if (callBufferRef.current.length === 0) return;

      const myLength = callBufferRef.current.reduce(
        (acc, cur) => acc + cur.length,
        0
      );
      const myMerged = new Int16Array(myLength);
      let offset = 0;
      callBufferRef.current.forEach((chunk) => {
        myMerged.set(chunk, offset);
        offset += chunk.length;
      });

      if (callWsRef.current?.readyState === WebSocket.OPEN) {
        callWsRef.current.send(myMerged.buffer);
      }
      callBufferRef.current = [];
    }, 2000); // 2초마다 전송

    // cleanup 위해 ref에 저장
    (callWsRef as any).interval = callInterval;
  };

  const handleMicStop = () => {
    recordingRef.current = false;
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioCtxRef.current?.close();

    if (intervalRef.current) clearInterval(intervalRef.current);
    if ((callWsRef as any).interval) clearInterval((callWsRef as any).interval);

    logSTT("🛑 Recording stopped");
  };

  /** ---------------- 파일 업로드 ---------------- */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "wav";
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      wsRef.current.send(JSON.stringify({ audio: base64, format: ext }));
      logSTT(`📤 Sent file: ${file.name} (format: ${ext})`);
    } else {
      logSTT("❌ AI WebSocket not connected");
    }
  };

  /** ---------------- 통화방 목록 불러오기 ---------------- */
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${CALL_API_URL}/call/room/list`);
      const data = await res.json();
      // 백엔드가 { rooms: [...] } 형태라면
      setRooms(data.rooms || []);
    } catch (err) {
      logSTT(`❌ 방 목록 로드 실패: ${(err as Error).message}`);
      setRooms([]); // 실패 시 안전하게 빈 배열
    }
  };

  const createRoom = async () => {
    const payload = { creatorId: userEmail, roomName: "새로운 방" };
    const res = await fetch(`${CALL_API_URL}/call/room/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setCurrentRoom(data.roomId);
    connectCallWS(data.roomId);
    handleMicStart();
    logSTT(`📞 통화방 생성: ${data.roomName} (${data.roomId})`);
    fetchRooms();
  };

  const joinRoom = async (roomId: string) => {
    await fetch(`${CALL_API_URL}/call/room/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userEmail, roomId }),
    });
    setCurrentRoom(roomId);
    connectCallWS(roomId);
    handleMicStart();
    logSTT(`📞 통화방 참가: ${roomId}`);
  };

  /** ---------------- PCM 재생 ---------------- */
  const playPCM = (pcm: Int16Array, sampleRate = 48000) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

    const float32 = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 0x7fff;

    const buffer = audioCtxRef.current.createBuffer(
      1,
      float32.length,
      sampleRate // 서버에서 송출한 sampleRate에 맞춰야 함
    );
    buffer.getChannelData(0).set(float32);

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    source.start();
  };

  const handleMicStart = async () => {
    if (recordingRef.current) return;
    recordingRef.current = true;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 48000,
        channelCount: 1,
        echoCancellation: true, // 에코 제거
        noiseSuppression: true, // 잡음 억제
        autoGainControl: true, // 자동 볼륨 조정
      },
    });
    streamRef.current = stream;

    audioCtxRef.current = new AudioContext({ sampleRate: 48000 });
    const source = audioCtxRef.current.createMediaStreamSource(stream);

    // 🔥 GainNode 추가
    const gainNode = audioCtxRef.current.createGain();
    gainNode.gain.value = 0.4; // 0.0 ~ 1.0 (기본 1.0, 줄이면 감도 ↓, 올리면 감도 ↑)

    processorRef.current = audioCtxRef.current.createScriptProcessor(
      4096,
      1,
      1
    );

    processorRef.current.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(input.length);
      let sumSquares = 0;
      for (let i = 0; i < input.length; i++) {
        const clamped = Math.max(-1, Math.min(1, input[i]));
        int16[i] = clamped * 0x7fff;
        sumSquares += clamped * clamped;
      }
      aiMyBufferRef.current.push(int16);
      callBufferRef.current.push(int16);

      // 비주얼라이저 업데이트(최대 60ms 간격)
      const now = performance.now();
      if (now - vizLastUpdateRef.current > 60) {
        vizLastUpdateRef.current = now;
        const rms = Math.sqrt(sumSquares / input.length); // 0..1
        const base = Math.min(1, rms * 2.5); // 민감도 보정
        setVizLevels((prev) =>
          prev.map((_, idx) => {
            const jitter = (Math.sin(now / 120 + idx) + 1) / 12; // 0..~0.16
            const decay = prev[idx] * 0.85; // 부드러운 감쇠
            return Math.max(decay, Math.min(1, base + jitter));
          })
        );
      }
    };

    source.connect(gainNode);
    gainNode.connect(processorRef.current!);
    processorRef.current.connect(audioCtxRef.current.destination);

    // ✅ 두 가지 interval 시작
    startAIInterval();
    startCallInterval();

    logSTT("🎤 Mic started");
  };

  const leaveRoom = async () => {
    if (!currentRoom || !userEmail) {
      logSTT("❌ 방 정보가 없어서 나갈 수 없음");
      return;
    }

    try {
      const res = await fetch(`${CALL_API_URL}/call/room/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userEmail, roomId: currentRoom }),
      });
      const data = await res.json();
      logSTT(`🚪 Left room: ${JSON.stringify(data)}`);
      setCurrentRoom(null);
      fetchRooms(); // 방 목록 갱신
    } catch (err) {
      logSTT(`❌ 방 나가기 실패: ${(err as Error).message}`);
    }
  };

  // 챗봇에 대화 보내기
  const sendSTTToAI = async (segment: { speaker: string; text: string }) => {
    try {
      const payload = {
        sessionId: sessionIdRef.current, // 고정 세션
        query: `
당신은 보이스피싱 탐지 도우미입니다.
항상 한국어로 답하세요.
아래 대화 발화를 보고 대답해 주세요.
대화 발화에 위험징후가 있을경우에만 첫마디에 "보이스피싱 위험징후 포착"으로 시작하세요.
대화에 위험징후가 없다면 "특이사항 없음" 으로만 대답하세요.
대화 발화에서 포착한 위험 징후가 있을 경우에만 해당 위험징후에 대해 간략하게 설명하고 행동 가이드를 안내하세요.
전체 대답은 3줄 이하로 요약하여 해주세요.

위험 징후:
- 기관 사칭: 경찰, 검찰, 은행 등 공무원 및 공공기관을 사칭하며 금전 요구
- 금액 요구: 안전계좌, 수수료, 세금 등을 이유로 송금 요구

행동 가이드:
- 전화로 요구받은 계좌나 금액은 절대 이체하지 마세요.
- 해당 기관 공식 대표번호로 다시 확인하세요.
- 의심되면 경찰서나 금융기관에 신고하세요.

대화 발화: ${segment.speaker}: ${segment.text}
※ ${segment.speaker}는 발화자 구분용입니다.
`,
        token: API_TOKEN,
        history: historyRef.current, // 누적 history 전송
      };

      const res = await fetch(`${AI_SERVER_URL}/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.answer) {
        // ⚠️ 위험 키워드 발견 시 별도 UI/로그 표시
        if (/경고|주의|위험|사기/.test(data.answer)) {
          logAI(
            `🤖 AI 분석 결과 \n의심내용 = ${segment.speaker}: ${segment.text} \n🛑 ${data.answer} \n`
          );
        }
      }

      // 3️⃣ STT를 history에 누적
      historyRef.current.push({
        role: "user",
        content: `[${segment.speaker}] ${segment.text}`,
      });

      // 선택: AI 답변도 history에 추가하면 다음 요청에 컨텍스트 반영 가능
      historyRef.current.push({
        role: "assistant",
        content: data.answer || "",
      });
    } catch (err) {
      console.error("STT 전송 실패", err);
    }
  };

  /** ---------------- Cleanup ---------------- */
  useEffect(() => {
    fetchRooms();
    return () => {
      handleMicStop();
      wsRef.current?.close();
      callWsRef.current?.close();
    };
  }, []);

  // 유저 이메일 저장
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await authService.me();
        setUserEmail(me.email); // email을 creatorId/userId로 사용
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err);
      }
    };
    fetchUser();
  }, []);

  /** ---------------- UI ---------------- */
  const logsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [sttLogs]);

  const getLogClass = (text: string) => {
    if (/[🛑]|위험|에러|Error|❌/.test(text)) return "text-danger-600";
    if (/[⚠️]|주의|경고/.test(text)) return "text-warning-600";
    if (/[✅]|connected|완료|success/i.test(text)) return "text-success-600";
    return "text-gray-800 dark:text-gray-200";
  };

  return (
    <div className="p-4 pb-4 h-full flex flex-col gap-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* 통화방 제어 */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-gray-100 dark:border-gray-700 overflow-visible">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
              onClick={createRoom}>
              통화방 생성
            </Button>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              현재 통화방:
              <span className="ml-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {currentRoom || "없음"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={connectWS}>
              AI 연결
            </Button>
            <div className="relative">
              <input
                ref={fileInputRef}
                id="voice-file"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="secondary" size="sm" onClick={triggerFileSelect}>
                오디오 파일 업로드
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">
            통화방 목록
          </h4>
          <div className="flex gap-2 overflow-x-auto overflow-y-visible p-2 rounded-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {rooms.length === 0 ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                생성된 방이 없습니다.
              </span>
            ) : (
              rooms.map((room) => (
                <Button
                  key={room.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => joinRoom(room.id)}
                  className={`${
                    currentRoom === room.id
                      ? "ring-inset ring-2 ring-primary-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                      : ""
                  }`}>
                  {room.name} ({room.participants})
                </Button>
              ))
            )}
          </div>
        </div>

        {/* 통화 시작/중지 버튼은 하단 고정 액션바에서만 제공 */}
      </Card>

      {/* 로그 뷰 (탭 전환) */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {/* 탭 버튼 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("stt")}
            className={`flex-1 p-2 text-sm font-semibold ${
              activeTab === "stt"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}>
            통화 로그
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 p-2 text-sm font-semibold ${
              activeTab === "ai"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}>
            🤖 AI 분석 로그
          </button>
        </div>

        {/* 로그 내용 */}
        <div className="flex-1 overflow-auto p-3 bg-gray-50">
          {activeTab === "stt"
            ? sttLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono"
                  style={{ whiteSpace: "pre-wrap" }}>
                  {log}
                </div>
              ))
            : aiLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono text-indigo-600"
                  style={{ whiteSpace: "pre-wrap" }}>
                  {log}
                </div>
              ))}
        </div>
      </Card>

      {/* 하단 액션바: 고정 해제, 위 블록과 1rem 간격 유지 */}
      <div className="mt-4">
        <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur shadow-xl px-4 py-3 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 gap-y-2">
            {/* 오디오 바 비주얼라이저 */}
            <div className="flex items-end gap-[3px] h-10 w-28 sm:w-40">
              {vizLevels.map((lv, i) => (
                <span
                  key={i}
                  className="w-[6px] rounded-full bg-gradient-to-b from-primary-500 to-indigo-500 dark:from-primary-400 dark:to-indigo-400 transition-[height] duration-75"
                  style={{ height: `${8 + Math.round(lv * 28)}px` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 whitespace-nowrap">
                <span
                  className={`w-2 h-2 rounded-full ${
                    recordingRef.current ? "bg-red-500" : "bg-gray-400"
                  }`}
                />
                {recordingRef.current ? "녹음 중" : "대기"}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 whitespace-nowrap">
                <span
                  className={`w-2 h-2 rounded-full ${
                    wsRef.current?.readyState === WebSocket.OPEN
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />
                {wsRef.current?.readyState === WebSocket.OPEN
                  ? "AI 연결됨"
                  : "AI 미연결"}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {!recordingRef.current ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (currentRoom) {
                      connectCallWS(currentRoom);
                      handleMicStart();
                    }
                  }}
                  className="shadow-md whitespace-nowrap"
                  disabled={!currentRoom}>
                  통화 시작
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    handleMicStop();
                    leaveRoom();
                  }}
                  className="shadow-md whitespace-nowrap">
                  통화 중지
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTab;
