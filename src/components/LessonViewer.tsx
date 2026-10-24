import React, { useState } from 'react';
import { DayLesson, WeekModule, SubTopic } from '../types/course';
import { CodeViewer } from './CodeViewer';
import { CodeRunner } from './CodeRunner';
import { InteractiveDiagrams } from './InteractiveDiagrams';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  BookOpen,
  Code,
  AlertTriangle,
  Lightbulb,
  Check,
  HelpCircle,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface LessonViewerProps {
  lesson: DayLesson;
  module: WeekModule;
  isCompleted: boolean;
  onToggleComplete: (dayNumber: number) => void;
  onNextDay: () => void;
  onPrevDay: () => void;
  hasPrevDay: boolean;
  hasNextDay: boolean;
  onOpenQuiz: (weekNumber: number) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  module,
  isCompleted,
  onToggleComplete,
  onNextDay,
  onPrevDay,
  hasPrevDay,
  hasNextDay,
  onOpenQuiz,
}) => {
  const topics: SubTopic[] = lesson.topics && lesson.topics.length > 0 ? lesson.topics : [];
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');

  // Initial code for runner
  const initialSnippetCode = topics[0]?.codeSnippet?.code || lesson.codeSnippets?.[0]?.code || '';
  const initialLanguage = topics[0]?.codeSnippet?.language || 'python';
  const [runnerCode, setRunnerCode] = useState(initialSnippetCode);
  const [runnerLanguage, setRunnerLanguage] = useState(initialLanguage);

  const [showChallengeSolution, setShowChallengeSolution] = useState(false);
  const [showChallengeHint, setShowChallengeHint] = useState(false);

  // Interactive quick-check answer state for current topic
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Reset active topic when lesson changes
  React.useEffect(() => {
    setActiveTopicIdx(0);
    const initialCode = lesson.topics?.[0]?.codeSnippet?.code || lesson.codeSnippets?.[0]?.code || '';
    const initialLang = lesson.topics?.[0]?.codeSnippet?.language || 'python';
    setRunnerCode(initialCode);
    setRunnerLanguage(initialLang);
    setShowChallengeSolution(false);
    setShowChallengeHint(false);
  }, [lesson.id]);

  const activeTopic = topics[activeTopicIdx] || topics[0];

  const handleSendToRunner = (code: string, language = activeTopic?.codeSnippet?.language || 'python') => {
    setRunnerCode(code);
    setRunnerLanguage(language);
    const runnerEl = document.getElementById('lesson-code-runner');
    if (runnerEl) {
      runnerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectOption = (topicId: string, optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [topicId]: optIdx }));
    setRevealedExplanations((prev) => ({ ...prev, [topicId]: true }));
  };

  return (
    <article className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Lesson Header */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        {/* Unboxed Metadata Kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Week {lesson.weekNumber}: {module.title}
          </span>
          <span aria-hidden="true">·</span>
          <span>Day {lesson.dayNumber} of 28</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            {topics.length} In-Depth Topics Today
          </span>
          <span aria-hidden="true">·</span>
          <span>{lesson.durationMinutes} min read & practice</span>
          <span aria-hidden="true">·</span>
          <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500'}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          style={{ textWrap: 'balance' }}
        >
          {lesson.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {lesson.subtitle}
        </p>

        {/* Overview Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-300 leading-relaxed shadow-xs">
          <p>{lesson.overview}</p>
        </div>
      </header>

      {/* 2. Visual Architecture Graphic */}
      <section className="space-y-3">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
          Architectural Schematic & Concept Blueprint
        </div>
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
          <img
            src={module.conceptImage}
            alt={module.imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-48 sm:h-60 md:h-64 object-cover"
          />
          <div className="p-3 bg-slate-50 dark:bg-slate-900/90 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
            <span>{module.imageAlt}</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">Week {module.weekNumber} Visual</span>
          </div>
        </div>
      </section>

      {/* 3. Topics Navigation & Curriculum Suite */}
      {topics.length > 0 && (
        <section className="space-y-6 pt-2">
          {/* Topic Navigation Bar Header */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-900/40 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase font-mono">
                  Day {lesson.dayNumber} Curriculum: {topics.length} In-Depth Topics
                </h2>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('focused')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    viewMode === 'focused'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Step-by-Step (Topic {activeTopicIdx + 1}/{topics.length})
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  View All {topics.length} Topics
                </button>
              </div>
            </div>

            {/* Stepper Tabs */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 ${topics.length >= 8 ? 'md:grid-cols-8' : 'md:grid-cols-7'} gap-1.5 pt-1`}>
              {topics.map((t, idx) => {
                const isActive = activeTopicIdx === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTopicIdx(idx);
                      setViewMode('focused');
                      setRunnerCode(t.codeSnippet.code);
                      setRunnerLanguage(t.codeSnippet.language);
                    }}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={isActive ? 'text-indigo-100 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="text-xs font-semibold truncate mt-0.5" title={t.title}>
                      {t.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused View of Single Topic */}
          {viewMode === 'focused' && activeTopic && (
            <div className="space-y-6 animate-fadeIn">
              {/* Topic Sub-Header */}
              <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    Topic {activeTopicIdx + 1} of {topics.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={activeTopicIdx === 0}
                      onClick={() => {
                        const newIdx = activeTopicIdx - 1;
                        setActiveTopicIdx(newIdx);
                        setRunnerCode(topics[newIdx].codeSnippet.code);
                        setRunnerLanguage(topics[newIdx].codeSnippet.language);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Previous Topic"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={activeTopicIdx === topics.length - 1}
                      onClick={() => {
                        const newIdx = activeTopicIdx + 1;
                        setActiveTopicIdx(newIdx);
                        setRunnerCode(topics[newIdx].codeSnippet.code);
                        setRunnerLanguage(topics[newIdx].codeSnippet.language);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 cursor-pointer"
                      title="Next Topic"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  <span className="w-2 h-6 rounded-full bg-indigo-500 inline-block" />
                  <span>{activeTopic.title}</span>
                </h2>
              </div>

              {/* In-Depth Explanation Paragraphs */}
              <div className="space-y-3 text-sm sm:text-base text-slate-800 dark:text-slate-300 leading-relaxed">
                {activeTopic.explanation.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Key Rules / Principles */}
              {activeTopic.keyRules && activeTopic.keyRules.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 font-mono uppercase tracking-wider">
                    Core Engineering Rules & Architecture Invariants
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {activeTopic.keyRules.map((rule, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">·</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pitfall Warning */}
              {activeTopic.pitfall && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 dark:text-amber-300">Common Pitfall: </span>
                    {activeTopic.pitfall}
                  </div>
                </div>
              )}

              {/* Exemplary Code Snippet */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Code Snippet: {activeTopic.codeSnippet.title}
                    </h3>
                  </div>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {activeTopic.codeSnippet.language}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">{activeTopic.codeSnippet.description}</p>

                <CodeViewer
                  snippet={activeTopic.codeSnippet}
                  onSendToRunner={(code) => handleSendToRunner(code, activeTopic.codeSnippet.language)}
                />
              </div>

              {/* Quick Check Question */}
              {activeTopic.quickCheck && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Quick Concept Check</span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-white font-semibold">
                    {activeTopic.quickCheck.question}
                  </p>

                  <div className="space-y-1.5">
                    {activeTopic.quickCheck.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[activeTopic.id] === oIdx;
                      const isCorrect = activeTopic.quickCheck!.correctIndex === oIdx;
                      const showResult = revealedExplanations[activeTopic.id];

                      let btnStyle = 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
                      if (showResult) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(activeTopic.id, oIdx)}
                          className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {showResult && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {revealedExplanations[activeTopic.id] && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">Explanation: </span>
                      {activeTopic.quickCheck.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  disabled={activeTopicIdx === 0}
                  onClick={() => {
                    const newIdx = activeTopicIdx - 1;
                    setActiveTopicIdx(newIdx);
                    setRunnerCode(topics[newIdx].codeSnippet.code);
                    setRunnerLanguage(topics[newIdx].codeSnippet.language);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>
                    {activeTopicIdx > 0 ? `Prev: ${topics[activeTopicIdx - 1].title}` : 'Previous Topic'}
                  </span>
                </button>

                {activeTopicIdx < topics.length - 1 ? (
                  <button
                    onClick={() => {
                      const newIdx = activeTopicIdx + 1;
                      setActiveTopicIdx(newIdx);
                      setRunnerCode(topics[newIdx].codeSnippet.code);
                      setRunnerLanguage(topics[newIdx].codeSnippet.language);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Next: {topics[activeTopicIdx + 1].title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>All {topics.length} Topics Explored!</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* All Topics View (Sequential) */}
          {viewMode === 'all' && (
            <div className="space-y-10">
              {topics.map((t, idx) => (
                <div key={t.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/50 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
                        Topic {idx + 1} of {topics.length}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-800 dark:text-slate-300 leading-relaxed">
                    {t.explanation.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {t.keyRules && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="font-semibold text-indigo-700 dark:text-indigo-400 uppercase font-mono text-[10px]">
                        Core Principles
                      </div>
                      {t.keyRules.map((rule, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2">
                          <span className="text-indigo-600 dark:text-indigo-400">·</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 space-y-2">
                    <CodeViewer
                      snippet={t.codeSnippet}
                      onSendToRunner={(code) => handleSendToRunner(code, t.codeSnippet.language)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Interactive Diagram Widget */}
      {lesson.interactiveDiagram && (
        <section className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
            Interactive Concept Exploration Sandbox
          </div>
          <InteractiveDiagrams diagram={lesson.interactiveDiagram} />
        </section>
      )}

      {/* 5. Live In-Browser Code Runner */}
      <section id="lesson-code-runner" className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Code Execution Studio</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Edit, inspect, and execute in real-time</span>
        </div>

        <CodeRunner
          initialCode={runnerCode}
          language={runnerLanguage}
          title={`Day ${lesson.dayNumber} Live Playground: ${activeTopic?.title || lesson.title}`}
        />
      </section>

      {/* 6. Practical Coding Challenge */}
      {lesson.practiceChallenge && (
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-slate-900/70 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
              <Lightbulb className="w-4 h-4" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lesson.practiceChallenge.title}
              </h3>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {lesson.practiceChallenge.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{idx + 1}.</span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>

            {/* Action buttons: Hint & Solution */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowChallengeHint(!showChallengeHint)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {showChallengeHint ? 'Hide Hint' : 'Need a Hint?'}
              </button>
              <button
                onClick={() => setShowChallengeSolution(!showChallengeSolution)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {showChallengeSolution ? 'Hide Solution' : 'Reveal Solution'}
              </button>
              <button
                onClick={() => handleSendToRunner(lesson.practiceChallenge?.starterCode || '')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors cursor-pointer shadow-xs"
              >
                Load Challenge in Runner
              </button>
            </div>

            {showChallengeHint && lesson.practiceChallenge.hints && (
              <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Hint: </span>
                {lesson.practiceChallenge.hints.join(' ')}
              </div>
            )}

            {showChallengeSolution && lesson.practiceChallenge.solutionCode && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Verified Solution:</div>
                <pre className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-200 overflow-x-auto">
                  {lesson.practiceChallenge.solutionCode}
                </pre>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Key Takeaways */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Day {lesson.dayNumber} Key Takeaways
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-300 flex items-start gap-2.5 shadow-xs"
              >
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 8. Bottom Navigation Controls */}
      <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onToggleComplete(lesson.dayNumber)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
            <span>{isCompleted ? 'Day Completed (Click to Toggle)' : 'Mark Day as Completed'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {hasPrevDay && (
            <button
              onClick={onPrevDay}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Day</span>
            </button>
          )}

          {lesson.dayNumber % 7 === 0 ? (
            <button
              onClick={() => onOpenQuiz(lesson.weekNumber)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>
                {lesson.dayNumber === 28 ? 'Take Final Certification Exam' : `Take Week ${lesson.weekNumber} Unlock Quiz`}
              </span>
            </button>
          ) : (
            hasNextDay && (
              <button
                onClick={onNextDay}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                <span>Next Day</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </footer>
    </article>
  );
};
