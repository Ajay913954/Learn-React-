import React, { useState, useRef, useTransition, use, Suspense } from 'react';
import { 
  Workflow, AlertTriangle, KeyRound, Globe, ExternalLink, 
  Sparkles, Check, CheckCircle2, Play, RefreshCw, Cpu 
} from 'lucide-react';

// ==========================================
// 1. PROPS FLOW & COMPOSITION VISUALIZER
// ==========================================
export function PropsFlowVisualizer() {
  const [userName, setUserName] = useState('Sarah Connor');
  const [themeColor, setThemeColor] = useState('cyan');
  const [drillMode, setDrillMode] = useState('composition'); // 'drill' | 'composition'

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Workflow className="text-cyan" size={20} />
          <h3 className="text-lg font-bold">Unidirectional Data Flow & Composition</h3>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setDrillMode('composition')}
            className={`btn-control text-xs ${drillMode === 'composition' ? 'btn-primary' : 'btn-outline'}`}
          >
            Children Composition (Clean)
          </button>
          <button 
            onClick={() => setDrillMode('drill')}
            className={`btn-control text-xs ${drillMode === 'drill' ? 'btn-warning' : 'btn-outline'}`}
          >
            Prop Drilling (Cluttered)
          </button>
        </div>
      </div>

      <p className="visualizer-desc">
        Data flows downward from parent to child. Using <code>props.children</code> composition lets parents inject content directly into deeply nested components without polluting intermediate layers.
      </p>

      <div className="flex items-center gap-3 mb-3">
        <input 
          value={userName} 
          onChange={e => setUserName(e.target.value)} 
          className="input-demo flex-1"
          placeholder="Type user name..."
        />
        <select 
          value={themeColor} 
          onChange={e => setThemeColor(e.target.value)}
          className="input-demo bg-slate-900"
        >
          <option value="cyan">Cyan Accent</option>
          <option value="purple">Purple Accent</option>
          <option value="emerald">Emerald Accent</option>
        </select>
      </div>

      {/* Visual Component Tree */}
      <div className="tree-container">
        <div className="tree-node tree-parent">
          <span className="tree-title">GrandParent Component (Holds State)</span>
          <div className="tree-body">
            state: &#123; user: "{userName}" &#125;
          </div>

          <div className="tree-connector">↓ passes down</div>

          <div className="tree-node tree-intermediate">
            <span className="tree-title">
              {drillMode === 'drill' ? 'MiddleWrapper (Forced to pass prop)' : 'MiddleWrapper (Pure Layout, untouched)'}
            </span>
            <div className="tree-body">
              {drillMode === 'drill' ? (
                <span className="text-amber-400 font-mono text-xs">props.userName (unnecessary burden)</span>
              ) : (
                <span className="text-emerald-400 font-mono text-xs">&#123;children&#125; slot</span>
              )}
            </div>

            <div className="tree-connector">↓ passes down</div>

            <div className="tree-node tree-leaf" style={{ borderColor: `var(--${themeColor}, #00d8ff)` }}>
              <span className="tree-title">LeafComponent (Consumes Data)</span>
              <div className="tree-body text-cyan font-bold">
                Hello, {userName}!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. LISTS & BROKEN KEY SIMULATOR
// ==========================================
export function ListsKeysVisualizer() {
  const [itemsWithKeys, setItemsWithKeys] = useState([
    { id: 'item-1', name: 'Task 1: Learn JSX' },
    { id: 'item-2', name: 'Task 2: Understand Hooks' },
    { id: 'item-3', name: 'Task 3: Build Portfolio' },
  ]);

  const [itemsWithIndexKeys, setItemsWithIndexKeys] = useState([
    { text: 'Task 1: Learn JSX' },
    { text: 'Task 2: Understand Hooks' },
    { text: 'Task 3: Build Portfolio' },
  ]);

  const deleteFirstStable = () => {
    setItemsWithKeys(prev => prev.slice(1));
  };

  const deleteFirstIndex = () => {
    setItemsWithIndexKeys(prev => prev.slice(1));
  };

  const resetLists = () => {
    setItemsWithKeys([
      { id: `item-${Date.now()}-1`, name: 'Task 1: Learn JSX' },
      { id: `item-${Date.now()}-2`, name: 'Task 2: Understand Hooks' },
      { id: `item-${Date.now()}-3`, name: 'Task 3: Build Portfolio' },
    ]);
    setItemsWithIndexKeys([
      { text: 'Task 1: Learn JSX' },
      { text: 'Task 2: Understand Hooks' },
      { text: 'Task 3: Build Portfolio' },
    ]);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <KeyRound className="text-amber-400" size={20} />
          <h3 className="text-lg font-bold">The "Key" Prop Visual Bug Lab</h3>
        </div>
        <button onClick={resetLists} className="btn-icon">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      <p className="visualizer-desc">
        Type some text into the input fields in both columns below. Then click <strong>"Delete Top Item"</strong> in each column.
        Notice how using <code>key=&#123;index&#125;</code> causes the input's typed text to jump to the wrong item because React reuses DOM nodes!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Stable ID Keys */}
        <div className="p-3 rounded-lg bg-slate-900 border border-emerald-800/60">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-emerald-400 text-sm">✅ Stable Unique ID Key</strong>
            <button onClick={deleteFirstStable} className="btn-control btn-danger text-xs">
              Delete Top Item
            </button>
          </div>
          <div className="space-y-2">
            {itemsWithKeys.map(item => (
              <div key={item.id} className="p-2 rounded bg-slate-800 flex items-center gap-2">
                <span className="text-xs text-gray-300 font-medium flex-1">{item.name}</span>
                <input placeholder="Type note here..." className="input-demo text-xs py-1 px-2 w-32" />
              </div>
            ))}
            {itemsWithKeys.length === 0 && <span className="text-xs text-gray-500">List is empty. Click reset!</span>}
          </div>
        </div>

        {/* Right: Index as Key (Buggy) */}
        <div className="p-3 rounded-lg bg-slate-900 border border-rose-800/60">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-rose-400 text-sm">❌ Index as Key (Buggy)</strong>
            <button onClick={deleteFirstIndex} className="btn-control btn-danger text-xs">
              Delete Top Item
            </button>
          </div>
          <div className="space-y-2">
            {itemsWithIndexKeys.map((item, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-800 flex items-center gap-2">
                <span className="text-xs text-gray-300 font-medium flex-1">{item.text}</span>
                <input placeholder="Type note here..." className="input-demo text-xs py-1 px-2 w-32" />
              </div>
            ))}
            {itemsWithIndexKeys.length === 0 && <span className="text-xs text-gray-500">List is empty. Click reset!</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CONTEXT API THEME & AUTH PROVIDER
// ==========================================
export function ContextVisualizer() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState({ name: 'Alex Developer', role: 'Staff Engineer', loggedIn: true });

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Globe className="text-indigo-400" size={20} />
          <h3 className="text-lg font-bold">Context Provider & Consumer Broadcast</h3>
        </div>
        <button 
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          className="btn-control"
        >
          Toggle Theme: {theme.toUpperCase()}
        </button>
      </div>

      <p className="visualizer-desc">
        Context acts as a telemetry broadcast tower. Any consumer deep in the tree taps into <code>useContext(AppContext)</code> without touching intermediate props.
      </p>

      {/* Simulated Context Provider Card */}
      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-300'}`}>
        <div className="flex justify-between items-center border-b pb-2 mb-3 border-slate-700/50">
          <span className="font-mono text-xs text-cyan font-bold">&lt;AppContext.Provider value=&#123;&#123; theme, user &#125;&#125;&gt;</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/40 text-cyan">Provider Scope</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-black/20 border border-white/10">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Consumer 1: Header Profile</h5>
            <p className="text-sm font-bold">{user.name}</p>
            <span className="text-xs text-emerald-400">{user.role}</span>
          </div>

          <div className="p-3 rounded-lg bg-black/20 border border-white/10">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Consumer 2: Settings Card</h5>
            <p className="text-sm">Active Theme Mode: <strong>{theme}</strong></p>
            <button 
              onClick={() => setUser(u => ({ ...u, loggedIn: !u.loggedIn }))}
              className="mt-2 text-xs py-1 px-2 rounded bg-indigo-600 text-white"
            >
              Toggle Auth ({user.loggedIn ? 'Logged In' : 'Logged Out'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. REACT 19 ACTIONS & FORM VISUALIZER
// ==========================================
export function React19ActionsVisualizer() {
  const [state, setState] = useState({ name: 'Ada Lovelace', email: 'ada@example.com' });
  const [isPending, setIsPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const simulateAction = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.username.value;
    const email = form.useremail.value;

    setIsPending(true);
    setStatusMessage('React 19 Action pending: coordinating transitions...');

    await new Promise(r => setTimeout(r, 1200));

    setState({ name, email });
    setIsPending(false);
    setStatusMessage('Action complete! State updated natively without manual boilerplate.');
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold">React 19 Actions & useActionState</h3>
        </div>
        <span className="badge-pill bg-emerald-950 text-emerald-400 border border-emerald-800">
          React 19 Feature
        </span>
      </div>

      <p className="visualizer-desc">
        In React 19, passing an async function to <code>&lt;form action&gt;</code> automatically handles loading states, error boundaries, and form resets!
      </p>

      <form onSubmit={simulateAction} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Username:</label>
            <input 
              name="username" 
              defaultValue={state.name} 
              disabled={isPending}
              className="input-demo w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Email Address:</label>
            <input 
              name="useremail" 
              defaultValue={state.email} 
              disabled={isPending}
              className="input-demo w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-cyan font-mono">
            {isPending ? '⏳ Action Transition In-Flight...' : '● Idle State Ready'}
          </span>
          <button 
            type="submit" 
            disabled={isPending} 
            className="btn-control btn-primary"
          >
            {isPending ? 'Submitting Action...' : 'Execute React 19 Action'}
          </button>
        </div>
      </form>

      {statusMessage && (
        <div className="feedback-banner success-banner mt-3">
          {statusMessage}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. FIBER ENGINE & RECONCILIATION WORK LOOP
// ==========================================
export function FiberVisualizer() {
  const [phase, setPhase] = useState('idle');
  const [activeFiberIndex, setActiveFiberIndex] = useState(-1);

  const fiberNodes = [
    { name: 'HostRootFiber', tag: 'Root' },
    { name: 'AppFiber', tag: 'Component' },
    { name: 'HeaderFiber', tag: 'Component' },
    { name: 'ContentFiber', tag: 'Component' },
    { name: 'ButtonFiber', tag: 'HostComponent (DOM)' }
  ];

  const runReconciliation = async () => {
    setPhase('render');
    for (let i = 0; i < fiberNodes.length; i++) {
      setActiveFiberIndex(i);
      await new Promise(r => setTimeout(r, 400));
    }
    setPhase('commit');
    await new Promise(r => setTimeout(r, 600));
    setPhase('idle');
    setActiveFiberIndex(-1);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Cpu className="text-purple-400" size={20} />
          <h3 className="text-lg font-bold">Fiber Engine Work Loop & Two-Phase Commit</h3>
        </div>
        <button onClick={runReconciliation} disabled={phase !== 'idle'} className="btn-control btn-primary text-xs">
          <Play size={12} /> Step Through Fiber Work Loop
        </button>
      </div>

      <p className="visualizer-desc">
        Watch the Fiber engine process units of work during the asynchronous <strong>Render Phase</strong>, then instantaneously swap pointers in the synchronous <strong>Commit Phase</strong>.
      </p>

      {/* Fiber Linked List Chain */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        {fiberNodes.map((fiber, idx) => (
          <div 
            key={fiber.name} 
            className={`p-3 rounded-lg border transition-all ${
              activeFiberIndex === idx 
                ? 'bg-cyan-950 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105' 
                : 'bg-slate-900 border-slate-800 text-gray-400'
            }`}
          >
            <div className="text-xs font-mono font-bold text-cyan">{fiber.name}</div>
            <div className="text-xs text-gray-400">{fiber.tag}</div>
            {activeFiberIndex === idx && (
              <span className="text-xs text-amber-300 font-bold block mt-1 animate-pulse">Computing Diff...</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 rounded bg-slate-950 border border-slate-800">
        <div className="text-xs">
          Current Engine Phase: <strong className="text-cyan uppercase">{phase}</strong>
        </div>
        <div className="text-xs text-gray-400">
          {phase === 'render' && 'Render Phase: Interruptible singly-linked list traversal'}
          {phase === 'commit' && 'Commit Phase: Swift synchronous DOM mutation batch'}
          {phase === 'idle' && 'Idle: Screen at 60fps'}
        </div>
      </div>
    </div>
  );
}
