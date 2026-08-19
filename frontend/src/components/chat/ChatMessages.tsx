import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, SourceCitation } from '../../types';
import { CitationBadge } from '../citations/CitationBadge';

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading: boolean;
  onSelectCitation: (citation: SourceCitation) => void;
  onRegenerate?: (lastQuestion: string) => void;
  onQuickPrompt: (prompt: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  onSelectCitation,
  onRegenerate,
  onQuickPrompt
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ [key: number]: 'up' | 'down' }>({});

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [index]: prev[index] === type ? undefined! : type
    }));
  };

  const quickPrompts = [
    { title: 'Optimal RAG Chunking', prompt: 'What is the optimal chunk size and overlap for RAG according to the handbook?' },
    { title: 'ML Performance Latency', prompt: 'What are the performance latency benchmarks and token savings in the ML report?' },
    { title: 'Quantum Algorithms', prompt: 'Which hybrid quantum-classical algorithms are described in the quantum foundations document?' },
    { title: 'Anti-Hallucination Guardrails', prompt: 'Explain the techniques used to mitigate hallucinations in RAG systems.' }
  ];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-indigo to-brand-violet p-[1px] shadow-glow-blue">
          <div className="w-full h-full bg-background-darkest rounded-[15px] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-brand-cyan animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">
            How can DocuMind assist your document research?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Ask complex technical questions across all your uploaded documents. DocuMind will retrieve relevant chunks from ChromaDB and synthesize grounded answers with verifiable page citations.
          </p>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="w-full space-y-2 pt-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Suggested Portfolio Research Prompts:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onQuickPrompt(item.prompt)}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-brand-blue/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-brand-cyan mb-1">
                  <span>{item.title}</span>
                  <Sparkles className="w-3 h-3 text-slate-500 group-hover:text-brand-cyan" />
                </div>
                <p className="text-[11px] text-slate-400 truncate w-full">
                  "{item.prompt}"
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';

        if (isUser) {
          return (
            <div key={idx} className="flex items-start justify-end gap-3 animate-fade-in">
              <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand-blue to-brand-indigo text-white text-xs sm:text-sm max-w-2xl shadow-md">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.timestamp && (
                  <span className="text-[10px] text-blue-200 font-mono mt-1.5 block text-right">
                    {msg.timestamp}
                  </span>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            </div>
          );
        }

        // Assistant Message
        return (
          <div key={idx} className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0 mt-1 shadow-glow-cyan">
              <Bot className="w-4 h-4" />
            </div>

            <div className="flex-1 rounded-2xl rounded-tl-sm glass-card border border-slate-800/90 p-5 space-y-4 max-w-3xl">
              
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-cyan flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    DocuMind AI Grounded Response
                  </span>
                  {msg.timestamp && (
                    <span className="text-[10px] font-mono text-slate-500">
                      • {msg.timestamp}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-mono"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Markdown Content */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans space-y-2.5 prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {/* Source Citations Section */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="uppercase tracking-wider flex items-center gap-1.5 text-slate-300 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-brand-cyan" />
                      Retrieved Ground Truth Citations ({msg.citations.length}):
                    </span>
                    <span className="text-slate-500">Click citation to inspect text chunk</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {msg.citations.map((cit, cIdx) => (
                      <CitationBadge
                        key={cIdx}
                        citation={cit}
                        onClick={() => onSelectCitation(cit)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback & Actions Bar */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">Feedback:</span>
                  <button
                    onClick={() => handleFeedback(idx, 'up')}
                    className={`p-1.5 rounded-md transition-colors ${
                      feedback[idx] === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-white'
                    }`}
                    title="Good response"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback(idx, 'down')}
                    className={`p-1.5 rounded-md transition-colors ${
                      feedback[idx] === 'down' ? 'text-rose-400 bg-rose-500/10' : 'hover:text-white'
                    }`}
                    title="Poor response"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onRegenerate && (
                  <button
                    onClick={() => {
                      const userMsg = messages.slice(0, idx).reverse().find(m => m.role === 'user');
                      if (userMsg) onRegenerate(userMsg.content);
                    }}
                    className="flex items-center gap-1 text-[11px] font-mono hover:text-white transition-colors"
                  >
                    <RotateCw className="w-3 h-3 text-brand-cyan" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
