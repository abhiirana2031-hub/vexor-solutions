import React, { useState } from 'react';
import { UserProgress, WeekModule, CourseId } from '../types/course';
import { COURSES } from '../data/coursesCatalog';
import {
  calculateProgressStats,
  calculateModuleProgress,
  computeDayOfWeekActivity,
  generateHeatmapGrid,
  getDefaultActivityLog,
} from '../utils/course_logic';
import {
  Award,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  Flame,
  Calendar,
  Activity,
  TrendingUp,
  Check,
} from 'lucide-react';

interface StatsViewProps {
  progress: UserProgress;
  modules: WeekModule[];
  activeCourseId: CourseId;
  onSelectDay: (dayId: string) => void;
  onOpenQuiz: (weekNumber: number) => void;
  onOpenCertificate: () => void;
  onResetProgress: () => void;
  devMode: boolean;
}

export const StatsView: React.FC<StatsViewProps> = ({
  progress,
  modules,
  activeCourseId,
  onSelectDay,
  onOpenQuiz,
  onOpenCertificate,
  onResetProgress,
  devMode,
}) => {
  const currentCourse = COURSES[activeCourseId];
  const stats = calculateProgressStats(progress);
  const activityLog = progress.activityLog || getDefaultActivityLog(progress.completedDays);

  // Analytics computation
  const dayOfWeekAnalysis = computeDayOfWeekActivity(activityLog);
  const heatmap = generateHeatmapGrid(activityLog, 8);

  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    dayShort: string;
    count: number;
  } | null>(null);

  const totalTopicsCount = modules.reduce(
    (acc, m) => acc + m.days.reduce((dAcc, d) => dAcc + d.topics.length, 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Learning Analytics & Consistency · {currentCourse.shortTitle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Student Velocity & Curriculum Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track daily lessons completed ({totalTopicsCount} total topics), weekly study heatmaps, and module qualifying exams.
          </p>
        </div>

        <button
          onClick={onResetProgress}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Course Progress</span>
        </button>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Overall Completion</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {stats.overallPercentage}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {stats.completedDaysCount} of 28 Days Complete
          </div>
        </div>

        {/* Daily Modules Finished */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Lessons Finished</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {stats.completedDaysCount} <span className="text-lg text-slate-400 dark:text-slate-500">/ 28</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {28 - stats.completedDaysCount} days remaining in syllabus
          </div>
        </div>

        {/* Qualifying Quizzes Passed */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Module Exams Passed</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {stats.passedQuizzesCount} <span className="text-lg text-slate-400 dark:text-slate-500">/ 4</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            {stats.passedQuizzesCount >= 4 ? 'All 4 modules certified!' : 'Score ≥ 80% to unlock next weeks'}
          </div>
        </div>

        {/* Most Active Day */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/70 border border-indigo-200 dark:border-indigo-900/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Peak Study Day</span>
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans truncate">
            {dayOfWeekAnalysis.mostActiveDay.dayName}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
            <span>{dayOfWeekAnalysis.mostActiveDay.percentage}% of weekly activity</span>
            <span aria-hidden="true">·</span>
            <span>{dayOfWeekAnalysis.mostActiveDay.count} sessions</span>
          </div>
        </div>
      </div>

      {/* 3. Visual Learning Heatmap & Day-of-the-Week Habit Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Learning Heatmap & Weekly Habit Matrix</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Visualizing which days of the week you study most actively and your 8-week learning consistency.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span>Peak Day:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {dayOfWeekAnalysis.mostActiveDay.dayName} ({dayOfWeekAnalysis.mostActiveDay.count} points)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card A: Which Days of the Week Student is Most Active (5 Columns) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
                Day-of-Week Activity Distribution
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                When Do You Learn Best?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Activity volume aggregated across all Mondays through Sundays.
              </p>
            </div>

            {/* Day by Day Intensity Bars */}
            <div className="space-y-2.5 pt-1">
              {dayOfWeekAnalysis.days.map((day) => {
                const isPeak = day.dayName === dayOfWeekAnalysis.mostActiveDay.dayName;
                const maxCount = Math.max(...dayOfWeekAnalysis.days.map((d) => d.count), 1);
                const barWidth = Math.max(6, Math.round((day.count / maxCount) * 100));

                return (
                  <div key={day.shortName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`w-8 font-semibold ${isPeak ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {day.shortName}
                        </span>
                        {isPeak && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-sans font-medium">
                            Peak
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-slate-400">{day.count} sessions</span>
                        <span className="text-slate-600 dark:text-slate-500 w-8 text-right font-medium">{day.percentage}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800/80">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm shadow-amber-500/30'
                            : 'bg-indigo-600 dark:bg-indigo-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Pill */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>{dayOfWeekAnalysis.weekdayTotal}</strong> weekday vs{' '}
                <strong>{dayOfWeekAnalysis.weekendTotal}</strong> weekend sessions.
              </span>
            </div>
          </div>

          {/* Card B: 8-Week Activity Calendar Heatmap Grid (7 Columns) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 font-mono uppercase tracking-wider">
                  8-Week Learning Calendar Heatmap
                </div>
                {hoveredCell ? (
                  <span className="text-xs font-mono text-amber-700 dark:text-amber-300 font-semibold">
                    {hoveredCell.dateStr} ({hoveredCell.dayShort}): {hoveredCell.count} activities
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Hover cell to view details
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Study Consistency
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Each column represents one week (Monday through Sunday).
              </p>
            </div>

            {/* Heatmap Grid */}
            <div className="pt-2 overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Day Labels Row + 8 Weeks Columns */}
                <div className="grid grid-flow-col auto-cols-fr gap-1.5">
                  {/* Left row labels for days */}
                  <div className="flex flex-col justify-between py-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono pr-2 select-none">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>

                  {/* 8 Week Columns */}
                  {heatmap.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1.5">
                      {week.map((cell) => {
                        let bgClass = 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-600';
                        if (cell.level === 1) bgClass = 'bg-indigo-100 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300';
                        else if (cell.level === 2) bgClass = 'bg-indigo-300 dark:bg-indigo-800 border-indigo-400 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200';
                        else if (cell.level === 3) bgClass = 'bg-indigo-600 border-indigo-600 text-white';
                        else if (cell.level === 4) bgClass = 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold';

                        return (
                          <div
                            key={cell.dateStr}
                            onMouseEnter={() =>
                              setHoveredCell({
                                dateStr: cell.dateStr,
                                dayShort: cell.dayShort,
                                count: cell.count,
                              })
                            }
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                              cell.isToday ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : ''
                            } hover:scale-115 hover:z-10`}
                            title={`${cell.dateStr} (${cell.dayShort}): ${cell.count} learning activities`}
                          >
                            {cell.count > 0 && (
                              <span className="text-[9px] font-mono leading-none">
                                {cell.count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Heatmap Legend & Date Range */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-mono">
                {heatmap.startDateStr} to {heatmap.endDateStr}
              </span>

              <div className="flex items-center gap-1.5 font-mono">
                <span>Less</span>
                <span className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-indigo-300 dark:bg-indigo-800 border border-indigo-400 dark:border-indigo-700 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 border border-indigo-600 inline-block" />
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-500 inline-block" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Progress Bar Per Module (User Requirement) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Module-by-Module Progress & Exam Gateways</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Individual completion progress bars, daily step indicators, and unlocking quiz statuses for all 4 weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((m) => {
            const isUnlocked = progress.unlockedWeeks.includes(m.weekNumber) || devMode;
            const moduleProgress = calculateModuleProgress(m.weekNumber, progress.completedDays);
            const scoreObj = progress.quizScores[m.weekNumber];
            const hasPassedQuiz = scoreObj?.passed;
            const moduleTopicsCount = m.days.reduce((acc, d) => acc + d.topics.length, 0);

            return (
              <div
                key={m.weekNumber}
                className={`p-6 rounded-2xl border transition-all space-y-5 shadow-sm ${
                  isUnlocked
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'border-slate-200/70 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/40 opacity-75'
                }`}
              >
                {/* Module Title Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                        Week {m.weekNumber}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        7 Days · {moduleTopicsCount} Topics
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{m.theme}</p>
                  </div>

                  <div className="shrink-0">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* VISUAL PROGRESS BAR PER MODULE */}
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Module Completion Progress
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {moduleProgress.completedCount} / 7 Days ({moduleProgress.percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        moduleProgress.isComplete
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-sm shadow-indigo-500/20'
                      }`}
                      style={{ width: `${moduleProgress.percentage}%` }}
                    />
                  </div>

                  {/* 7 Daily Pips Navigation Bar */}
                  <div className="pt-2 flex items-center justify-between gap-1">
                    {m.days.map((day) => {
                      const isDone = progress.completedDays.includes(day.dayNumber);
                      return (
                        <button
                          key={day.id}
                          onClick={() => onSelectDay(day.id)}
                          className={`flex-1 py-1 px-1 rounded flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                              : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title={`Day ${day.dayNumber}: ${day.title} (${isDone ? 'Completed' : 'Pending'})`}
                        >
                          <span className="text-[10px] font-mono leading-none font-semibold">
                            D{day.dayNumber}
                          </span>
                          <span className="mt-0.5">
                            {isDone ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-700 inline-block" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quiz Status and Action Row */}
                <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-800/80">
                  <div>
                    {hasPassedQuiz ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quiz Passed: {scoreObj.score}/{scoreObj.total} ({(scoreObj.score / scoreObj.total * 100).toFixed(0)}%)</span>
                      </div>
                    ) : isUnlocked ? (
                      <span className="text-slate-600 dark:text-slate-400">
                        {moduleProgress.isComplete
                          ? 'All 7 days finished! Ready for Quiz.'
                          : `${7 - moduleProgress.completedCount} lessons remaining before quiz.`}
                      </span>
                    ) : (
                      <span className="text-slate-500">Module locked</span>
                    )}
                  </div>

                  <div>
                    {hasPassedQuiz ? (
                      <button
                        onClick={() => onOpenQuiz(m.weekNumber)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Review Quiz
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => onOpenQuiz(m.weekNumber)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          moduleProgress.isComplete
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/20'
                            : 'bg-indigo-600/15 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40 hover:bg-indigo-600/25 dark:hover:bg-indigo-600/50'
                        }`}
                      >
                        {moduleProgress.isComplete ? 'Take Unlock Quiz ->' : 'Attempt Quiz'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-600">Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Certificate Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-indigo-50 dark:from-amber-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-amber-300 dark:border-amber-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Official {currentCourse.title} Verified Credential
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {stats.isCourseCompleted || devMode
                ? 'Congratulations! You have satisfied all 4-week module requirements. Generate your official PDF certificate.'
                : 'Complete all 28 days and pass each week\'s qualifying exam to unlock your graduation certificate.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertificate}
          className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-400/20 cursor-pointer whitespace-nowrap shrink-0"
        >
          View / Customize Certificate
        </button>
      </div>
    </div>
  );
};
