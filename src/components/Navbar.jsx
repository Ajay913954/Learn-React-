import React from 'react';
import { 
  Atom, Menu, Award, RotateCcw, Sparkles, Map, Trophy, CheckCircle2 
} from 'lucide-react';

export default function Navbar({
  completedCount,
  totalCount,
  activeView,
  setActiveView,
  onResetProgress,
  onToggleSidebar
}) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getRankBadge = (pct) => {
    if (pct >= 90) return { title: 'React Grandmaster', color: '#34d399' };
    if (pct >= 60) return { title: 'Senior Architect', color: '#c084fc' };
    if (pct >= 35) return { title: 'Hooks Practitioner', color: '#818cf8' };
    if (pct >= 10) return { title: 'Apprentice', color: '#38bdf8' };
    return { title: 'Foundations Explorer', color: '#94a3b8' };
  };

  const rank = getRankBadge(percentage);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="btn-icon md:hidden"
            aria-label="Toggle navigation drawer"
          >
            <Menu size={20} />
          </button>

          <div 
            onClick={() => setActiveView('roadmap')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="logo-atom-wrapper">
              <Atom size={24} className="logo-atom animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan transition-colors">
                  ReactSphere
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan border border-cyan-800">
                  v19
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Beginner to Advanced Mastery
              </span>
            </div>
          </div>
        </div>

        {/* Center: Progress & Rank Telemetry */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
          <div className="flex items-center gap-2">
            <Award size={16} style={{ color: rank.color }} />
            <span className="text-xs font-semibold" style={{ color: rank.color }}>
              {rank.title}
            </span>
          </div>

          <div className="w-px h-4 bg-slate-700" />

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-gray-300 font-mono">
              {completedCount}/{totalCount} Mastered
            </span>
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-cyan font-mono">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('roadmap')}
            className={`btn-control btn-xs hidden sm:flex ${activeView === 'roadmap' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Map size={13} /> Roadmap
          </button>
          <button
            onClick={() => setActiveView('quiz')}
            className={`btn-control btn-xs hidden sm:flex ${activeView === 'quiz' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Trophy size={13} /> Quiz
          </button>
          <button
            onClick={onResetProgress}
            className="btn-icon text-gray-400 hover:text-rose-400"
            title="Reset Mastered Progress"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
