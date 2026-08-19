import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Check, 
  Copy, 
  RotateCw,
  Search
} from 'lucide-react';

interface InteractiveDemoProps {
  onEnterApp: () => void;
}

export const InteractiveDemoSection: React.FC<InteractiveDemoProps> = ({ onEnterApp }) => {
  const sampleScenarios = [
    {
      id: 1,
      label: 'Optimal RAG Chunking',
      question: 'What is the optimal chunk size and overlap for RAG according to the handbook?',
      answer: 'According to the **AI Engineering Handbook (Page 1)**, optimal chunk size for precise dense retrieval is configured between **500 to 800 characters** with a **15% to 20% overlap** (100–150 characters).\n\nThis balance ensures semantic continuity across chunk boundaries while preventing dilution of vector embeddings in cosine similarity space.',
      sources: [
        { file: 'AI_Engineering_RAG_Handbook.txt', page: 1, similarity: 96.4, chunk: 'Typical optimal chunk size ranges between 500 to 800 characters with a 15-20% overlap to preserve semantic continuity across boundaries.' }
      ]
    },
    {
      id: 2,
      label: 'ML Systems Benchmark',
      question: 'What are the performance latency benchmarks and token savings in the ML systems report?',
      answer: 'In the **Enterprise Cloud & Machine Learning Systems Report 2026 (Page 1)**:\n\n- **Retrieval Latency**: ChromaDB localized HNSW index delivers average query latencies of **4.2ms** across 50,000 embedded documents.\n- **Error Reduction**: Grounded RAG demonstrated an **89.4% reduction** in factual errors compared to ungrounded LLM zero-shot prompts.\n- **Token Cost Savings**: Reduces context window token consumption by up to **73%** by filtering out irrelevant sections.',
      sources: [
        { file: 'Enterprise_ML_Systems_Report_2026.txt', page: 1, similarity: 94.8, chunk: 'Retrieval Latency: ChromaDB localized HNSW index delivers average query latencies of 4.2ms across 50,000 embedded documents.' }
      ]
    },
    {
      id: 3,
      label: 'Quantum Algorithms',
      question: 'Which hybrid quantum-classical algorithms are outlined in the foundations document?',
      answer: 'The **Quantum Computing and Quantum Machine Learning Foundations (Page 1)** specifies three primary hybrid algorithms:\n\n1. **VQE (Variational Quantum Eigensolver)**: Applied for molecular simulation and quantum chemistry ground-state approximations.\n2. **QAOA (Quantum Approximate Optimization Algorithm)**: Solves combinatorial graph optimization problems with polynomial speedups.\n3. **Quantum Kernels**: Maps non-linearly separable data into exponentially large Hilbert feature spaces for quantum SVM classification.',
      sources: [
        { file: 'Quantum_Computing_Foundations.txt', page: 1, similarity: 95.1, chunk: 'VQE (Variational Quantum Eigensolver): Used for molecular simulation and quantum chemistry ground-state approximations.' }
      ]
    }
  ];

  const [activeScenario, setActiveScenario] = useState(sampleScenarios[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScenario.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="demo" className="py-24 bg-background-dark/50 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-mono text-brand-cyan">
            <Search className="w-3.5 h-3.5" />
            <span>LIVE INTERACTIVE SIMULATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience <span className="gradient-text-accent">DocuMind In Action</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Test realistic document retrieval queries against our pre-indexed knowledge base. Click sample prompts to observe instant semantic vector matching.
          </p>
        </div>

        {/* Demo Box */}
        <div className="max-w-4xl mx-auto rounded-2xl glass-card border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Top Bar with scenario selectors */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Vector Database: <strong className="text-slate-200">3 Indexed Documents</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {sampleScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeScenario.id === sc.id
                      ? 'bg-brand-blue text-white shadow-glow-blue'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Preview Area */}
          <div className="p-6 space-y-6 bg-background-darkest/90 min-h-[380px]">
            
            {/* User Message */}
            <div className="flex items-start justify-end gap-3">
              <div className="p-4 rounded-2xl rounded-tr-sm bg-gradient-to-r from-brand-blue to-brand-indigo text-white text-sm max-w-xl shadow-md">
                <p>{activeScenario.question}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                U
              </div>
            </div>

            {/* AI Assistant Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              
              <div className="flex-1 rounded-2xl rounded-tl-sm glass-card border border-slate-800/80 p-5 space-y-4 max-w-2xl">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-brand-cyan flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    DocuMind AI Grounded Response
                  </span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeScenario.answer}
                </div>

                {/* Sources Section */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Retrieved Ground Truth Sources:
                  </div>
                  {activeScenario.sources.map((src, sIdx) => (
                    <div 
                      key={sIdx}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-brand-blue/40 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText className="w-4 h-4 text-brand-cyan shrink-0" />
                        <span className="font-medium text-white">{src.file}</span>
                        <span className="text-slate-400 font-mono text-[11px]">— Page {src.page}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-semibold text-[10px] border border-emerald-500/20">
                        {src.similarity}% Similarity
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Bar Call to Action */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Ready to chat with your own PDF, Word, and text documents?
            </span>
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
            >
              <span>Launch Full SaaS App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
