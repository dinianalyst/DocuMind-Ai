import React from 'react';
import { 
  Zap, 
  Database, 
  Cpu, 
  Code2, 
  Layers, 
  FileCode, 
  Sparkles,
  Server
} from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const stack = [
    {
      name: 'FastAPI & Python 3.12',
      role: 'Backend Framework & REST Engine',
      desc: 'Provides asynchronous I/O request handling, strict Pydantic v2 data validation, automated OpenAPI documentation, and sub-10ms route execution.',
      icon: Zap,
      badge: 'High-Throughput REST'
    },
    {
      name: 'ChromaDB Vector Database',
      role: 'Dense Vector Store & Indexer',
      desc: 'Local persistent vector store utilizing Hierarchical Navigable Small World (HNSW) graphs to compute cosine similarity across high-dimensional embeddings.',
      icon: Database,
      badge: 'HNSW Graph Index'
    },
    {
      name: 'SentenceTransformers (all-MiniLM-L6-v2)',
      role: 'Dense Embedding Model',
      desc: 'Produces normalized 384-dimensional dense semantic vectors. Optimized for CPU and GPU inference with state-of-the-art semantic textual similarity.',
      icon: Cpu,
      badge: '384-D Vector Space'
    },
    {
      name: 'LangChain Text Splitters',
      role: 'Context-Aware Document Chunking',
      desc: 'Employs RecursiveCharacterTextSplitter with sentence-boundary awareness and configurable sliding overlap (15-20%) to preserve contextual integrity.',
      icon: Layers,
      badge: 'Semantic Splitting'
    },
    {
      name: 'React 18 & TypeScript',
      role: 'SaaS Frontend Architecture',
      desc: 'Strictly typed component hierarchy, custom hooks, dynamic Markdown rendering, citation drawer inspectors, and responsive Tailwind CSS dark theme.',
      icon: Code2,
      badge: 'Type-Safe Frontend'
    },
    {
      name: 'PyPDF & python-docx',
      role: 'Multi-Format Ingestion Engine',
      desc: 'Extracts clean text, page numbers, and table hierarchies across PDF, DOCX, MD, and TXT files with multi-encoding fallback detection.',
      icon: FileCode,
      badge: 'Document Parsing'
    }
  ];

  return (
    <section id="technology" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-xs font-mono text-brand-violet">
            <Server className="w-3.5 h-3.5" />
            <span>ENGINEERING STACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Production-Grade <span className="gradient-text-accent">Technology Stack</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every architectural layer is selected for performance, maintainability, type safety, and real-world AI scalability.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between hover:border-brand-blue/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-brand-cyan mb-3">
                    {item.role}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                  LAYER 0{idx + 1} ARCHITECTURE
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
