import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { DocumentMetadata } from '../../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  loading: boolean;
  documents: DocumentMetadata[];
  selectedDocId: string | null;
  onSelectDocId: (docId: string | null) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onClearChat,
  onOpenUpload,
  onOpenSettings,
  loading,
  documents,
  selectedDocId,
  onSelectDocId
}) => {
  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-expand up to 140px
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const activeDocName = selectedDocId
    ? documents.find(d => d.id === selectedDocId)?.filename || 'Selected Document'
    : 'All Knowledge Base Documents';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      
      {/* Top Filter and Controls Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        
        {/* Document Scope Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-mono"
          >
            <FileText className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="truncate max-w-[180px] sm:max-w-[280px]">Scope: {activeDocName}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-72 bg-background-dark border border-slate-800 rounded-xl shadow-2xl p-1.5 space-y-1 z-30 animate-slide-up">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Filter Retrieval Scope
              </div>
              <button
                onClick={() => {
                  onSelectDocId(null);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  selectedDocId === null
                    ? 'bg-brand-blue/20 text-brand-cyan font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>All Documents ({documents.length})</span>
                {selectedDocId === null && <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
              </button>

              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    onSelectDocId(doc.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    selectedDocId === doc.id
                      ? 'bg-brand-blue/20 text-brand-cyan font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate max-w-[180px]" title={doc.filename}>{doc.filename}</span>
                  <span className="text-[10px] font-mono text-slate-500">{doc.chunk_count}c</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors font-mono text-[11px]"
            title="Configure RAG Hyperparameters"
          >
            <SlidersHorizontal className="w-3 h-3 text-brand-violet" />
            <span>RAG Tuning</span>
          </button>

          <button
            onClick={onClearChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors font-mono text-[11px]"
            title="Clear Chat Session"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Chat</span>
          </button>
        </div>

      </div>

      {/* Main Input Floating Container */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-brand-blue/30 via-slate-800 to-brand-violet/30 shadow-2xl focus-within:from-brand-blue focus-within:to-brand-cyan transition-all">
        <div className="bg-background-darkest/95 backdrop-blur-xl rounded-[15px] p-3 flex items-end gap-2">
          
          {/* Attach Document Button */}
          <button
            type="button"
            onClick={onOpenUpload}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-brand-cyan transition-colors border border-slate-800 shrink-0"
            title="Upload Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your documents... (e.g. 'Summarize the key findings in page 2')"
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none py-2 px-1 max-h-[140px] leading-relaxed selection:bg-brand-blue/30"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              input.trim() && !loading
                ? 'bg-gradient-to-r from-brand-blue to-brand-violet text-white shadow-glow-blue cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>
      </div>

      <div className="text-center text-[10px] font-mono text-slate-500">
        DocuMind AI verifies every response against ChromaDB vector embeddings. Citations link directly to document pages.
      </div>

    </div>
  );
};
