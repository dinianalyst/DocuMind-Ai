import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Database, 
  Search, 
  CheckCircle2, 
  Bot, 
  Layers, 
  Zap,
  ShieldCheck,
  Binary
} from 'lucide-react';

interface HeroSectionProps {
  onStartChatting: () => void;
}



export const HeroSection: React.FC<HeroSectionProps> = ({ onStartChatting }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-20 overflow-hidden grid-background">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-brand-violet/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-brand-blue/30 text-xs font-medium text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-brand-cyan animate-ping" />
              <span className="text-brand-cyan font-semibold">Production RAG Architecture</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">FastAPI + ChromaDB + SentenceTransformers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Chat With Your <br />
              <span className="gradient-text-accent">Documents Using AI</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              An intelligent RAG-powered document assistant that understands your files, retrieves relevant knowledge from multi-page PDFs, DOCX, and TXT files, and delivers <span className="text-white font-medium">grounded answers with verifiable source citations</span>.
            </p>

            {/* Highlights List */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hallucination Guardrails</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Page-level Citations & Scores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-10ms Chroma Vector Search</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Format: PDF, DOCX, TXT</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onStartChatting}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-violet hover:from-blue-600 hover:to-purple-600 transition-all shadow-glow-blue active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <span>Start Chatting</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#architecture"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-300 glass-card glass-card-hover hover:text-white transition-all"
              >
                <Layers className="w-4 h-4 text-brand-cyan" />
                <span>Explore RAG Pipeline</span>
              </a>
            </div>

            {/* Micro stats counter */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              <div>
                <span className="block font-bold text-base text-white font-mono">100%</span>
                <span>Grounded Retrieval</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div>
                <span className="block font-bold text-base text-white font-mono">384-D</span>
                <span>Dense Embeddings</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div>
                <span className="block font-bold text-base text-white font-mono">&lt; 15ms</span>
                <span>Vector Cosine Search</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact RAG Interactive Visualizer */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Container */}
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-brand-blue/30 via-brand-violet/20 to-transparent shadow-2xl backdrop-blur-xl">
                <div className="bg-background-dark/95 rounded-xl p-5 border border-slate-800/80 space-y-4">
                  
                  {/* Visualizer Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-slate-300">DocuMind Vector Pipeline Active</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-brand-blue/15 text-brand-cyan font-mono text-[10px]">
                      HNSW INDEXED
                    </span>
                  </div>

                  {/* Floating Document Nodes */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-brand-blue/30 flex flex-col gap-1 items-start text-[11px] transform transition-transform hover:-translate-y-1">
                      <FileText className="w-4 h-4 text-brand-blue" />
                      <span className="font-medium text-slate-200 truncate w-full">RAG_Handbook.pdf</span>
                      <span className="text-[9px] text-slate-400 font-mono">14 Chunks • 384d</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-brand-violet/30 flex flex-col gap-1 items-start text-[11px] transform transition-transform hover:-translate-y-1">
                      <FileText className="w-4 h-4 text-brand-violet" />
                      <span className="font-medium text-slate-200 truncate w-full">ML_Systems.docx</span>
                      <span className="text-[9px] text-slate-400 font-mono">9 Chunks • 384d</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-brand-cyan/30 flex flex-col gap-1 items-start text-[11px] transform transition-transform hover:-translate-y-1">
                      <FileText className="w-4 h-4 text-brand-cyan" />
                      <span className="font-medium text-slate-200 truncate w-full">Quantum_Docs.txt</span>
                      <span className="text-[9px] text-slate-400 font-mono">6 Chunks • 384d</span>
                    </div>
                  </div>

                  {/* Retrieval Connection Indicator */}
                  <div className="relative py-2 flex items-center justify-center">
                    <div className="w-full border-t border-dashed border-slate-700 relative" />
                    <div className="absolute bg-background-darkest border border-slate-700 px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] text-brand-cyan font-mono shadow-glow-blue">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Semantic Cosine Search (Top-K = 4)</span>
                    </div>
                  </div>

                  {/* Simulated Question */}
                  <div className="rounded-lg p-3 bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5 text-xs">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-bold text-brand-cyan text-[10px]">U</span>
                    </div>
                    <div>
                      <p className="text-slate-200 font-medium">
                        "What is the optimal chunk size and overlap for RAG pipelines?"
                      </p>
                    </div>
                  </div>

                  {/* Simulated Grounded AI Response */}
                  <div className="rounded-lg p-3.5 bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-blue/10 border border-brand-blue/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-brand-cyan font-semibold text-[11px]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>DocuMind Assistant</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Grounded 96.2%
                      </span>
                    </div>
                    
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      According to the <strong className="text-white">AI Engineering Handbook</strong>, the optimal chunk size ranges between <strong className="text-brand-cyan">500 to 800 characters</strong> with a <strong className="text-brand-cyan">15–20% overlap</strong> (100–150 chars) to maintain semantic continuity across boundaries.
                    </p>

                    {/* Source Citation Chips */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-medium">Sources:</span>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-blue/20 border border-brand-blue/40 text-[10px] text-brand-cyan font-mono">
                        <span>📄 AI_Engineering_Handbook.pdf — Page 1</span>
                        <span className="text-emerald-400 font-semibold">96%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
