import React, { useState, useMemo } from 'react';
import { Gauge, Clock, Zap, Check, AlertTriangle } from 'lucide-react';

export default function UseMemoBenchmark() {
  const [complexity, setComplexity] = useState(25);
  const [unrelatedCounter, setUnrelatedCounter] = useState(0);
  const [isMemoEnabled, setIsMemoEnabled] = useState(true);
  const [lastDuration, setLastDuration] = useState('0.02');
  const [cacheHit, setCacheHit] = useState(true);

  // Heavy computation function (calculating nth Fibonacci / prime series)
  const calculateExpensiveSum = (n) => {
    const t0 = performance.now();
    let sum = 0;
    // Controlled loop iterations
    const iterations = n * 40000;
    for (let i = 0; i < iterations; i++) {
      sum += Math.sqrt(i % 1000);
    }
    const t1 = performance.now();
    return { result: Math.round(sum), duration: (t1 - t0).toFixed(2) };
  };

  // With useMemo vs Without
  const memoizedComputation = useMemo(() => {
    const res = calculateExpensiveSum(complexity);
    setLastDuration(res.duration);
    setCacheHit(false);
    return res.result;
  }, [complexity]);

  const handleUnrelatedClick = () => {
    if (!isMemoEnabled) {
      // Re-run expensive calculation without memo!
      const res = calculateExpensiveSum(complexity);
      setLastDuration(res.duration);
      setCacheHit(false);
    } else {
      setLastDuration('0.01');
      setCacheHit(true);
    }
    setUnrelatedCounter(c => c + 1);
  };

  const handleComplexityChange = (val) => {
    setComplexity(val);
    const res = calculateExpensiveSum(val);
    setLastDuration(res.duration);
    setCacheHit(false);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Gauge className="text-amber-400" size={20} />
          <h3 className="text-lg font-bold">useMemo Performance Benchmark Lab</h3>
        </div>
        <span className={`badge-pill ${isMemoEnabled ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'}`}>
          {isMemoEnabled ? 'useMemo Active' : 'useMemo Disabled'}
        </span>
      </div>

      <p className="visualizer-desc">
        Test how memoizing heavy mathematical operations shields unrelated component re-renders from computational lag.
      </p>

      {/* Configuration Slider & Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-gray-400 font-semibold">Algorithm Iteration Load:</label>
            <span className="font-mono text-cyan text-sm">{complexity * 40000} ops</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="60" 
            value={complexity}
            onChange={e => handleComplexityChange(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <strong className="text-sm block">useMemo Cache Gate</strong>
            <span className="text-xs text-gray-400">Toggle memoization bypass</span>
          </div>
          <button 
            onClick={() => setIsMemoEnabled(!isMemoEnabled)}
            className={`btn-control ${isMemoEnabled ? 'btn-success' : 'btn-danger'}`}
            id="btn-toggle-memo"
          >
            {isMemoEnabled ? 'Memo: ON' : 'Memo: OFF'}
          </button>
        </div>
      </div>

      {/* Interactive Trigger Button */}
      <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-sm">Trigger Unrelated Parent Render</h4>
            <span className="text-xs text-gray-400">
              Clicks increment a counter unrelated to the algorithm: <strong>{unrelatedCounter}</strong>
            </span>
          </div>
          <button onClick={handleUnrelatedClick} className="btn-control btn-primary" id="btn-trigger-unrelated">
            <Zap size={14} /> Re-render Component
          </button>
        </div>
      </div>

      {/* Benchmark Live Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="metric-box bg-slate-900">
          <span className="metric-label">Execution Duration</span>
          <span className="metric-value font-mono text-cyan flex items-center gap-1">
            <Clock size={16} /> {lastDuration} ms
          </span>
        </div>
        <div className="metric-box bg-slate-900">
          <span className="metric-label">Cache Status</span>
          <span className={`metric-value font-mono ${cacheHit ? 'text-emerald-400' : 'text-amber-400'}`}>
            {cacheHit ? 'HIT (Reused)' : 'MISS (Recalculated)'}
          </span>
        </div>
        <div className="metric-box bg-slate-900">
          <span className="metric-label">Computed Result Hash</span>
          <span className="metric-value font-mono text-purple">
            {memoizedComputation.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
