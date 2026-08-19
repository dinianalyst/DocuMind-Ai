import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, SourceCitation, DocumentMetadata } from '../../types';
import { api } from '../../services/api';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { CitationDrawer } from '../citations/CitationDrawer';

interface ChatViewProps {
  documents: DocumentMetadata[];
  onOpenUpload: () => void;
  onOpenSettings: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  documents,
  onOpenUpload,
  onOpenSettings
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp };
    
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const docIds = selectedDocId ? [selectedDocId] : undefined;
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await api.sendChat({
        question: text,
        document_ids: docIds,
        chat_history: historyPayload
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: res.citations
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: `⚠️ **Error communicating with RAG backend**: ${err.message || 'Unknown network error'}.\n\nPlease ensure the FastAPI server is running on \`http://127.0.0.1:8000\`.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChatHistory();
      setMessages([]);
    } catch (err) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] max-w-5xl mx-auto relative">
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        <ChatMessages
          messages={messages}
          loading={loading}
          onSelectCitation={(cit) => setSelectedCitation(cit)}
          onRegenerate={(q) => handleSendMessage(q)}
          onQuickPrompt={(p) => handleSendMessage(p)}
        />
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="pt-3 pb-2 px-4 bg-gradient-to-t from-background-darkest via-background-darkest/95 to-transparent">
        <ChatInput
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onOpenUpload={onOpenUpload}
          onOpenSettings={onOpenSettings}
          loading={loading}
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDocId={setSelectedDocId}
        />
      </div>

      {/* Citation Deep-Dive Drawer */}
      {selectedCitation && (
        <CitationDrawer
          citation={selectedCitation}
          onClose={() => setSelectedCitation(null)}
        />
      )}

    </div>
  );
};
