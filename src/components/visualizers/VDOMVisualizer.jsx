import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Layers, CheckCircle2, Zap } from 'lucide-react';

export default function VDOMVisualizer() {
  const [userName, setUserName] = useState('Alex');
  const [isOnline, setIsOnline] = useState(true);
  const [unreadCount, setUnreadCount] = useState(2);
  const [mutationLog, setMutationLog] = useState([
    { id: 1, text: 'Initial DOM Tree rendered in browser.', time: '0ms' }
  ]);
  const [flashKey, setFlashKey] = useState(0);

  const handleUpdate = (type) => {
    let logText = '';
    if (type === 'name') {
      const names = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Maya'];
      const nextName = names[(names.indexOf(userName) + 1) % names.length];
      setUserName(nextName);
      logText = `Diff detected: textNode "#text" updated from "${userName}" to "${nextName}". Sibling nodes untouched.`;
    } else if (type === 'status') {
      setIsOnline(!isOnline);
      logText = `Diff detected: className on badge changed to "${!isOnline ? 'status-online' : 'status-offline'}".`;
    } else if (type === 'msg') {
      setUnreadCount(c => c + 1);
      logText = `Diff detected: unread counter text updated to ${unreadCount + 1}.`;
    }
    setFlashKey(prev => prev + 1);
    setMutationLog(prev => [
      { id: Date.now(), text: logText, time: `${Math.floor(Math.random() * 4) + 1}ms diff calculation` },
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Layers className="text-cyan" size={20} />
          <h3 className="text-lg font-bold">Virtual DOM & Reconciliation Diff Engine</h3>
        </div>
        <span className="badge-pill">Interactive Live Demo</span>
      </div>

      <p className="visualizer-desc">
        Trigger state updates below. Watch how React recalculates the lightweight Virtual DOM tree in memory, performs diffing, and only mutates the exact real DOM node changed!
      </p>

      {/* Control Buttons */}
      <div className="controls-row">
        <button 
          onClick={() => handleUpdate('name')} 
          className="btn-control"
          id="btn-vdom-name"
        >
          <RefreshCw size={14} /> Change Name
        </button>
        <button 
          onClick={() => handleUpdate('status')} 
          className="btn-control"
          id="btn-vdom-status"
        >
          <Zap size={14} /> Toggle Online Status
        </button>
        <button 
          onClick={() => handleUpdate('msg')} 
          className="btn-control"
          id="btn-vdom-msg"
        >
          <CheckCircle2 size={14} /> +1 Unread Message
        </button>
      </div>

      {/* Three Column Comparison: JSX -> Virtual DOM Object -> Real Browser DOM */}
      <div className="three-col-grid">
        {/* Col 1: JSX Representation */}
        <div className="col-box">
          <div className="col-header">
            <span className="col-tag">1. JSX Syntax</span>
          </div>
          <pre className="code-snippet-small">
{`<div className="profile-card">
  <h3>{"${userName}"}</h3>
  <span className="${isOnline ? 'online' : 'offline'}">
    "${isOnline ? 'Active' : 'Away'}"
  </span>
  <span className="badge">
    ${unreadCount} unread
  </span>
</div>`}
          </pre>
        </div>

        {/* Col 2: In-Memory Virtual DOM (Plain JS Object) */}
        <div className="col-box">
          <div className="col-header">
            <span className="col-tag">2. Virtual DOM (JS Tree)</span>
          </div>
          <pre className="code-snippet-small json-tree">
{`{
  type: 'div',
  props: {
    className: 'profile-card',
    children: [
      { type: 'h3', children: '${userName}' },
      { 
        type: 'span', 
        props: { className: '${isOnline ? "online" : "offline"}' }, 
        children: '${isOnline ? "Active" : "Away"}' 
      },
      { type: 'span', children: '${unreadCount} unread' }
    ]
  }
}`}
          </pre>
        </div>

        {/* Col 3: Rendered Real DOM with Flash */}
        <div className="col-box">
          <div className="col-header">
            <span className="col-tag">3. Real Browser DOM</span>
          </div>
          <div className={`rendered-dom-preview flash-target-${flashKey % 2}`}>
            <div className="preview-avatar">
              {userName[0]}
            </div>
            <div className="preview-info">
              <h4 className="preview-name">{userName}</h4>
              <div className="preview-status-row">
                <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? '● Active Now' : '○ Away'}
                </span>
                <span className="unread-pill">
                  {unreadCount} unread
                </span>
              </div>
            </div>
          </div>
          <small className="diff-highlight-text">
            ⚡ Notice the subtle green flash on update: only changed DOM nodes are touched!
          </small>
        </div>
      </div>

      {/* Live Diff Activity Log */}
      <div className="diff-log-section">
        <div className="diff-log-title">
          <span>Reconciliation Activity Log</span>
        </div>
        <div className="diff-log-list">
          {mutationLog.map(item => (
            <div key={item.id} className="diff-log-item">
              <span className="log-time">{item.time}</span>
              <span className="log-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
