// 파일 설명: 사용자/권한/설정/구독/통계 등 사용자 도메인 타입 모음
// 사용자 역할 타입
export type UserRole = 'user' | 'admin' | 'moderator' | 'analyst';

// 사용자 상태 타입
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// 사용자 기본 정보
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferences: UserPreferences;
  subscription: UserSubscription;
  statistics: UserStatistics;
}

// 사용자 설정
export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  theme: ThemePreferences;
}

// 알림 설정
export interface NotificationPreferences {
  email: EmailNotificationSettings;
  push: PushNotificationSettings;
  sms: SmsNotificationSettings;
  inApp: InAppNotificationSettings;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  riskAlerts: boolean;
  weeklyReports: boolean;
  systemUpdates: boolean;
  marketing: boolean;
}

export interface PushNotificationSettings {
  enabled: boolean;
  riskAlerts: boolean;
  callUpdates: boolean;
  systemAlerts: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface SmsNotificationSettings {
  enabled: boolean;
  criticalAlerts: boolean;
  twoFactorAuth: boolean;
  phone: string;
}

export interface InAppNotificationSettings {
  enabled: boolean;
  showBadges: boolean;
  autoMarkRead: boolean;
  sound: boolean;
}

// 개인정보 설정
export interface PrivacyPreferences {
  dataRetention: number; // 일 단위
  shareAnalytics: boolean;
  shareUsageData: boolean;
  allowPersonalization: boolean;
  localProcessing: boolean;
  dataExport: boolean;
  dataDeletion: boolean;
}

// 접근성 설정
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  colorBlindSupport: boolean;
}

// 테마 설정
export interface ThemePreferences {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
}

// 사용자 구독
export interface UserSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: SubscriptionFeature[];
  usage: SubscriptionUsage;
}

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired' | 'trial';

export interface SubscriptionFeature {
  name: string;
  enabled: boolean;
  limit?: number;
  used?: number;
}

export interface SubscriptionUsage {
  callsThisMonth: number;
  storageUsed: number;
  apiCalls: number;
  lastReset: Date;
}

// 사용자 통계
export interface UserStatistics {
  totalCalls: number;
  totalDuration: number;
  highRiskCalls: number;
  blockedCalls: number;
  averageRiskLevel: number;
  reportsSubmitted: number;
  lastCallDate?: Date;
  streak: number;
  achievements: UserAchievement[];
}

// 사용자 성취
export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'safety' | 'usage' | 'engagement' | 'milestone';
}

// 사용자 활동 로그
export interface UserActivity {
  id: string;
  userId: string;
  action: UserAction;
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

export type UserAction = 
  | 'login'
  | 'logout'
  | 'call_started'
  | 'call_ended'
  | 'call_blocked'
  | 'report_submitted'
  | 'settings_updated'
  | 'password_changed'
  | 'email_verified'
  | 'phone_verified'
  | 'subscription_changed'
  | 'data_exported'
  | 'data_deleted';

// 사용자 세션
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  isActive: boolean;
}

// 사용자 그룹
export interface UserGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  permissions: GroupPermission[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface GroupPermission {
  resource: string;
  actions: string[];
}

// 사용자 초대
export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  groupId?: string;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
}

// 사용자 프로필 업데이트
export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

// 사용자 비밀번호 변경
export interface UserPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 사용자 이메일 변경
export interface UserEmailChange {
  newEmail: string;
  password: string;
}

// 사용자 전화번호 변경
export interface UserPhoneChange {
  newPhone: string;
  verificationCode: string;
}

// 사용자 계정 삭제
export interface UserAccountDeletion {
  password: string;
  reason?: string;
  feedback?: string;
  deleteData: boolean;
}
