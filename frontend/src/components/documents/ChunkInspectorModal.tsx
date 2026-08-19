import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Search, 
  FileText, 
  Copy, 
  Check, 
  Hash, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { ChunkMetadata, DocumentMetadata } from '../../types';
import { api } from '../../services/api';

interface ChunkInspectorModalProps {
  document: DocumentMetadata | null;
  onClose: () => void;
}

export const ChunkInspectorModal: React.FC<ChunkInspectorModalProps> = ({ document, onClose }) => {
  const [chunks, setChunks] = useState<ChunkMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!document) return;
    
    let isMounted = true;
    setLoading(true);
    api.getDocumentChunks(document.id)
      .then((res) => {
        if (isMounted) {
          setChunks(res.chunks);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load chunks:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [document]);

  if (!document) return null;

  const filteredChunks = chunks.filter(c => 
    c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.page_number.toString().includes(searchTerm)
  );

  const handleCopyChunk = (chunk: ChunkMetadata) => {
    navigator.clipboard.writeText(chunk.text);
    setCopiedId(chunk.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background-dark border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Vector Chunk Inspector</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-cyan font-mono border border-brand-blue/30">
                  {chunks.length} Chunks
                </span>
              </h3>
              <p className="text-xs font-mono text-slate-400 truncate max-w-md">
                Document: {document.filename} ({document.file_type})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across extracted chunks, text, or page..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
            />
          </div>
          <span className="text-xs font-mono text-slate-400 shrink-0">
            Showing {filteredChunks.length} of {chunks.length}
          </span>
        </div>

        {/* Chunks List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
              <span className="text-xs font-mono">Fetching chunk embeddings from ChromaDB...</span>
            </div>
          ) : filteredChunks.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs font-mono">
              No chunks match your search filter.
            </div>
          ) : (
            filteredChunks.map((chunk) => (
              <div 
                key={chunk.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3"
              >
                {/* Chunk Meta Header */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-brand-cyan">
                      CHUNK #{chunk.chunk_index}
                    </span>
                    <span className="text-slate-400 font-mono">
                      Page {chunk.page_number}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {chunk.char_count} chars
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyChunk(chunk)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedId === chunk.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Chunk Text Body */}
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-brand-blue/30 selection:text-brand-cyan">
                  {chunk.text}
                </p>

                <div className="text-[10px] font-mono text-slate-500 truncate">
                  Vector ID: {chunk.id}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Chunk Size: 600 chars • Overlap: 120 chars</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
