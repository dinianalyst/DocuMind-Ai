import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Sparkles,
  FileCode,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { DocumentMetadata } from '../../types';

interface UploadDropzoneProps {
  onUploadSuccess: (doc: DocumentMetadata) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(file);

    // Validate size (25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds maximum limit of 25MB.');
      return;
    }

    // Validate extension
    const allowed = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.json'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setErrorMessage(`Unsupported format '${ext}'. Allowed: PDF, DOCX, TXT, MD, CSV, JSON.`);
      return;
    }

    setUploading(true);
    try {
      const response = await api.uploadDocument(file);
      setSuccessMessage(`Successfully processed '${file.name}' (${response.document.chunk_count} chunks created)`);
      onUploadSuccess(response.document);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload and process document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.txt,.md,.csv,.json"
        className="hidden"
      />

      {/* Dropzone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? 'border-brand-cyan bg-brand-cyan/10 scale-[1.01]'
            : 'border-slate-800 hover:border-brand-blue/50 bg-background-dark/60 hover:bg-slate-900/60'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-cyan mb-4 group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-brand-cyan" />
          ) : (
            <UploadCloud className="w-7 h-7 text-brand-blue" />
          )}
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          {uploading ? 'Processing & Vectorizing Document...' : 'Upload your documents'}
        </h3>
        
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
          {uploading
            ? 'Extracting text pages, generating 384-d semantic embeddings, and indexing into ChromaDB...'
            : 'Drag and drop PDF, Word (.docx), or plain text files here, or click to browse.'}
        </p>

        {/* Formats Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">PDF</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">DOCX</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300">TXT / MD</span>
          <span className="text-slate-500">• Max 25MB</span>
        </div>
      </div>

      {/* Status Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="flex-1 font-medium">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
