export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  answer: string;
  sources: Array<{
    source: string;
    title?: string;
    url?: string;
  }>;
  confidence?: number;
}

export interface ChatRequest {
  question: string;
  history: ChatMessage[];
  context?: string;
}

export interface ChatConfig {
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-sonnet' | 'claude-3-haiku';
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
