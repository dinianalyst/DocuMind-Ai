import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Database, Search, ShieldCheck } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: 'Converting query to 384-d dense embedding...', icon: Sparkles },
    { text: 'Searching ChromaDB HNSW vector index...', icon: Database },
    { text: 'Retrieving top-k relevant context chunks...', icon: Search },
    { text: 'Synthesizing grounded answer with source citations...', icon: ShieldCheck }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0 mt-1 shadow-glow-cyan">
        <Bot className="w-4 h-4" />
      </div>

      <div className="rounded-2xl rounded-tl-sm glass-card border border-brand-blue/30 p-4 space-y-2 max-w-md bg-slate-900/90 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan">
          <CurrentIcon className="w-3.5 h-3.5 animate-pulse" />
          <span className="animate-pulse">{steps[step].text}</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet h-full transition-all duration-500 rounded-full"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
