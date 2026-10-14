import React, { useState, useRef } from 'react';
import { Target, RefreshCw, Eye, Sparkles } from 'lucide-react';

export default function RefVsStateVisualizer() {
  // 1. State variable
  const [stateCount, setStateCount] = useState(0);

  // 2. Ref variable (mutable, persistent, no re-render)
  const refCount = useRef(0);

  // 3. Render tracking
  const renderCountRef = useRef(1);
  renderCountRef.current += 1;

  // 4. Input ref for DOM access demo
  const inputRef = useRef(null);
  const [domMessage, setDomMessage] = useState('');

  const incrementState = () => {
    setStateCount(c => c + 1);
  };

  const incrementRef = () => {
    refCount.current += 1;
    // Note: No setState is called here, so screen will NOT show new refCount.current until next render!
  };

  const forceReRender = () => {
    setStateCount(c => c); // or trigger dummy state
    setDomMessage('Forced re-render! Now the screen reveals the hidden refCount.current.');
  };

  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
    setDomMessage('Direct DOM access: inputRef.current.focus() executed!');
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Target className="text-purple" size={20} />
          <h3 className="text-lg font-bold">useState vs useRef: Live Behavior Comparison</h3>
        </div>
        <div className="render-pulse-badge">
          <Sparkles size={14} className="text-amber-400" />
          <span>Render Count: <strong>{renderCountRef.current}</strong></span>
        </div>
      </div>

      <p className="visualizer-desc">
        Click <strong>Increment Ref</strong> multiple times. Notice that the screen does NOT update and the Render Count does NOT budge. 
        Then click <strong>Increment State</strong> or <strong>Force Re-render</strong> to see the accumulated ref value appear!
      </p>

      {/* Two Column Side-by-Side Comparison */}
      <div className="two-col-grid">
        {/* Left: useState Panel */}
        <div className="state-panel panel-left">
          <div className="panel-badge-top state-badge">useState (Reactive UI State)</div>
          <div className="panel-number-display text-cyan">
            {stateCount}
          </div>
          <p className="panel-expl">
            Calling <code>setState()</code> notifies React to re-render. Every click updates the UI immediately.
          </p>
          <button onClick={incrementState} className="btn-panel btn-cyan" id="btn-inc-state">
            Increment State (+1)
          </button>
        </div>

        {/* Right: useRef Panel */}
        <div className="state-panel panel-right">
          <div className="panel-badge-top ref-badge">useRef (Silent Mutable Memory)</div>
          <div className="panel-number-display text-purple">
            {refCount.current}
          </div>
          <p className="panel-expl">
            Modifying <code>ref.current</code> is synchronous and silent. <strong>Zero re-renders triggered!</strong>
          </p>
          <div className="flex gap-2 w-full">
            <button onClick={incrementRef} className="btn-panel btn-purple flex-1" id="btn-inc-ref">
              Increment Ref (+1)
            </button>
            <button onClick={forceReRender} className="btn-panel btn-outline" title="Trigger re-render to reveal current value">
              <RefreshCw size={14} /> Reveal
            </button>
          </div>
        </div>
      </div>

      {/* Direct DOM Access via useRef Demo */}
      <div className="dom-ref-demo-box">
        <div className="dom-ref-title">
          <Eye size={16} className="text-cyan" />
          <span>useRef for Direct DOM Node Access</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            ref={inputRef} 
            type="text" 
            defaultValue="Focus me via ref.current.focus()!" 
            className="input-demo flex-1"
          />
          <button onClick={focusInput} className="btn-control btn-primary" id="btn-focus-dom">
            Focus & Select DOM Node
          </button>
        </div>
        {domMessage && (
          <p className="dom-message-text">{domMessage}</p>
        )}
      </div>
    </div>
  );
}
