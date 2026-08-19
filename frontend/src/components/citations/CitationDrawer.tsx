import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Hash, 
  BookOpen 
} from 'lucide-react';
import { SourceCitation } from '../../types';

interface CitationDrawerProps {
  citation: SourceCitation | null;
  onClose: () => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ citation, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const handleCopy = () => {
    const textToCopy = citation.full_text || citation.text_snippet;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-brand-cyan border-cyan-500/30 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg h-full bg-background-dark border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slide-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-xs" title={citation.filename}>
                {citation.filename}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Page {citation.page_number} • Chunk #{citation.chunk_index}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Cosine Similarity
              </span>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreColor(citation.similarity_score)}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{citation.similarity_score}% Confidence</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Chunk ID
              </span>
              <span className="text-xs font-mono text-slate-200 truncate block">
                {citation.chunk_id}
              </span>
            </div>
          </div>

          {/* Retrieved Grounded Chunk Passage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-cyan" />
                Exact Retrieved Text Passage
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Passage' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-brand-blue/30 selection:text-brand-cyan">
              {citation.full_text || citation.text_snippet}
            </div>
          </div>

          {/* RAG Verification Explainer */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 border border-brand-blue/30 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Verifiable RAG Ground Truth</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              This exact excerpt was retrieved directly from the ChromaDB HNSW vector index using cosine similarity matching and injected into the LLM system context.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Document: {citation.filename}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
