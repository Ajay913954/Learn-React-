import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TopicDetail from './components/TopicDetail';
import RoadmapView from './components/RoadmapView';
import HookDecisionGuide from './components/HookDecisionGuide';
import AntiPatternsGuide from './components/AntiPatternsGuide';
import React19Guide from './components/React19Guide';
import QuizArena from './components/QuizArena';
import { TOPICS } from './data/curriculumData';

export default function App() {
  const [selectedTopicId, setSelectedTopicId] = useState('b1-jsx-vdom');
  const [activeView, setActiveView] = useState('topic'); // 'topic' | 'roadmap' | 'decision' | 'antipatterns' | 'react19' | 'quiz'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persistent Completed Topics in localStorage
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('reactsphere_completed_topics');
      return saved ? JSON.parse(saved) : ['b1-jsx-vdom'];
    } catch {
      return ['b1-jsx-vdom'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('reactsphere_completed_topics', JSON.stringify(completedTopics));
    } catch (e) {
      console.warn(e);
    }
  }, [completedTopics]);

  const toggleCompleted = (topicId) => {
    setCompletedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId]
    );
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all topic mastery progress?')) {
      setCompletedTopics([]);
    }
  };

  const currentTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];

  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setActiveView('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="reactsphere-app">
      {/* Top Glassmorphic Navigation Bar */}
      <Navbar 
        completedCount={completedTopics.length}
        totalCount={TOPICS.length}
        activeView={activeView}
        setActiveView={setActiveView}
        onResetProgress={handleResetProgress}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Grid: Sidebar + Scrollable Content */}
      <div className="dashboard-body-layout">
        <Sidebar 
          topics={TOPICS}
          selectedTopicId={selectedTopicId}
          onSelectTopic={handleSelectTopic}
          activeView={activeView}
          setActiveView={setActiveView}
          completedTopics={completedTopics}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="dashboard-main-content">
          {activeView === 'topic' && (
            <TopicDetail 
              topic={currentTopic}
              onSelectTopic={handleSelectTopic}
              allTopics={TOPICS}
              completedTopics={completedTopics}
              toggleCompleted={toggleCompleted}
            />
          )}

          {activeView === 'roadmap' && (
            <RoadmapView 
              topics={TOPICS}
              onSelectTopic={handleSelectTopic}
              completedTopics={completedTopics}
            />
          )}

          {activeView === 'decision' && (
            <HookDecisionGuide />
          )}

          {activeView === 'antipatterns' && (
            <AntiPatternsGuide />
          )}

          {activeView === 'react19' && (
            <React19Guide onSelectTopic={handleSelectTopic} />
          )}

          {activeView === 'quiz' && (
            <QuizArena />
          )}
        </main>
      </div>
    </div>
  );
}
