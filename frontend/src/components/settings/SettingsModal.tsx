import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  Key, 
  Cpu, 
  Database, 
  Save, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { SystemConfigResponse, SystemConfigUpdateRequest } from '../../types';
import { api } from '../../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigSaved }) => {
  const [config, setConfig] = useState<SystemConfigResponse | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [modelName, setModelName] = useState('gpt-4o-mini');
  const [topK, setTopK] = useState(4);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.25);
  const [chunkSize, setChunkSize] = useState(600);
  const [chunkOverlap, setChunkOverlap] = useState(120);
  
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    api.getConfig().then((res) => {
      setConfig(res);
      setModelName(res.model_name || 'gpt-4o-mini');
      setTopK(res.top_k || 4);
      setSimilarityThreshold(res.similarity_threshold !== undefined ? res.similarity_threshold : 0.25);
      setChunkSize(res.chunk_size || 600);
      setChunkOverlap(res.chunk_overlap || 120);
    }).catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const updatePayload: SystemConfigUpdateRequest = {
        model_name: modelName,
        top_k: topK,
        similarity_threshold: similarityThreshold,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap
      };

      if (apiKey.trim()) {
        updatePayload.openai_api_key = apiKey.trim();
      }
      if (baseUrl.trim()) {
        updatePayload.openai_base_url = baseUrl.trim();
      }

      await api.updateConfig(updatePayload);
      setSavedSuccess(true);
      onConfigSaved();
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert(`Failed to save settings: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-background-dark border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                RAG Pipeline & Model Configuration
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Tune retrieval parameters, vector search thresholds, and API keys.
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* API Key Configuration */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-cyan" />
                LLM Provider API Key
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {config?.has_api_key ? '🟢 Key Active' : '⚪ Zero-Key Local Mode'}
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">
                OpenAI / Compatible API Key (Optional)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={config?.has_api_key ? '•••••••••••••••••••• (Leave blank to keep existing)' : 'sk-... (Enter key or use default local engine)'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Works with OpenAI, Groq, Ollama, DeepSeek, or built-in grounded extractive engine.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">API Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">LLM Model Name</label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Recommended)</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                  <option value="deepseek-chat">deepseek-chat</option>
                  <option value="llama3-70b-8192">llama3-70b (Groq)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RAG Hyperparameters Sliders */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-5">
            <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-violet" />
              Retrieval Hyperparameters
            </span>

            {/* Top-K Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Top-K Retrieved Chunks</span>
                <span className="font-mono font-bold text-brand-cyan">{topK} chunks</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full accent-brand-cyan bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Number of highest-ranking context passages injected into the generation prompt.
              </span>
            </div>

            {/* Similarity Threshold */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Similarity Confidence Threshold</span>
                <span className="font-mono font-bold text-brand-violet">{(similarityThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={0.9}
                step={0.05}
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full accent-brand-violet bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Minimum cosine similarity score required for chunks to be considered relevant.
              </span>
            </div>

            {/* Chunk Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Chunk Size</span>
                  <span className="font-mono font-bold text-white">{chunkSize} chars</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={50}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                  className="w-full accent-brand-blue bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Chunk Overlap</span>
                  <span className="font-mono font-bold text-white">{chunkOverlap} chars</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={10}
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                  className="w-full accent-brand-blue bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Active Embedding Specification */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Dense Embedding Vector:</span>
            <span className="text-brand-cyan font-semibold">all-MiniLM-L6-v2 (384-D HNSW)</span>
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-violet hover:from-blue-600 hover:to-purple-600 text-white text-xs font-semibold shadow-glow-blue transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating...' : 'Save Configuration'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
