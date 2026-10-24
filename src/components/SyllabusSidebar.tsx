import React, { useState } from 'react';
import { WeekModule, UserProgress } from '../types/course';
import { isModuleUnlocked, isDayUnlocked } from '../utils/course_logic';
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  HelpCircle,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';

interface SyllabusSidebarProps {
  modules: WeekModule[];
  progress: UserProgress;
  activeDayId: string;
  onSelectDay: (dayId: string) => void;
  onOpenQuiz: (weekNumber: number) => void;
  devMode: boolean;
}

export const SyllabusSidebar: React.FC<SyllabusSidebarProps> = ({
  modules,
  progress,
  activeDayId,
  onSelectDay,
  onOpenQuiz,
  devMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1, 2, 3, 4]);

  const toggleWeek = (weekNum: number) => {
    if (expandedWeeks.includes(weekNum)) {
      setExpandedWeeks(expandedWeeks.filter((w) => w !== weekNum));
    } else {
      setExpandedWeeks([...expandedWeeks, weekNum]);
    }
  };

  // Filter modules/days based on search query
  const filteredModules = modules.map((m) => {
    if (!searchQuery.trim()) return m;
    const q = searchQuery.toLowerCase();
    const matchingDays = m.days.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.subtitle.toLowerCase().includes(q) ||
        d.overview.toLowerCase().includes(q) ||
        d.topics?.some((t) => t.title.toLowerCase().includes(q))
    );
    return {
      ...m,
      days: matchingDays,
    };
  });

  return (
    <aside className="w-full lg:w-80 xl:w-96 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-61px)] sticky top-[61px] overflow-hidden transition-colors">
      {/* Search Input Box */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics (e.g. React, SQL, async)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredModules.map((module) => {
          const isUnlocked = isModuleUnlocked(module.weekNumber, progress.unlockedWeeks, devMode);
          const isExpanded = expandedWeeks.includes(module.weekNumber);
          const completedInWeek = module.days.filter((d) => progress.completedDays.includes(d.dayNumber)).length;
          const quizScore = progress.quizScores[module.weekNumber];
          const hasPassedQuiz = quizScore?.passed;

          return (
            <div
              key={module.weekNumber}
              className={`rounded-xl border transition-colors ${
                isUnlocked
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 shadow-xs'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-slate-950/40 opacity-75'
              }`}
            >
              {/* Module Header Button */}
              <button
                onClick={() => toggleWeek(module.weekNumber)}
                className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-t-xl transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isUnlocked ? (
                    <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                        W{module.weekNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        Week {module.weekNumber}: {module.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {completedInWeek} of {module.days.length} days done
                      {hasPassedQuiz && ' · Quiz Passed'}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 ml-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Module Days List */}
              {isExpanded && (
                <div className="px-2 pb-2.5 space-y-1 border-t border-slate-200 dark:border-slate-800/60 pt-2">
                  {module.days.map((day) => {
                    const dayUnlocked = isDayUnlocked(day.dayNumber, day.weekNumber, progress.unlockedWeeks, devMode);
                    const isCompleted = progress.completedDays.includes(day.dayNumber);
                    const isActive = activeDayId === day.id;

                    return (
                      <button
                        key={day.id}
                        disabled={!dayUnlocked}
                        onClick={() => onSelectDay(day.id)}
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                            : isCompleted
                            ? 'hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                              }`}
                            />
                          ) : (
                            <Circle
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActive ? 'text-white' : 'text-slate-400 dark:text-slate-600'
                              }`}
                            />
                          )}
                          <span className="truncate">
                            Day {day.dayNumber}: {day.title}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] shrink-0 font-mono ${
                            isActive ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {day.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}

                  {/* End of Week Quiz Button */}
                  <div className="pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-800/50">
                    <button
                      onClick={() => onOpenQuiz(module.weekNumber)}
                      disabled={!isUnlocked}
                      className={`w-full px-2.5 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        hasPassedQuiz
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                          : isUnlocked
                          ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-semibold'
                          : 'bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-semibold">
                          {module.weekNumber === 4
                            ? 'Final Exam & Certificate'
                            : `Week ${module.weekNumber} Unlock Quiz`}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider">
                        {hasPassedQuiz ? 'Passed' : isUnlocked ? 'Take Quiz' : 'Locked'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
