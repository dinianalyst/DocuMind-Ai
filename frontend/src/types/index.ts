export interface DocumentMetadata {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  page_count: number;
  chunk_count: number;
  char_count: number;
  upload_timestamp: string;
  status: 'processing' | 'processed' | 'failed';
  error_message?: string;
  file_path?: string;
}

export interface DocumentResponse {
  document: DocumentMetadata;
  message: string;
}

export interface DocumentListResponse {
  documents: DocumentMetadata[];
  total_count: number;
  total_chunks: number;
}

export interface ChunkMetadata {
  id: string;
  document_id: string;
  filename: string;
  page_number: number;
  chunk_index: number;
  char_count: number;
  text: string;
  preview: string;
}

export interface DocumentChunksResponse {
  document_id: string;
  filename: string;
  total_chunks: number;
  chunks: ChunkMetadata[];
}

export interface SourceCitation {
  chunk_id: string;
  document_id: string;
  filename: string;
  page_number: number;
  chunk_index: number;
  similarity_score: number;
  text_snippet: string;
  full_text?: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  citations?: SourceCitation[];
}

export interface ChatRequest {
  question: string;
  session_id?: string;
  document_ids?: string[];
  top_k?: number;
  similarity_threshold?: number;
  chat_history?: { role: string; content: string }[];
  use_stream?: boolean;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  citations: SourceCitation[];
  retrieval_stats: {
    query: string;
    chunks_retrieved: number;
    top_k: number;
    similarity_threshold: number;
    highest_similarity: number;
    document_filter: string | string[];
  };
  llm_model: string;
  timestamp: string;
}

export interface SearchQueryResult {
  chunk_id: string;
  document_id: string;
  filename: string;
  page_number: number;
  chunk_index: number;
  similarity_score: number;
  text: string;
}

export interface SearchResponse {
  query: string;
  total_matches: number;
  results: SearchQueryResult[];
}

export interface SystemConfigResponse {
  project_name: string;
  version: string;
  model_name: string;
  embedding_model: string;
  has_api_key: boolean;
  top_k: number;
  chunk_size: number;
  chunk_overlap: number;
  similarity_threshold: number;
  total_documents: number;
  total_chunks: number;
}

export interface SystemConfigUpdateRequest {
  openai_api_key?: string;
  openai_base_url?: string;
  model_name?: string;
  top_k?: number;
  chunk_size?: number;
  chunk_overlap?: number;
  similarity_threshold?: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  vector_store_status: string;
  documents_indexed: number;
  total_vectors: number;
}

export type AppView = 'landing' | 'app';
export type AppTab = 'chat' | 'documents' | 'architecture' | 'settings';
