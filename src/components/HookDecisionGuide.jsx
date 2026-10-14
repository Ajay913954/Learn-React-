import React, { useState } from 'react';
import { Compass, Sparkles, Check, ArrowRight, Code2, HelpCircle } from 'lucide-react';
import { HOOK_DECISION_TREE } from '../data/cheatSheetData';

export default function HookDecisionGuide() {
  const [selectedScenario, setSelectedScenario] = useState(HOOK_DECISION_TREE[0].id);

  const activeItem = HOOK_DECISION_TREE.find(item => item.id === selectedScenario) || HOOK_DECISION_TREE[0];

  return (
    <div className="guide-view-container">
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-badge">
          <Compass size={14} className="text-cyan" />
          <span>Interactive Decision Guide</span>
        </div>
        <h1 className="roadmap-hero-title">"Which Hook Should I Use?" Navigator</h1>
        <p className="roadmap-hero-desc">
          Never second-guess hook selection again. Pick your exact programming requirement below to get the optimal React architectural recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Scenarios List */}
        <div className="lg:col-span-5 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Select Your Goal or Scenario:
          </h2>
          {HOOK_DECISION_TREE.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setSelectedScenario(item.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedScenario === item.id
                  ? 'bg-cyan-950/40 border-cyan-400/80 shadow-md shadow-cyan-950 text-white'
                  : 'bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs text-cyan mt-0.5">0{idx + 1}.</span>
                <span className="text-sm font-medium leading-snug">{item.goal}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Recommendation & Code Card */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Recommended React Solution</span>
                <h3 className="text-2xl font-extrabold text-cyan font-mono mt-1">
                  {activeItem.recommendation}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-900/40 text-cyan border border-cyan-700/50">
                Optimal Choice
              </span>
            </div>

            <div className="mb-4">
              <span className="text-xs text-gray-400 font-semibold block mb-1">Architectural Rule of Thumb:</span>
              <p className="text-sm text-gray-200 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {activeItem.rule}
              </p>
            </div>

            {activeItem.secondary && (
              <div className="mb-4 text-xs text-gray-400">
                <strong>Alternative / Companion:</strong> <span className="text-purple-300">{activeItem.secondary}</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-400">
                <Code2 size={14} className="text-emerald-400" />
                <span>Standard Implementation Pattern:</span>
              </div>
              <pre className="code-snippet-small text-xs leading-relaxed">
                <code>{activeItem.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
