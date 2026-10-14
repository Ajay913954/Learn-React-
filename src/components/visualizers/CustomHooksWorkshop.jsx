import React, { useState, useEffect } from 'react';
import { Sliders, Search, Database, ToggleLeft, ToggleRight, Laptop } from 'lucide-react';

export default function CustomHooksWorkshop() {
  const [activeTab, setActiveTab] = useState('debounce');

  // --- 1. useDebounce Demo State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [rawApiCount, setRawApiCount] = useState(0);
  const [debouncedApiCount, setDebouncedApiCount] = useState(0);

  useEffect(() => {
    if (searchTerm) setRawApiCount(c => c + 1);
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (searchTerm) setDebouncedApiCount(c => c + 1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // --- 2. useLocalStorage Demo State ---
  const [localKey, setLocalKey] = useState('react_user_name');
  const [localValue, setLocalValue] = useState(() => {
    return localStorage.getItem('react_user_name') || 'Guest Explorer';
  });

  const handleSaveLocal = (val) => {
    setLocalValue(val);
    try {
      localStorage.setItem(localKey, val);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearLocal = () => {
    setLocalValue('');
    try {
      localStorage.removeItem(localKey);
    } catch (e) {
      console.warn(e);
    }
  };

  // --- 3. useToggle Demo State ---
  const [isToggled, setIsToggled] = useState(false);
  const [toggleMode, setToggleMode] = useState('Auto-Save Enabled');

  // --- 4. useWindowSize Simulator ---
  const [windowDims, setWindowDims] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDims({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Sliders className="text-cyan" size={20} />
          <h3 className="text-lg font-bold">Custom Hooks Interactive Workshop</h3>
        </div>
        <span className="badge-pill">4 Interactive Labs</span>
      </div>

      <p className="visualizer-desc">
        Custom hooks package reusable state logic into clean functions. Select a hook below to test its live behavior and review its implementation.
      </p>

      {/* Workshop Tabs */}
      <div className="workshop-tabs">
        <button 
          onClick={() => setActiveTab('debounce')} 
          className={`workshop-tab-btn ${activeTab === 'debounce' ? 'active' : ''}`}
        >
          <Search size={15} /> useDebounce()
        </button>
        <button 
          onClick={() => setActiveTab('storage')} 
          className={`workshop-tab-btn ${activeTab === 'storage' ? 'active' : ''}`}
        >
          <Database size={15} /> useLocalStorage()
        </button>
        <button 
          onClick={() => setActiveTab('toggle')} 
          className={`workshop-tab-btn ${activeTab === 'toggle' ? 'active' : ''}`}
        >
          <ToggleRight size={15} /> useToggle()
        </button>
        <button 
          onClick={() => setActiveTab('window')} 
          className={`workshop-tab-btn ${activeTab === 'window' ? 'active' : ''}`}
        >
          <Laptop size={15} /> useWindowSize()
        </button>
      </div>

      {/* Tab 1: useDebounce */}
      {activeTab === 'debounce' && (
        <div className="hook-lab-content">
          <div className="hook-lab-playground">
            <h4 className="font-semibold text-sm text-gray-300 mb-2">Live Search Simulator</h4>
            <input 
              type="text" 
              placeholder="Type quickly (e.g. 'React 19 Server Components')..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input-demo w-full mb-3"
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="metric-box bg-slate-800">
                <span className="metric-label">Without Debounce (Raw Keystrokes)</span>
                <span className="metric-value text-rose-400">{rawApiCount} API calls</span>
              </div>
              <div className="metric-box bg-slate-800">
                <span className="metric-label">With useDebounce(400ms)</span>
                <span className="metric-value text-emerald-400">{debouncedApiCount} API calls</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Debounced Query Value: <span className="text-cyan">"{debouncedTerm}"</span>
            </div>
          </div>
          <pre className="code-snippet-small mt-3">
{`function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Reset on every keypress!
  }, [value, delay]);
  return debouncedValue;
}`}
          </pre>
        </div>
      )}

      {/* Tab 2: useLocalStorage */}
      {activeTab === 'storage' && (
        <div className="hook-lab-content">
          <div className="hook-lab-playground">
            <h4 className="font-semibold text-sm text-gray-300 mb-2">Browser LocalStorage Sync</h4>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={localValue}
                onChange={e => handleSaveLocal(e.target.value)}
                placeholder="Type anything to auto-save to localStorage..."
                className="input-demo flex-1"
              />
              <button onClick={handleClearLocal} className="btn-control btn-danger">
                Clear Storage
              </button>
            </div>
            <div className="text-xs text-gray-400">
              Synced with browser key: <code className="text-cyan font-mono">{localKey}</code>. Refresh the page; this value persists!
            </div>
          </div>
          <pre className="code-snippet-small mt-3">
{`function useLocalStorage(key, initialValue) {
  const [val, setVal] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}`}
          </pre>
        </div>
      )}

      {/* Tab 3: useToggle */}
      {activeTab === 'toggle' && (
        <div className="hook-lab-content">
          <div className="hook-lab-playground">
            <h4 className="font-semibold text-sm text-gray-300 mb-2">useToggle() Boolean State Machine</h4>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700 mb-3">
              <div>
                <strong className="text-sm block">{toggleMode}</strong>
                <span className="text-xs text-gray-400">Current Boolean: {isToggled ? 'true' : 'false'}</span>
              </div>
              <button 
                onClick={() => setIsToggled(!isToggled)} 
                className={`btn-control ${isToggled ? 'btn-success' : 'btn-outline'}`}
              >
                {isToggled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {isToggled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
          <pre className="code-snippet-small mt-3">
{`function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}`}
          </pre>
        </div>
      )}

      {/* Tab 4: useWindowSize */}
      {activeTab === 'window' && (
        <div className="hook-lab-content">
          <div className="hook-lab-playground">
            <h4 className="font-semibold text-sm text-gray-300 mb-2">Live Window Viewport Dimensions</h4>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="metric-box bg-slate-800">
                <span className="metric-label">Viewport Width</span>
                <span className="metric-value text-cyan">{windowDims.width} px</span>
              </div>
              <div className="metric-box bg-slate-800">
                <span className="metric-label">Viewport Height</span>
                <span className="metric-value text-purple">{windowDims.height} px</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Resize your browser window to see these coordinates update dynamically through window resize events!</p>
          </div>
          <pre className="code-snippet-small mt-3">
{`function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}`}
          </pre>
        </div>
      )}
    </div>
  );
}
