import type { LanguageCode } from '@/core/apiConfig';
import { apiClient } from '@/services/api/apiClient';

export type ChatStatus = 'success' | 'insufficient_evidence' | 'service_unavailable' | 'validation_error' | 'timeout' | 'unauthorized';

export interface ChatRequest {
  message: string;
  language: LanguageCode;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface ChatAnswer {
  text: string;
  language: LanguageCode | string;
}

export interface ChatCitation {
  id: string;
  title: string;
  documentId?: string | null;
  page?: number | null;
  section?: string | null;
  url?: string | null;
  verified: boolean;
}

export interface ChatResponse {
  requestId: string;
  sessionId?: string;
  status: ChatStatus;
  intent: string;
  answer: ChatAnswer;
  citations: ChatCitation[];
  context: Record<string, unknown>[];
  evidence?: Record<string, unknown>[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ChatSession {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

class HttpChatService {
  /**
   * Send a chat message to the Primary Server.
   * POST /api/v1/chat
   */
  public async ask(request: ChatRequest): Promise<ChatResponse> {
    const res = await apiClient.post<ApiEnvelope<ChatResponse>>('/chat', request);
    return res.data;
  }

  /**
   * Fetch all sessions for the authenticated user.
   * GET /api/v1/sessions
   */
  public async getSessions(): Promise<ChatSession[]> {
    const res = await apiClient.get<ApiEnvelope<ChatSession[]>>('/sessions');
    return res.data;
  }

  /**
   * Fetch messages for a specific session.
   * GET /api/v1/sessions/:id/messages
   * 
   * Backend returns { data: { messages: [...] } }, so we unwrap .messages here.
   */
  public async getSessionHistory(sessionId: string): Promise<ChatMessage[]> {
    const res = await apiClient.get<ApiEnvelope<{ messages: ChatMessage[] }>>(`/sessions/${sessionId}/messages`);
    return res.data.messages;
  }
}

export const chatService = new HttpChatService();