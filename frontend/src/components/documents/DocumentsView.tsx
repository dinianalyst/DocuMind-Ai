import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Trash2, 
  RefreshCw, 
  Layers, 
  Search, 
  Filter, 
  Database, 
  FilePlus, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  FileCode,
  HardDrive
} from 'lucide-react';
import { DocumentMetadata } from '../../types';
import { api } from '../../services/api';
import { UploadDropzone } from './UploadDropzone';
import { ChunkInspectorModal } from './ChunkInspectorModal';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDocForChunks, setSelectedDocForChunks] = useState<DocumentMetadata | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.getDocuments();
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (docId: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete '${filename}' and purge its vector embeddings from ChromaDB?`)) {
      return;
    }

    try {
      setActionLoadingId(docId);
      await api.deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      alert(`Error deleting document: ${err}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReprocess = async (docId: string) => {
    try {
      setActionLoadingId(docId);
      const res = await api.reprocessDocument(docId);
      setDocuments(prev => prev.map(d => d.id === docId ? res.document : d));
    } catch (err) {
      alert(`Reprocessing error: ${err}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || doc.file_type.toUpperCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const totalChunks = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);
  const totalSize = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Document Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your indexed files, inspect vector chunks, and monitor ChromaDB embedding storage.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">DOCUMENTS</span>
            <span className="text-white font-bold">{documents.length} Files</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">TOTAL CHUNKS</span>
            <span className="text-brand-cyan font-bold">{totalChunks} Vectors</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">TOTAL SIZE</span>
            <span className="text-slate-300 font-bold">{formatFileSize(totalSize)}</span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <UploadDropzone onUploadSuccess={() => fetchDocuments()} />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter documents by name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Format Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          {['ALL', 'PDF', 'DOCX', 'TXT'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedType === type
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
            <span className="text-xs font-mono">Loading indexed documents...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No documents found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm ? 'No documents match your search query.' : 'Upload your first document above to begin.'}
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl glass-card glass-card-hover border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Doc Info */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-brand-cyan shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md" title={doc.filename}>
                      {doc.filename}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-brand-blue/15 text-brand-cyan font-mono text-[10px] uppercase font-bold border border-brand-blue/30">
                      {doc.file_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
                    <span>{formatFileSize(doc.file_size)}</span>
                    <span>•</span>
                    <span>{doc.page_count} {doc.page_count === 1 ? 'page' : 'pages'}</span>
                    <span>•</span>
                    <span className="text-brand-cyan font-semibold">{doc.chunk_count} chunks indexed</span>
                    <span>•</span>
                    <span className="text-slate-500">{doc.upload_timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                <button
                  onClick={() => setSelectedDocForChunks(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 hover:text-white transition-colors border border-slate-700"
                  title="Inspect Vector Chunks"
                >
                  <Layers className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Inspect Chunks</span>
                </button>

                <button
                  onClick={() => handleReprocess(doc.id)}
                  disabled={actionLoadingId === doc.id}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-slate-700"
                  title="Re-process Document"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${actionLoadingId === doc.id ? 'animate-spin text-brand-cyan' : ''}`} />
                </button>

                <button
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  disabled={actionLoadingId === doc.id}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chunk Inspector Modal */}
      {selectedDocForChunks && (
        <ChunkInspectorModal
          document={selectedDocForChunks}
          onClose={() => setSelectedDocForChunks(null)}
        />
      )}
    </div>
  );
};
