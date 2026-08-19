import React from 'react';
import { Sparkles, Github, Linkedin, FileText, Code2, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-background-darkest text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 text-brand-cyan">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">DocuMind AI</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-cyan font-mono border border-brand-blue/30">
                v1.0.0
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Built with RAG, Python, FastAPI, ChromaDB, SentenceTransformers, and modern AI technologies for technical recruitment and production deployment.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">RAG Architecture Flow</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a></li>
              <li><a href="#technology" className="hover:text-white transition-colors">Tech Stack</a></li>
            </ul>
          </div>

          {/* Tech Specs */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-3">
              System Specs
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li>• FastAPI (Python 3.12)</li>
              <li>• ChromaDB Vector Store</li>
              <li>• all-MiniLM-L6-v2 (384d)</li>
              <li>• PyPDF & python-docx</li>
              <li>• React 18 + TypeScript</li>
              <li>• Tailwind CSS Dark Theme</li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} DocuMind AI. Built for AI / ML Engineer Portfolio Showcase.</p>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ChromaDB HNSW Online
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
