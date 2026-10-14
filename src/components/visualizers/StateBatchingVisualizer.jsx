import React, { useState, useRef } from 'react';
import { AlertCircle, CheckCircle, RefreshCcw, Layers } from 'lucide-react';

export default function StateBatchingVisualizer() {
  const [count, setCount] = useState(0);
  const [renderCount, setRenderCount] = useState(1);
  const [lastAction, setLastAction] = useState('Initialized with count = 0');
  const [batchingDemo, setBatchingDemo] = useState({
    title: 'Select a test case above',
    detail: 'Run tests to observe how React manages render passes and snapshot states.',
    status: 'idle'
  });

  // Track renders
  const renderRef = useRef(1);

  // 1. Snapshot test (setCount(count + 1) x 3)
  const testSnapshotTriple = () => {
    renderRef.current += 1;
    setRenderCount(renderRef.current);
    
    // Captured snapshot value
    const snapshotVal = count;
    setCount(snapshotVal + 1);
    setCount(snapshotVal + 1);
    setCount(snapshotVal + 1);

    setLastAction(`Called setCount(count + 1) three times. Captured snapshot was ${snapshotVal}.`);
    setBatchingDemo({
      title: '⚠️ Snapshot Trap Detected!',
      detail: `All 3 calls evaluated with count = ${snapshotVal}. The next state resolved to ${snapshotVal + 1}, NOT ${snapshotVal + 3}!`,
      status: 'warning'
    });
  };

  // 2. Functional updater test (setCount(prev => prev + 1) x 3)
  const testFunctionalTriple = () => {
    renderRef.current += 1;
    setRenderCount(renderRef.current);

    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);

    setLastAction('Called setCount(prev => prev + 1) three times via updater functions.');
    setBatchingDemo({
      title: '✅ Perfect Functional Updates!',
      detail: 'React queued the 3 updater functions sequentially in memory: prev + 1 (+3 total) in a single batched render pass!',
      status: 'success'
    });
  };

  // 3. React 19 Auto-Batching in Async setTimeout
  const testAsyncBatching = () => {
    setLastAction('Triggered async setTimeout test...');
    setBatchingDemo({
      title: '⏳ Waiting 400ms for async callback...',
      detail: 'In older React 17, async callbacks caused 2 separate renders. In React 18/19, automatic batching combines them into 1!',
      status: 'pending'
    });

    setTimeout(() => {
      renderRef.current += 1;
      setRenderCount(renderRef.current);
      setCount(c => c + 10);
      setLastAction('Async state update finished (+10 to count). Single batched render pass.');
      setBatchingDemo({
        title: '✨ Automatic Batching Complete!',
        detail: 'React 19 batched all state updates inside the setTimeout callback into a single atomic render pass.',
        status: 'success'
      });
    }, 400);
  };

  const handleReset = () => {
    setCount(0);
    renderRef.current = 1;
    setRenderCount(1);
    setLastAction('Reset state to initial values.');
    setBatchingDemo({
      title: 'State Reset',
      detail: 'Try running the tests again to compare updater styles.',
      status: 'idle'
    });
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Layers className="text-cyan" size={20} />
          <h3 className="text-lg font-bold">State Snapshots & Batching Simulator</h3>
        </div>
        <button onClick={handleReset} className="btn-icon" title="Reset Values">
          <RefreshCcw size={16} />
        </button>
      </div>

      <p className="visualizer-desc">
        Observe the classic React "State Snapshot" dilemma. See why calling <code>setState(count + 1)</code> three times only adds 1, while <code>setState(prev =&gt; prev + 1)</code> reliably adds 3.
      </p>

      {/* Metric Counters */}
      <div className="stats-metric-grid">
        <div className="metric-box">
          <span className="metric-label">Current State (count)</span>
          <span className="metric-value font-mono text-cyan">{count}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Total Component Renders</span>
          <span className="metric-value font-mono text-purple">{renderCount}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Batching Status</span>
          <span className="metric-value font-mono text-emerald">Active (React 19)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="controls-row">
        <button 
          onClick={testSnapshotTriple} 
          className="btn-control btn-warning"
          id="btn-test-snapshot"
        >
          <AlertCircle size={15} /> Run: setCount(count + 1) × 3
        </button>
        <button 
          onClick={testFunctionalTriple} 
          className="btn-control btn-primary"
          id="btn-test-updater"
        >
          <CheckCircle size={15} /> Run: setCount(prev =&gt; prev + 1) × 3
        </button>
        <button 
          onClick={testAsyncBatching} 
          className="btn-control"
          id="btn-test-async"
        >
          ⚡ Test Async Batching (+10)
        </button>
      </div>

      {/* Educational Feedback Panel */}
      <div className={`status-feedback-box status-${batchingDemo.status}`}>
        <h4 className="feedback-title">{batchingDemo.title}</h4>
        <p className="feedback-detail">{batchingDemo.detail}</p>
        <div className="feedback-footnote">
          <strong>Latest Event:</strong> {lastAction}
        </div>
      </div>
    </div>
  );
}
