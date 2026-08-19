import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  SlidersHorizontal, 
  Database, 
  HardDrive, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AppTab, DocumentMetadata } from '../../types';

interface TopHeaderProps {
  activeTab: AppTab;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  documents: DocumentMetadata[];
  totalVectors: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenUpload,
  onOpenSettings,
  documents,
  totalVectors
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'chat': return 'AI Document Assistant';
      case 'documents': return 'Knowledge Base & File Manager';
      case 'settings': return 'System Settings';
      default: return 'DocuMind Workspace';
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-background-dark/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      
      {/* Title & Scope Status */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{getTabTitle()}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-normal border border-slate-700">
              RAG v1.0
            </span>
          </h1>
        </div>
      </div>

      {/* Right Quick Actions & System Pill */}
      <div className="flex items-center gap-3">
        {/* ChromaDB Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ChromaDB Active</span>
          <span className="text-slate-500">•</span>
          <span className="text-brand-cyan">{documents.length} Docs / {totalVectors} Chunks</span>
        </div>

        {/* Upload Action Button */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-cyan hover:text-white border border-brand-blue/30 transition-all text-xs font-semibold cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="RAG Configuration"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
