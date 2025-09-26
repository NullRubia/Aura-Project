// 파일 설명: 위험도 도메인(분석/요인/통계) 관련 타입 정의 모음
// 위험도 레벨 타입
export type RiskLevel = 'safe' | 'warning' | 'danger' | 'critical';

// 위험도 점수 (0-100)
export type RiskScore = number;

// 위험도 임계값
export interface RiskThresholds {
  warning: number;   // 30
  danger: number;    // 60
  critical: number;  // 80
}

// 위험도 분석 결과
export interface RiskAnalysis {
  callId: string;
  riskScore: RiskScore;
  riskLevel: RiskLevel;
  confidence: number;
  factors: RiskFactor[];
  timestamp: Date;
  duration: number;
}

// 위험 요인
export interface RiskFactor {
  id: string;
  type: RiskFactorType;
  score: number;
  confidence: number;
  description: string;
  keywords?: string[];
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 위험 요인 타입
export type RiskFactorType = 
  | 'keyword'           // 의심 키워드
  | 'tone'              // 음성 톤
  | 'pattern'           // 대화 패턴
  | 'context'           // 맥락 분석
  | 'urgency'           // 긴급성
  | 'authority'         // 권위 주장
  | 'fear'              // 공포 유발
  | 'greed'             // 탐욕 유발
  | 'social_engineering' // 사회공학
  | 'technical'         // 기술적 위험
  | 'behavioral';       // 행동 패턴

// 키워드 기반 위험 요인
export interface KeywordRiskFactor extends RiskFactor {
  type: 'keyword';
  keywords: string[];
  matchedText: string;
  position: number;
  context: string;
}

// 톤 기반 위험 요인
export interface ToneRiskFactor extends RiskFactor {
  type: 'tone';
  toneType: 'aggressive' | 'urgent' | 'authoritative' | 'manipulative';
  intensity: number;
  duration: number;
  frequency: number;
}

// 패턴 기반 위험 요인
export interface PatternRiskFactor extends RiskFactor {
  type: 'pattern';
  patternType: 'repetitive' | 'escalating' | 'contradictory' | 'evasive';
  occurrences: number;
  timeSpan: number;
  examples: string[];
}

// 위험도 분석 설정
export interface RiskAnalysisConfig {
  enabled: boolean;
  realTime: boolean;
  batchSize: number;
  updateInterval: number;
  thresholds: RiskThresholds;
  factorWeights: Record<RiskFactorType, number>;
  keywordLists: KeywordList[];
  toneModels: ToneModel[];
  patternRules: PatternRule[];
}

// 키워드 목록
export interface KeywordList {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  weight: number;
  enabled: boolean;
  description: string;
}

// 톤 모델
export interface ToneModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  enabled: boolean;
  description: string;
}

// 패턴 규칙
export interface PatternRule {
  id: string;
  name: string;
  pattern: string;
  weight: number;
  enabled: boolean;
  description: string;
}

// 위험도 경고
export interface RiskAlert {
  id: string;
  callId: string;
  riskLevel: RiskLevel;
  riskScore: RiskScore;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isDismissed: boolean;
  actions: RiskAlertAction[];
  factors: RiskFactor[];
}

// 위험도 경고 액션
export interface RiskAlertAction {
  id: string;
  label: string;
  action: 'mute' | 'block' | 'report' | 'ignore' | 'dismiss';
  style: 'primary' | 'secondary' | 'danger' | 'warning';
  enabled: boolean;
}

// 위험도 통계
export interface RiskStatistics {
  totalAnalyses: number;
  averageRiskScore: number;
  riskDistribution: RiskDistribution;
  factorFrequency: FactorFrequency[];
  timeSeries: RiskTimeSeries[];
  topRisks: TopRisk[];
}

// 위험도 분포
export interface RiskDistribution {
  safe: number;
  warning: number;
  danger: number;
  critical: number;
}

// 요인 빈도
export interface FactorFrequency {
  factorType: RiskFactorType;
  count: number;
  percentage: number;
  averageScore: number;
}

// 위험도 시계열
export interface RiskTimeSeries {
  timestamp: Date;
  riskScore: RiskScore;
  callCount: number;
  highRiskCount: number;
}

// 상위 위험
export interface TopRisk {
  factorType: RiskFactorType;
  count: number;
  averageScore: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// 위험도 학습 데이터
export interface RiskTrainingData {
  id: string;
  callId: string;
  transcript: string;
  audioFeatures: AudioFeatures;
  riskScore: RiskScore;
  factors: RiskFactor[];
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

// 오디오 특징
export interface AudioFeatures {
  pitch: number[];
  volume: number[];
  tempo: number;
  rhythm: number[];
  spectralCentroid: number[];
  mfcc: number[][];
  zeroCrossingRate: number[];
  energy: number[];
}

// 위험도 모델 성능
export interface RiskModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocAuc: number;
  lastUpdated: Date;
  version: string;
}

// 위험도 분석 히스토리
export interface RiskAnalysisHistory {
  id: string;
  callId: string;
  analyses: RiskAnalysis[];
  finalScore: RiskScore;
  finalLevel: RiskLevel;
  createdAt: Date;
  updatedAt: Date;
}
