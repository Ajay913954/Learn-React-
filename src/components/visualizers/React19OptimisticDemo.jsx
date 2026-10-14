import React, { useState, useOptimistic, useTransition } from 'react';
import { Heart, MessageSquare, Send, AlertTriangle, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react';

export default function React19OptimisticDemo() {
  // Underlying true server state
  const [likes, setLikes] = useState(42);
  const [messages, setMessages] = useState([
    { id: 1, text: 'React 19 Actions simplify form handling so much!', sending: false },
    { id: 2, text: 'The useOptimistic hook feels like real-time magic.', sending: false }
  ]);
  const [shouldFail, setShouldFail] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const [isPending, startTransition] = useTransition();

  // 1. React 19 useOptimistic for Likes
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (current, updateVal) => current + updateVal
  );

  // 2. React 19 useOptimistic for Messages
  const [optimisticMessages, setOptimisticMessages] = useOptimistic(
    messages,
    (current, newText) => [
      ...current,
      { id: Date.now(), text: newText, sending: true }
    ]
  );

  // Handler for like action
  const handleLike = () => {
    setErrorNotice('');
    setSuccessNotice('');

    startTransition(async () => {
      // 🚀 Step 1: Instantly show optimistic increment (0ms)
      setOptimisticLikes(1);

      // ⏳ Step 2: Simulate network latency (800ms)
      await new Promise(r => setTimeout(r, 800));

      // ❌ Simulated network error case
      if (shouldFail) {
        setErrorNotice('Server 500 error! React automatically rolled back the like.');
        return; // Transition completes with no setLikes -> optimistic state rolls back!
      }

      // ✅ Server success: Commit to true state
      setLikes(prev => prev + 1);
      setSuccessNotice('Server confirmed like! True state updated.');
    });
  };

  // Handler for posting message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const input = e.target.elements.msg;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    setErrorNotice('');
    setSuccessNotice('');

    startTransition(async () => {
      // 🚀 Step 1: Instantly appear in feed optimistically
      setOptimisticMessages(text);

      // ⏳ Step 2: Network latency
      await new Promise(r => setTimeout(r, 900));

      if (shouldFail) {
        setErrorNotice('Message delivery failed! Rolled back from feed.');
        return; // Auto rollback!
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now(), text, sending: false }
      ]);
      setSuccessNotice('Message persisted to database.');
    });
  };

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-400" size={20} />
          <h3 className="text-lg font-bold">React 19 useOptimistic & Rollback Simulator</h3>
        </div>
        <span className="badge-pill bg-emerald-950 text-emerald-400 border border-emerald-800">
          React 19 Native Hook
        </span>
      </div>

      <p className="visualizer-desc">
        Experience zero-latency optimistic UI. When you click Like or post a message, React reflects it in <strong>0ms</strong>.
        If the server fails, React automatically rolls back without messy manual cleanup code!
      </p>

      {/* Server Simulation Failure Switch */}
      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between mb-4">
        <div>
          <strong className="text-sm block">Simulate Server Fault (Error Injection)</strong>
          <span className="text-xs text-gray-400">Test automatic UI rollback behavior</span>
        </div>
        <button 
          onClick={() => setShouldFail(!shouldFail)}
          className={`btn-control ${shouldFail ? 'btn-danger' : 'btn-success'}`}
          id="btn-toggle-fault"
        >
          {shouldFail ? '⚠️ Server Failure: ON' : '✅ Server Healthy: 200 OK'}
        </button>
      </div>

      {/* Social Post Feed Box */}
      <div className="social-post-card">
        <div className="post-author-row">
          <div className="post-avatar">⚛</div>
          <div>
            <h4 className="post-author">React 19 Release Feed</h4>
            <span className="post-meta">Published to Community</span>
          </div>
        </div>

        <p className="post-body">
          Actions, <code>useActionState</code>, and <code>useOptimistic</code> redefine how we handle asynchronous data in modern React. No more boilerplate!
        </p>

        {/* Like Button with optimistic counter */}
        <div className="post-actions-row">
          <button 
            onClick={handleLike} 
            disabled={isPending}
            className={`btn-like ${optimisticLikes > likes ? 'liked-optimistic' : ''}`}
            id="btn-like-post"
          >
            <Heart size={18} className={optimisticLikes > likes ? 'fill-rose-500 text-rose-500' : ''} />
            <span>{optimisticLikes} Likes</span>
            {optimisticLikes > likes && (
              <span className="optimistic-tag">⚡ Optimistic</span>
            )}
          </button>
          <span className="comment-count-text">
            <MessageSquare size={16} /> {optimisticMessages.length} comments
          </span>
        </div>

        {/* Comment Stream */}
        <div className="comments-stream">
          {optimisticMessages.map(msg => (
            <div key={msg.id} className={`comment-bubble ${msg.sending ? 'optimistic-pending' : ''}`}>
              <span>{msg.text}</span>
              {msg.sending && (
                <span className="comment-sending-badge">Sending...</span>
              )}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="comment-form">
          <input 
            name="msg" 
            placeholder="Write a comment (instant optimistic preview)..." 
            className="input-demo flex-1"
            disabled={isPending}
          />
          <button type="submit" disabled={isPending} className="btn-control btn-primary">
            <Send size={14} /> Send
          </button>
        </form>
      </div>

      {/* Notifications */}
      {errorNotice && (
        <div className="feedback-banner error-banner mt-3 flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{errorNotice}</span>
        </div>
      )}
      {successNotice && (
        <div className="feedback-banner success-banner mt-3 flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successNotice}</span>
        </div>
      )}
    </div>
  );
}
