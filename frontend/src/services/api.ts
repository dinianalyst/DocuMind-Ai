import {
  DocumentMetadata,
  DocumentResponse,
  DocumentListResponse,
  DocumentChunksResponse,
  ChatRequest,
  ChatResponse,
  ChatMessage,
  SearchResponse,
  SystemConfigResponse,
  SystemConfigUpdateRequest,
  HealthResponse
} from '../types';

const API_BASE = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.detail) {
            errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch {
          // ignore json parse error on non-json error responses
        }
        throw new Error(errorMsg);
      }

      return await response.json() as T;
    } catch (err: any) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  }

  // Health & Config
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async getConfig(): Promise<SystemConfigResponse> {
    return this.request<SystemConfigResponse>('/config');
  }

  async updateConfig(data: SystemConfigUpdateRequest): Promise<SystemConfigResponse> {
    return this.request<SystemConfigResponse>('/config', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Documents
  async getDocuments(): Promise<DocumentListResponse> {
    return this.request<DocumentListResponse>('/documents');
  }

  async getDocument(id: string): Promise<DocumentResponse> {
    return this.request<DocumentResponse>(`/documents/${id}`);
  }

  async uploadDocument(file: File): Promise<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      let errorMsg = `Upload failed (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.detail) {
          errorMsg = errorData.detail;
        }
      } catch {}
      throw new Error(errorMsg);
    }

    return await response.json() as DocumentResponse;
  }

  async deleteDocument(id: string): Promise<{ message: string; document_id: string }> {
    return this.request<{ message: string; document_id: string }>(`/documents/${id}`, {
      method: 'DELETE'
    });
  }

  async reprocessDocument(id: string): Promise<DocumentResponse> {
    return this.request<DocumentResponse>(`/documents/${id}/reprocess`, {
      method: 'POST'
    });
  }

  async getDocumentChunks(id: string): Promise<DocumentChunksResponse> {
    return this.request<DocumentChunksResponse>(`/documents/${id}/chunks`);
  }

  // Chat & Retrieval
  async sendChat(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async getChatHistory(sessionId: string = 'default'): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>(`/chat/history?session_id=${encodeURIComponent(sessionId)}`);
  }

  async clearChatHistory(sessionId: string = 'default'): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/chat/history?session_id=${encodeURIComponent(sessionId)}`, {
      method: 'DELETE'
    });
  }

  async semanticSearch(query: string, topK: number = 5, documentIds?: string[]): Promise<SearchResponse> {
    return this.request<SearchResponse>('/rag/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        top_k: topK,
        document_ids: documentIds
      })
    });
  }
}

export const api = new ApiService();
