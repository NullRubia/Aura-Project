// 파일 설명: 날짜/시간 계산 및 포맷팅 관련 유틸리티 함수 모음
// 날짜 유틸리티 함수들

// 현재 날짜/시간 가져오기
export const now = (): Date => new Date();

// 오늘 날짜 (시간 제외)
export const today = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

// 어제 날짜
export const yesterday = (): Date => {
  const date = today();
  date.setDate(date.getDate() - 1);
  return date;
};

// 내일 날짜
export const tomorrow = (): Date => {
  const date = today();
  date.setDate(date.getDate() + 1);
  return date;
};

// 주 시작일 (월요일)
export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 월요일부터 시작
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 주 종료일 (일요일)
export const getWeekEnd = (date: Date = new Date()): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

// 월 시작일
export const getMonthStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 월 종료일
export const getMonthEnd = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
};

// 년 시작일
export const getYearStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

// 년 종료일
export const getYearEnd = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setMonth(11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
};

// 날짜 포맷팅
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

// 상대적 시간 포맷팅
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
};

// 날짜 차이 계산 (일 단위)
export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 날짜 차이 계산 (시간 단위)
export const getHoursDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

// 날짜 차이 계산 (분 단위)
export const getMinutesDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60));
};

// 날짜 더하기
export const addDays = (date: Date | string, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const addHours = (date: Date | string, hours: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

export const addMinutes = (date: Date | string, minutes: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
};

export const addMonths = (date: Date | string, months: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const addYears = (date: Date | string, years: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

// 날짜 빼기
export const subtractDays = (date: Date | string, days: number): Date => {
  return addDays(date, -days);
};

export const subtractHours = (date: Date | string, hours: number): Date => {
  return addHours(date, -hours);
};

export const subtractMinutes = (date: Date | string, minutes: number): Date => {
  return addMinutes(date, -minutes);
};

export const subtractMonths = (date: Date | string, months: number): Date => {
  return addMonths(date, -months);
};

export const subtractYears = (date: Date | string, years: number): Date => {
  return addYears(date, -years);
};

// 날짜 비교
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isSameMonth = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth();
};

export const isSameYear = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return d1.getFullYear() === d2.getFullYear();
};

// 날짜가 범위 내에 있는지 확인
export const isDateInRange = (date: Date | string, startDate: Date | string, endDate: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return d >= start && d <= end;
};

// 날짜가 오늘인지 확인
export const isToday = (date: Date | string): boolean => {
  return isSameDay(date, new Date());
};

// 날짜가 어제인지 확인
export const isYesterday = (date: Date | string): boolean => {
  return isSameDay(date, yesterday());
};

// 날짜가 내일인지 확인
export const isTomorrow = (date: Date | string): boolean => {
  return isSameDay(date, tomorrow());
};

// 주말인지 확인
export const isWeekend = (date: Date | string = new Date()): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDay();
  return day === 0 || day === 6; // 일요일(0) 또는 토요일(6)
};

// 평일인지 확인
export const isWeekday = (date: Date | string = new Date()): boolean => {
  return !isWeekend(date);
};

// 시간대 변환
export const convertTimezone = (date: Date | string, timezone: string): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.toLocaleString('en-US', { timeZone: timezone }));
};

// UTC로 변환
export const toUTC = (date: Date | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
};

// 로컬 시간으로 변환
export const toLocal = (date: Date | string): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
};

// 날짜 범위 생성
export const createDateRange = (startDate: Date | string, endDate: Date | string): Date[] => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const dates: Date[] = [];
  
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
};

// 주차 계산
export const getWeekNumber = (date: Date | string = new Date()): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// 분기 계산
export const getQuarter = (date: Date | string = new Date()): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor(d.getMonth() / 3) + 1;
};

// 나이 계산
export const calculateAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// 시간 포맷팅 (HH:MM:SS)
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDate(d, 'HH:mm:ss');
};

// 날짜만 포맷팅 (YYYY-MM-DD)
export const formatDateOnly = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDate(d, 'YYYY-MM-DD');
};

// 한국어 날짜 포맷팅
export const formatKoreanDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};
