import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, 
  HelpCircle, Sparkles, Filter, Award 
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizzesData';

export default function QuizArena() {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [showExplanation, setShowExplanation] = useState({});

  const filteredQuestions = selectedLevel === 'all' 
    ? QUIZ_QUESTIONS 
    : QUIZ_QUESTIONS.filter(q => q.level === selectedLevel);

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const answeredCount = Object.keys(userAnswers).length;

  const calculateScore = () => {
    let score = 0;
    filteredQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleSelectOption = (optionIndex) => {
    if (userAnswers[activeQuestion.id] !== undefined) return; // already answered

    const isCorrect = optionIndex === activeQuestion.correctIndex;
    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optionIndex
    }));
    setShowExplanation(prev => ({
      ...prev,
      [activeQuestion.id]: true
    }));

    if (isCorrect) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
  };

  const currentAnswer = userAnswers[activeQuestion?.id];
  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="quiz-view-container">
      {/* Quiz Banner */}
      <div className="roadmap-hero-banner">
        <div className="roadmap-hero-badge">
          <Trophy size={14} className="text-amber-400" />
          <span>React Knowledge Assessment</span>
        </div>
        <h1 className="roadmap-hero-title">React Arena: Test Your Mastery</h1>
        <p className="roadmap-hero-desc">
          Evaluate your understanding of core rendering mechanics, hook lifecycles, and modern React 19 architecture with interactive interview questions.
        </p>
      </div>

      {/* Filter Tabs & Score Board */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'beginner', 'intermediate', 'advanced', 'react19'].map(lvl => (
            <button
              key={lvl}
              onClick={() => { setSelectedLevel(lvl); setCurrentIndex(0); }}
              className={`btn-control text-xs capitalize ${selectedLevel === lvl ? 'btn-primary' : 'btn-outline'}`}
            >
              {lvl === 'react19' ? 'React 19' : lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400">
            Score: <strong className="text-emerald-400 font-mono text-sm">{calculateScore()}</strong> / {filteredQuestions.length}
          </div>
          <button onClick={handleReset} className="btn-icon" title="Reset Quiz">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Question Card */}
      {activeQuestion ? (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 font-medium">
              {activeQuestion.category}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg font-bold text-white mb-3 leading-snug">
            {activeQuestion.question}
          </h2>

          {/* Code snippet if question has one */}
          {activeQuestion.codeSnippet && (
            <pre className="code-snippet-small text-xs mb-4">
              <code>{activeQuestion.codeSnippet}</code>
            </pre>
          )}

          {/* Options */}
          <div className="space-y-3 mb-6">
            {activeQuestion.options.map((option, idx) => {
              let optionStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-gray-300';

              if (isAnswered) {
                if (idx === activeQuestion.correctIndex) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                } else if (idx === currentAnswer) {
                  optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-slate-950 border-slate-800 text-gray-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 text-gray-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && idx === activeQuestion.correctIndex && (
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswered && idx === currentAnswer && idx !== activeQuestion.correctIndex && (
                    <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className={`p-4 rounded-xl mb-6 text-xs leading-relaxed ${
              currentAnswer === activeQuestion.correctIndex 
                ? 'bg-emerald-950/30 border border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/30 border border-rose-800 text-rose-300'
            }`}>
              <strong className="block mb-1 font-bold text-sm">
                {currentAnswer === activeQuestion.correctIndex ? '🎉 Spot on!' : '💡 Conceptual Explanation:'}
              </strong>
              {activeQuestion.explanation}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="btn-control btn-outline text-xs"
            >
              Previous
            </button>
            <span className="text-xs text-gray-400 font-mono">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredQuestions.length - 1}
              className="btn-control btn-primary text-xs"
            >
              Next Question <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          No questions available for this level.
        </div>
      )}
    </div>
  );
}
