import React from 'react';
import { 
  Sparkles, 
  MessageSquareCode, 
  FileText, 
  Settings, 
  Plus, 
  Database, 
  Home, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { AppTab, DocumentMetadata } from '../../types';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onReturnToLanding: () => void;
  onNewChat: () => void;
  documents: DocumentMetadata[];
  totalVectors: number;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onReturnToLanding,
  onNewChat,
  documents,
  totalVectors,
  onOpenSettings
}) => {
  return (
    <aside className="w-64 bg-background-darkest border-r border-slate-800/80 flex flex-col h-screen shrink-0">
      
      {/* Top Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div 
          onClick={onReturnToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Landing Page"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-violet p-[1px] shadow-glow-blue">
            <div className="w-full h-full bg-background-darkest rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-cyan group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-white">DocuMind</span>
              <span className="text-[10px] px-1 rounded bg-brand-blue/20 text-brand-cyan font-mono border border-brand-blue/30">AI</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">ENTERPRISE RAG</span>
          </div>
        </div>

        <button
          onClick={onReturnToLanding}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Home / Landing"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New Chat CTA */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New RAG Chat</span>
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-3 space-y-1">
        <button
          onClick={() => onSelectTab('chat')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MessageSquareCode className={`w-4 h-4 ${activeTab === 'chat' ? 'text-brand-cyan' : 'text-slate-500'}`} />
            <span>Chat Assistant</span>
          </div>
          {activeTab === 'chat' && <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />}
        </button>

        <button
          onClick={() => onSelectTab('documents')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'documents'
              ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-sm'
              : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className={`w-4 h-4 ${activeTab === 'documents' ? 'text-brand-blue' : 'text-slate-500'}`} />
            <span>Knowledge Base</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {documents.length}
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>RAG Settings</span>
          </div>
        </button>
      </div>

      {/* Indexed Documents Quick Preview */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 mt-2">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          <span>Active Files ({documents.length})</span>
          <span 
            onClick={() => onSelectTab('documents')}
            className="text-brand-cyan hover:underline cursor-pointer"
          >
            Manage
          </span>
        </div>

        <div className="space-y-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectTab('chat')}
              className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/60 text-xs flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 truncate max-w-[170px]">
                <FileText className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan shrink-0" />
                <span className="truncate text-slate-300 group-hover:text-white text-[11px]">
                  {doc.filename}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 shrink-0">
                {doc.chunk_count}c
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status & System Health */}
      <div className="p-3 border-t border-slate-800/80 bg-background-dark/80 space-y-2">
        
        {/* ChromaDB Status Card */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ChromaDB HNSW
            </span>
            <span className="text-brand-cyan font-bold">{totalVectors} Vectors</span>
          </div>
          <div className="text-[9px] font-mono text-slate-500 truncate">
            Embeddings: all-MiniLM-L6-v2
          </div>
        </div>

        {/* User / Portfolio Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center text-white text-[11px] font-bold">
            AI
          </div>
          <div className="flex-1 truncate">
            <span className="block text-xs font-semibold text-white truncate">AI / ML Engineer</span>
            <span className="block text-[10px] text-slate-500 font-mono">Portfolio Candidate</span>
          </div>
        </div>

      </div>

    </aside>
  );
};
