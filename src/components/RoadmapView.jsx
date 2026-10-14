import React from 'react';
import { 
  Sparkles, Layers, Cpu, Zap, CheckCircle2, Circle, ArrowRight, BookOpen, Clock 
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';

export default function RoadmapView({ topics, onSelectTopic, completedTopics }) {
  const getLevelIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={18} />;
      case 'Layers': return <Layers size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'Zap': return <Zap size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div className="roadmap-view-container">
      {/* Hero Intro */}
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-badge">
          <Sparkles size={14} className="text-cyan" />
          <span>Curated Learning Pathway</span>
        </div>
        <h1 className="roadmap-hero-title">React Mastery Learning Roadmap</h1>
        <p className="roadmap-hero-desc">
          Follow this structured architectural roadmap from core JSX primitives to React 19 Actions and Fiber reconciliation.
          Click any milestone to open its visual sandbox, code patterns, and interview breakdown.
        </p>
      </div>

      {/* Levels Pathway */}
      <div className="roadmap-levels-stack">
        {CURRICULUM_LEVELS.map((level, levelIdx) => {
          const levelTopics = topics.filter(t => t.level === level.id);
          const completedCount = levelTopics.filter(t => completedTopics.includes(t.id)).length;
          const progressPercent = levelTopics.length > 0 
            ? Math.round((completedCount / levelTopics.length) * 100) 
            : 0;

          return (
            <div key={level.id} className="roadmap-level-track">
              {/* Level Header Card */}
              <div className="roadmap-track-header">
                <div className="flex items-center gap-3">
                  <div className="track-icon-badge" style={{ background: level.gradient }}>
                    {getLevelIcon(level.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="track-tag" style={{ color: level.color }}>{level.tag}</span>
                      <h2 className="track-title">{level.name}</h2>
                    </div>
                    <p className="track-desc">{level.description}</p>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="track-progress-block">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-400">Track Progress:</span>
                    <strong style={{ color: level.color }}>{completedCount} / {levelTopics.length} ({progressPercent}%)</strong>
                  </div>
                  <div className="progress-bar-rail">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progressPercent}%`, background: level.gradient }} 
                    />
                  </div>
                </div>
              </div>

              {/* Milestones Cards Grid */}
              <div className="roadmap-milestones-grid">
                {levelTopics.map((topic, topicIdx) => {
                  const isDone = completedTopics.includes(topic.id);

                  return (
                    <div 
                      key={topic.id}
                      onClick={() => onSelectTopic(topic.id)}
                      className={`roadmap-node-card ${isDone ? 'node-done' : ''}`}
                      id={`node-${topic.id}`}
                    >
                      <div className="node-top-row">
                        <span className="node-index font-mono">0{topicIdx + 1}</span>
                        <span className="node-badge">{topic.badge}</span>
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />
                        ) : (
                          <Circle size={16} className="text-gray-500 ml-auto" />
                        )}
                      </div>

                      <h3 className="node-title">{topic.title}</h3>
                      <p className="node-summary">{topic.summary}</p>

                      <div className="node-footer">
                        <span className="node-time flex items-center gap-1">
                          <Clock size={12} /> {topic.time}
                        </span>
                        <span className="node-link flex items-center gap-1">
                          Explore <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {levelIdx < CURRICULUM_LEVELS.length - 1 && (
                <div className="roadmap-connector-line">
                  <div className="connector-pulse-dot" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
