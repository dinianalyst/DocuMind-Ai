import React from 'react';
import { 
  Search, 
  Bot, 
  FileCheck2, 
  Files, 
  Network, 
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Intelligent Document Search',
      description: 'Go beyond basic keyword queries. Find concepts, semantic ideas, and specific paragraphs across hundreds of pages using high-dimensional dense embeddings.',
      badge: 'Dense Retrieval',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-brand-cyan'
    },
    {
      icon: Bot,
      title: 'Context-Aware AI Answers',
      description: 'The LLM synthesizes precise answers by conditioning exclusively on the retrieved chunks, eliminating hallucinations and ensuring technical fidelity.',
      badge: 'Grounded Generation',
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-brand-violet'
    },
    {
      icon: FileCheck2,
      title: 'Verifiable Source Citations',
      description: 'Every statement links to the exact originating document and page number with real-time cosine similarity scores for total auditability.',
      badge: 'Audit & Transparency',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Files,
      title: 'Multi-Document Support',
      description: 'Upload and cross-reference PDFs, DOCX reports, research papers, Markdown notes, and TXT files in a unified vectorized knowledge repository.',
      badge: 'Cross-Doc Synthesis',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-brand-indigo'
    },
    {
      icon: Network,
      title: 'ChromaDB Vector Storage',
      description: 'Leverage persistent Hierarchical Navigable Small World (HNSW) indexing for sub-15ms approximate nearest neighbor (ANN) lookups.',
      badge: 'HNSW Graph Indexing',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Local Processing',
      description: 'Runs with local SentenceTransformers embeddings and ChromaDB storage with zero data retention, keeping sensitive enterprise files confidential.',
      badge: 'Privacy by Design',
      gradient: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-400'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-mono text-brand-cyan">
            <Layers className="w-3.5 h-3.5" />
            <span>ENTERPRISE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for <span className="gradient-text-accent">Precision Information Retrieval</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            DocuMind AI combines state-of-the-art vector embedding pipelines with strict anti-hallucination guardrails to deliver a dependable document intelligence platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl glass-card glass-card-hover border border-slate-800 flex flex-col justify-between"
              >
                {/* Subtle top glow */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>0{idx + 1} // FEATURE</span>
                  <span className="text-brand-cyan group-hover:translate-x-1 transition-transform">Explore →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
