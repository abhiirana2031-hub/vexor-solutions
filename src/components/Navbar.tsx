import React from 'react';
import { UserProgress, CourseId, ThemeMode } from '../types/course';
import { calculateProgressStats } from '../utils/course_logic';
import { COURSES, COURSE_LIST } from '../data/coursesCatalog';
import {
  Terminal,
  Award,
  BookOpen,
  Sparkles,
  Unlock,
  Lock,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  activeCourseId: CourseId;
  onSelectCourse: (courseId: CourseId) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  progress: UserProgress;
  activeTab: 'curriculum' | 'sandbox' | 'stats' | 'certificate';
  setActiveTab: (tab: 'curriculum' | 'sandbox' | 'stats' | 'certificate') => void;
  devMode: boolean;
  setDevMode: (val: boolean) => void;
  onOpenCertificate: () => void;
  onOpenMobileSyllabus?: () => void;
}

const getCourseVisuals = (id: CourseId) => {
  switch (id) {
    case 'python':
      return {
        icon: <Terminal className="w-5 h-5" />,
        smallIcon: <Terminal className="w-4 h-4" />,
        gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20',
        bg: 'bg-emerald-600',
        topicsCount: '196 Topics',
      };
    case 'fullstack':
      return {
        icon: <Globe className="w-5 h-5" />,
        smallIcon: <Globe className="w-4 h-4" />,
        gradient: 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20',
        bg: 'bg-indigo-600',
        topicsCount: '224 Topics',
      };
    case 'cpp':
      return {
        icon: <Cpu className="w-5 h-5" />,
        smallIcon: <Cpu className="w-4 h-4" />,
        gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20',
        bg: 'bg-cyan-600',
        topicsCount: '224 Topics',
      };
    case 'dsa':
      return {
        icon: <Layers className="w-5 h-5" />,
        smallIcon: <Layers className="w-4 h-4" />,
        gradient: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20',
        bg: 'bg-amber-600',
        topicsCount: '224 Topics',
      };
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  activeCourseId,
  onSelectCourse,
  theme,
  onToggleTheme,
  progress,
  activeTab,
  setActiveTab,
  devMode,
  setDevMode,
  onOpenCertificate,
  onOpenMobileSyllabus,
}) => {
  const currentCourse = COURSES[activeCourseId];
  const stats = calculateProgressStats(progress);
  const [courseDropdownOpen, setCourseDropdownOpen] = React.useState(false);
  const activeVisuals = getCourseVisuals(activeCourseId);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
          {/* Zone 1: Course Brand & Selector */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative">
              <button
                onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 -m-1 min-h-[44px]"
                title="Click to switch courses"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm ${activeVisuals.gradient}`}
                >
                  {activeVisuals.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
                      {currentCourse.shortTitle}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 transition-transform ${courseDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
                    4 Weeks · 28 Days · {activeVisuals.topicsCount}
                  </div>
                </div>
              </button>

              {/* Course Switcher Dropdown Menu */}
              {courseDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setCourseDropdownOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-30 space-y-1">
                    <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Select Academy Course
                    </div>
                    {COURSE_LIST.map((c) => {
                      const isSelected = c.id === activeCourseId;
                      const visuals = getCourseVisuals(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCourse(c.id);
                            setCourseDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-lg text-left transition-colors cursor-pointer flex items-center gap-3 min-h-[44px] ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-white border border-indigo-200 dark:border-indigo-900/60'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${visuals.bg}`}
                          >
                            {visuals.smallIcon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                              <span className="truncate">{c.title}</span>
                              {isSelected && (
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono shrink-0 ml-1">Active</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {c.badge}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeTab === 'curriculum'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeTab === 'sandbox'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Code Sandbox
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                activeTab === 'stats'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Progress ({stats.overallPercentage}%)
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
                activeTab === 'certificate'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-500 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Certificate</span>
            </button>
          </nav>

          {/* Zone 3: Theme Toggle & Dev Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold min-h-[44px] min-w-[44px] justify-center"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden lg:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden lg:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Dev Mode Unlock Toggle */}
            <button
              onClick={() => setDevMode(!devMode)}
              aria-label="Toggle Dev Unlock Mode"
              title="Toggle Dev Unlock Mode (unlocks all modules for preview and evaluation)"
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${
                devMode
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {devMode ? (
                <Unlock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
              <span className="hidden lg:inline">{devMode ? 'Dev: Unlocked' : 'Progression'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-First Fixed Bottom Navigation Bar (Natural Thumb Zone) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-lg px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        <div className="grid grid-cols-5 items-center h-16">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'curriculum'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Lesson</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('curriculum');
              if (onOpenMobileSyllabus) {
                onOpenMobileSyllabus();
              }
            }}
            className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer min-h-[44px]"
          >
            <Layers className="w-5 h-5 text-indigo-500" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">28 Days</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'sandbox'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer min-h-[44px] ${
              activeTab === 'stats'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="relative">
              <Award className="w-5 h-5" />
              {stats.overallPercentage > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] font-mono bg-indigo-600 text-white rounded-full px-1 leading-tight">
                  {stats.overallPercentage}%
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">Progress</span>
          </button>

          <button
            onClick={onOpenCertificate}
            className="flex flex-col items-center justify-center h-full text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors cursor-pointer min-h-[44px]"
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Certificate</span>
          </button>
        </div>
      </nav>
    </>
  );
};
