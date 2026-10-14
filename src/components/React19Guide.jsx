import React from 'react';
import { Zap, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { REACT19_CHEATSHEET } from '../data/cheatSheetData';

export default function React19Guide({ onSelectTopic }) {
  return (
    <div className="guide-view-container">
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-badge">
          <Zap size={14} className="text-emerald-400" />
          <span>Next-Gen Paradigm Shift</span>
        </div>
        <h1 className="roadmap-hero-title">React 19 Complete Architecture Guide</h1>
        <p className="roadmap-hero-desc">
          React 19 introduces transformative native capabilities: async Actions, optimistic states, the versatile <code>use()</code> hook, and streamlined JSX primitives.
        </p>
      </div>

      {/* Feature Comparison Cards */}
      <div className="space-y-4">
        {REACT19_CHEATSHEET.map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                  {item.status}
                </span>
                <h3 className="text-lg font-bold text-white font-mono">{item.feature}</h3>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{item.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-gray-500 block mb-1 font-sans font-semibold">Previous Era (React 18 & Earlier):</span>
                <code className="text-rose-300">{item.before}</code>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                <span className="text-emerald-400 block mb-1 font-sans font-semibold">The React 19 Standard:</span>
                <code className="text-emerald-300">{item.now}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
