// 파일 설명: 전역 상수/설정 값 모음 (앱/네트워크/도메인/표현 등)
// 앱 기본 설정
export const APP_CONFIG = {
  name: 'Voice Guard',
  version: '0.1.0',
  description: 'AI 기반 실시간 보이스피싱 탐지 시스템',
  author: 'Voice Guard Team',
  website: 'https://voiceguard.com',
  supportEmail: 'support@voiceguard.com',
  supportPhone: '1588-1234',
} as const;

// API 설정
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// WebSocket 설정
export const WEBSOCKET_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
} as const;

// 위험도 임계값
export const RISK_THRESHOLDS = {
  SAFE: 30,
  WARNING: 60,
  DANGER: 80,
  CRITICAL: 90,
} as const;

// 위험도 레벨
export const RISK_LEVELS = {
  SAFE: 'safe',
  WARNING: 'warning',
  DANGER: 'danger',
  CRITICAL: 'critical',
} as const;

// 통화 상태
export const CALL_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ENDED: 'ended',
  ERROR: 'error',
} as const;

// 통화 방향
export const CALL_DIRECTION = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
} as const;

// 신고 상태
export const REPORT_STATUS = {
  PENDING: 'pending',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
} as const;

// 신고 우선순위
export const REPORT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// 사용자 역할
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  ANALYST: 'analyst',
} as const;

// 사용자 상태
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

// 구독 플랜
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

// 구독 상태
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  TRIAL: 'trial',
} as const;

// 알림 타입
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

// 알림 심각도
export const NOTIFICATION_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// 파일 타입
export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// 파일 크기 제한 (MB)
export const FILE_SIZE_LIMITS = {
  IMAGE: 5,
  AUDIO: 50,
  VIDEO: 100,
  DOCUMENT: 10,
} as const;

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  CALL_HISTORY: 'call_history',
  RISK_SETTINGS: 'risk_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// 세션 스토리지 키
export const SESSION_KEYS = {
  CURRENT_CALL: 'current_call',
  TEMP_DATA: 'temp_data',
  FORM_DATA: 'form_data',
} as const;

// 쿠키 설정
export const COOKIE_CONFIG = {
  AUTH_TOKEN: {
    name: 'auth_token',
    maxAge: 7 * 24 * 60 * 60, // 7일
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
  REFRESH_TOKEN: {
    name: 'refresh_token',
    maxAge: 30 * 24 * 60 * 60, // 30일
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  },
} as const;

// 테마 색상
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  GRAY: '#6b7280',
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// 애니메이션 지속 시간
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 1000,
} as const;

// 오디오 설정
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 44100,
  CHANNELS: 1,
  BIT_DEPTH: 16,
  BUFFER_SIZE: 4096,
  MAX_DURATION: 300, // 5분
} as const;

// 음성 인식 설정
export const SPEECH_RECOGNITION_CONFIG = {
  LANGUAGE: 'ko-KR',
  CONTINUOUS: true,
  INTERIM_RESULTS: true,
  MAX_ALTERNATIVES: 1,
} as const;

// 위험도 분석 설정
export const RISK_ANALYSIS_CONFIG = {
  UPDATE_INTERVAL: 1000, // 1초
  BATCH_SIZE: 10,
  CONFIDENCE_THRESHOLD: 0.7,
  FACTOR_WEIGHTS: {
    keyword: 0.3,
    tone: 0.25,
    pattern: 0.2,
    context: 0.15,
    urgency: 0.1,
  },
} as const;

// 키워드 목록
export const RISK_KEYWORDS = {
  URGENCY: [
    '지금 당장', '즉시', '긴급', '바로', '서둘러', '빨리', '급한 일',
    '시간이 없어', '마지막 기회', '오늘만', '내일은 늦어'
  ],
  AUTHORITY: [
    '은행', '경찰', '검찰', '법원', '정부', '국세청', '금융감독원',
    '공무원', '직원', '담당자', '상급자', '관리자'
  ],
  FEAR: [
    '계좌 동결', '자금 세탁', '범죄', '수사', '기소', '벌금', '처벌',
    '신용등급', '블랙리스트', '제재', '처분'
  ],
  GREED: [
    '이익', '수익', '보상', '보상금', '상금', '돈', '현금', '이자',
    '투자', '수익률', '할인', '혜택', '보너스'
  ],
  PERSONAL_INFO: [
    '주민등록번호', '주민번호', '주민등록', '신분증', '여권번호',
    '계좌번호', '비밀번호', '카드번호', '카드 비밀번호', 'OTP',
    '인증번호', '보안카드', '공인인증서'
  ],
} as const;

// 에러 코드
export const ERROR_CODES = {
  // 인증 관련
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // 유효성 검사
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // 리소스 관련
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // 서버 관련
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // 비즈니스 로직
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '로그인되었습니다',
  LOGOUT_SUCCESS: '로그아웃되었습니다',
  REGISTER_SUCCESS: '회원가입이 완료되었습니다',
  UPDATE_SUCCESS: '정보가 업데이트되었습니다',
  DELETE_SUCCESS: '삭제되었습니다',
  SAVE_SUCCESS: '저장되었습니다',
  SEND_SUCCESS: '전송되었습니다',
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
  SERVER_ERROR: '서버 오류가 발생했습니다',
  UNAUTHORIZED: '로그인이 필요합니다',
  FORBIDDEN: '접근 권한이 없습니다',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다',
  VALIDATION_ERROR: '입력 정보를 확인해주세요',
  TIMEOUT: '요청 시간이 초과되었습니다',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
} as const;
