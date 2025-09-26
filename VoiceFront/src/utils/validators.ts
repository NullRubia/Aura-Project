// 파일 설명: 이메일/전화/비밀번호/파일 등 다양한 유효성 검사 유틸 함수 모음
// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 유효성 검사 (한국)
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  // 010, 011, 016, 017, 018, 019로 시작하는 11자리 또는 10자리
  const phoneRegex = /^(010|011|016|017|018|019)\d{7,8}$/;
  return phoneRegex.test(cleaned);
};

// 비밀번호 강도 검사
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('비밀번호는 최소 8자 이상이어야 합니다');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('소문자를 포함해야 합니다');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('대문자를 포함해야 합니다');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    feedback.push('숫자를 포함해야 합니다');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('특수문자를 포함해야 합니다');
  } else {
    score += 1;
  }

  if (password.length >= 12) {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

// URL 유효성 검사
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 한국 주민등록번호 유효성 검사
export const isValidKoreanSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length !== 13) return false;

  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }

  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  const finalCheckDigit = checkDigit >= 10 ? checkDigit - 10 : checkDigit;

  return finalCheckDigit === parseInt(cleaned[12]);
};

// 신용카드 번호 유효성 검사 (Luhn 알고리즘)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// 한국 은행 계좌번호 유효성 검사
export const isValidKoreanBankAccount = (accountNumber: string): boolean => {
  const cleaned = accountNumber.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 20;
};

// 날짜 유효성 검사
export const isValidDate = (date: string | Date): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d instanceof Date && !isNaN(d.getTime());
};

// 나이 유효성 검사
export const isValidAge = (age: number): boolean => {
  return age >= 0 && age <= 150;
};

// 위험도 점수 유효성 검사
export const isValidRiskScore = (score: number): boolean => {
  return score >= 0 && score <= 100;
};

// 파일 크기 유효성 검사
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// 파일 타입 유효성 검사
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// 이미지 파일 유효성 검사
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return isValidFileType(file, allowedTypes);
};

// 오디오 파일 유효성 검사
export const isValidAudioFile = (file: File): boolean => {
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
  return isValidFileType(file, allowedTypes);
};

// 비디오 파일 유효성 검사
export const isValidVideoFile = (file: File): boolean => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'];
  return isValidFileType(file, allowedTypes);
};

// JSON 문자열 유효성 검사
export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

// IP 주소 유효성 검사
export const isValidIPAddress = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// 포트 번호 유효성 검사
export const isValidPort = (port: number): boolean => {
  return port >= 1 && port <= 65535;
};

// 사용자명 유효성 검사
export const isValidUsername = (username: string): boolean => {
  // 3-20자, 영문자, 숫자, 언더스코어, 하이픈만 허용
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// 한국어 이름 유효성 검사
export const isValidKoreanName = (name: string): boolean => {
  // 2-10자, 한글만 허용
  const koreanNameRegex = /^[가-힣]{2,10}$/;
  return koreanNameRegex.test(name);
};

// 비밀번호 확인 검사
export const validatePasswordConfirmation = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

// 필수 필드 검사
export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

// 최소 길이 검사
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

// 최대 길이 검사
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// 숫자 범위 검사
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// 정규식 검사
export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// 복합 검사 함수
export const validateField = (value: any, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (rules.required && !validateRequired(value)) {
    errors.push('필수 입력 항목입니다');
  }

  if (typeof value === 'string') {
    if (rules.minLength && !validateMinLength(value, rules.minLength)) {
      errors.push(`최소 ${rules.minLength}자 이상 입력해주세요`);
    }

    if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
      errors.push(`최대 ${rules.maxLength}자까지 입력 가능합니다`);
    }

    if (rules.pattern && !validatePattern(value, rules.pattern)) {
      errors.push('올바른 형식이 아닙니다');
    }
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push('유효하지 않은 값입니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
