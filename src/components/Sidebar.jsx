import React, { useState } from 'react';
import { 
  Map, Compass, Bug, Zap, Trophy, Search, CheckCircle2, 
  Circle, ChevronDown, ChevronRight, BookOpen, Layers, Cpu, Sparkles, X
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';

export default function Sidebar({
  topics,
  selectedTopicId,
  onSelectTopic,
  activeView,
  setActiveView,
  completedTopics,
  isOpen,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedLevels, setCollapsedLevels] = useState({});

  const toggleLevelCollapse = (levelId) => {
    setCollapsedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
    }));
  };

  const filteredTopics = searchQuery.trim() === ''
    ? topics
    : topics.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.badge.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getLevelIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={16} />;
      case 'Layers': return <Layers size={16} />;
      case 'Cpu': return <Cpu size={16} />;
      case 'Zap': return <Zap size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="sidebar-backdrop md:hidden" onClick={onClose} />
      )}

      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Mobile Close Button */}
        <div className="sidebar-mobile-close">
          <button onClick={onClose} className="btn-icon" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        {/* Global Navigation Hub */}
        <div className="sidebar-section-title">EXPLORATION HUBS</div>
        <nav className="space-y-1 mb-4">
          <button
            onClick={() => { setActiveView('roadmap'); onClose?.(); }}
            className={`sidebar-nav-btn ${activeView === 'roadmap' ? 'active' : ''}`}
            id="nav-roadmap"
          >
            <Map size={16} className="text-cyan" />
            <span>Learning Roadmap</span>
          </button>
          <button
            onClick={() => { setActiveView('decision'); onClose?.(); }}
            className={`sidebar-nav-btn ${activeView === 'decision' ? 'active' : ''}`}
            id="nav-decision"
          >
            <Compass size={16} className="text-indigo-400" />
            <span>"Which Hook?" Guide</span>
          </button>
          <button
            onClick={() => { setActiveView('antipatterns'); onClose?.(); }}
            className={`sidebar-nav-btn ${activeView === 'antipatterns' ? 'active' : ''}`}
            id="nav-antipatterns"
          >
            <Bug size={16} className="text-rose-400" />
            <span>Anti-Patterns & Traps</span>
          </button>
          <button
            onClick={() => { setActiveView('react19'); onClose?.(); }}
            className={`sidebar-nav-btn ${activeView === 'react19' ? 'active' : ''}`}
            id="nav-react19"
          >
            <Zap size={16} className="text-emerald-400" />
            <span>React 19 Deep Dive</span>
          </button>
          <button
            onClick={() => { setActiveView('quiz'); onClose?.(); }}
            className={`sidebar-nav-btn ${activeView === 'quiz' ? 'active' : ''}`}
            id="nav-quiz"
          >
            <Trophy size={16} className="text-amber-400" />
            <span>Quiz & Interview Arena</span>
          </button>
        </nav>

        {/* Search Input */}
        <div className="sidebar-search-container mb-4">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search concepts, hooks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
        </div>

        {/* Curriculum Topics Tree */}
        <div className="sidebar-section-title">CURRICULUM MODULES</div>
        <div className="space-y-3 pb-8">
          {CURRICULUM_LEVELS.map(level => {
            const levelTopics = filteredTopics.filter(t => t.level === level.id);
            if (levelTopics.length === 0 && searchQuery) return null;

            const isCollapsed = collapsedLevels[level.id];
            const completedInLevel = levelTopics.filter(t => completedTopics.includes(t.id)).length;

            return (
              <div key={level.id} className="level-group-box">
                {/* Level Title Toggle */}
                <button
                  onClick={() => toggleLevelCollapse(level.id)}
                  className="level-group-header"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: level.color }}>
                      {getLevelIcon(level.icon)}
                    </span>
                    <span className="font-semibold text-xs text-white">{level.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-gray-400">
                      {completedInLevel}/{levelTopics.length}
                    </span>
                    {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  </div>
                </button>

                {/* Topics List */}
                {!isCollapsed && (
                  <div className="level-topics-sublist">
                    {levelTopics.map(topic => {
                      const isSelected = activeView === 'topic' && selectedTopicId === topic.id;
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          onClick={() => {
                            onSelectTopic(topic.id);
                            setActiveView('topic');
                            onClose?.();
                          }}
                          className={`sidebar-topic-item ${isSelected ? 'active' : ''}`}
                          id={`sidebar-item-${topic.id}`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle size={13} className="text-gray-500 flex-shrink-0" />
                          )}
                          <span className="topic-name-truncate">{topic.title}</span>
                          <span className="topic-badge-subtle">{topic.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
