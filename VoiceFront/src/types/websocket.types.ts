// 파일 설명: WebSocket 메시지/이벤트/연결 상태 등 실시간 통신 타입 모음
// WebSocket 연결 상태
export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

// WebSocket 메시지 타입
export type WebSocketMessageType = 
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'ping'
  | 'pong'
  | 'call_started'
  | 'call_ended'
  | 'call_updated'
  | 'audio_data'
  | 'audio_processed'
  | 'risk_update'
  | 'risk_alert'
  | 'risk_analysis'
  | 'transcript_update'
  | 'transcript_final'
  | 'notification'
  | 'alert'
  | 'system_status'
  | 'maintenance';

// WebSocket 메시지 기본 구조
export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  data: T;
  timestamp: string;
  messageId?: string;
  correlationId?: string;
}

// 연결 이벤트
export interface ConnectMessage {
  type: 'connect';
  data: {
    userId: string;
    sessionId: string;
    version: string;
    capabilities: string[];
  };
}

export interface DisconnectMessage {
  type: 'disconnect';
  data: {
    reason: string;
    code: number;
  };
}

export interface ErrorMessage {
  type: 'error';
  data: {
    code: string;
    message: string;
    details?: any;
  };
}

// 핑/퐁 메시지
export interface PingMessage {
  type: 'ping';
  data: {
    timestamp: number;
  };
}

export interface PongMessage {
  type: 'pong';
  data: {
    timestamp: number;
    latency: number;
  };
}

// 통화 관련 메시지
export interface CallStartedMessage {
  type: 'call_started';
  data: {
    callId: string;
    phoneNumber: string;
    startTime: string;
    direction: 'incoming' | 'outgoing';
  };
}

export interface CallEndedMessage {
  type: 'call_ended';
  data: {
    callId: string;
    endTime: string;
    duration: number;
    reason: string;
  };
}

export interface CallUpdatedMessage {
  type: 'call_updated';
  data: {
    callId: string;
    updates: {
      isMuted?: boolean;
      isBlocked?: boolean;
      riskLevel?: number;
      transcript?: string;
    };
  };
}

// 오디오 관련 메시지
export interface AudioDataMessage {
  type: 'audio_data';
  data: {
    callId: string;
    audioChunk: {
      data: number[];
      sampleRate: number;
      channels: number;
      timestamp: number;
    };
  };
}

export interface AudioProcessedMessage {
  type: 'audio_processed';
  data: {
    callId: string;
    features: {
      volume: number;
      pitch: number;
      clarity: number;
      noiseLevel: number;
    };
    timestamp: number;
  };
}

// 위험도 관련 메시지
export interface RiskUpdateMessage {
  type: 'risk_update';
  data: {
    callId: string;
    riskLevel: number;
    confidence: number;
    factors: RiskFactor[];
    timestamp: string;
  };
}

export interface RiskAlertMessage {
  type: 'risk_alert';
  data: {
    callId: string;
    alertType: 'warning' | 'danger' | 'critical';
    riskLevel: number;
    message: string;
    actions: string[];
    timestamp: string;
  };
}

export interface RiskAnalysisMessage {
  type: 'risk_analysis';
  data: {
    callId: string;
    analysis: {
      riskScore: number;
      riskLevel: string;
      factors: RiskFactor[];
      confidence: number;
    };
    timestamp: string;
  };
}

// 텍스트 관련 메시지
export interface TranscriptUpdateMessage {
  type: 'transcript_update';
  data: {
    callId: string;
    transcript: string;
    isFinal: boolean;
    confidence: number;
    timestamp: string;
  };
}

export interface TranscriptFinalMessage {
  type: 'transcript_final';
  data: {
    callId: string;
    transcript: string;
    confidence: number;
    timestamp: string;
  };
}

// 알림 관련 메시지
export interface NotificationMessage {
  type: 'notification';
  data: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: string;
    actions?: NotificationAction[];
  };
}

export interface AlertMessage {
  type: 'alert';
  data: {
    id: string;
    callId?: string;
    alertType: 'risk' | 'system' | 'security' | 'maintenance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    timestamp: string;
    actions?: AlertAction[];
  };
}

// 시스템 관련 메시지
export interface SystemStatusMessage {
  type: 'system_status';
  data: {
    status: 'healthy' | 'degraded' | 'down';
    services: ServiceStatus[];
    timestamp: string;
  };
}

export interface MaintenanceMessage {
  type: 'maintenance';
  data: {
    scheduled: boolean;
    startTime: string;
    endTime: string;
    description: string;
    affectedServices: string[];
  };
}

// 보조 타입들
export interface RiskFactor {
  type: string;
  score: number;
  confidence: number;
  description: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface AlertAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  lastCheck: string;
}

// WebSocket 클라이언트 설정
export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  timeout: number;
  retryDelay: number;
}

// WebSocket 이벤트 핸들러
export interface WebSocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: (reason: string, code: number) => void;
  onError?: (error: Error) => void;
  onMessage?: <T>(message: WebSocketMessage<T>) => void;
  onCallStarted?: (data: CallStartedMessage['data']) => void;
  onCallEnded?: (data: CallEndedMessage['data']) => void;
  onCallUpdated?: (data: CallUpdatedMessage['data']) => void;
  onAudioData?: (data: AudioDataMessage['data']) => void;
  onAudioProcessed?: (data: AudioProcessedMessage['data']) => void;
  onRiskUpdate?: (data: RiskUpdateMessage['data']) => void;
  onRiskAlert?: (data: RiskAlertMessage['data']) => void;
  onRiskAnalysis?: (data: RiskAnalysisMessage['data']) => void;
  onTranscriptUpdate?: (data: TranscriptUpdateMessage['data']) => void;
  onTranscriptFinal?: (data: TranscriptFinalMessage['data']) => void;
  onNotification?: (data: NotificationMessage['data']) => void;
  onAlert?: (data: AlertMessage['data']) => void;
  onSystemStatus?: (data: SystemStatusMessage['data']) => void;
  onMaintenance?: (data: MaintenanceMessage['data']) => void;
}

// WebSocket 연결 상태 정보
export interface WebSocketConnectionInfo {
  status: WebSocketStatus;
  url: string;
  connectedAt?: Date;
  lastPingAt?: Date;
  lastPongAt?: Date;
  latency?: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  error?: Error;
}
