import React, { useState, useRef, useCallback } from 'react';
import { Activity, Flame, ShieldAlert, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function ReRenderProfiler() {
  const [parentCount, setParentCount] = useState(0);
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true);

  // Render counters
  const parentRenders = useRef(1);
  const childARenders = useRef(1);
  const childBRenders = useRef(1);

  // Flash triggers
  const [flashA, setFlashA] = useState(0);
  const [flashB, setFlashB] = useState(0);

  const incrementParent = () => {
    parentRenders.current += 1;
    childARenders.current += 1;
    setFlashA(prev => prev + 1);

    if (!useCallbackEnabled) {
      // Inline function causes Child B props to fail shallow equality!
      childBRenders.current += 1;
      setFlashB(prev => prev + 1);
    }

    setParentCount(c => c + 1);
  };

  const handleReset = () => {
    parentRenders.current = 1;
    childARenders.current = 1;
    childBRenders.current = 1;
    setParentCount(0);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Activity className="text-rose-400" size={20} />
          <h3 className="text-lg font-bold">React Re-render Profiler & Memoization Inspector</h3>
        </div>
        <button onClick={handleReset} className="btn-icon" title="Reset Counts">
          Reset
        </button>
      </div>

      <p className="visualizer-desc">
        Watch how parent state updates cascade down child components. Notice how <strong>React.memo + useCallback</strong> shields Child B from unnecessary renders, while Child A suffers wasted render cycles.
      </p>

      {/* Control Configuration Bar */}
      <div className="config-bar mb-4 p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-cyan" />
          <span className="text-sm font-semibold">Callback Memoization:</span>
        </div>
        <button 
          onClick={() => setUseCallbackEnabled(!useCallbackEnabled)}
          className={`btn-control ${useCallbackEnabled ? 'btn-success' : 'btn-warning'}`}
          id="btn-toggle-usecallback"
        >
          {useCallbackEnabled ? '✅ useCallback: ENABLED (Stable)' : '⚠️ Inline Function (New Reference Each Render)'}
        </button>
      </div>

      {/* Parent Component Box */}
      <div className="parent-component-box">
        <div className="component-title-row">
          <span className="comp-tag parent-tag">Parent Component</span>
          <span className="render-pill">Renders: {parentRenders.current}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-xs text-gray-400">Parent State:</span>
            <span className="font-mono text-cyan ml-2 text-lg font-bold">{parentCount}</span>
          </div>
          <button onClick={incrementParent} className="btn-control btn-primary" id="btn-inc-parent">
            <Flame size={14} /> Update Parent State
          </button>
        </div>

        {/* Children Visual Tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Child A: Standard Un-memoized */}
          <div className={`child-card child-unmemoized flash-animation-${flashA % 2}`}>
            <div className="child-card-header">
              <span className="comp-tag unmemoized-tag">Child A: Default Component</span>
              <span className="render-counter-pill wasted">
                {childARenders.current} Renders
              </span>
            </div>
            <p className="child-desc">
              Does NOT use React.memo. Re-renders automatically on every parent tick, even though its own props did not change!
            </p>
            <div className="status-tag-row">
              <span className="status-badge-inline unmounted">
                <ShieldAlert size={12} /> Wasted Re-render Detected
              </span>
            </div>
          </div>

          {/* Child B: React.memo */}
          <div className={`child-card child-memoized ${!useCallbackEnabled ? `flash-animation-${flashB % 2}` : ''}`}>
            <div className="child-card-header">
              <span className="comp-tag memoized-tag">Child B: React.memo(Component)</span>
              <span className={`render-counter-pill ${useCallbackEnabled ? 'optimal' : 'wasted'}`}>
                {childBRenders.current} Renders
              </span>
            </div>
            <p className="child-desc">
              Uses React.memo. Compares props shallowly with Object.is.
            </p>
            <div className="status-tag-row">
              {useCallbackEnabled ? (
                <span className="status-badge-inline mounted">
                  <Sparkles size={12} /> Render Bailed Out (Optimized)
                </span>
              ) : (
                <span className="status-badge-inline unmounted">
                  <ShieldAlert size={12} /> Shallow comparison failed due to inline fn!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
