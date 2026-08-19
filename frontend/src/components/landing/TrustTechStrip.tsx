import React from 'react';
import { 
  Database, 
  Cpu, 
  Search, 
  Code2, 
  Layers, 
  Zap, 
  Box, 
  ShieldCheck 
} from 'lucide-react';

export const TrustTechStrip: React.FC = () => {
  const technologies = [
    { name: 'RAG Architecture', icon: Layers, desc: 'Context-Augmented' },
    { name: 'FastAPI Backend', icon: Zap, desc: 'High-Performance REST' },
    { name: 'ChromaDB', icon: Database, desc: 'HNSW Vector Store' },
    { name: 'SentenceTransformers', icon: Cpu, desc: '384-D Dense Vectors' },
    { name: 'Semantic Search', icon: Search, desc: 'Cosine Distance Match' },
    { name: 'React + TypeScript', icon: Code2, desc: 'Modern Modular UI' },
    { name: 'Multi-Format Parsing', icon: Box, desc: 'PDF, DOCX, TXT' },
    { name: 'Anti-Hallucination', icon: ShieldCheck, desc: 'Strict Grounding' },
  ];

  return (
    <section className="border-y border-slate-800/80 bg-background-dark/80 py-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">
          Architected for AI Engineering & Enterprise Information Retrieval
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-xl glass-card border border-slate-800 hover:border-brand-blue/40 transition-all text-center group cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center mb-2 group-hover:bg-brand-blue/20 transition-colors">
                  <Icon className="w-4 h-4 text-brand-cyan group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold text-slate-200 truncate w-full">{tech.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{tech.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
