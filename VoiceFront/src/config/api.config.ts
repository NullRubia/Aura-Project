/* 파일 설명: REST API 엔드포인트 및 기본 설정을 정의한 구성 파일. */
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
    calls: {
      list: '/calls',
      create: '/calls',
      get: (id: string) => `/calls/${id}`,
      update: (id: string) => `/calls/${id}`,
      delete: (id: string) => `/calls/${id}`,
      start: '/calls/start',
      end: '/calls/end',
      transcript: (id: string) => `/calls/${id}/transcript`,
    },
    risk: {
      analyze: '/risk/analyze',
      history: '/risk/history',
      settings: '/risk/settings',
    },
    reports: {
      list: '/reports',
      create: '/reports',
      get: (id: string) => `/reports/${id}`,
      update: (id: string) => `/reports/${id}`,
      delete: (id: string) => `/reports/${id}`,
    },
    settings: {
      user: '/settings/user',
      app: '/settings/app',
      notifications: '/settings/notifications',
    },
  },
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export default API_CONFIG;
