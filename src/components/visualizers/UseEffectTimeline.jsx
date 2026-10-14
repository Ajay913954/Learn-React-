import React, { useState } from 'react';
import { Play, RotateCcw, Power, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export default function UseEffectTimeline() {
  const [isMounted, setIsMounted] = useState(true);
  const [depA, setDepA] = useState(1);
  const [depB, setDepB] = useState('idle');
  const [logs, setLogs] = useState([
    { id: 1, phase: '1. RENDER', desc: 'Component rendered initial JSX (depA=1, depB="idle")', type: 'render' },
    { id: 2, phase: '2. PAINT', desc: 'Browser painted pixels to the screen', type: 'paint' },
    { id: 3, phase: '3. EFFECT', desc: 'useEffect callback executed: setup subscription', type: 'effect' }
  ]);
  const [currentStep, setCurrentStep] = useState('mounted');

  const addLog = (phase, desc, type) => {
    setLogs(prev => [
      { id: Date.now() + Math.random(), phase, desc, type },
      ...prev.slice(0, 7)
    ]);
  };

  const handleUpdateDepA = () => {
    const nextVal = depA + 1;
    setDepA(nextVal);
    setCurrentStep('updating');
    addLog('1. RENDER', `State changed: depA is now ${nextVal}. Re-rendered.`, 'render');
    addLog('2. PAINT', 'Browser painted updated DOM.', 'paint');
    addLog('3. CLEANUP', `Previous cleanup executed for depA=${depA}`, 'cleanup');
    addLog('4. EFFECT', `New effect executed with depA=${nextVal}`, 'effect');
  };

  const handleToggleDepB = () => {
    const nextStatus = depB === 'idle' ? 'connected' : 'idle';
    setDepB(nextStatus);
    setCurrentStep('updating');
    addLog('1. RENDER', `depB changed to "${nextStatus}". Re-rendered.`, 'render');
    addLog('2. PAINT', 'Browser painted updated DOM.', 'paint');
    addLog('3. CLEANUP', `Cleaned up previous effect for depB="${depB}"`, 'cleanup');
    addLog('4. EFFECT', `New effect subscribed with depB="${nextStatus}"`, 'effect');
  };

  const handleToggleMount = () => {
    if (isMounted) {
      setIsMounted(false);
      setCurrentStep('unmounted');
      addLog('1. UNMOUNT', 'Component removed from DOM hierarchy.', 'unmount');
      addLog('2. CLEANUP', 'Final cleanup function executed. Subscriptions/timers cancelled.', 'cleanup');
    } else {
      setIsMounted(true);
      setCurrentStep('mounted');
      addLog('1. MOUNT', 'Component re-mounted to DOM.', 'render');
      addLog('2. PAINT', 'Screen painted fresh.', 'paint');
      addLog('3. EFFECT', 'Initial mount effect callback fired.', 'effect');
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Clock className="text-indigo" size={20} />
          <h3 className="text-lg font-bold">useEffect Lifecycle & Cleanup Timeline</h3>
        </div>
        <button onClick={handleClearLogs} className="btn-icon" title="Clear Event Log">
          <RotateCcw size={16} />
        </button>
      </div>

      <p className="visualizer-desc">
        Interact with state dependencies or toggle mounting. Follow the exact chronological execution order: 
        <strong> Render → Browser Paint → Previous Cleanup → New Effect</strong>.
      </p>

      {/* Interactive Controls */}
      <div className="controls-row">
        <button 
          onClick={handleUpdateDepA} 
          disabled={!isMounted}
          className="btn-control"
          id="btn-update-dep-a"
        >
          <Play size={14} /> Update depA ({depA} → {depA + 1})
        </button>
        <button 
          onClick={handleToggleDepB} 
          disabled={!isMounted}
          className="btn-control"
          id="btn-update-dep-b"
        >
          <Play size={14} /> Toggle depB ("{depB}")
        </button>
        <button 
          onClick={handleToggleMount} 
          className={`btn-control ${isMounted ? 'btn-danger' : 'btn-success'}`}
          id="btn-toggle-mount"
        >
          <Power size={14} /> {isMounted ? 'Unmount Component' : 'Remount Component'}
        </button>
      </div>

      {/* Visual Sequence Flow Diagram */}
      <div className="lifecycle-stepper">
        <div className={`step-node ${isMounted ? 'active' : 'inactive'}`}>
          <div className="step-num">1</div>
          <div className="step-text">
            <strong>Render Phase</strong>
            <small>Pure JSX evaluation</small>
          </div>
        </div>
        <ArrowRight size={18} className="step-arrow" />
        <div className={`step-node ${isMounted ? 'active' : 'inactive'}`}>
          <div className="step-num">2</div>
          <div className="step-text">
            <strong>Browser Paint</strong>
            <small>DOM visible to user</small>
          </div>
        </div>
        <ArrowRight size={18} className="step-arrow" />
        <div className="step-node active-cleanup">
          <div className="step-num">3</div>
          <div className="step-text">
            <strong>Cleanup Function</strong>
            <small>Runs before re-run</small>
          </div>
        </div>
        <ArrowRight size={18} className="step-arrow" />
        <div className={`step-node ${isMounted ? 'active-effect' : 'inactive'}`}>
          <div className="step-num">4</div>
          <div className="step-text">
            <strong>Effect Execution</strong>
            <small>Sync with outside world</small>
          </div>
        </div>
      </div>

      {/* Dependency Array Inspector */}
      <div className="dep-inspector-box">
        <div className="font-mono text-sm">
          <span className="text-gray-400">useEffect(</span>
          <span className="text-cyan">() =&gt; &#123; /* effect */ return () =&gt; /* cleanup */ &#125;</span>, 
          <span className="text-amber-400"> [depA: {depA}, depB: "{depB}"]</span>
          <span className="text-gray-400">)</span>
        </div>
        <span className={`status-badge-inline ${isMounted ? 'mounted' : 'unmounted'}`}>
          {isMounted ? 'Component: Mounted' : 'Component: Unmounted'}
        </span>
      </div>

      {/* Chronological Event History */}
      <div className="timeline-log-container">
        <div className="timeline-log-header">
          <ShieldCheck size={14} className="text-emerald" />
          <span>Real-Time Execution Trace (Latest First)</span>
        </div>
        <div className="timeline-log-list">
          {logs.map((log) => (
            <div key={log.id} className={`timeline-log-row log-${log.type}`}>
              <span className="timeline-phase-tag">{log.phase}</span>
              <span className="timeline-desc">{log.desc}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="empty-log">No events yet. Click buttons above!</div>
          )}
        </div>
      </div>
    </div>
  );
}
