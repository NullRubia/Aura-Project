# Voice Guard - 실시간 보이스피싱 탐지 앱

AI 기반 실시간 통화 분석 시스템으로 보이스피싱 시도를 탐지하고 통화 중 즉시 경고를 제공합니다.

## 주요 기능

- **실시간 오디오 분석**: 고급 STT(음성-텍스트 변환) 기술을 사용한 통화 실시간 모니터링
- **AI 기반 위험 탐지**: 머신러닝 알고리즘으로 대화 패턴, 억양, 의심스러운 키워드 분석
- **즉시 경고**: 잠재적 피싱 시도 감지 시 즉각적인 경고
- **위험도 점수화**: 시각적 지표를 통한 동적 위험 평가
- **통화 요약**: 중요한 통화 내용의 AI 생성 요약
- **백그라운드 보호**: 앱이 백그라운드에 있어도 지속적인 모니터링
- **개인정보 우선**: 최대 개인정보 보호를 위한 로컬 오디오 처리 가능

## 아키텍처

### 프론트엔드 (React + TypeScript)

```
src/
├── components/          # UI 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── call/           # 통화 관련 컴포넌트
│   │   ├── CallInterface.tsx     # 메인 통화 화면
│   │   ├── RiskMeter.tsx         # 실시간 위험도 표시
│   │   ├── AlertPopup.tsx        # 경고 팝업
│   │   ├── CallControls.tsx      # 통화 제어 버튼
│   │   └── TranscriptDisplay.tsx # 실시간 텍스트 표시
│   ├── dashboard/      # 대시보드 컴포넌트
│   │   ├── CallHistory.tsx       # 통화 기록
│   │   ├── RiskAnalytics.tsx     # 위험도 분석
│   │   ├── StatCards.tsx         # 통계 카드
│   │   └── RecentAlerts.tsx      # 최근 경고
│   └── layout/         # 레이아웃 컴포넌트
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── hooks/              # 커스텀 React 훅
│   ├── useWebSocket.ts      # 웹소켓 연결 관리
│   ├── useAudioCapture.ts   # 마이크 오디오 캡처
│   ├── useCallSession.ts    # 통화 세션 관리
│   ├── useRealTimeRisk.ts   # 실시간 위험도 수신
│   └── useNotification.ts   # 브라우저 알림
├── services/           # API 및 외부 서비스
│   ├── api/            # REST API 호출
│   │   ├── callApi.ts       # 통화 관련 API
│   │   ├── riskApi.ts       # 위험도 분석 API
│   │   ├── authApi.ts       # 인증 API
│   │   └── reportApi.ts     # 신고 API
│   ├── websocket/      # 웹소켓 통신
│   │   ├── socketClient.ts  # 소켓 클라이언트
│   │   └── socketEvents.ts  # 이벤트 핸들러
│   └── audio/          # 오디오 처리
│       ├── audioCapture.ts  # 오디오 캡처
│       ├── audioStream.ts   # 스트리밍
│       └── audioUtils.ts    # 오디오 유틸리티
├── store/              # 상태 관리 (Zustand)
│   ├── callStore.ts         # 통화 상태
│   ├── riskStore.ts         # 위험도 상태
│   ├── authStore.ts         # 인증 상태
│   ├── settingsStore.ts     # 설정 상태
│   └── notificationStore.ts # 알림 상태
├── types/              # TypeScript 타입 정의
│   ├── api.types.ts         # API 응답 타입
│   ├── call.types.ts        # 통화 관련 타입
│   ├── risk.types.ts        # 위험도 관련 타입
│   ├── user.types.ts        # 사용자 타입
│   └── websocket.types.ts   # 웹소켓 타입
├── utils/              # 유틸리티 함수
│   ├── formatters.ts        # 데이터 포맷팅
│   ├── validators.ts        # 입력 검증
│   ├── constants.ts         # 상수 정의
│   ├── storage.ts           # 로컬 스토리지
│   └── dateUtils.ts         # 날짜 처리
├── pages/              # 페이지 컴포넌트
│   ├── Dashboard.tsx        # 메인 대시보드
│   ├── CallMonitor.tsx      # 실시간 통화 모니터링
│   ├── CallHistory.tsx      # 통화 기록 조회
│   ├── Settings.tsx         # 설정 페이지
│   ├── Login.tsx            # 로그인
│   └── Reports.tsx          # 신고 관리
├── styles/             # 스타일 파일
│   ├── globals.css          # 전역 스타일
│   ├── components.css       # 컴포넌트 스타일
│   └── variables.css        # CSS 변수
└── config/             # 설정 파일
    ├── api.config.ts        # API 엔드포인트 설정
    ├── websocket.config.ts  # 웹소켓 설정
    └── env.ts               # 환경 변수
```

### 백엔드 (Python - 별도 저장소)

- AI 모델 추론을 위한 FastAPI 서버
- 실시간 통신을 위한 WebSocket 연결
- 오디오 처리 및 분석 파이프라인
- 위험 탐지를 위한 머신러닝 모델

## 기술 스택

### 프론트엔드

- **React 18** with **TypeScript**
- **Next.js** (App Router)
- **Tailwind CSS** 스타일링
- **Zustand** 상태 관리
- **Socket.io** 실시간 통신
- **Web Audio API** 오디오 캡처
- **Capacitor** 모바일 앱 배포

### AI 및 오디오 처리

- **Web Speech API** 기본 STT
- **TensorFlow.js** 클라이언트 사이드 AI 추론
- **WebRTC** 오디오 스트리밍
- 외부 AI 서비스 통합 (OpenAI, Anthropic)

## 배포 옵션

### 웹 애플리케이션 (PWA)

- 오프라인 기능을 갖춘 프로그레시브 웹 앱
- 모바일 및 데스크톱에 설치 가능
- 경고를 위한 푸시 알림

### 모바일 애플리케이션

- **iOS & Android** Capacitor를 통한 배포
- 웹 기술로 네이티브 성능 구현
- 디바이스 마이크 및 알림 접근
- 백그라운드 처리 기능

### 데스크톱 애플리케이션

- **Electron** Windows, macOS, Linux용 래퍼
- 시스템 트레이 통합
- 상시 보호 기능

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- 마이크 접근이 가능한 최신 웹 브라우저

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/yourusername/voice-guard-frontend.git
cd voice-guard-frontend
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**

- env.example을 본인의 환경에 맞게 변경 필요

```bash
cp env.example .env.local
# API 키와 백엔드 URL로 .env.local 편집
```

4. **개발 서버 시작**

```bash
npm run dev
```

5. **브라우저에서 열기**

```
http://localhost:3000
```

### 환경 변수

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

## 프로덕션 빌드

### 웹 빌드

```bash
npm run build
npm run start
```

### 모바일 앱 (Capacitor)

```bash
# 웹 에셋 빌드
npm run build

# 모바일 플랫폼 추가
npx cap add ios
npx cap add android

# 웹 에셋을 네이티브 프로젝트에 복사
npx cap copy

# 네이티브 IDE에서 열기
npx cap open ios     # Xcode 열기
npx cap open android # Android Studio 열기
```

### 데스크톱 앱 (Electron)

```bash
npm run electron:build
```

## 개발

### 프로젝트 구조

- `/src/components` - 재사용 가능한 UI 컴포넌트
- `/src/hooks` - 오디오, WebSocket 등을 위한 커스텀 React 훅
- `/src/services` - API 클라이언트 및 외부 서비스 통합
- `/src/store` - 전역 상태 관리
- `/src/types` - TypeScript 타입 정의
- `/src/utils` - 헬퍼 함수 및 유틸리티

### 주요 컴포넌트

- **CallInterface**: 메인 실시간 모니터링 인터페이스
- **RiskMeter**: 시각적 위험 수준 표시기
- **AlertPopup**: 긴급 경고 시스템
- **CallHistory**: 과거 통화 분석
- **Dashboard**: 개요 및 분석

## 개인정보 보호 및 보안

- **로컬 처리**: 오디오를 완전히 디바이스에서 처리 가능
- **암호화된 통신**: 모든 데이터 전송이 암호화됨
- **오디오 저장 없음**: 오디오 데이터는 실시간으로 처리되며 저장되지 않음
- **사용자 동의**: 마이크 접근을 위한 명시적 허가 필요
- **규정 준수**: 개인정보 보호 규정을 고려한 설계

## 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 로드맵

- [ ] 다국어 지원
- [ ] 고급 AI 모델 통합
- [ ] 음성 패턴 학습
- [ ] 전화 시스템과의 통합
- [ ] 기업용 대시보드
- [ ] 서드파티 통합을 위한 API

---
