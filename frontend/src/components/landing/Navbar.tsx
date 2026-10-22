import React from 'react';
import { Sparkles, ArrowRight, Github, FileText, Cpu } from 'lucide-react';

interface NavbarProps {
  onEnterApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onEnterApp }) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-indigo to-brand-violet p-[1px] shadow-glow-blue">
            <div className="w-full h-full bg-background-darkest rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-cyan" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">DocuMind</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-cyan font-mono border border-brand-blue/30">AI</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">RAG PLATFORM</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#architecture" className="hover:text-white transition-colors flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            RAG Pipeline
          </a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#technology" className="hover:text-white transition-colors">Technology</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white glass-card rounded-lg hover:border-slate-600 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <button
            onClick={onEnterApp}
            className="relative group flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-600 hover:to-purple-600 transition-all shadow-glow-blue active:scale-95"
          >
            <span>Try DocuMind</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
