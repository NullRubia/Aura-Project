"use client";

import React, { useState, useRef, useEffect } from "react";
import type { ChatMessage, ChatResponse } from "@/types/chat.types";
import { chatService } from "@/services/api/chat";

interface ChatUIProps {
  className?: string;
}

export default function ChatUI({ className = "" }: ChatUIProps) {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const exampleQuestions: string[] = [
    "검찰이라며 안전계좌로 이체하라고 합니다. 어떻게 해야 하나요?",
    "보이스피싱의 일반적인 수법은 무엇인가요?",
    "고위험 통화로 판단되는 특징은 무엇인가요?",
    "개인정보 요구 전화를 받았을 때 대처 방법은?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: question.trim(),
      timestamp: new Date(),
    };

    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage({
        question: question.trim(),
        history: newHistory,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };

      setHistory([...newHistory, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setHistory([]);
    setError(null);
    setShowExamples(true);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 flex items-center justify-center h-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <span className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100">
          AURA CHAT
        </span>
      </div>
      {/* 메시지 영역 (헤더 제거, 중앙 인사) */}
      <div className="flex-1 overflow-y-auto bg-transparent pt-4 px-4">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-600 dark:text-primary-500 tracking-tight text-center px-6">
              안녕하세요!
            </h1>
          </div>
        )}
        {history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 shadow-sm"
                  }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.timestamp && (
                    <div
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-400 dark:text-gray-400"
                      }`}>
                      {message.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 shadow-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm">답변 생성 중...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* 예시 칩: 초기 화면 하단에 간단 노출 */}
      {history.length === 0 && (
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역: 캡슐형 바 */}
      <div className="p-4 mt-3">
        <div className="w-full max-w-2xl mx-auto flex items-center gap-2 rounded-2xl px-3 py-2 bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
          <button
            onClick={() => setShowExamples((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="예시 보기">
            +
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="질문을 입력하세요…"
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
            aria-label="전송">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
