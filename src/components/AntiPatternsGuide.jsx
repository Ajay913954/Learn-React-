import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Bug, Check, X } from 'lucide-react';
import { ANTI_PATTERNS } from '../data/cheatSheetData';

export default function AntiPatternsGuide() {
  const [activeTabByPattern, setActiveTabByPattern] = useState({});

  const toggleTab = (id, tab) => {
    setActiveTabByPattern(prev => ({
      ...prev,
      [id]: tab
    }));
  };

  return (
    <div className="guide-view-container">
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-badge">
          <Bug size={14} className="text-rose-400" />
          <span>Code Quality & Pitfalls</span>
        </div>
        <h1 className="roadmap-hero-title">React Anti-Patterns & Best Practices</h1>
        <p className="roadmap-hero-desc">
          Review the most notorious traps in React development. Compare the bug-inducing wrong approach directly against the clean, canonical React standard.
        </p>
      </div>

      <div className="space-y-6">
        {ANTI_PATTERNS.map((item, idx) => {
          const currentTab = activeTabByPattern[item.id] || 'compare';

          return (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan">#{idx + 1}</span>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-semibold">
                    {item.severity}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-gray-300">
                    {item.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4">{item.description}</p>

              {/* Side-by-side or Tabbed Code Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bad Code */}
                <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-rose-950/40 border-b border-rose-900/50 text-rose-400 font-bold text-xs">
                    <X size={14} /> ❌ Anti-Pattern (Don't Do This)
                  </div>
                  <pre className="code-snippet-small text-xs m-0">
                    <code>{item.badCode}</code>
                  </pre>
                </div>

                {/* Good Code */}
                <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/20 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/40 border-b border-emerald-900/50 text-emerald-400 font-bold text-xs">
                    <Check size={14} /> ✅ The React Way (Best Practice)
                  </div>
                  <pre className="code-snippet-small text-xs m-0">
                    <code>{item.goodCode}</code>
                  </pre>
                </div>
              </div>

              {/* Architectural Rationale */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-gray-300 leading-relaxed">
                <strong className="text-cyan">Architectural Rationale:</strong> {item.why}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
