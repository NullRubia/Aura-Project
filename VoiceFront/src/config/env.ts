/* 파일 설명: 클라이언트에서 사용하는 환경 변수 타입과 로더/검증 유틸. */
interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_WS_URL: string;
  NEXT_PUBLIC_OPENAI_API_KEY?: string;
  NEXT_PUBLIC_ANTHROPIC_API_KEY?: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_VERSION: string;
}

const env: Environment = {
  NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || 'development',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws',
  NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Voice Guard',
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
};

// 환경 변수 검증
const validateEnv = () => {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_WS_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // 개발 환경에서만 API 키 검증
  if (env.NODE_ENV === 'development') {
    if (!env.NEXT_PUBLIC_OPENAI_API_KEY) {
      console.warn('NEXT_PUBLIC_OPENAI_API_KEY is not set. AI features may not work properly.');
    }
    if (!env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
      console.warn('NEXT_PUBLIC_ANTHROPIC_API_KEY is not set. AI features may not work properly.');
    }
  }
};

// 환경 변수 검증 실행
validateEnv();

export default env;
