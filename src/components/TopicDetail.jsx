import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Circle, ArrowRight, ArrowLeft, Copy, Check, 
  HelpCircle, AlertTriangle, Lightbulb, Code2, Sparkles, Clock, BookOpen, ChevronDown, ChevronUp 
} from 'lucide-react';
import VisualizerDispatcher from './visualizers/VisualizerDispatcher';

export default function TopicDetail({ 
  topic, 
  onSelectTopic, 
  allTopics, 
  completedTopics, 
  toggleCompleted 
}) {
  const [copied, setCopied] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [antiPatternTab, setAntiPatternTab] = useState('good'); // 'bad' | 'good'

  const currentIndex = allTopics.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  const isCompleted = completedTopics.includes(topic.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(topic.codeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCompleteClick = () => {
    const nextState = !isCompleted;
    toggleCompleted(topic.id);
    if (nextState) {
      // Trigger festive celebratory confetti!
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <article className="topic-detail-container">
      {/* Breadcrumb & Navigation Header */}
      <header className="topic-header-bar">
        <div className="breadcrumb-row">
          <span className="breadcrumb-level font-mono text-cyan">{topic.levelName}</span>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-badge">{topic.badge}</span>
          <span className="breadcrumb-divider">•</span>
          <span className="breadcrumb-time flex items-center gap-1">
            <Clock size={13} /> {topic.time}
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mt-2">
          <h1 className="topic-main-title">{topic.title}</h1>
          <button 
            onClick={handleCompleteClick}
            className={`btn-complete-topic ${isCompleted ? 'completed' : ''}`}
            id="btn-mark-completed"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Topic Mastered</span>
              </>
            ) : (
              <>
                <Circle size={18} />
                <span>Mark as Mastered</span>
              </>
            )}
          </button>
        </div>
        <p className="topic-summary-text">{topic.summary}</p>
      </header>

      {/* Interactive Visualizer / Live Playground Section */}
      <section className="topic-section">
        <div className="section-title-row">
          <div className="flex items-center gap-2">
            <Sparkles className="text-cyan" size={20} />
            <h2 className="section-title">Interactive Visual Playground</h2>
          </div>
          <span className="text-xs text-gray-400">Interact to understand under-the-hood behavior</span>
        </div>
        
        <VisualizerDispatcher visualizerId={topic.visualizerId} />
      </section>

      {/* Conceptual Overview & Mental Model */}
      <section className="topic-section">
        <div className="section-title-row">
          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-400" size={20} />
            <h2 className="section-title">Deep Dive: Mental Model & Concepts</h2>
          </div>
        </div>

        <div className="overview-prose">
          {topic.overview.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="overview-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Takeaways Cards */}
        <div className="key-takeaways-card">
          <div className="takeaways-header">
            <Lightbulb size={18} className="text-amber-400" />
            <h3 className="font-bold text-sm">Key Principles to Remember</h3>
          </div>
          <ul className="takeaways-list">
            {topic.keyConcepts.map((concept, idx) => (
              <li key={idx} className="takeaway-item">
                <Check size={15} className="text-cyan mt-1 flex-shrink-0" />
                <span>{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Code Breakdown Section */}
      <section className="topic-section">
        <div className="section-title-row">
          <div className="flex items-center gap-2">
            <Code2 className="text-emerald-400" size={20} />
            <h2 className="section-title">{topic.codeExample.title}</h2>
          </div>
          <button onClick={handleCopyCode} className="btn-copy">
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="code-viewer-container">
          <pre className="code-block-syntax">
            <code>{topic.codeExample.code}</code>
          </pre>
          <div className="code-explanation-bar">
            <strong>Insight:</strong> {topic.codeExample.explanation}
          </div>
        </div>
      </section>

      {/* Anti-Patterns & Pitfalls Comparator */}
      {topic.antiPattern && (
        <section className="topic-section">
          <div className="section-title-row">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={20} />
              <h2 className="section-title">Pitfalls & The React Way</h2>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setAntiPatternTab('bad')}
                className={`btn-control text-xs ${antiPatternTab === 'bad' ? 'btn-danger' : 'btn-outline'}`}
              >
                ❌ The Pitfall (Wrong)
              </button>
              <button 
                onClick={() => setAntiPatternTab('good')}
                className={`btn-control text-xs ${antiPatternTab === 'good' ? 'btn-success' : 'btn-outline'}`}
              >
                ✅ The React Way (Correct)
              </button>
            </div>
          </div>

          <div className={`anti-pattern-box ${antiPatternTab === 'bad' ? 'border-rose-800 bg-rose-950/20' : 'border-emerald-800 bg-emerald-950/20'}`}>
            <pre className="code-block-syntax">
              <code>{antiPatternTab === 'bad' ? topic.antiPattern.bad : topic.antiPattern.good}</code>
            </pre>
            <div className="anti-pattern-why">
              <strong>Why this matters:</strong> {topic.antiPattern.explanation}
            </div>
          </div>
        </section>
      )}

      {/* Interview Readiness Q&A */}
      {topic.interviewQuestions && topic.interviewQuestions.length > 0 && (
        <section className="topic-section">
          <div className="section-title-row">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-indigo-400" size={20} />
              <h2 className="section-title">Interview Readiness: Top Questions</h2>
            </div>
            <span className="text-xs text-gray-400">Click to reveal model answers</span>
          </div>

          <div className="space-y-3">
            {topic.interviewQuestions.map((qa, idx) => (
              <div key={idx} className="interview-qa-card">
                <button 
                  onClick={() => handleToggleQuestion(idx)}
                  className="qa-question-button"
                >
                  <span className="font-semibold text-sm text-left">{qa.q}</span>
                  {expandedQuestions[idx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedQuestions[idx] && (
                  <div className="qa-answer-prose">
                    <p>{qa.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Previous / Next Pagination Navigation */}
      <footer className="topic-footer-nav">
        {prevTopic ? (
          <button 
            onClick={() => onSelectTopic(prevTopic.id)}
            className="btn-nav-prev"
            id="btn-prev-topic"
          >
            <ArrowLeft size={16} />
            <div className="text-left">
              <small className="block text-gray-400 text-xs">Previous Concept</small>
              <strong className="text-sm">{prevTopic.title}</strong>
            </div>
          </button>
        ) : <div />}

        {nextTopic ? (
          <button 
            onClick={() => onSelectTopic(nextTopic.id)}
            className="btn-nav-next"
            id="btn-next-topic"
          >
            <div className="text-right">
              <small className="block text-gray-400 text-xs">Next Concept</small>
              <strong className="text-sm">{nextTopic.title}</strong>
            </div>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div className="completion-card">
            <CheckCircle2 size={24} className="text-emerald-400" />
            <span>Congratulations! You reached the end of the curriculum.</span>
          </div>
        )}
      </footer>
    </article>
  );
}
