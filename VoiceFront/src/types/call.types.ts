// 파일 설명: 통화 도메인에서 사용하는 상세 타입 정의 모음
// 통화 상태 타입
export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

// 통화 방향 타입
export type CallDirection = 'incoming' | 'outgoing';

// 통화 품질 타입
export type CallQuality = 'excellent' | 'good' | 'fair' | 'poor';

// 통화 인터페이스 상태
export interface CallState {
  status: CallStatus;
  direction: CallDirection;
  phoneNumber: string;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
  quality: CallQuality;
  riskLevel: number;
  transcript: string;
  isRecording: boolean;
  isBlocked: boolean;
}

// 통화 제어 액션
export type CallAction = 
  | 'start'
  | 'end'
  | 'mute'
  | 'unmute'
  | 'speaker_on'
  | 'speaker_off'
  | 'hold'
  | 'resume'
  | 'block'
  | 'unblock';

// 통화 이벤트
export interface CallEvent {
  type: CallAction;
  timestamp: Date;
  callId: string;
  data?: any;
}

// 통화 기록 필터
export interface CallHistoryFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  riskLevel?: {
    min: number;
    max: number;
  };
  phoneNumber?: string;
  status?: CallStatus[];
  isBlocked?: boolean;
}

// 통화 통계
export interface CallStatistics {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  highRiskCalls: number;
  blockedCalls: number;
  averageRiskLevel: number;
  callsByDay: CallDayStats[];
  riskDistribution: RiskDistribution;
}

export interface CallDayStats {
  date: string;
  callCount: number;
  averageRiskLevel: number;
  highRiskCount: number;
}

export interface RiskDistribution {
  safe: number;      // 0-30%
  warning: number;   // 31-60%
  danger: number;    // 61-80%
  critical: number;  // 81-100%
}

// 오디오 스트림 설정
export interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  bitDepth: number;
  bufferSize: number;
  enableNoiseReduction: boolean;
  enableEchoCancellation: boolean;
  enableAutoGainControl: boolean;
}

// 오디오 청크
export interface AudioChunk {
  data: Float32Array;
  timestamp: number;
  sampleRate: number;
  channels: number;
  duration: number;
}

// 음성 인식 설정
export interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  enableProfanityFilter: boolean;
}

// 통화 품질 메트릭
export interface CallQualityMetrics {
  audioLevel: number;
  noiseLevel: number;
  clarity: number;
  latency: number;
  packetLoss: number;
  jitter: number;
}

// 통화 알림
export interface CallNotification {
  id: string;
  callId: string;
  type: 'risk_alert' | 'quality_warning' | 'connection_lost' | 'call_ended';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  isRead: boolean;
  actions?: CallNotificationAction[];
}

export interface CallNotificationAction {
  id: string;
  label: string;
  action: CallAction;
  style: 'primary' | 'secondary' | 'danger';
}

// 통화 세션
export interface CallSession {
  id: string;
  userId: string;
  phoneNumber: string;
  startTime: Date;
  endTime?: Date;
  status: CallStatus;
  riskLevel: number;
  transcript: string;
  audioChunks: AudioChunk[];
  events: CallEvent[];
  quality: CallQualityMetrics;
  notifications: CallNotification[];
  settings: CallSessionSettings;
}

export interface CallSessionSettings {
  autoMute: boolean;
  autoBlock: boolean;
  riskThreshold: number;
  recordingEnabled: boolean;
  transcriptEnabled: boolean;
  realTimeAnalysis: boolean;
}
