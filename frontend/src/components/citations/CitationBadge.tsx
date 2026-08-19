import React from 'react';
import { FileText, ShieldCheck, ChevronRight } from 'lucide-react';
import { SourceCitation } from '../../types';

interface CitationBadgeProps {
  citation: SourceCitation;
  onClick: () => void;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-brand-blue/50 text-xs text-slate-300 hover:text-white transition-all shadow-sm group text-left cursor-pointer active:scale-95"
      title={`Inspect chunk from ${citation.filename} (Page ${citation.page_number})`}
    >
      <div className="w-5 h-5 rounded bg-brand-blue/20 flex items-center justify-center text-brand-cyan shrink-0">
        <FileText className="w-3 h-3" />
      </div>

      <span className="font-medium text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
        {citation.filename}
      </span>

      <span className="text-[10px] font-mono text-slate-400">
        p.{citation.page_number}
      </span>

      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-[10px] border border-emerald-500/20">
        {citation.similarity_score}%
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-cyan transition-colors" />
    </button>
  );
};
