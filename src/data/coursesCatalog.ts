import { Course, CourseId } from '../types/course';
import { COURSE_MODULES as PYTHON_MODULES } from './courseData';
import { FULLSTACK_WEEK_1_MODULE } from './fullstackWeek1Data';
import { FULLSTACK_WEEK_2_MODULE } from './fullstackWeek2Data';
import { FULLSTACK_WEEK_3_MODULE } from './fullstackWeek3Data';
import { FULLSTACK_WEEK_4_MODULE } from './fullstackWeek4Data';
import { CPP_WEEK_1_MODULE } from './cppWeek1Data';
import { CPP_WEEK_2_MODULE } from './cppWeek2Data';
import { CPP_WEEK_3_MODULE } from './cppWeek3Data';
import { CPP_WEEK_4_MODULE } from './cppWeek4Data';
import { DSA_WEEK_1_MODULE } from './dsaWeek1Data';
import { DSA_WEEK_2_MODULE } from './dsaWeek2Data';
import { DSA_WEEK_3_MODULE } from './dsaWeek3Data';
import { DSA_WEEK_4_MODULE } from './dsaWeek4Data';

export const FULLSTACK_MODULES = [
  FULLSTACK_WEEK_1_MODULE,
  FULLSTACK_WEEK_2_MODULE,
  FULLSTACK_WEEK_3_MODULE,
  FULLSTACK_WEEK_4_MODULE,
];

export const CPP_MODULES = [
  CPP_WEEK_1_MODULE,
  CPP_WEEK_2_MODULE,
  CPP_WEEK_3_MODULE,
  CPP_WEEK_4_MODULE,
];

export const DSA_MODULES = [
  DSA_WEEK_1_MODULE,
  DSA_WEEK_2_MODULE,
  DSA_WEEK_3_MODULE,
  DSA_WEEK_4_MODULE,
];

export const COURSES: Record<CourseId, Course> = {
  python: {
    id: 'python',
    title: 'Python Engineering Mastery',
    shortTitle: 'Python Mastery',
    badge: 'CPython 3.12+',
    tagline: 'From Memory Models & OOP to Concurrency & Metaprogramming',
    description: 'Master Python from fundamentals to deep architectural mastery: memory references, data structures, generators, async event loops, and production design patterns.',
    colorScheme: {
      primary: 'emerald',
      secondary: 'teal',
      accent: 'amber',
      badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30'
    },
    modules: PYTHON_MODULES
  },
  fullstack: {
    id: 'fullstack',
    title: 'Full Stack Web Development Academy',
    shortTitle: 'Full Stack Web Dev',
    badge: 'React 19 · Node.js · SQL · Docker',
    tagline: 'From Web Basics & Front-End to Back-End, Databases & Cloud Production',
    description: 'A comprehensive 4-week, 28-day professional curriculum covering HTML5, CSS3, JavaScript ES6+, React 19, Node.js, Express, PostgreSQL, Prisma, Git/GitHub, Docker, and CI/CD Cloud Publishing.',
    colorScheme: {
      primary: 'indigo',
      secondary: 'violet',
      accent: 'cyan',
      badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      badgeText: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/30'
    },
    modules: FULLSTACK_MODULES
  },
  cpp: {
    id: 'cpp',
    title: 'C++ Systems & Software Architecture Academy',
    shortTitle: 'C++ Systems Academy',
    badge: 'C++20/23 · RAII · Concurrency',
    tagline: 'From Memory, Pointers & RAII to Templates, Concepts, Atomics & CMake',
    description: 'A complete 4-week, 28-day professional systems curriculum covering low-level memory, pointer arithmetic, RAII, move semantics, smart pointers, C++20 concepts, multithreading, lock-free atomics, CMake, and production architecture.',
    colorScheme: {
      primary: 'cyan',
      secondary: 'blue',
      accent: 'sky',
      badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
      badgeText: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/30'
    },
    modules: CPP_MODULES
  },
  dsa: {
    id: 'dsa',
    title: 'Data Structures & Algorithms Mastery Academy',
    shortTitle: 'DSA Mastery Academy',
    badge: 'Big-O · Trees · Graphs · DP',
    tagline: 'From Asymptotics & Two Pointers to Trees, Graphs, DP & Interview Architecture',
    description: 'A comprehensive 4-week, 28-day algorithmic academy covering asymptotic Big-O, dynamic arrays, sliding windows, linked lists, monotonic stacks, binary trees, heaps, tries, Dijkstra, dynamic programming, and greedy systems.',
    colorScheme: {
      primary: 'amber',
      secondary: 'orange',
      accent: 'rose',
      badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
      badgeText: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30'
    },
    modules: DSA_MODULES
  }
};

export const COURSE_LIST = Object.values(COURSES);
