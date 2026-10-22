import React from 'react';
import { UploadCloud, Cpu, Search, MessageSquareCode, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Documents',
      desc: 'Drop in your multi-page PDFs, Word documents (.docx), research papers, or text files. The system automatically handles parsing and metadata extraction.',
      icon: UploadCloud,
      tag: 'Multi-Format Input',
      color: 'text-brand-blue'
    },
    {
      num: '02',
      title: 'Chunk & Embed',
      desc: 'Document text is split using RecursiveCharacterSplitters with 20% overlap, transformed into 384-dimensional dense vectors, and stored in ChromaDB.',
      icon: Cpu,
      tag: 'Dense Vectorization',
      color: 'text-brand-violet'
    },
    {
      num: '03',
      title: 'Semantic Retrieval',
      desc: 'When you ask a question, query embeddings are compared against all chunks using cosine distance to locate the top-k highest-confidence contexts in milliseconds.',
      icon: Search,
      tag: 'ChromaDB HNSW',
      color: 'text-brand-cyan'
    },
    {
      num: '04',
      title: 'Grounded Generation',
      desc: 'The LLM synthesizes a structured answer conditioned strictly on retrieved excerpts, appending verified citations, page numbers, and similarity scores.',
      icon: MessageSquareCode,
      tag: 'Accurate Citations',
      color: 'text-emerald-400'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background-dark/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-xs font-mono text-brand-violet">
            <span>RAG WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="gradient-text-accent">DocuMind AI Works</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From raw unstructured document files to verifiable conversational knowledge in four transparent stages.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="relative p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between group hover:border-brand-blue/40 transition-all"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-brand-cyan transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-cyan mb-2 block">
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <span>STAGE {step.num} OF 04</span>
                  {idx < 3 && <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-600 hidden lg:block" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
