import React from 'react';
import { Play, Sparkles, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { UserProgress, CourseId } from '../types/course';
import { calculateProgressStats } from '../utils/course_logic';
import { COURSES } from '../data/coursesCatalog';

interface HeroBannerProps {
  activeCourseId: CourseId;
  progress: UserProgress;
  onStartCourse: () => void;
  activeDayNumber: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeCourseId,
  progress,
  onStartCourse,
  activeDayNumber,
}) => {
  const course = COURSES[activeCourseId];
  const stats = calculateProgressStats(progress);
  const nextUnfinishedDay = Array.from({ length: 28 }, (_, i) => i + 1).find(
    (d) => !progress.completedDays.includes(d)
  ) || 1;

  const totalTopics = activeCourseId === 'python' ? 196 : 224;

  const heroImage =
    activeCourseId === 'python'
      ? '/src/assets/images/hero_python_mastery_1792862443181.jpg'
      : 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Unboxed Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="uppercase tracking-wider font-mono">{course.badge}</span>
              <span aria-hidden="true">·</span>
              <span>4 Structured Weeks</span>
              <span aria-hidden="true">·</span>
              <span>28 Daily Modules</span>
              <span aria-hidden="true">·</span>
              <span>{totalTopics} Topics</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {course.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
              {course.description}
            </p>

            {/* Action CTA Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onStartCourse}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Play className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">
                  {progress.completedDays.length === 0
                    ? `Start Day 1: ${course.modules[0].days[0].title}`
                    : `Continue Day ${nextUnfinishedDay}`}
                </span>
              </button>

              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {stats.completedDaysCount} of 28 Days Finished ({stats.overallPercentage}% Complete)
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Block */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl group">
              <img
                src={heroImage}
                alt={course.title}
                referrerPolicy="no-referrer"
                className="w-full h-48 sm:h-72 lg:h-80 object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs text-slate-200 flex items-center justify-between">
                <span className="font-mono text-indigo-300">{course.shortTitle}</span>
                <span className="text-slate-300">In-Browser Simulated Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">4 Weeks</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Structured Modules</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">{totalTopics} Topics</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">{activeCourseId === 'python' ? '7 Topics Daily' : '8 Topics Daily'}</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">4 Quizzes</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">Unlock Gates & Cert</div>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">Runner</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">In-Browser Execution</div>
          </div>
        </div>
      </div>
    </section>
  );
};
