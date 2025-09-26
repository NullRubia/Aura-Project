/* 파일 설명: WebSocket 기본 설정과 이벤트/메시지 타입 상수. */
const WEBSOCKET_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  events: {
    // 연결 이벤트
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    RECONNECT: 'reconnect',
    ERROR: 'error',
    
    // 통화 이벤트
    CALL_STARTED: 'call_started',
    CALL_ENDED: 'call_ended',
    CALL_UPDATED: 'call_updated',
    
    // 오디오 이벤트
    AUDIO_DATA: 'audio_data',
    AUDIO_PROCESSED: 'audio_processed',
    
    // 위험도 이벤트
    RISK_UPDATE: 'risk_update',
    RISK_ALERT: 'risk_alert',
    RISK_ANALYSIS: 'risk_analysis',
    
    // 텍스트 이벤트
    TRANSCRIPT_UPDATE: 'transcript_update',
    TRANSCRIPT_FINAL: 'transcript_final',
    
    // 알림 이벤트
    NOTIFICATION: 'notification',
    ALERT: 'alert',
    
    // 시스템 이벤트
    SYSTEM_STATUS: 'system_status',
    MAINTENANCE: 'maintenance',
  },
  messageTypes: {
    AUDIO_CHUNK: 'audio_chunk',
    AUDIO_METADATA: 'audio_metadata',
    RISK_SCORE: 'risk_score',
    TRANSCRIPT_CHUNK: 'transcript_chunk',
    HEARTBEAT: 'heartbeat',
    PING: 'ping',
    PONG: 'pong',
  },
};

export default WEBSOCKET_CONFIG;
