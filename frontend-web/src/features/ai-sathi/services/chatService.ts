import type { LanguageCode } from '@/core/apiConfig';
import { apiClient } from '@/services/api/apiClient';

export type ChatStatus = 'success' | 'insufficient_evidence' | 'service_unavailable' | 'validation_error' | 'timeout' | 'unauthorized';

export interface ChatRequest {
  message: string;
  language: LanguageCode;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  answer: string;
  citations: Array<{ title: string; url?: string; page?: string }>;
  intent: string;
  requestId: string;
  status: ChatStatus;
}

export interface ChatService {
  ask(request: ChatRequest): Promise<ChatResponse>;
}

const mockChatService: ChatService = {
  async ask({ message, language }) {
    return {
      answer: message,
      citations: [],
      intent: 'GENERAL',
      requestId: `mock-${Date.now()}`,
      status: language ? 'success' : 'validation_error',
    };
  },
};

const backendChatService: ChatService = {
  ask: request => apiClient.post<ChatResponse>('/chat', request),
};

export const chatService: ChatService = import.meta.env.VITE_API_BASE_URL
  ? backendChatService
  : mockChatService;