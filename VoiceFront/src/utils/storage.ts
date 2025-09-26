// 파일 설명: 로컬/세션/쿠키/인덱스드DB 래퍼 및 통합 스토리지 유틸
// 로컬 스토리지 유틸리티
export const localStorage = {
  // 값 저장
  setItem: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  },

  // 값 가져오기
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('로컬 스토리지 읽기 실패:', error);
      return defaultValue || null;
    }
  },

  // 값 삭제
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지 삭제 실패:', error);
    }
  },

  // 모든 값 삭제
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('로컬 스토리지 초기화 실패:', error);
    }
  },

  // 키 존재 여부 확인
  hasItem: (key: string): boolean => {
    return window.localStorage.getItem(key) !== null;
  },

  // 모든 키 가져오기
  getAllKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  },

  // 스토리지 사용량 확인 (대략적)
  getStorageSize: (): number => {
    let total = 0;
    for (let key in window.localStorage) {
      if (window.localStorage.hasOwnProperty(key)) {
        total += window.localStorage[key].length + key.length;
      }
    }
    return total;
  },
};

// 세션 스토리지 유틸리티
export const sessionStorage = {
  // 값 저장
  setItem: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('세션 스토리지 저장 실패:', error);
    }
  },

  // 값 가져오기
  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('세션 스토리지 읽기 실패:', error);
      return defaultValue || null;
    }
  },

  // 값 삭제
  removeItem: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('세션 스토리지 삭제 실패:', error);
    }
  },

  // 모든 값 삭제
  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('세션 스토리지 초기화 실패:', error);
    }
  },

  // 키 존재 여부 확인
  hasItem: (key: string): boolean => {
    return window.sessionStorage.getItem(key) !== null;
  },
};

// 쿠키 유틸리티
export const cookies = {
  // 쿠키 설정
  setItem: (name: string, value: string, options: {
    expires?: Date;
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    httpOnly?: boolean;
  } = {}): void => {
    let cookieString = `${name}=${encodeURIComponent(value)}`;

    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }

    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    if (options.httpOnly) {
      // httpOnly는 JavaScript에서 설정할 수 없음 (서버에서만 설정 가능)
      console.warn('httpOnly 쿠키는 서버에서만 설정할 수 있습니다');
    }

    document.cookie = cookieString;
  },

  // 쿠키 가져오기
  getItem: (name: string): string | null => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  // 쿠키 삭제
  removeItem: (name: string, options: {
    path?: string;
    domain?: string;
  } = {}): void => {
    cookies.setItem(name, '', {
      ...options,
      expires: new Date(0),
    });
  },

  // 모든 쿠키 가져오기
  getAll: (): Record<string, string> => {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');
    
    for (let cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    }
    
    return cookies;
  },
};

// 인덱스드DB 유틸리티 (향후 확장용)
export const indexedDB = {
  // 데이터베이스 열기
  open: (name: string, version: number): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(name, version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // 스키마 업그레이드 로직
      };
    });
  },

  // 데이터 저장
  save: async (db: IDBDatabase, storeName: string, data: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  // 데이터 가져오기
  get: async (db: IDBDatabase, storeName: string, key: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // 데이터 삭제
  delete: async (db: IDBDatabase, storeName: string, key: any): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },
};

// 스토리지 타입 정의
export type StorageType = 'localStorage' | 'sessionStorage' | 'cookies' | 'indexedDB';

// 통합 스토리지 인터페이스
export interface StorageInterface {
  setItem: <T>(key: string, value: T, options?: any) => void;
  getItem: <T>(key: string, defaultValue?: T) => T | null;
  removeItem: (key: string, options?: any) => void;
  clear: () => void;
  hasItem: (key: string) => boolean;
}

// 스토리지 팩토리
export const createStorage = (type: StorageType): StorageInterface => {
  switch (type) {
    case 'localStorage':
      return localStorage;
    case 'sessionStorage':
      return sessionStorage;
    case 'cookies':
      return {
        setItem: (key: string, value: any, options?: any) => {
          cookies.setItem(key, JSON.stringify(value), options);
        },
        getItem: <T>(key: string, defaultValue?: T): T | null => {
          const item = cookies.getItem(key);
          if (item === null) {
            return defaultValue || null;
          }
          try {
            return JSON.parse(item);
          } catch {
            return item as T;
          }
        },
        removeItem: (key: string, options?: any) => {
          cookies.removeItem(key, options);
        },
        clear: () => {
          const allCookies = cookies.getAll();
          Object.keys(allCookies).forEach(key => {
            cookies.removeItem(key);
          });
        },
        hasItem: (key: string) => {
          return cookies.getItem(key) !== null;
        },
      };
    default:
      throw new Error(`지원하지 않는 스토리지 타입: ${type}`);
  }
};

// 기본 스토리지 인스턴스
export const defaultStorage = createStorage('localStorage');
export const sessionStorageInstance = createStorage('sessionStorage');
export const cookieStorage = createStorage('cookies');
