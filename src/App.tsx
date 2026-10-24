import React, { useState, useEffect } from 'react';
import { COURSES } from './data/coursesCatalog';
import { UserProgress, CourseId, ThemeMode, WeekModule, DayLesson } from './types/course';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SyllabusSidebar } from './components/SyllabusSidebar';
import { LessonViewer } from './components/LessonViewer';
import { QuizModal } from './components/QuizModal';
import { CertificateModal, CertificateCanvas } from './components/CertificateModal';
import { SandboxPlayground } from './components/SandboxPlayground';
import { StatsView } from './components/StatsView';
import { Unlock } from 'lucide-react';
import { getDefaultActivityLog } from './utils/course_logic';

const THEME_STORAGE_KEY = 'applet_theme_v1';
const COURSE_STORAGE_KEY = 'applet_active_course_v1';
const PYTHON_PROGRESS_KEY = 'python_mastery_academy_progress_v1';
const FULLSTACK_PROGRESS_KEY = 'fullstack_mastery_academy_progress_v1';
const CPP_PROGRESS_KEY = 'cpp_mastery_academy_progress_v1';
const DSA_PROGRESS_KEY = 'dsa_mastery_academy_progress_v1';

const getInitialProgress = (storageKey: string, defaultName: string): UserProgress => {
  const defaultProgress: UserProgress = {
    unlockedWeeks: [1],
    completedDays: [],
    quizScores: {},
    savedCodeSnippets: {},
    userName: defaultName,
    activityLog: getDefaultActivityLog([]),
  };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.activityLog || Object.keys(parsed.activityLog).length === 0) {
        parsed.activityLog = getDefaultActivityLog(parsed.completedDays || []);
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Failed to parse progress from ${storageKey}`, e);
  }

  return defaultProgress;
};

export default function App() {
  // 1. Theme State (Light vs Dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // ignore
    }
    return 'dark'; // Default to dark mode
  });

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Active Course State
  const [activeCourseId, setActiveCourseId] = useState<CourseId>(() => {
    try {
      const savedCourse = localStorage.getItem(COURSE_STORAGE_KEY);
      if (savedCourse === 'python' || savedCourse === 'fullstack' || savedCourse === 'cpp' || savedCourse === 'dsa') {
        return savedCourse as CourseId;
      }
    } catch {
      // ignore
    }
    return 'python';
  });

  useEffect(() => {
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, activeCourseId);
    } catch {
      // ignore
    }
  }, [activeCourseId]);

  // 3. Independent Progress State per Course
  const [pythonProgress, setPythonProgress] = useState<UserProgress>(() =>
    getInitialProgress(PYTHON_PROGRESS_KEY, 'Python Scholar')
  );
  const [fullstackProgress, setFullstackProgress] = useState<UserProgress>(() =>
    getInitialProgress(FULLSTACK_PROGRESS_KEY, 'Full Stack Engineer')
  );
  const [cppProgress, setCppProgress] = useState<UserProgress>(() =>
    getInitialProgress(CPP_PROGRESS_KEY, 'C++ Systems Engineer')
  );
  const [dsaProgress, setDsaProgress] = useState<UserProgress>(() =>
    getInitialProgress(DSA_PROGRESS_KEY, 'Algorithm Master')
  );

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PYTHON_PROGRESS_KEY, JSON.stringify(pythonProgress));
    } catch (e) {
      console.error('Failed to save python progress', e);
    }
  }, [pythonProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(FULLSTACK_PROGRESS_KEY, JSON.stringify(fullstackProgress));
    } catch (e) {
      console.error('Failed to save fullstack progress', e);
    }
  }, [fullstackProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(CPP_PROGRESS_KEY, JSON.stringify(cppProgress));
    } catch (e) {
      console.error('Failed to save cpp progress', e);
    }
  }, [cppProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(dsaProgress));
    } catch (e) {
      console.error('Failed to save dsa progress', e);
    }
  }, [dsaProgress]);

  const progressMap: Record<CourseId, UserProgress> = {
    python: pythonProgress,
    fullstack: fullstackProgress,
    cpp: cppProgress,
    dsa: dsaProgress,
  };
  const setProgressMap: Record<CourseId, React.Dispatch<React.SetStateAction<UserProgress>>> = {
    python: setPythonProgress,
    fullstack: setFullstackProgress,
    cpp: setCppProgress,
    dsa: setDsaProgress,
  };

  const currentProgress = progressMap[activeCourseId] || pythonProgress;
  const setCurrentProgress = setProgressMap[activeCourseId] || setPythonProgress;

  // Active UI Navigation state
  const [activeTab, setActiveTab] = useState<'curriculum' | 'sandbox' | 'stats' | 'certificate'>('curriculum');
  const [activeDayId, setActiveDayId] = useState<string>('w1-d1');
  const [devMode, setDevMode] = useState<boolean>(false);
  const [activeQuizWeek, setActiveQuizWeek] = useState<number | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [unlockNotification, setUnlockNotification] = useState<string | null>(null);

  // Get active course data
  const currentCourse = COURSES[activeCourseId] || COURSES.python;
  const courseModules: WeekModule[] = currentCourse.modules;

  // Ensure activeDayId belongs to current course
  let activeLesson: DayLesson = courseModules[0].days[0];
  let activeModule: WeekModule = courseModules[0];

  let foundDay = false;
  for (const mod of courseModules) {
    const found = mod.days.find((d) => d.id === activeDayId);
    if (found) {
      activeLesson = found;
      activeModule = mod;
      foundDay = true;
      break;
    }
  }

  // If day was not found (e.g., switched courses), default to first day of new course
  useEffect(() => {
    if (!foundDay && courseModules[0]?.days[0]?.id) {
      setActiveDayId(courseModules[0].days[0].id);
    }
  }, [activeCourseId, foundDay, courseModules]);

  // Day navigation helpers
  const allDays = courseModules.flatMap((m) => m.days);
  const currentDayIndex = allDays.findIndex((d) => d.id === activeDayId);
  const hasPrevDay = currentDayIndex > 0;
  const hasNextDay = currentDayIndex < allDays.length - 1;

  const handlePrevDay = () => {
    if (hasPrevDay) {
      setActiveDayId(allDays[currentDayIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextDay = () => {
    if (hasNextDay) {
      setActiveDayId(allDays[currentDayIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleComplete = (dayNumber: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    setCurrentProgress((prev) => {
      const isAlreadyDone = prev.completedDays.includes(dayNumber);
      const updated = isAlreadyDone
        ? prev.completedDays.filter((d) => d !== dayNumber)
        : [...prev.completedDays, dayNumber];

      const currentActivity = prev.activityLog || {};
      const newCount = (currentActivity[todayStr] || 0) + (isAlreadyDone ? 0 : 1);

      return {
        ...prev,
        completedDays: updated,
        activityLog: {
          ...currentActivity,
          [todayStr]: newCount,
        },
      };
    });
  };

  const handleQuizPassed = (weekNumber: number, score: number, total: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    setCurrentProgress((prev) => {
      const nextWeek = weekNumber + 1;
      const newUnlocked =
        prev.unlockedWeeks.includes(nextWeek) || nextWeek > 4
          ? prev.unlockedWeeks
          : [...prev.unlockedWeeks, nextWeek];

      const currentActivity = prev.activityLog || {};

      return {
        ...prev,
        unlockedWeeks: newUnlocked,
        activityLog: {
          ...currentActivity,
          [todayStr]: (currentActivity[todayStr] || 0) + 2,
        },
        quizScores: {
          ...prev.quizScores,
          [weekNumber]: {
            score,
            total,
            passed: true,
            completedAt: new Date().toISOString(),
          },
        },
      };
    });

    // Show celebratory banner
    if (weekNumber < 4) {
      setUnlockNotification(`Week ${weekNumber + 1} Module Unlocked! Excellent work.`);
      setTimeout(() => setUnlockNotification(null), 6000);
    } else {
      setUnlockNotification(`Congratulations! You passed the Final Exam and earned your Certificate!`);
      setTimeout(() => setUnlockNotification(null), 8000);
    }
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        `Are you sure you want to reset all progress and quiz scores for ${currentCourse.title}?`
      )
    ) {
      const freshProgress: UserProgress = {
        unlockedWeeks: [1],
        completedDays: [],
        quizScores: {},
        savedCodeSnippets: {},
        userName: activeCourseId === 'python' ? 'Python Scholar' : 'Full Stack Developer',
        activityLog: getDefaultActivityLog([]),
      };
      setCurrentProgress(freshProgress);
      setActiveDayId('w1-d1');
    }
  };

  const handleUpdateStudentName = (name: string) => {
    setCurrentProgress((prev) => ({
      ...prev,
      userName: name,
    }));
  };

  // Mobile Syllabus Drawer State
  const [isMobileSyllabusOpen, setIsMobileSyllabusOpen] = useState(false);

  // Find the quiz for active modal
  const currentQuizModule = activeQuizWeek
    ? courseModules.find((m) => m.weekNumber === activeQuizWeek)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Global Navigation Bar (Includes Mobile Fixed Bottom Tab Bar) */}
      <Navbar
        activeCourseId={activeCourseId}
        onSelectCourse={(courseId) => {
          setActiveCourseId(courseId);
          setActiveDayId('w1-d1');
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        progress={currentProgress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        devMode={devMode}
        setDevMode={setDevMode}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenMobileSyllabus={() => setIsMobileSyllabusOpen(true)}
      />

      {/* Unlock Notification Toast */}
      {unlockNotification && (
        <div className="fixed top-16 right-4 z-50 p-4 rounded-xl bg-emerald-900/90 dark:bg-emerald-950/90 border border-emerald-500/80 text-emerald-100 dark:text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 dark:text-emerald-400">
            <Unlock className="w-4 h-4" />
          </div>
          <div>{unlockNotification}</div>
        </div>
      )}

      {/* 2. Main Viewport Router (pb-24 on mobile ensures clearance for fixed bottom tab bar) */}
      <main className="flex-1 pb-24 md:pb-8">
        {activeTab === 'curriculum' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              activeCourseId={activeCourseId}
              progress={currentProgress}
              activeDayNumber={activeLesson.dayNumber}
              onStartCourse={() => {
                const nextDay = allDays.find((d) => !currentProgress.completedDays.includes(d.dayNumber));
                if (nextDay) setActiveDayId(nextDay.id);
                const el = document.getElementById('lesson-content-area');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Split Layout: Desktop Sidebar + Lesson Viewer */}
            <div
              id="lesson-content-area"
              className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch"
            >
              <SyllabusSidebar
                modules={courseModules}
                progress={currentProgress}
                activeDayId={activeDayId}
                onSelectDay={(dayId) => {
                  setActiveDayId(dayId);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenQuiz={(weekNumber) => setActiveQuizWeek(weekNumber)}
                devMode={devMode}
              />

              <div className="flex-1 bg-white dark:bg-slate-950 transition-colors">
                <LessonViewer
                  lesson={activeLesson}
                  module={activeModule}
                  isCompleted={currentProgress.completedDays.includes(activeLesson.dayNumber)}
                  onToggleComplete={handleToggleComplete}
                  onNextDay={handleNextDay}
                  onPrevDay={handlePrevDay}
                  hasPrevDay={hasPrevDay}
                  hasNextDay={hasNextDay}
                  onOpenQuiz={(weekNumber) => setActiveQuizWeek(weekNumber)}
                  onOpenMobileSyllabus={() => setIsMobileSyllabusOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && <SandboxPlayground />}

        {activeTab === 'stats' && (
          <StatsView
            progress={currentProgress}
            modules={courseModules}
            activeCourseId={activeCourseId}
            onSelectDay={(dayId) => {
              setActiveDayId(dayId);
              setActiveTab('curriculum');
            }}
            onOpenQuiz={(weekNum) => setActiveQuizWeek(weekNum)}
            onOpenCertificate={() => setIsCertificateOpen(true)}
            onResetProgress={handleResetProgress}
            devMode={devMode}
          />
        )}

        {activeTab === 'certificate' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentCourse.title} Credential Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Official verified certificate for completing the 4-week, 28-day {currentCourse.shortTitle} academy.
              </p>
            </div>

            <CertificateCanvas
              progress={currentProgress}
              activeCourseId={activeCourseId}
              onUpdateName={handleUpdateStudentName}
            />
          </div>
        )}
      </main>

      {/* 3. Global Modals & Mobile Drawer */}
      {isMobileSyllabusOpen && (
        <SyllabusSidebar
          modules={courseModules}
          progress={currentProgress}
          activeDayId={activeDayId}
          onSelectDay={(dayId) => {
            setActiveDayId(dayId);
            setIsMobileSyllabusOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenQuiz={(weekNumber) => {
            setActiveQuizWeek(weekNumber);
            setIsMobileSyllabusOpen(false);
          }}
          devMode={devMode}
          isMobileDrawer={true}
          onCloseMobileDrawer={() => setIsMobileSyllabusOpen(false)}
        />
      )}

      {currentQuizModule && (
        <QuizModal
          quiz={currentQuizModule.quiz}
          isOpen={activeQuizWeek !== null}
          onClose={() => setActiveQuizWeek(null)}
          onQuizPassed={handleQuizPassed}
        />
      )}

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        progress={currentProgress}
        activeCourseId={activeCourseId}
        onUpdateName={handleUpdateStudentName}
      />

      {/* 4. Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-8 px-4 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-300">{currentCourse.title}</span>
            <span aria-hidden="true">·</span>
            <span>4-Week Professional Academy ({activeCourseId === 'python' ? '196' : '224'} In-Depth Topics)</span>
          </div>
          <div className="text-slate-500">
            Interactive In-Browser Execution Engine · Light & Dark High-Contrast Modes
          </div>
        </div>
      </footer>
    </div>
  );
}
