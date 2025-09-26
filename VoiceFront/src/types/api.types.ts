// 파일 설명: REST API 요청/응답 및 도메인 전반에서 사용하는 공용 타입 모음
// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 에러 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// 인증 관련 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// 사용자 타입
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  riskThresholds: RiskThresholds;
  audio: AudioSettings;
  privacy: PrivacySettings;
}

// 통화 관련 타입
export interface Call {
  id: string;
  userId: string;
  phoneNumber: string;
  startTime: string;
  endTime?: string;
  duration: number;
  riskLevel: number;
  transcript: string;
  isBlocked: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallCreateRequest {
  phoneNumber: string;
  startTime: string;
}

export interface CallUpdateRequest {
  endTime?: string;
  isMuted?: boolean;
  isBlocked?: boolean;
}

// 위험도 분석 타입
export interface RiskAnalysis {
  callId: string;
  riskLevel: number;
  confidence: number;
  factors: RiskFactor[];
  timestamp: string;
}

export interface RiskFactor {
  type: 'keyword' | 'tone' | 'pattern' | 'context';
  score: number;
  description: string;
  confidence: number;
}

export interface RiskThresholds {
  warning: number;
  danger: number;
  critical: number;
}

// 신고 관련 타입
export interface Report {
  id: string;
  userId: string;
  callId: string;
  phoneNumber: string;
  reason: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ReportCreateRequest {
  callId: string;
  reason: string;
  description: string;
  priority: ReportPriority;
}

export interface ReportUpdateRequest {
  status?: ReportStatus;
  priority?: ReportPriority;
}

// 알림 설정 타입
export interface NotificationSettings {
  riskAlerts: boolean;
  emailAlerts: boolean;
  pushNotifications: boolean;
  soundAlerts: boolean;
}

// 오디오 설정 타입
export interface AudioSettings {
  microphoneSensitivity: number;
  noiseReduction: boolean;
  autoMute: boolean;
}

// 개인정보 설정 타입
export interface PrivacySettings {
  dataRetention: number;
  shareAnalytics: boolean;
  localProcessing: boolean;
}

// WebSocket 메시지 타입
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface AudioChunkMessage {
  type: 'audio_chunk';
  data: {
    callId: string;
    audioData: ArrayBuffer;
    sampleRate: number;
    channels: number;
  };
}

export interface RiskUpdateMessage {
  type: 'risk_update';
  data: {
    callId: string;
    riskLevel: number;
    confidence: number;
    factors: RiskFactor[];
  };
}

export interface TranscriptUpdateMessage {
  type: 'transcript_update';
  data: {
    callId: string;
    transcript: string;
    isFinal: boolean;
  };
}

export interface AlertMessage {
  type: 'alert';
  data: {
    callId: string;
    alertType: 'warning' | 'danger' | 'critical';
    message: string;
    riskLevel: number;
  };
}
