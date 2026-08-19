import React, { useState } from 'react';
import { 
  FileText, 
  Scissors, 
  Binary, 
  Database, 
  Search, 
  Layers, 
  Bot, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const RagArchitectureSection: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      id: 0,
      title: '1. Multi-Format Ingestion',
      icon: FileText,
      tech: 'PyPDF • python-docx • UTF-8',
      summary: 'Extract raw text, page breaks, and structural metadata from PDF, DOCX, and TXT files.',
      details: [
        'Page-by-page extraction preserving document structure',
        'Normalizes whitespace, linebreaks, and encoding anomalies',
        'Extracts metadata: filename, original size, page count, byte length'
      ],
      color: 'from-blue-500/20 to-blue-600/10',
      borderColor: 'border-blue-500/40',
      iconColor: 'text-brand-blue'
    },
    {
      id: 1,
      title: '2. Recursive Chunking',
      icon: Scissors,
      tech: 'LangChain RecursiveTextSplitter',
      summary: 'Segments continuous text into cohesive semantic units with overlapping boundaries.',
      details: [
        'Configurable chunk size: 600 characters (optimal for precision)',
        'Sliding chunk overlap: 120 characters (20% boundary continuity)',
        'Sentence-aware separation: splits on ["\\n\\n", "\\n", ". ", "? ", "! "]'
      ],
      color: 'from-indigo-500/20 to-indigo-600/10',
      borderColor: 'border-indigo-500/40',
      iconColor: 'text-brand-indigo'
    },
    {
      id: 2,
      title: '3. Dense Embeddings',
      icon: Binary,
      tech: 'SentenceTransformers • 384-D Vectors',
      summary: 'Projects textual chunks into normalized high-dimensional semantic vector spaces.',
      details: [
        'Model: all-MiniLM-L6-v2 (384-dimensional dense embeddings)',
        'L2 unit-normalized vector generation for rapid cosine comparison',
        'Dual-support for OpenAI text-embedding-3-small via API'
      ],
      color: 'from-violet-500/20 to-violet-600/10',
      borderColor: 'border-violet-500/40',
      iconColor: 'text-brand-violet'
    },
    {
      id: 3,
      title: '4. Vector Database Index',
      icon: Database,
      tech: 'ChromaDB • HNSW Graph Index',
      summary: 'Persists and indexes high-dimensional vectors with sub-millisecond approximate nearest neighbor (ANN) lookups.',
      details: [
        'Persistent storage on disk at ./data/chroma_db',
        'Hierarchical Navigable Small World (HNSW) cosine metric graph',
        'Granular metadata filtering by document_id and page index'
      ],
      color: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/40',
      iconColor: 'text-purple-400'
    },
    {
      id: 4,
      title: '5. Query Similarity Search',
      icon: Search,
      tech: 'Cosine Similarity • Top-K Ranking',
      summary: 'Converts user query into embedding and computes cosine distance against all indexed passages.',
      details: [
        'Sub-15ms vector retrieval across thousands of document chunks',
        'Configurable Top-K parameter (default: 4 chunks)',
        'Similarity threshold filtering (0.0 to 1.0 confidence gating)'
      ],
      color: 'from-cyan-500/20 to-cyan-600/10',
      borderColor: 'border-cyan-500/40',
      iconColor: 'text-brand-cyan'
    },
    {
      id: 5,
      title: '6. Context Injection & LLM',
      icon: Bot,
      tech: 'Anti-Hallucination Prompt • OpenAI / Local',
      summary: 'Injects verified context into system prompt with strict factual guardrails.',
      details: [
        'Explicit instruction: "Answer ONLY using retrieved context, decline if missing"',
        'Zero external knowledge pollution for domain-specific queries',
        'Support for GPT-4o-mini, Groq, Ollama, or built-in grounded engine'
      ],
      color: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/40',
      iconColor: 'text-emerald-400'
    },
    {
      id: 6,
      title: '7. Answer with Source Citations',
      icon: CheckCircle2,
      tech: 'Verifiable Page Citations • Similarity %',
      summary: 'Delivers formatted Markdown response linked to exact document source passages.',
      details: [
        'Every factual claim maps to originating document & page number',
        'Exact similarity percentage gauge (e.g. 96.2% confidence)',
        'Interactive chunk inspector drawer for complete auditability'
      ],
      color: 'from-teal-500/20 to-teal-600/10',
      borderColor: 'border-teal-500/40',
      iconColor: 'text-teal-400'
    }
  ];

  return (
    <section id="architecture" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono text-brand-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTFOLIO TECHNICAL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End <span className="gradient-text-accent">RAG Pipeline Breakdown</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A production-ready architecture designed for high precision, verifiable attribution, and low latency. Click any stage to inspect engineering specifications.
          </p>
        </div>

        {/* Interactive Architecture Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Flow Column: 7 Stages */}
          <div className="lg:col-span-7 space-y-3">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                    isSelected
                      ? `glass-card ${stage.borderColor} shadow-lg shadow-brand-blue/10 bg-slate-900/90`
                      : 'bg-background-dark/80 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-slate-800 border border-slate-700' : 'bg-slate-900'
                    }`}>
                      <Icon className={`w-5 h-5 ${stage.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {stage.title}
                        {isSelected && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                            ACTIVE INSPECTION
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{stage.tech}</p>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    isSelected ? 'text-brand-cyan rotate-90' : 'text-slate-600'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Right Detail Inspection Panel */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="p-6 rounded-2xl glass-card border border-brand-blue/30 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan">
                  <Info className="w-4 h-4" />
                  <span>DEEP-DIVE SPECIFICATION</span>
                </div>
                <span className="text-xs font-mono text-slate-400">STAGE 0{selectedStage + 1}</span>
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-bold text-white">
                  {stages[selectedStage].title}
                </h3>
                
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs font-mono text-brand-cyan">
                  {stages[selectedStage].tech}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {stages[selectedStage].summary}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block font-mono">
                    Technical Highlights:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {stages[selectedStage].details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-brand-blue/10 to-brand-violet/10 border border-brand-blue/20 text-xs text-slate-300 mt-4">
                  <span className="font-semibold text-white">Engineering Note: </span>
                  Ensures sub-second deterministic retrieval with verifiable ground truth.
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
