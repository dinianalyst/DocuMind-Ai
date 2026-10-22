import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';

interface CtaSectionProps {
  onEnterApp: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onEnterApp }) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-brand-blue/20 via-slate-900 to-brand-violet/20 border border-brand-blue/30 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-xs font-mono text-brand-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              <span>READY FOR PORTFOLIO DEMONSTRATION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Turn Your Documents Into an <br />
              <span className="gradient-text-accent">Intelligent Knowledge Base</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Upload your research papers, financial reports, technical documentation, and contracts to start asking questions with sub-second semantic retrieval.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onEnterApp}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-600 hover:to-purple-600 transition-all shadow-glow-blue active:scale-95 cursor-pointer"
              >
                <Database className="w-4 h-4 text-brand-cyan" />
                <span>Build Your Knowledge Base</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Grounded RAG Guardrails
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Sub-15ms Vector Lookups
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-cyan" /> PDF / DOCX / TXT Native
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
