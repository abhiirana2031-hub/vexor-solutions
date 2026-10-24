export type CourseId = 'python' | 'fullstack' | 'cpp' | 'dsa';

export type SupportedLanguage = 
  | 'python' 
  | 'javascript' 
  | 'typescript' 
  | 'cpp'
  | 'html' 
  | 'css' 
  | 'sql' 
  | 'bash' 
  | 'cmake'
  | 'json';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: SupportedLanguage;
  code: string;
  expectedOutput?: string;
  lineAnnotations?: Record<number, string>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  passingScorePercent: number; // e.g. 80
  questions: QuizQuestion[];
}

export interface InteractiveDiagram {
  type: 
    | 'memory' 
    | 'slicing' 
    | 'mro' 
    | 'eventloop' 
    | 'hashmap'
    | 'dom_tree'
    | 'http_request_cycle'
    | 'git_graph'
    | 'db_relations'
    | 'docker_layers';
  title: string;
  caption: string;
  data?: Record<string, any>;
}

export interface SubTopic {
  id: string;
  topicNumber: number; // 1 to 8
  title: string;
  explanation: string[];
  keyRules?: string[];
  codeSnippet: CodeSnippet;
  pitfall?: string;
  quickCheck?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface DayLesson {
  id: string;
  dayNumber: number;
  weekNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  overview: string;
  topics: SubTopic[]; // Guaranteed 7-8 distinct, detailed topics per day
  theoryContent?: {
    sectionTitle: string;
    paragraphs: string[];
    keyPoints?: string[];
    pitfallWarning?: string;
  }[];
  interactiveDiagram?: InteractiveDiagram;
  codeSnippets?: CodeSnippet[];
  practiceChallenge?: {
    title: string;
    instructions: string[];
    starterCode: string;
    solutionCode: string;
    hints: string[];
  };
  keyTakeaways?: string[];
}

export interface WeekModule {
  weekNumber: number;
  title: string;
  theme: string;
  description: string;
  conceptImage: string;
  imageAlt: string;
  days: DayLesson[];
  quiz: ModuleQuiz;
}

export interface Course {
  id: CourseId;
  title: string;
  shortTitle: string;
  badge: string;
  tagline: string;
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  };
  modules: WeekModule[];
}

export interface UserProgress {
  unlockedWeeks: number[]; // e.g. [1] initially, unlocks 2, 3, 4 upon passing quizzes
  completedDays: number[]; // e.g. [1, 2]
  quizScores: Record<number, { score: number; total: number; passed: boolean; completedAt: string }>;
  savedCodeSnippets: Record<string, string>;
  userName?: string;
  activityLog?: Record<string, number>; // Date string 'YYYY-MM-DD' -> activity count
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
  variables: Record<string, any>;
}

export type ThemeMode = 'light' | 'dark';
