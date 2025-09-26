import type {
  ChatMessage,
  ChatResponse,
  ChatRequest,
  ChatConfig,
} from "@/types/chat.types";

const AI_BASE_URL =
  process.env.NEXT_PUBLIC_AI_SERVER_URL || "http://localhost:8000";

export class ChatService {
  private static instance: ChatService;
  private config: ChatConfig;

  constructor() {
    this.config = {
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: `당신은 보이스피싱 방지를 위한 전문 AI 어시스턴트입니다. 
사용자에게 보이스피싱의 위험성과 대응 방법에 대해 정확하고 도움이 되는 정보를 제공해주세요.
한국어로 친근하고 이해하기 쉽게 설명해주세요.`,
    };
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${AI_BASE_URL}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization 헤더는 백엔드에서 사용하지 않지만 남겨둡니다
          Authorization: `Bearer ${
            process.env.NEXT_PUBLIC_API_TOKEN || "devtoken"
          }`,
        },
        body: JSON.stringify({
          // 백엔드 스키마에 맞춰 필드 매핑
          query: request.question,
          history: request.history,
          use_rag: true,
          token: process.env.NEXT_PUBLIC_API_TOKEN || "devtoken",
        }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("챗봇 API 오류:", error);
      throw new Error(
        "챗봇 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  async sendMessageWithOpenAI(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${AI_BASE_URL}/api/chat/openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({
          ...request,
          config: this.config,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("OpenAI API 오류:", error);
      throw new Error(
        "OpenAI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  async sendMessageWithAnthropic(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${AI_BASE_URL}/api/chat/anthropic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({
          ...request,
          config: this.config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Anthropic API 오류:", error);
      throw new Error(
        "Anthropic 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }

  updateConfig(newConfig: Partial<ChatConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ChatConfig {
    return { ...this.config };
  }
}

export const chatService = ChatService.getInstance();
