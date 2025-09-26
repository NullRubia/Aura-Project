// 파일 설명: 전화 앱에서 사용하는 타입 정의 모음

// 연락처 타입
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  isFavorite: boolean;
  lastCallTime?: Date;
  callCount: number;
  riskLevel?: number;
  isBlocked: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 연락처 그룹
export interface ContactGroup {
  id: string;
  name: string;
  contacts: Contact[];
  color: string;
  createdAt: Date;
}

// 최근 통화 기록
export interface RecentCall {
  id: string;
  contactId?: string;
  contactName?: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing" | "missed";
  startTime: Date;
  endTime?: Date;
  duration: number;
  riskLevel: number;
  isBlocked: boolean;
  isFavorite: boolean;
  transcript?: string;
  callQuality: "excellent" | "good" | "fair" | "poor";
}

// 키패드 입력 상태
export interface KeypadState {
  input: string;
  isCalling: boolean;
  isConnected: boolean;
  callDuration: number;
}

// 전화 앱 탭
export type PhoneTab = "contacts" | "recent" | "keypad" | "voice";

// 연락처 검색 필터
export interface ContactFilter {
  query: string;
  groupId?: string;
  isFavorite?: boolean;
  isBlocked?: boolean;
  tags?: string[];
}

// 통화 기록 필터
export interface RecentCallFilter {
  query: string;
  direction?: ("incoming" | "outgoing" | "missed")[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  riskLevel?: {
    min: number;
    max: number;
  };
  isBlocked?: boolean;
}

// 전화 앱 상태
export interface PhoneAppState {
  activeTab: PhoneTab;
  selectedContact?: Contact;
  isCalling: boolean;
  currentCall?: {
    phoneNumber: string;
    contactName?: string;
    startTime: Date;
    duration: number;
    riskLevel: number;
  };
  contacts: Contact[];
  recentCalls: RecentCall[];
  searchQuery: string;
  filters: ContactFilter | RecentCallFilter;
}

// 키패드 버튼 타입
export interface KeypadButton {
  value: string;
  letters?: string;
  type: "number" | "action" | "call";
  action?: "call" | "delete" | "clear" | "add_contact";
}

// 통화 액션
export type PhoneAction =
  | "make_call"
  | "end_call"
  | "add_contact"
  | "block_number"
  | "unblock_number"
  | "add_to_favorites"
  | "remove_from_favorites"
  | "delete_contact"
  | "edit_contact";

// 전화 이벤트
export interface PhoneEvent {
  type: PhoneAction;
  timestamp: Date;
  data?: any;
}

// 연락처 정렬 옵션
export type ContactSortOption =
  | "name_asc"
  | "name_desc"
  | "last_call_desc"
  | "call_count_desc"
  | "created_desc";

// 통화 기록 정렬 옵션
export type RecentCallSortOption =
  | "time_desc"
  | "time_asc"
  | "duration_desc"
  | "duration_asc"
  | "risk_level_desc"
  | "risk_level_asc";
