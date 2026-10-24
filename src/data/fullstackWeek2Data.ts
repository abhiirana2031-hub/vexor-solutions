import { WeekModule } from '../types/course';

export const FULLSTACK_WEEK_2_MODULE: WeekModule = {
  weekNumber: 2,
  title: 'Front-End Development with Modern React, TypeScript & State',
  theme: 'Component Architecture, React Hooks, Forms & Routing',
  description:
    'Build reactive, type-safe, production-grade user interfaces with React 19, TypeScript, modern bundlers (Vite), state management architectures (useState, useReducer, Context API), and client-side routing.',
  conceptImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Modern React TypeScript frontend component tree interface',
  days: [
    {
      id: 'fs-w2-d8',
      dayNumber: 8,
      weekNumber: 2,
      title: 'Modern Frontend Tooling: Vite, npm & TypeScript Fundamentals',
      subtitle: 'Package management, ESM bundlers, TypeScript interfaces, and project setup',
      durationMinutes: 50,
      overview:
        'Understand modern frontend build tools. Compare legacy Webpack with blazing fast Vite (ESM), understand package.json dependencies vs devDependencies, and learn TypeScript fundamentals for bulletproof component contracts.',
      topics: [
        {
          id: 'fs-w2-d8-t1',
          topicNumber: 1,
          title: 'Package Managers: npm vs yarn vs pnpm & lockfiles',
          explanation: [
            'Node Package Manager (npm) coordinates third-party dependencies from the global registry.',
            '`package.json` declares project dependencies, while `package-lock.json` freezes exact cryptographic versions, ensuring identical builds across all machines and CI servers.'
          ],
          keyRules: [
            'Always commit package-lock.json to version control.',
            'dependencies are required at runtime in production (e.g., react, express).',
            'devDependencies are only needed during local build and testing (e.g., typescript, vite).'
          ],
          codeSnippet: {
            id: 'fs-t8-c1',
            title: 'Inspecting package.json Configuration',
            description: 'Standard package structure with dependencies and scripts.',
            language: 'json',
            code: `{
  "name": "fullstack-portal",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.500.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^6.0.0"
  }
}`,
            expectedOutput: 'Clean configuration separating runtime and development dependencies'
          },
          pitfall: 'Running `npm install` without committing `package-lock.json` leads to the infamous "works on my machine" bug when dependencies silently drift.',
          quickCheck: {
            question: 'Why should typescript and vite be installed in devDependencies rather than dependencies?',
            options: [
              'They do not work in dependencies',
              'They are only used during development/compilation and are not needed in the production runtime bundle',
              'To hide them from GitHub',
              'npm requires it'
            ],
            correctIndex: 1,
            explanation: 'devDependencies are development-only tooling that compile the code down to static assets, so they do not need to run in production.'
          }
        },
        {
          id: 'fs-w2-d8-t2',
          topicNumber: 2,
          title: 'Why Vite? Native ES Modules (ESM) vs Legacy Bundlers',
          explanation: [
            'Legacy bundlers (Webpack, Parcel) bundle every module in an entire project before serving dev pages, causing sluggish cold starts on large codebases.',
            'Vite leverages native browser ES Modules (`<script type="module">`). It serves source code on-demand and pre-bundles node_modules with esbuild in Go (10-100x faster).'
          ],
          codeSnippet: {
            id: 'fs-t8-c2',
            title: 'Scaffolding a Vite React TypeScript Application',
            description: 'Quick project initialization with modern Vite template.',
            language: 'bash',
            code: `# Scaffold modern React + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Navigate and install dependencies
cd my-app
npm install

# Start instant HMR development server
npm run dev`,
            expectedOutput: 'Vite v6.0.0 ready in 140 ms\nLocal: http://localhost:5173/'
          },
          pitfall: 'Do not import CommonJS `require()` in Vite client code; always use modern standard ESM `import` statements.',
          quickCheck: {
            question: 'What allows Vite dev server to start almost instantaneously compared to legacy Webpack?',
            options: [
              'It does not compile code at all',
              'It serves native browser ES Modules on-demand without pre-bundling the entire source tree',
              'It skips TypeScript checks',
              'It runs in the cloud'
            ],
            correctIndex: 1,
            explanation: 'Vite takes advantage of native browser ESM support, compiling and serving only the files currently requested by the browser.'
          }
        },
        {
          id: 'fs-w2-d8-t3',
          topicNumber: 3,
          title: 'TypeScript Foundations: Static Types vs Dynamic Types',
          explanation: [
            'JavaScript is dynamically typed (type errors only surface at runtime when users click buttons).',
            'TypeScript adds static type definitions on top of JavaScript. The compiler validates contracts at build time, preventing runtime bugs (like `undefined is not a function`) before deployment.'
          ],
          codeSnippet: {
            id: 'fs-t8-c3',
            title: 'Type Annotations and Static Checking',
            description: 'Explicit parameter and return types catching errors at compile time.',
            language: 'typescript',
            code: `// Explicit primitive annotations
let appName: string = 'FullStack Pro';
let studentCount: number = 350;
let isEnrolled: boolean = true;

// Function signatures with parameter and return type contracts
function formatWelcome(name: string, daysActive: number): string {
  return \`Welcome back \${name}! You have been active for \${daysActive} days.\`;
}

console.log(formatWelcome('Taylor', 14));
// formatWelcome('Taylor', '14'); // Error: Argument of type 'string' is not assignable to 'number'.`,
            expectedOutput: 'Welcome back Taylor! You have been active for 14 days.'
          },
          pitfall: 'Do not sprinkle `any` across your TypeScript files; `any` turns off type safety and defeats the entire purpose of TypeScript. Use `unknown` or specific interfaces.',
          quickCheck: {
            question: 'What is the primary purpose of TypeScript in modern web development?',
            options: [
              'To speed up CPU runtime execution',
              'To catch type errors and contract mismatches at compile time before code reaches production',
              'To replace HTML and CSS',
              'To encrypt database records'
            ],
            correctIndex: 1,
            explanation: 'TypeScript provides static analysis at compile time, eliminating an entire category of runtime type bugs.'
          }
        },
        {
          id: 'fs-w2-d8-t4',
          topicNumber: 4,
          title: 'TypeScript Interfaces vs Type Aliases',
          explanation: [
            'Both `interface` and `type` define the shape of an object or data structure.',
            '`interface` is extensible via declaration merging and inheritance (`extends`), making it the standard for public APIs and React component props.',
            '`type` is preferred for unions, primitives, and tuples (e.g. `type Status = "idle" | "loading" | "error"`).'
          ],
          codeSnippet: {
            id: 'fs-t8-c4',
            title: 'Defining Interfaces and Union Types',
            description: 'Modeling user profiles and discrete state unions.',
            language: 'typescript',
            code: `// Union type of discrete string literals
type LessonStatus = 'locked' | 'in_progress' | 'completed';

// Extensible object interface
interface UserProfile {
  id: string;
  email: string;
  status: LessonStatus;
  avatarUrl?: string; // Optional property
}

const activeDev: UserProfile = {
  id: 'usr-901',
  email: 'alex@dev.io',
  status: 'completed'
};

console.log('User status:', activeDev.status);`,
            expectedOutput: 'User status: completed'
          },
          pitfall: 'Marking a property optional with `?` means its type is `T | undefined`. Always guard with optional chaining `user.avatarUrl?.toUpperCase()` before calling methods on it.',
          quickCheck: {
            question: 'What does the question mark in avatarUrl?: string mean?',
            options: [
              'The property is a boolean',
              'The property is optional and can be string or undefined',
              'The property is secret',
              'The property must be queried from a database'
            ],
            correctIndex: 1,
            explanation: 'The ? modifier makes a property optional, allowing it to be omitted or have the value undefined.'
          }
        },
        {
          id: 'fs-w2-d8-t5',
          topicNumber: 5,
          title: 'Generics in TypeScript: Flexible, Type-Safe Functions',
          explanation: [
            'Generics allow writing reusable functions, interfaces, and classes that work with any type while maintaining complete type safety.',
            'Instead of using `any`, you pass a type parameter `<T>` that captures the input type and guarantees the return type.'
          ],
          codeSnippet: {
            id: 'fs-t8-c5',
            title: 'Generic API Response Envelope',
            description: 'Wrapping diverse payloads inside a typed API response.',
            language: 'typescript',
            code: `// Generic Response Wrapper
interface ApiResponse<TData> {
  success: boolean;
  timestamp: string;
  data: TData;
}

interface CourseSummary {
  title: string;
  totalModules: number;
}

const response: ApiResponse<CourseSummary> = {
  success: true,
  timestamp: '2026-10-24T12:00:00Z',
  data: {
    title: 'Full Stack Engineering',
    totalModules: 4
  }
};

console.log('Loaded course:', response.data.title);`,
            expectedOutput: 'Loaded course: Full Stack Engineering'
          },
          pitfall: 'Overusing complex nested generics for simple scenarios can make code unreadable; use them when the data shape genuinely depends on caller input.',
          quickCheck: {
            question: 'What does <T> represent in a TypeScript generic function?',
            options: [
              'A template placeholder for a type that will be specified at invocation time',
              'A fixed integer type',
              'An HTML tag',
              'A timeout in milliseconds'
            ],
            correctIndex: 0,
            explanation: '<T> is a type variable / parameter that captures the specific type provided by the caller.'
          }
        },
        {
          id: 'fs-w2-d8-t6',
          topicNumber: 6,
          title: 'TypeScript with DOM Elements & Event Handlers',
          explanation: [
            'When interacting with HTML elements in React and TypeScript, use specific DOM types like `HTMLInputElement`, `HTMLButtonElement`, and `React.ChangeEvent<HTMLInputElement>`.',
            'This guarantees autocomplete on `e.target.value` and avoids casting bugs.'
          ],
          codeSnippet: {
            id: 'fs-t8-c6',
            title: 'Typed Event Handlers in TypeScript',
            description: 'Handling input change and form submission events safely.',
            language: 'typescript',
            code: `// Type-safe change event handler
function handleInputChange(event: { target: { value: string } }) {
  const query: string = event.target.value;
  console.log('Search query updated:', query);
}

// Simulating typed event dispatch
handleInputChange({ target: { value: 'react hooks' } });`,
            expectedOutput: 'Search query updated: react hooks'
          },
          pitfall: 'Do not cast events with `as any`; using `React.ChangeEvent<HTMLInputElement>` ensures your event handlers are statically verified.',
          quickCheck: {
            question: 'Which TypeScript type accurately models an input text change event in React?',
            options: [
              'React.MouseEvent<HTMLButtonElement>',
              'React.ChangeEvent<HTMLInputElement>',
              'React.KeyboardEvent<HTMLDivElement>',
              'Event'
            ],
            correctIndex: 1,
            explanation: 'React.ChangeEvent<HTMLInputElement> models changes on HTML <input> controls.'
          }
        },
        {
          id: 'fs-w2-d8-t7',
          topicNumber: 7,
          title: 'Configuring tsconfig.json: strict, jsx, and paths',
          explanation: [
            'The `tsconfig.json` file configures compiler options for the TypeScript language service.',
            'Crucial production settings: `"strict": true` (enforces null checks and no implicit any), `"jsx": "react-jsx"` (supports React 17+ transform without importing React), and `"paths"` (path aliases like `@/*`).'
          ],
          codeSnippet: {
            id: 'fs-t8-c7',
            title: 'Production-Ready tsconfig.json Settings',
            description: 'Essential compiler options for React Vite applications.',
            language: 'json',
            code: `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}`,
            expectedOutput: 'Compiler configured with strict type checks and modern JSX transform'
          },
          pitfall: 'Disabling `"strict": true` hides `null` and `undefined` errors that will eventually crash in production.',
          quickCheck: {
            question: 'What does "strict": true in tsconfig.json enable?',
            options: [
              'All strict type-checking options, including strictNullChecks and noImplicitAny',
              'Slower compilation only',
              'Enables dark mode',
              'Disables console.log'
            ],
            correctIndex: 0,
            explanation: '"strict": true activates the full suite of static safety checks, protecting against null pointer exceptions.'
          }
        },
        {
          id: 'fs-w2-d8-t8',
          topicNumber: 8,
          title: 'ESLint & Prettier: Enforcing Code Quality & Formatting',
          explanation: [
            'Linters (ESLint) catch code bugs, security flaws, and bad practices.',
            'Formatters (Prettier) enforce uniform code formatting (indentation, quotes, commas) automatically on save.',
            'Automating both in your git pre-commit hooks guarantees clean codebases.'
          ],
          codeSnippet: {
            id: 'fs-t8-c8',
            title: 'Running ESLint in Vite Projects',
            description: 'Running the linter from package.json scripts.',
            language: 'bash',
            code: `# Run ESLint check across all TypeScript files
npm run lint

# Auto-fix fixable formatting and lint issues
npx eslint src --fix`,
            expectedOutput: 'Checked 24 files with 0 errors'
          },
          pitfall: 'Do not ignore lint warnings in team projects; treat warnings as errors in CI to maintain high codebase standards.',
          quickCheck: {
            question: 'What is the primary difference in roles between ESLint and Prettier?',
            options: [
              'ESLint finds logical bugs and syntax violations; Prettier handles visual formatting and indentation',
              'Prettier compiles TypeScript; ESLint runs unit tests',
              'They do the exact same thing',
              'ESLint is for CSS only'
            ],
            correctIndex: 0,
            explanation: 'ESLint focuses on code quality rules and preventing bugs; Prettier focuses on consistent stylistic formatting.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Define Type-Safe Full-Stack Course Models',
        instructions: [
          'Create a CourseModule interface with id, weekNumber, and title.',
          'Define a LessonProgress type with status union ("not_started" | "in_progress" | "completed").',
          'Write a generic ApiResponse<T> interface.',
          'Instantiate a typed mock response.'
        ],
        starterCode: `// Write your TypeScript interfaces and types here
interface CourseModule {
  // Add properties
}`,
        solutionCode: `type LessonStatus = 'not_started' | 'in_progress' | 'completed';

interface CourseModule {
  id: string;
  weekNumber: number;
  title: string;
  status: LessonStatus;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

const sampleModule: ApiResponse<CourseModule> = {
  success: true,
  timestamp: new Date().toISOString(),
  data: {
    id: 'fs-mod-1',
    weekNumber: 1,
    title: 'Web Foundations',
    status: 'completed'
  }
};
console.log(sampleModule.data.title);`,
        hints: [
          'Use union types with pipe | for LessonStatus.',
          'Use <T> for the generic parameter in ApiResponse.'
        ]
      },
      keyTakeaways: [
        'Vite provides instantaneous development server feedback using native browser ES Modules.',
        'TypeScript catches contract errors at build time, eliminating runtime type crashes.',
        'Use strict: true and explicit interfaces for reliable full-stack application development.'
      ]
    },
    {
      id: 'fs-w2-d9',
      dayNumber: 9,
      weekNumber: 2,
      title: 'React Core: JSX, Component Tree, Props & Composition',
      subtitle: 'Declarative UI, virtual DOM diffing, component hierarchy, and children props',
      durationMinutes: 50,
      overview:
        'Master the fundamental mental model of React: declarative UI as a function of state, JSX syntax transformation, unidirectional data flow with props, and component composition patterns.',
      topics: [
        {
          id: 'fs-w2-d9-t1',
          topicNumber: 1,
          title: 'The React Mental Model: UI as a Function of State',
          explanation: [
            'In vanilla JavaScript, you manually query and mutate DOM nodes (`element.appendChild()`, `element.innerHTML = ...`). This imperative approach leads to state synchronization bugs.',
            'React is declarative: you describe what the UI should look like for a given state (`UI = f(state)`). When state changes, React handles updating the browser DOM efficiently.'
          ],
          codeSnippet: {
            id: 'fs-t9-c1',
            title: 'Imperative DOM vs Declarative React',
            description: 'Comparing manual DOM mutation with declarative React rendering.',
            language: 'javascript',
            code: `// Imperative (Vanilla JS): Manual step-by-step DOM manipulation
// const btn = document.createElement('button');
// btn.innerText = count;
// btn.onclick = () => { count++; btn.innerText = count; };

// Declarative (React): Describe the desired output given the count
function CounterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-600 text-white rounded">
      Clicks: {count}
    </button>
  );
}`,
            expectedOutput: 'Declarative component rendering predictable UI based on props'
          },
          pitfall: 'Never manually query and mutate the DOM inside React components (`document.getElementById()`); let React manage the DOM tree.',
          quickCheck: {
            question: 'What is the core philosophy of declarative React UI?',
            options: [
              'You write imperative DOM mutations step by step',
              'You declare what the UI should look like for a given state, and React computes the DOM changes',
              'React compiles to C++',
              'All UI must be stored in cookies'
            ],
            correctIndex: 1,
            explanation: 'React declarative model means you describe the UI state, and React reconciles the DOM automatically.'
          }
        },
        {
          id: 'fs-w2-d9-t2',
          topicNumber: 2,
          title: 'JSX: JavaScript XML & The Under-the-Hood Transformation',
          explanation: [
            'JSX is a syntax extension for JavaScript that looks like HTML but has the full power of JavaScript.',
            'The JSX transform converts `<div className="card">Hello</div>` into `_jsx("div", { className: "card", children: "Hello" })`.',
            'Because JSX compiles to JavaScript objects, you can return JSX from functions, store it in variables, and pass it as arguments.'
          ],
          codeSnippet: {
            id: 'fs-t9-c2',
            title: 'Embedding JavaScript Expressions in JSX',
            description: 'Using curly braces {} to execute expressions inside markup.',
            language: 'javascript',
            code: `function Greeting({ studentName, completedLessons }: { studentName: string; completedLessons: number }) {
  const isAllComplete = completedLessons >= 28;

  return (
    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
      <h2 className="text-lg font-bold">Hello, {studentName.toUpperCase()}!</h2>
      <p>Progress: {completedLessons} / 28 lessons completed.</p>
      {isAllComplete && <span className="text-emerald-500 font-semibold">🎉 Certified Graduate!</span>}
    </div>
  );
}`,
            expectedOutput: 'Dynamic JSX rendering student progress with conditional completion badge'
          },
          pitfall: 'You cannot write statement blocks (like `if (x) {}` or `for () {}`) inside JSX curly braces `{}`; you can only write expressions (ternary `? :`, map, boolean `&&`).',
          quickCheck: {
            question: 'Can you place a regular "for" loop directly inside JSX curly braces { ... }?',
            options: [
              'Yes, anywhere',
              'No, JSX only accepts expressions that produce a value (like array.map or ternaries), not statements',
              'Only in React 19',
              'Only inside <p> tags'
            ],
            correctIndex: 1,
            explanation: 'JSX allows only JavaScript expressions inside curly braces; statements like for or if/else cannot be placed inside JSX directly.'
          }
        },
        {
          id: 'fs-w2-d9-t3',
          topicNumber: 3,
          title: 'Components: Pure Functions & Unidirectional Data Flow',
          explanation: [
            'A React component is a pure JavaScript function that accepts `props` (inputs) and returns JSX (output).',
            'Data flows strictly in one direction (Top-Down / Unidirectional): from parent components to child components via props. Children cannot mutate parent props directly.'
          ],
          codeSnippet: {
            id: 'fs-t9-c3',
            title: 'Parent-to-Child Props Contract',
            description: 'Passing data down through typed props.',
            language: 'typescript',
            code: `interface LessonBadgeProps {
  dayNumber: number;
  title: string;
  isUnlocked: boolean;
}

function LessonBadge({ dayNumber, title, isUnlocked }: LessonBadgeProps) {
  return (
    <div className={\`flex items-center gap-2 \${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}\`}>
      <span className="font-mono text-xs">Day {dayNumber}:</span>
      <span className="font-medium">{title}</span>
    </div>
  );
}`,
            expectedOutput: 'Component receives typed props and renders dynamic classes'
          },
          pitfall: 'Props are strictly read-only! Never attempt to mutate props directly (`props.title = "new"`). Treat all props as immutable.',
          quickCheck: {
            question: 'What is unidirectional data flow in React?',
            options: [
              'Data flows from child to parent automatically',
              'Data flows top-down from parent components to children via props',
              'Data flows between siblings directly without parent',
              'Data flows from DOM to React'
            ],
            correctIndex: 1,
            explanation: 'Unidirectional data flow means data always passes downwards from parents to children via props.'
          }
        },
        {
          id: 'fs-w2-d9-t4',
          topicNumber: 4,
          title: 'Component Composition & The children Prop',
          explanation: [
            'Instead of building monolithic components with dozens of configuration props, React encourages Component Composition.',
            'The special `children` prop allows components to act as generic container shells (cards, modals, layouts), passing nested JSX inside them.'
          ],
          codeSnippet: {
            id: 'fs-t9-c4',
            title: 'Creating a Reusable Card Container with children',
            description: 'Container component rendering arbitrary nested JSX.',
            language: 'typescript',
            code: `interface SurfaceCardProps {
  title: string;
  children: React.ReactNode;
}

function SurfaceCard({ title, children }: SurfaceCardProps) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
      <header className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      </header>
      <div className="text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}`,
            expectedOutput: 'SurfaceCard renders consistent shell with dynamic child content'
          },
          pitfall: 'Avoid creating giant components with 20 optional boolean props (`hasHeader`, `hasFooter`, `isCard`, `hasBadge`); use composition with children instead.',
          quickCheck: {
            question: 'What TypeScript type is recommended for the children prop in React components?',
            options: ['string', 'number', 'React.ReactNode', 'HTMLElement'],
            correctIndex: 2,
            explanation: 'React.ReactNode accommodates strings, numbers, JSX elements, fragments, arrays, and booleans.'
          }
        },
        {
          id: 'fs-w2-d9-t5',
          topicNumber: 5,
          title: 'Rendering Lists with array.map() and The key Prop',
          explanation: [
            'In React, arrays of items are converted into lists of elements using `items.map(item => <Component key={item.id} />)`.',
            'The `key` prop gives elements a stable identity between renders. It allows React Virtual DOM reconciler to determine which items were added, modified, or removed.'
          ],
          codeSnippet: {
            id: 'fs-t9-c5',
            title: 'Rendering Dynamic Lists with Unique Keys',
            description: 'Mapping items to JSX elements with persistent database IDs.',
            language: 'typescript',
            code: `interface TopicItem {
  id: string;
  title: string;
  duration: number;
}

function TopicList({ topics }: { topics: TopicItem[] }) {
  return (
    <ul className="space-y-2">
      {topics.map((topic) => (
        <li key={topic.id} className="p-3 rounded bg-slate-50 dark:bg-slate-800 flex justify-between">
          <span>{topic.title}</span>
          <span className="text-xs text-slate-400">{topic.duration}m</span>
        </li>
      ))}
    </ul>
  );
}`,
            expectedOutput: 'List of topics rendered with unique keys for efficient diffing'
          },
          pitfall: 'Never use array indices (`key={index}`) as keys when lists can be filtered, reordered, or deleted; it causes state leakage and rendering glitches.',
          quickCheck: {
            question: 'Why should you avoid using array index as the key prop in dynamic lists?',
            options: [
              'React throws a compile error',
              'Reordering or deleting items causes index changes that confuse React reconciliation and break internal component state',
              'Index keys slow down network requests',
              'Tailwind does not support index keys'
            ],
            correctIndex: 1,
            explanation: 'Array indices shift when items are reordered or deleted, causing React to associate state with the wrong DOM nodes.'
          }
        },
        {
          id: 'fs-w2-d9-t6',
          topicNumber: 6,
          title: 'Conditional Rendering Patterns in React',
          explanation: [
            'React supports several patterns for conditional UI: 1) Ternary operator `cond ? <A /> : <B />`, 2) Logical AND `cond && <A />`, 3) Early returns from function components.',
            'Beware of `count && <Component />` when count is `0`, because JavaScript renders `0` directly into the DOM!'
          ],
          codeSnippet: {
            id: 'fs-t9-c6',
            title: 'Safe Conditional Rendering Patterns',
            description: 'Avoiding the zero-render bug with explicit boolean conversion.',
            language: 'typescript',
            code: `function NotificationBadge({ unreadCount }: { unreadCount: number }) {
  // Buggy: unreadCount && <span> will print "0" on screen when unreadCount is 0!
  // Safe: Convert to explicit boolean with > 0 or Boolean()
  return (
    <div className="relative">
      <button>Inbox</button>
      {unreadCount > 0 && (
        <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
}`,
            expectedOutput: 'Badge renders only when unreadCount is strictly greater than 0'
          },
          pitfall: '`0 && <Component />` prints the literal number 0 on your screen. Always use boolean conditions like `items.length > 0 && <List />`.',
          quickCheck: {
            question: 'What does {count && <div>Hello</div>} render if count === 0?',
            options: ['Nothing', '<div>Hello</div>', '0', 'undefined'],
            correctIndex: 2,
            explanation: 'In JavaScript 0 is falsy, so 0 && ... evaluates to 0, which React renders as text "0" in the DOM.'
          }
        },
        {
          id: 'fs-w2-d9-t7',
          topicNumber: 7,
          title: 'Fragments: Grouping Elements Without Extra DOM Nodes',
          explanation: [
            'React components must return a single root element. In the past, developers wrapped everything in empty `<div>` tags, causing "div soup" that broke Flexbox and Grid layouts.',
            'React Fragments (`<React.Fragment>` or concise `<>...</>`) allow grouping a list of children without adding extra nodes to the DOM.'
          ],
          codeSnippet: {
            id: 'fs-t9-c7',
            title: 'Using React Fragments in Table Rows',
            description: 'Returning adjacent table cells without wrapping div.',
            language: 'typescript',
            code: `function TableColumns({ label, value }: { label: string; value: string }) {
  return (
    <>
      <td className="font-semibold p-2">{label}</td>
      <td className="text-slate-600 p-2">{value}</td>
    </>
  );
}`,
            expectedOutput: 'Table cells render directly inside <tr> without illegal <div> wrapper'
          },
          pitfall: 'The shorthand `<>...</>` does not support the `key` attribute. When mapping a list of fragments, use `<React.Fragment key={item.id}>`.',
          quickCheck: {
            question: 'When must you use <React.Fragment> instead of the shorthand <> ?',
            options: [
              'When the fragment needs a key attribute in a mapped loop',
              'When using TypeScript',
              'On mobile devices',
              'Never'
            ],
            correctIndex: 0,
            explanation: 'The shorthand <> syntax cannot receive any attributes. If you need a key prop, use <React.Fragment key={id}>.'
          }
        },
        {
          id: 'fs-w2-d9-t8',
          topicNumber: 8,
          title: 'Pure Components & The StrictMode Double-Render',
          explanation: [
            'React assumes that every component you write is a pure function: given identical inputs (props and state), it should always return identical JSX without mutating external variables.',
            'In development, `<React.StrictMode>` deliberately renders every component twice to help developers detect accidental side effects and impure logic.'
          ],
          codeSnippet: {
            id: 'fs-t9-c8',
            title: 'Pure vs Impure Component Logic',
            description: 'Avoiding mutation of variables outside component scope.',
            language: 'typescript',
            code: `// IMPURE (BUG): Mutates external variable during render!
// let renderCounter = 0;
// function BadComponent() { renderCounter++; return <div>{renderCounter}</div>; }

// PURE: Computes everything locally without touching outside variables
function GoodComponent({ factor }: { factor: number }) {
  const result = factor * 42;
  return <div className="font-mono">Computed: {result}</div>;
}`,
            expectedOutput: 'Deterministic pure rendering without side effects'
          },
          pitfall: 'Do not panic if you see `console.log` firing twice in development; that is React StrictMode verifying your component purity.',
          quickCheck: {
            question: 'Why does React StrictMode render components twice in development mode?',
            options: [
              'It is a bug in React',
              'To proactively detect impure mutations and unsafe side effects in render logic',
              'To increase memory usage',
              'To test mobile responsiveness'
            ],
            correctIndex: 1,
            explanation: 'StrictMode invokes renders and state initializers twice in dev mode to flush out impurity bugs.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Reusable Card Deck with Composition & Badges',
        instructions: [
          'Create a reusable ShellCard component that accepts title, badge, and children.',
          'Render a list of course modules using array.map with stable keys.',
          'Conditionally render an "Active" badge if module is unlocked.'
        ],
        starterCode: `// Write your ShellCard and ModuleList components here`,
        solutionCode: `interface ShellCardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function ShellCard({ title, badge, children }: ShellCardProps) {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        {badge && (
          <span className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-md font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div>{children}</div>
    </article>
  );
}`,
        hints: [
          'Use React.ReactNode for children prop.',
          'Conditionally render badge with {badge && <span>...</span>}.'
        ]
      },
      keyTakeaways: [
        'React UI is a pure function of props and state: UI = f(state).',
        'Component composition with children is far superior to prop explosion.',
        'Always assign persistent unique IDs to keys when rendering mapped arrays.'
      ]
    },
    {
      id: 'fs-w2-d10',
      dayNumber: 10,
      weekNumber: 2,
      title: 'State & Event Handling: useState, Controlled Forms & Immutability',
      subtitle: 'Component state, updater functions, form inputs, and immutable state updates',
      durationMinutes: 55,
      overview:
        'Master interactive state in React: the useState hook, state batching, asynchronous updater functions, controlled vs uncontrolled form inputs, and updating nested objects and arrays immutably.',
      topics: [
        {
          id: 'fs-w2-d10-t1',
          topicNumber: 1,
          title: 'The useState Hook: Component Memory',
          explanation: [
            'Regular local variables disappear and reset every time a component re-renders.',
            'The `useState` hook provides component memory: it retains data between renders and triggers React to re-render the component with the new state when updated.'
          ],
          codeSnippet: {
            id: 'fs-t10-c1',
            title: 'Basic useState Counter Pattern',
            description: 'Declaring state tuple [value, setter] and handling click.',
            language: 'typescript',
            code: `import { useState } from 'react';

function LikeCounter() {
  const [likes, setLikes] = useState<number>(0);

  return (
    <button 
      onClick={() => setLikes(likes + 1)}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
      ❤️ Likes: {likes}
    </button>
  );
}`,
            expectedOutput: 'Interactive button tracking like count across user clicks'
          },
          pitfall: 'Never mutate state directly (`likes = likes + 1` or `user.name = "new"`); React only knows to re-render when you invoke the setter function `setLikes()`.',
          quickCheck: {
            question: 'What does calling a state setter function like setLikes(5) trigger in React?',
            options: [
              'A full browser page reload',
              'A re-render of the component with the updated state value',
              'A database query',
              'Nothing until the user refreshes'
            ],
            correctIndex: 1,
            explanation: 'Calling a state setter updates the component memory and schedules a re-render of the component with the new state.'
          }
        },
        {
          id: 'fs-w2-d10-t2',
          topicNumber: 2,
          title: 'State Batching & Functional Updaters: setVal(prev => prev + 1)',
          explanation: [
            'React batches multiple state updates inside event handlers to prevent wasteful rendering cycles.',
            'Because state updates are batched, reading state immediately after setting it yields the old value. When new state depends on prior state, always pass an updater callback `setVal(prev => prev + 1)`.'
          ],
          codeSnippet: {
            id: 'fs-t10-c2',
            title: 'Functional Updater vs Direct Assignment',
            description: 'Incrementing counter 3 times reliably inside a single event handler.',
            language: 'typescript',
            code: `function TripleIncrementer() {
  const [count, setCount] = useState(0);

  const handleTripleAdd = () => {
    // BUGGY: setCount(count + 1); setCount(count + 1); setCount(count + 1);
    // All 3 read the exact same snapshot of 'count', so total increment is only +1!

    // CORRECT: Functional updaters queue updates sequentially
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Guarantees count increases by +3!
  };

  return <button onClick={handleTripleAdd}>Current Count: {count}</button>;
}`,
            expectedOutput: 'Count accurately increments by 3 on every click'
          },
          pitfall: 'Do not expect state to change synchronously on the line directly below `setCount(5)`. State updates are applied during the subsequent render.',
          quickCheck: {
            question: 'Why should you use setCount(prev => prev + 1) instead of setCount(count + 1) when computing next state from previous state?',
            options: [
              'It makes code run in the background',
              'It guarantees you are operating on the most current queued state value regardless of batching',
              'It prevents dark mode from breaking',
              'It is required by TypeScript'
            ],
            correctIndex: 1,
            explanation: 'Functional updaters receive the guaranteed latest queued state, preventing stale closure snapshot issues.'
          }
        },
        {
          id: 'fs-w2-d10-t3',
          topicNumber: 3,
          title: 'Controlled Form Inputs: Single Source of Truth',
          explanation: [
            'In standard HTML, `<input>` holds its own internal state.',
            'In a Controlled Component, React state is the single source of truth: the input `value` is bound to React state, and its `onChange` event updates that state.',
            'This gives you complete programmatic control over input formatting, validation, and submission.'
          ],
          codeSnippet: {
            id: 'fs-t10-c3',
            title: 'Controlled Text Input with Character Counter',
            description: 'Binding input value to state with real-time character limit.',
            language: 'typescript',
            code: `function UsernameField() {
  const [username, setUsername] = useState('');
  const maxLength = 20;

  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\\s+/g, ''))}
        placeholder="e.g. devon_lane"
        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800"
      />
      <div className="text-xs text-slate-500 text-right">
        {username.length} / {maxLength} chars
      </div>
    </div>
  );
}`,
            expectedOutput: 'Controlled input sanitizing whitespace and enforcing single source of truth'
          },
          pitfall: 'Passing `undefined` as the initial `value` causes React warning: "component changed from uncontrolled to controlled". Always initialize string state with `""`.',
          quickCheck: {
            question: 'What defines a Controlled Component in React?',
            options: [
              'A component with no CSS',
              'An input element whose value is driven by React state and updated via onChange',
              'An input managed by jQuery',
              'A password field'
            ],
            correctIndex: 1,
            explanation: 'In a controlled component, form element data is handled by a React component state via value and onChange.'
          }
        },
        {
          id: 'fs-w2-d10-t4',
          topicNumber: 4,
          title: 'Immutable Object State Updates with Spread Operator',
          explanation: [
            'When state is an object, mutating a property (`user.name = "new"`) will not trigger a re-render because the object reference address is unchanged.',
            'Always produce a new object reference using the spread operator (`...`): `setUser(prev => ({ ...prev, name: "new" }))`.'
          ],
          codeSnippet: {
            id: 'fs-t10-c4',
            title: 'Updating Object State Immutably',
            description: 'Safely copying existing properties while updating target fields.',
            language: 'typescript',
            code: `interface StudentState {
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    emailNotifications: boolean;
  };
}

function SettingsToggle() {
  const [student, setStudent] = useState<StudentState>({
    name: 'Sarah',
    preferences: { theme: 'light', emailNotifications: true }
  });

  const toggleTheme = () => {
    // Nested immutable update
    setStudent(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light'
      }
    }));
  };

  return <button onClick={toggleTheme}>Theme: {student.preferences.theme}</button>;
}`,
            expectedOutput: 'Theme toggles cleanly without mutating original object in memory'
          },
          pitfall: 'Shallow spread `{ ...prev }` does not clone nested objects. Nested objects like `preferences` must also be spread explicitly.',
          quickCheck: {
            question: 'Why does user.role = "admin" fail to trigger a React component re-render?',
            options: [
              'role is a reserved keyword',
              'React uses Object.is() shallow comparison; because the object memory reference did not change, React assumes nothing was updated',
              'React only supports numbers',
              'It throws a syntax error'
            ],
            correctIndex: 1,
            explanation: 'React compares state by reference. Mutating properties of the same object reference causes React to bail out of rendering.'
          }
        },
        {
          id: 'fs-w2-d10-t5',
          topicNumber: 5,
          title: 'Immutable Array Operations: Adding, Removing & Updating Items',
          explanation: [
            'Avoid mutating array methods (`push`, `pop`, `splice`, `reverse`).',
            'To Add: `[...prev, newItem]`.',
            'To Remove: `prev.filter(item => item.id !== targetId)`.',
            'To Update: `prev.map(item => item.id === targetId ? { ...item, ...updates } : item)`.'
          ],
          codeSnippet: {
            id: 'fs-t10-c5',
            title: 'The Big 3 Immutable Array Operations',
            description: 'Adding, removing, and updating array state without mutation.',
            language: 'typescript',
            code: `interface Task { id: number; title: string; done: boolean; }

// 1. ADD: append to end immutably
const addTask = (prev: Task[], title: string): Task[] => [
  ...prev,
  { id: Date.now(), title, done: false }
];

// 2. REMOVE: filter out target id
const removeTask = (prev: Task[], id: number): Task[] =>
  prev.filter(t => t.id !== id);

// 3. UPDATE: toggle done property via map
const toggleTask = (prev: Task[], id: number): Task[] =>
  prev.map(t => t.id === id ? { ...t, done: !t.done } : t);`,
            expectedOutput: 'Pure array transformations returning fresh references'
          },
          pitfall: 'Calling `tasks.push(newTask)` mutates the existing state array in place and prevents React from detecting changes.',
          quickCheck: {
            question: 'Which method should you use to immutably remove an item from a state array by ID?',
            options: ['array.splice()', 'array.filter()', 'delete array[0]', 'array.pop()'],
            correctIndex: 1,
            explanation: 'filter() returns a brand new array containing only elements that pass the test, keeping operations pure and immutable.'
          }
        },
        {
          id: 'fs-w2-d10-t6',
          topicNumber: 6,
          title: 'Multi-Field Form Management with a Single State Object',
          explanation: [
            'Creating individual `useState` hooks for a form with 10 fields produces messy boilerplate.',
            'Manage complex forms using a single state object with a dynamic change handler leveraging `[e.target.name]: e.target.value`.'
          ],
          codeSnippet: {
            id: 'fs-t10-c6',
            title: 'Unified Multi-Field Form Handler',
            description: 'Handling multiple input fields with one clean generic handler.',
            language: 'typescript',
            code: `function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'frontend'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4">
      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="fullstack">Full Stack</option>
      </select>
    </form>
  );
}`,
            expectedOutput: 'Single dynamic handler updates corresponding property key dynamically'
          },
          pitfall: 'Ensure each `<input>` has a `name` attribute that strictly matches the key in your state object.',
          quickCheck: {
            question: 'What JavaScript feature enables [e.target.name]: e.target.value dynamic object key assignment?',
            options: ['Computed Property Names', 'Destructuring', 'Hoisting', 'Promises'],
            correctIndex: 0,
            explanation: 'ES6 Computed Property Names [expression] allow object keys to be evaluated dynamically at runtime.'
          }
        },
        {
          id: 'fs-w2-d10-t7',
          topicNumber: 7,
          title: 'Derived State vs Redundant State',
          explanation: [
            'Do NOT put data into state if it can be computed from existing props or state during render.',
            'Storing redundant state (`fullName` when you already have `firstName` and `lastName`) introduces state de-synchronization bugs. Compute derived values inline.'
          ],
          codeSnippet: {
            id: 'fs-t10-c7',
            title: 'Derived State Calculation',
            description: 'Computing active count directly during render without extra state.',
            language: 'typescript',
            code: `interface Item { id: string; completed: boolean; price: number; }

function CartSummary({ items }: { items: Item[] }) {
  // REDUNDANT (BAD): const [total, setTotal] = useState(0); useEffect(...)
  
  // DERIVED (EXCELLENT): Compute directly during render!
  const completedCount = items.filter(i => i.completed).length;
  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div>
      <p>Completed: {completedCount} / {items.length}</p>
      <p>Total: \${totalPrice.toFixed(2)}</p>
    </div>
  );
}`,
            expectedOutput: 'Fast derived calculation always in perfect synchronization with items prop'
          },
          pitfall: 'Do not create a `useEffect` just to update state when another state changes; calculate it inline as derived state.',
          quickCheck: {
            question: 'If you have items array in state, should you create a separate itemsCount state?',
            options: [
              'Yes, always',
              'No, calculate items.length directly during render as derived state to avoid sync bugs',
              'Only if items has more than 100 elements',
              'Yes, with useEffect'
            ],
            correctIndex: 1,
            explanation: 'items.length is derived state; storing it separately risks the count falling out of sync with the actual array.'
          }
        },
        {
          id: 'fs-w2-d10-t8',
          topicNumber: 8,
          title: 'Lifting State Up: Sharing State Between Siblings',
          explanation: [
            'When two sibling components need access to the same state or need to interact with each other, move the state up to their closest common parent.',
            'The parent holds the state and passes the value down to one child and the update callback down to the other.'
          ],
          codeSnippet: {
            id: 'fs-t10-c8',
            title: 'Lifting State to Common Parent',
            description: 'Theme toggle button in Navbar controls preview background in Viewer.',
            language: 'typescript',
            code: `function DashboardParent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div>
      {/* Sibling 1 receives callback to modify state */}
      <HeaderNav currentTheme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
      {/* Sibling 2 receives state value */}
      <WorkspaceViewer theme={theme} />
    </div>
  );
}

function HeaderNav({ currentTheme, onToggleTheme }: { currentTheme: string; onToggleTheme: () => void }) {
  return <button onClick={onToggleTheme}>Toggle ({currentTheme})</button>;
}

function WorkspaceViewer({ theme }: { theme: string }) {
  return <div className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-black'}>Workspace</div>;
}`,
            expectedOutput: 'Common parent synchronizes state cleanly across sibling components'
          },
          pitfall: 'Do not attempt to pass state sideways between siblings using DOM events or global variables; always lift state up to their shared ancestor.',
          quickCheck: {
            question: 'What is the standard React solution when two sibling components need to share the same state?',
            options: [
              'Use window.alert()',
              'Lift the state up to their nearest common parent component',
              'Store the data in the browser URL hash',
              'Duplicate the state in both siblings'
            ],
            correctIndex: 1,
            explanation: 'Lifting state up to the closest common ancestor allows both siblings to receive the shared state via props.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Fully Controlled Todo List with Immutable Operations',
        instructions: [
          'Create a todo list component with state array of todos { id, text, completed }.',
          'Provide a controlled input and button to add new todos.',
          'Implement toggle completed function using immutable array.map.',
          'Implement delete function using array.filter.'
        ],
        starterCode: `function TodoApp() {
  // Define todos and input text state
}`,
        solutionCode: `import { useState } from 'react';

interface Todo { id: number; text: string; completed: boolean; }

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="New task..." className="border p-2 rounded flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded">
            <span onClick={() => toggleTodo(t.id)} className={\`cursor-pointer \${t.completed ? 'line-through text-slate-400' : ''}\`}>{t.text}</span>
            <button onClick={() => deleteTodo(t.id)} className="text-red-500 text-xs">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        hints: [
          'Use prev => [...prev, newTodo] to append.',
          'Use prev => prev.filter(t => t.id !== id) to delete.'
        ]
      },
      keyTakeaways: [
        'Component state preserves data between renders and triggers automatic UI updates.',
        'Always update objects and arrays immutably with spread, map, and filter.',
        'Calculate derived state directly during render rather than creating redundant state variables.'
      ]
    },
    {
      id: 'fs-w2-d11',
      dayNumber: 11,
      weekNumber: 2,
      title: 'Side Effects & Lifecycle: useEffect, Data Fetching & Cleanups',
      subtitle: 'Side effect synchronization, dependency arrays, cleanup functions, and AbortController',
      durationMinutes: 50,
      overview:
        'Master the useEffect hook: how React synchronizes components with external systems (APIs, timers, event listeners, localStorage), the rules of dependency arrays, and preventing memory leaks with cleanup functions and AbortController.',
      topics: [
        {
          id: 'fs-w2-d11-t1',
          topicNumber: 1,
          title: 'What is a Side Effect & The Role of useEffect',
          explanation: [
            'A pure render calculates JSX from props and state. A "side effect" is anything that reaches outside the React rendering process: making HTTP requests, setting timers, manipulating browser localStorage, or listening to window resize events.',
            '`useEffect` runs after the component renders, synchronizing the component with external systems.'
          ],
          codeSnippet: {
            id: 'fs-t11-c1',
            title: 'Synchronizing Document Title with useEffect',
            description: 'Updating window.document title on state change.',
            language: 'typescript',
            code: `import { useState, useEffect } from 'react';

function PageTitleSync({ activeLessonTitle }: { activeLessonTitle: string }) {
  useEffect(() => {
    // Reaches outside to browser DOM API
    document.title = \`\${activeLessonTitle} | Full Stack Academy\`;
  }, [activeLessonTitle]); // Only re-runs when activeLessonTitle changes

  return <h1 className="text-xl font-bold">{activeLessonTitle}</h1>;
}`,
            expectedOutput: 'Browser tab title automatically updates as user switches lessons'
          },
          pitfall: 'Never perform side effects directly inside the component body during render (e.g. initiating a `fetch()` call directly in render logic will trigger infinite re-render loops).',
          quickCheck: {
            question: 'When does the effect callback function inside useEffect execute by default?',
            options: [
              'Before the component renders',
              'After the component renders and the DOM has been painted to the screen',
              'Only when the computer restarts',
              'Synchronously during JSX evaluation'
            ],
            correctIndex: 1,
            explanation: 'Effects run asynchronously after the render cycle completes and DOM updates are committed.'
          }
        },
        {
          id: 'fs-w2-d11-t2',
          topicNumber: 2,
          title: 'The Dependency Array: [], [prop], and No Array',
          explanation: [
            'The second argument to `useEffect` is the dependency array.',
            'No array: runs after EVERY single render (rarely desired).',
            'Empty array `[]`: runs ONCE after the initial mount (ideal for initial setup).',
            'Populated array `[userId, filter]`: runs only when one of those dependencies changes between renders.'
          ],
          codeSnippet: {
            id: 'fs-t11-c2',
            title: 'Comparing Dependency Behaviors',
            description: 'Mount-only vs reactive dependency tracking.',
            language: 'typescript',
            code: `// 1. Mount only: executes once when component is first mounted
useEffect(() => {
  console.log('Component mounted in DOM');
}, []);

// 2. Reactive: executes when query changes
const [query, setQuery] = useState('');
useEffect(() => {
  console.log('Search query changed to:', query);
}, [query]);`,
            expectedOutput: 'Deterministic execution tied strictly to specified dependencies'
          },
          pitfall: 'Lying to the dependency array (using a variable inside the effect but omitting it from the dependency array) causes stale closure bugs.',
          quickCheck: {
            question: 'What happens if you omit the dependency array entirely from useEffect(fn)?',
            options: [
              'The effect runs only once',
              'The effect never runs',
              'The effect runs after every single render of the component',
              'TypeScript throws a compiler error'
            ],
            correctIndex: 2,
            explanation: 'Without a dependency array, useEffect executes after every render cycle.'
          }
        },
        {
          id: 'fs-w2-d11-t3',
          topicNumber: 3,
          title: 'Cleanup Functions: Preventing Memory Leaks',
          explanation: [
            'If an effect sets up a subscription, interval timer, WebSocket connection, or event listener, it must clean it up when the component unmounts or before the effect re-runs.',
            'Return a cleanup function from your effect: `return () => { clearInterval(timer); }`.'
          ],
          codeSnippet: {
            id: 'fs-t11-c3',
            title: 'Window Resize Listener with Cleanup',
            description: 'Adding and tearing down event listeners cleanly.',
            language: 'typescript',
            code: `function WindowWidthIndicator() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // CLEANUP FUNCTION: Runs before effect re-runs and on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('Cleaned up window resize listener');
    };
  }, []);

  return <div>Window width: {width}px</div>;
}`,
            expectedOutput: 'Accurately tracks window width and prevents memory leaks upon unmount'
          },
          pitfall: 'Failing to clean up timers or listeners creates invisible zombie memory leaks that consume RAM and trigger state updates on unmounted components.',
          quickCheck: {
            question: 'When is the cleanup function returned by useEffect invoked by React?',
            options: [
              'Only when the browser window closes',
              'Before the effect executes again with new dependencies, and when the component unmounts',
              'During the render phase',
              'Never'
            ],
            correctIndex: 1,
            explanation: 'React invokes cleanup functions to tear down previous work before re-running the effect, and when unmounting.'
          }
        },
        {
          id: 'fs-w2-d11-t4',
          topicNumber: 4,
          title: 'Fetching Data with useEffect & Handling Race Conditions',
          explanation: [
            'When fetching data in response to user inputs (e.g. typing an ID), fast network responses might return out of order, overwriting newer data with stale data (a Race Condition).',
            'Use an `ignore` boolean flag or `AbortController` in the cleanup function to discard responses from obsolete requests.'
          ],
          codeSnippet: {
            id: 'fs-t11-c4',
            title: 'Race-Condition-Proof Data Fetching Pattern',
            description: 'Using an ignore flag to discard stale network responses.',
            language: 'typescript',
            code: `function StudentProfile({ studentId }: { studentId: number }) {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(\`/api/students/\${studentId}\`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) {
          setStudent(data);
          setLoading(false);
        }
      });

    // Cleanup sets ignore to true if studentId changes before fetch settles
    return () => { ignore = true; };
  }, [studentId]);

  if (loading) return <div>Loading profile...</div>;
  return <div>Student: {student?.name}</div>;
}`,
            expectedOutput: 'Eliminates race conditions when quickly switching between IDs'
          },
          pitfall: 'Do not mark the effect callback itself `async` (`useEffect(async () => ...)`); effect callbacks must return either nothing or a cleanup function, NOT a Promise.',
          quickCheck: {
            question: 'Why can you NOT pass an async function directly to useEffect(async () => {})?',
            options: [
              'React does not support async/await',
              'An async function returns a Promise, but React requires the effect to return either nothing or a cleanup function',
              'It causes a CORS error',
              'It is slower'
            ],
            correctIndex: 1,
            explanation: 'Async functions always return Promises, which conflicts with React expectation that an effect returns a cleanup function.'
          }
        },
        {
          id: 'fs-w2-d11-t5',
          topicNumber: 5,
          title: 'AbortController: Canceling In-Flight Network Requests',
          explanation: [
            'The native browser `AbortController` API allows actively canceling pending fetch requests across the network.',
            'Pass `controller.signal` to `fetch(url, { signal })`, and call `controller.abort()` inside your effect cleanup.'
          ],
          codeSnippet: {
            id: 'fs-t11-c5',
            title: 'Canceling Network Requests with AbortController',
            description: 'Active cancellation of pending network calls upon component unmount.',
            language: 'typescript',
            code: `useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      const res = await fetch('/api/stats', { signal: controller.signal });
      const data = await res.json();
      console.log('Stats loaded:', data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Request was successfully canceled');
      } else {
        console.error('Fetch error:', err);
      }
    }
  }

  loadData();

  return () => {
    controller.abort(); // Cancel pending network request!
  };
}, []);`,
            expectedOutput: 'Request aborts immediately if component unmounts while request is in flight'
          },
          pitfall: 'An aborted fetch throws an `AbortError`. Make sure to catch it and ignore it rather than displaying it to the user as a real network failure.',
          quickCheck: {
            question: 'What error does fetch throw when canceled via controller.abort()?',
            options: ['TypeError', 'AbortError', 'NetworkError', '404 Error'],
            correctIndex: 1,
            explanation: 'The fetch promise rejects with a DOMException named AbortError when aborted.'
          }
        },
        {
          id: 'fs-w2-d11-t6',
          topicNumber: 6,
          title: 'Syncing State with localStorage',
          explanation: [
            'Persisting client preferences (such as light/dark mode or student progress) is accomplished by reading `localStorage` during initial state setup and writing in `useEffect`.',
            'Pass a lazy initializer function `useState(() => readStorage())` to prevent reading from localStorage on every render.'
          ],
          codeSnippet: {
            id: 'fs-t11-c6',
            title: 'Lazy LocalStorage Initialization & Sync',
            description: 'Reading disk once on mount and syncing state changes.',
            language: 'typescript',
            code: `function usePersistedState<T>(key: string, defaultValue: T) {
  // Lazy initialization function: executes strictly ONCE on mount
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Sync to disk whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [key, state]);

  return [state, setState] as const;
}`,
            expectedOutput: 'Smooth persistent state surviving page refreshes'
          },
          pitfall: '`localStorage.getItem()` is synchronous disk I/O. Calling it directly in the component body without lazy `useState(() => ...)` slows down every render.',
          quickCheck: {
            question: 'Why should localStorage.getItem() be wrapped in a lazy useState(() => ...) initializer function?',
            options: [
              'It is required by Tailwind',
              'Lazy initialization runs strictly once during mount, preventing expensive disk I/O on subsequent renders',
              'It encrypts the data',
              'It disables cookies'
            ],
            correctIndex: 1,
            explanation: 'Passing a function to useState executes it only during initial component mounting, avoiding synchronous disk reads on every render.'
          }
        },
        {
          id: 'fs-w2-d11-t7',
          topicNumber: 7,
          title: 'When NOT to Use useEffect',
          explanation: [
            'Overusing `useEffect` is one of the most common signs of junior React code.',
            '1) Do NOT use useEffect to transform data for rendering (calculate it inline as derived state).',
            '2) Do NOT use useEffect to handle user events (handle it directly in the button `onClick` handler).',
            '3) Do NOT use useEffect to reset state when a prop changes (use a React `key` to reset component state).'
          ],
          codeSnippet: {
            id: 'fs-t11-c7',
            title: 'Refactoring Unnecessary useEffects',
            description: 'Replacing redundant effects with direct derived calculations.',
            language: 'typescript',
            code: `// BAD: Unnecessary state + useEffect causing 2 full render cycles
// const [filtered, setFiltered] = useState([]);
// useEffect(() => { setFiltered(items.filter(i => i.active)); }, [items]);

// GOOD: Derived calculation executed directly during render (1 render cycle!)
function ActiveList({ items }: { items: { id: string; active: boolean }[] }) {
  const filteredItems = items.filter(i => i.active);
  return <div>Active items: {filteredItems.length}</div>;
}`,
            expectedOutput: 'Faster execution with half the render cycles and zero effect synchronization bugs'
          },
          pitfall: 'Chaining multiple `useEffect` calls where Effect A sets State A, triggering Effect B which sets State B, causes cascading render cascades that devastate performance.',
          quickCheck: {
            question: 'What is the best way to filter an array of products based on a search term?',
            options: [
              'In an interval timer',
              'Compute the filtered array directly in the render body as derived state',
              'With a useEffect that updates a separate filteredProducts state',
              'Using a global variable'
            ],
            correctIndex: 1,
            explanation: 'Calculating derived data directly during render eliminates redundant state and an extra render cycle.'
          }
        },
        {
          id: 'fs-w2-d11-t8',
          topicNumber: 8,
          title: 'Custom Hooks: Extracting Reusable State Logic',
          explanation: [
            'Custom hooks are JavaScript functions prefixed with `use` (e.g. `useFetch`, `useWindowSize`, `useTheme`) that can call other React hooks.',
            'They let you extract complex stateful logic out of UI components and share it across dozens of screens without repeating code.'
          ],
          codeSnippet: {
            id: 'fs-t11-c8',
            title: 'Building a Reusable useFetch Custom Hook',
            description: 'Encapsulating loading, error, and data fetching states.',
            language: 'typescript',
            code: `function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(url)
      .then(res => res.json())
      .then(json => { if (!ignore) { setData(json); setLoading(false); } })
      .catch(err => { if (!ignore) { setError(err.message); setLoading(false); } });

    return () => { ignore = true; };
  }, [url]);

  return { data, loading, error };
}`,
            expectedOutput: 'Clean reusable custom hook handling full async lifecycle'
          },
          pitfall: 'Custom hooks share stateful LOGIC, not state itself. Each time a component calls `useFetch()`, it gets its own completely isolated state.',
          quickCheck: {
            question: 'Do two components calling the same custom hook share the exact same state instance?',
            options: [
              'Yes, always',
              'No, custom hooks reuse stateful logic, but each component invocation creates its own independent state',
              'Only in production',
              'Only if using Redux'
            ],
            correctIndex: 1,
            explanation: 'Each call to a custom hook generates a distinct, isolated instance of state for that specific component.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Live Debounced Search Input with AbortController',
        instructions: [
          'Create a component that listens for query input changes.',
          'Use useEffect with a 300ms setTimeout to debounce the search query.',
          'Clean up the timer in the effect cleanup to avoid unnecessary fetches.',
          'Display loading and results.'
        ],
        starterCode: `function DebouncedSearch() {
  const [query, setQuery] = useState('');
  // Build debounced effect here
}`,
        solutionCode: `import { useState, useEffect } from 'react';

function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handler = setTimeout(() => {
      // Simulating search query result
      setResults([\`Result for "\${query}" 1\`, \`Result for "\${query}" 2\`]);
      setLoading(false);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="p-4 max-w-sm mx-auto">
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        placeholder="Search documentation..."
        className="w-full border p-2 rounded" 
      />
      {loading && <p className="text-xs text-slate-400 mt-2">Searching...</p>}
      <ul className="mt-2 space-y-1">
        {results.map((r, i) => <li key={i} className="text-sm p-1 bg-slate-50 dark:bg-slate-800 rounded">{r}</li>)}
      </ul>
    </div>
  );
}`,
        hints: [
          'Use setTimeout(() => ..., 300) to delay search.',
          'Return () => clearTimeout(handler) in the effect cleanup.'
        ]
      },
      keyTakeaways: [
        'useEffect synchronizes your React components with external systems.',
        'Always clean up subscriptions, timers, and abortable network requests in the effect cleanup.',
        'Extract reusable state logic into custom hooks prefixed with "use".'
      ]
    },
    {
      id: 'fs-w2-d12',
      dayNumber: 12,
      weekNumber: 2,
      title: 'Advanced React Hooks: useRef, useMemo, useCallback & Performance',
      subtitle: 'DOM references, mutable persistent refs, memoization, and React re-render optimization',
      durationMinutes: 50,
      overview:
        'Master advanced React hooks: useRef for DOM nodes and mutable instance variables that do not trigger re-renders, useMemo for caching expensive calculations, and useCallback for stabilizing function references.',
      topics: [
        {
          id: 'fs-w2-d12-t1',
          topicNumber: 1,
          title: 'The useRef Hook: Referencing DOM Elements',
          explanation: [
            'While React is declarative, you sometimes need imperative access to raw DOM elements (e.g. focusing an input, scrolling to an element, measuring dimensions, or playing audio/video).',
            '`useRef<HTMLInputElement>(null)` creates a ref object whose `.current` property holds the underlying browser DOM node once mounted.'
          ],
          codeSnippet: {
            id: 'fs-t12-c1',
            title: 'Auto-Focusing an Input on Button Click',
            description: 'Using ref.current.focus() to control element focus.',
            language: 'typescript',
            code: `import { useRef } from 'react';

function SearchModal() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenSearch = () => {
    // Imperatively focus the input DOM node
    inputRef.current?.focus();
  };

  return (
    <div>
      <button onClick={handleOpenSearch} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded">
        Press Search (Cmd+K)
      </button>
      <input ref={inputRef} placeholder="Type query..." className="mt-2 p-2 border rounded" />
    </div>
  );
}`,
            expectedOutput: 'Input element immediately receives keyboard focus upon button click'
          },
          pitfall: 'Do not access `inputRef.current` during the render phase! DOM nodes are only attached to refs after React commits the render to the screen.',
          quickCheck: {
            question: 'When is a ref attached to its corresponding DOM element in React?',
            options: [
              'Before the component function runs',
              'After React renders and commits the DOM elements to the screen',
              'Only in production builds',
              'Never'
            ],
            correctIndex: 1,
            explanation: 'React attaches DOM nodes to ref.current after committing the render tree to the browser DOM.'
          }
        },
        {
          id: 'fs-w2-d12-t2',
          topicNumber: 2,
          title: 'useRef as Mutable Memory That Does Not Trigger Re-Renders',
          explanation: [
            'Unlike `useState`, mutating `ref.current = newValue` does NOT trigger a component re-render.',
            'This makes `useRef` ideal for storing timer IDs, previous prop values, interval references, or tracking whether a component has mounted.'
          ],
          codeSnippet: {
            id: 'fs-t12-c2',
            title: 'Storing Interval Timer ID with useRef',
            description: 'Persisting mutable timer reference without causing re-renders.',
            language: 'typescript',
            code: `function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerIdRef = useRef<number | null>(null);

  const start = () => {
    if (timerIdRef.current !== null) return;
    timerIdRef.current = window.setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
            expectedOutput: 'Stopwatch controls interval cleanly using mutable ref storage'
          },
          pitfall: 'Do not write or read `ref.current` during rendering calculations, as React assumes pure render outputs. Read/write refs only in event handlers or useEffect.',
          quickCheck: {
            question: 'What is the primary difference between mutating state vs mutating a ref?',
            options: [
              'Mutating state schedules a component re-render; mutating ref.current does not trigger a re-render',
              'Refs can only hold strings',
              'State is mutable, refs are immutable',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'Setting state triggers a re-render; mutating ref.current silently updates the value without causing a re-render.'
          }
        },
        {
          id: 'fs-w2-d12-t3',
          topicNumber: 3,
          title: 'useMemo: Caching Expensive Calculations',
          explanation: [
            '`useMemo(() => computeExpensiveValue(a, b), [a, b])` caches the result of a CPU-intensive calculation between renders.',
            'React only re-runs the computation if one of the dependencies in `[a, b]` has changed.'
          ],
          codeSnippet: {
            id: 'fs-t12-c3',
            title: 'Memoizing an Expensive Data Transformation',
            description: 'Caching filtered and sorted dataset calculation.',
            language: 'typescript',
            code: `import { useMemo } from 'react';

function AnalyticsReport({ logs, filterTerm }: { logs: string[]; filterTerm: string }) {
  // Only re-runs when logs array or filterTerm string changes
  const filteredLogs = useMemo(() => {
    console.log('Computing expensive log filter...');
    return logs.filter(log => log.includes(filterTerm));
  }, [logs, filterTerm]);

  return <div>Matching logs: {filteredLogs.length}</div>;
}`,
            expectedOutput: 'Filters 10,000 logs once and skips re-computation during unrelated re-renders'
          },
          pitfall: 'Do not wrap simple additions or 5-item array maps in `useMemo`; the memory overhead of memoization is often greater than the cost of simple arithmetic.',
          quickCheck: {
            question: 'When should you consider wrapping a calculation in useMemo?',
            options: [
              'On every single variable in your code',
              'When the calculation is noticeably slow (filtering large lists) or when stabilizing an object reference passed to a memoized child',
              'Only when using Redux',
              'Never'
            ],
            correctIndex: 1,
            explanation: 'useMemo is designed for expensive operations or reference stabilization, not for trivial calculations.'
          }
        },
        {
          id: 'fs-w2-d12-t4',
          topicNumber: 4,
          title: 'useCallback: Stabilizing Function References',
          explanation: [
            'In JavaScript, functions are objects: `() => {} !== () => {}`. Every time a component re-renders, all inline functions are recreated with new memory references.',
            '`useCallback(fn, deps)` caches the function instance itself between renders, preventing memoized child components (`React.memo`) from re-rendering unnecessarily.'
          ],
          codeSnippet: {
            id: 'fs-t12-c4',
            title: 'Preventing Child Re-Renders with useCallback',
            description: 'Preserving stable function reference across parent re-renders.',
            language: 'typescript',
            code: `import { useCallback } from 'react';

function ParentComponent({ studentId }: { studentId: string }) {
  const [theme, setTheme] = useState('dark');

  // Stable callback: reference only changes if studentId changes
  const handleSaveProgress = useCallback(() => {
    console.log('Saving progress for student:', studentId);
  }, [studentId]);

  return (
    <div>
      <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
      {/* MemoizedChild will NOT re-render when theme toggles! */}
      <MemoizedSaveButton onSave={handleSaveProgress} />
    </div>
  );
}`,
            expectedOutput: 'Function reference remains identical across theme renders'
          },
          pitfall: '`useCallback` does NOT prevent the parent component from re-rendering; it only provides a stable function reference to pass to children.',
          quickCheck: {
            question: 'What is the primary difference between useMemo and useCallback?',
            options: [
              'useMemo caches the returned value of a function; useCallback caches the function instance itself',
              'useCallback is only for CSS',
              'useMemo only works on strings',
              'They are completely identical'
            ],
            correctIndex: 0,
            explanation: 'useMemo returns a memoized value; useCallback returns a memoized callback function.'
          }
        },
        {
          id: 'fs-w2-d12-t5',
          topicNumber: 5,
          title: 'React.memo: Skipping Child Re-Renders',
          explanation: [
            'By default, when a parent component re-renders, all of its children re-render recursively.',
            '`React.memo(Component)` wraps a component so that React skips rendering it if its incoming props are shallowly equal to its previous props.'
          ],
          codeSnippet: {
            id: 'fs-t12-c5',
            title: 'Wrapping Component with React.memo',
            description: 'Shallow props comparison skipping wasteful renders.',
            language: 'typescript',
            code: `import React from 'react';

interface RowProps {
  id: string;
  label: string;
  onSelect: (id: string) => void;
}

// React.memo checks if props changed using shallow equality
export const HeavyTableRow = React.memo(function HeavyTableRow({ id, label, onSelect }: RowProps) {
  console.log('Rendered row:', id);
  return (
    <div onClick={() => onSelect(id)} className="p-3 border-b flex justify-between">
      <span>{label}</span>
    </div>
  );
});`,
            expectedOutput: 'Row only re-renders when its specific label or onSelect reference changes'
          },
          pitfall: 'If you pass an inline arrow function `<HeavyTableRow onSelect={() => ...} />`, `React.memo` will fail to skip re-renders because `() => ...` is a new reference every time. Pair with `useCallback`.',
          quickCheck: {
            question: 'How does React.memo determine if a component needs to re-render?',
            options: [
              'Deep recursive object comparison of all properties',
              'Shallow equality check (Object.is) of previous props vs next props',
              'By checking the git commit hash',
              'By timestamp'
            ],
            correctIndex: 1,
            explanation: 'React.memo performs a shallow equality check on props by default.'
          }
        },
        {
          id: 'fs-w2-d12-t6',
          topicNumber: 6,
          title: 'How React Re-Renders Actually Work (Reconciliation)',
          explanation: [
            'React re-render cycle has two phases: 1) Render Phase (calls component functions, generates Virtual DOM, diffs against previous Virtual DOM), 2) Commit Phase (applies only the detected differences to real browser DOM).',
            'Component re-rendering in JavaScript is fast; real browser DOM repainting is what slows down applications.'
          ],
          codeSnippet: {
            id: 'fs-t12-c6',
            title: 'Virtual DOM Diffing Mental Model',
            description: 'React calculates minimal patch for browser DOM.',
            language: 'javascript',
            code: `// Render 1: Virtual DOM representation
// { type: 'button', props: { className: 'bg-blue', children: 'Click me' } }

// User clicks button -> Render 2:
// { type: 'button', props: { className: 'bg-emerald', children: 'Click me' } }

// Diff: Only className changed!
// Commit: browserButton.className = 'bg-emerald'; (Text content is NOT re-painted!)`,
            expectedOutput: 'Minimal DOM patch executed targeting only changed attribute'
          },
          pitfall: 'Do not optimize prematurely. Most components re-render in fractions of a millisecond; only reach for memoization when you observe noticeable frame drops in the profiler.',
          quickCheck: {
            question: 'What are the two core phases of React rendering process?',
            options: [
              'Compilation and Execution',
              'Render Phase (V-DOM diffing) and Commit Phase (applying DOM patches)',
              'HTML parsing and CSS styling',
              'Upload and Download'
            ],
            correctIndex: 1,
            explanation: 'The Render phase executes components and diffs the Virtual DOM; the Commit phase applies minimal patches to the real DOM.'
          }
        },
        {
          id: 'fs-w2-d12-t7',
          topicNumber: 7,
          title: 'React DevTools Profiler: Pinpointing Render Bottlenecks',
          explanation: [
            'The React DevTools browser extension includes a Profiler tab that records flame charts of your component tree during user interactions.',
            'It highlights which components rendered, how long each render took in milliseconds, and the exact reason why each component rendered ("Props changed: onSelect").'
          ],
          codeSnippet: {
            id: 'fs-t12-c7',
            title: 'Inspecting Component Render Reasons',
            description: 'Reading React Profiler flame graph metrics.',
            language: 'bash',
            code: `# Open Chrome DevTools -> Profiler tab
# 1. Click Record button
# 2. Interact with UI (e.g. type in search, toggle tab)
# 3. Stop recording -> Inspect flame graph
# Identifies components with render times > 16ms (dropping 60fps frame rate)`,
            expectedOutput: 'Visual flame chart highlighting slow component subtrees'
          },
          pitfall: 'Always profile in production mode or production preview (`npm run build && npm run preview`); development builds include extra debug checks that skew timing results.',
          quickCheck: {
            question: 'What tool should you use to measure which React components are causing slow render cycles?',
            options: ['React DevTools Profiler', 'Photoshop', 'Postman', 'Vim'],
            correctIndex: 0,
            explanation: 'The React DevTools Profiler measures component render durations and identifies the specific props or hooks that caused them.'
          }
        },
        {
          id: 'fs-w2-d12-t8',
          topicNumber: 8,
          title: 'Forwarding Refs with React 19 / forwardRef',
          explanation: [
            'By default, passing `ref={myRef}` to a custom component (`<MyButton ref={myRef} />`) fails because components do not expose raw DOM nodes.',
            'In React 19, `ref` can be received directly as a prop! (In older React, you wrap with `forwardRef`). This lets parent components control focus or measure child DOM nodes.'
          ],
          codeSnippet: {
            id: 'fs-t12-c8',
            title: 'Exposing DOM Nodes with Ref Forwarding',
            description: 'Passing ref down through a custom UI component.',
            language: 'typescript',
            code: `interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

// React 19 ref as a standard prop
export function CustomInput({ label, ref, ...rest }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input ref={ref} {...rest} className="w-full p-2 border rounded-lg dark:bg-slate-800" />
    </div>
  );
}`,
            expectedOutput: 'Custom component forwards ref directly to underlying HTML input'
          },
          pitfall: 'Do not expose internal implementation details unless necessary; keep component interfaces clean and declarative.',
          quickCheck: {
            question: 'What does ref forwarding enable in React components?',
            options: [
              'Allows a parent component to obtain a direct reference to a child native DOM node',
              'Allows components to bypass state',
              'Enables automatic CSS compilation',
              'Shares cookies between tabs'
            ],
            correctIndex: 0,
            explanation: 'Ref forwarding allows a parent component to pass a ref through a child component to an underlying DOM element.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Optimize an Interactive Filtered List with useMemo and useCallback',
        instructions: [
          'Create a component that renders 1,000 mock items.',
          'Use useMemo to filter items based on search term.',
          'Use useCallback to stabilize the onItemSelect callback function.',
          'Verify that typing in search does not trigger redundant child re-allocations.'
        ],
        starterCode: `function FastFilterList({ items }: { items: string[] }) {
  // Implement useMemo and useCallback
}`,
        solutionCode: `import React, { useState, useMemo, useCallback } from 'react';

function FastFilterList({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  // Memoize filtered items calculation
  const filteredItems = useMemo(() => {
    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  // Stabilize item click handler reference
  const handleSelect = useCallback((item: string) => {
    setSelected(item);
  }, []);

  return (
    <div className="p-4">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter items..." className="border p-2 rounded w-full mb-3" />
      <p className="text-xs text-slate-500 mb-2">Selected: {selected || 'None'}</p>
      <ul className="max-h-60 overflow-y-auto space-y-1">
        {filteredItems.map(item => (
          <li key={item} onClick={() => handleSelect(item)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}`,
        hints: [
          'Filter inside useMemo with [items, query] dependencies.',
          'Wrap setSelected in useCallback with [] dependencies.'
        ]
      },
      keyTakeaways: [
        'useRef accesses DOM nodes or stores mutable instance data without triggering re-renders.',
        'useMemo caches expensive calculations; useCallback stabilizes function references.',
        'Profile in production builds before applying memoization optimizations.'
      ]
    },
    {
      id: 'fs-w2-d13',
      dayNumber: 13,
      weekNumber: 2,
      title: 'Global State Management: Context API & Reducer Pattern',
      subtitle: 'Prop drilling elimination, useReducer state machines, and compound contexts',
      durationMinutes: 55,
      overview:
        'Overcome prop drilling in large applications: learn the useReducer hook for state transitions, build global providers with React Context API, and understand when to reach for lightweight state libraries like Zustand.',
      topics: [
        {
          id: 'fs-w2-d13-t1',
          topicNumber: 1,
          title: 'The Prop Drilling Problem: Passing Props Through 7 Layers',
          explanation: [
            '"Prop Drilling" occurs when you must pass data down through many layers of intermediate components that do not actually need the data themselves, merely to get it to a deeply nested child.',
            'This tightly couples unrelated components and makes refactoring fragile. React Context provides a way to share values like user auth, theme, and language across the entire component tree.'
          ],
          codeSnippet: {
            id: 'fs-t13-c1',
            title: 'Prop Drilling Nightmare vs Context Solution',
            description: 'Visualizing prop drilling across component layers.',
            language: 'typescript',
            code: `// PROP DRILLING: Passing theme through every intermediate layer
// <App theme={theme}>
//   <Layout theme={theme}>
//     <Navbar theme={theme}>
//       <UserMenu theme={theme}>
//         <ThemeToggle theme={theme} />
//       </UserMenu>
//     </Navbar>
//   </Layout>
// </App>

// CONTEXT: Deep child directly accesses theme from Provider!
// function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme();
//   return <button onClick={toggleTheme}>{theme}</button>;
// }`,
            expectedOutput: 'Context eliminates intermediary prop passing completely'
          },
          pitfall: 'Do not use Context for every single piece of state; local state should remain local to where it is needed.',
          quickCheck: {
            question: 'What is "Prop Drilling" in React applications?',
            options: [
              'A fast way to compile TypeScript',
              'Passing props through multiple intermediate components that have no use for the data other than forwarding it',
              'An automated testing library',
              'A CSS technique'
            ],
            correctIndex: 1,
            explanation: 'Prop drilling is the tedious process of routing props through irrelevant intermediate components to reach deeply nested children.'
          }
        },
        {
          id: 'fs-w2-d13-t2',
          topicNumber: 2,
          title: 'Creating and Consuming a React Context',
          explanation: [
            'Context has three steps: 1) `createContext(defaultValue)` creates the context object, 2) `<Context.Provider value={...}>` wraps the subtree to provide data, 3) `useContext(Context)` consumes the value in any child.'
          ],
          codeSnippet: {
            id: 'fs-t13-c2',
            title: 'Building a Theme Context Provider',
            description: 'Complete context definition and custom consumer hook.',
            language: 'typescript',
            code: `import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with safety guard
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}`,
            expectedOutput: 'Type-safe theme provider and ergonomic consumer hook'
          },
          pitfall: 'Always create a custom hook (`useTheme()`) that validates `context !== undefined`; this throws an immediate descriptive error if someone forgets to wrap with the Provider.',
          quickCheck: {
            question: 'What does useContext return if called outside of its matching <Context.Provider>?',
            options: [
              'The defaultValue passed to createContext()',
              'null',
              'Throws an error automatically',
              'window'
            ],
            correctIndex: 0,
            explanation: 'useContext falls back to the defaultValue specified when calling createContext() if no Provider is found above it in the tree.'
          }
        },
        {
          id: 'fs-w2-d13-t3',
          topicNumber: 3,
          title: 'The useReducer Hook: Predictable State Transitions',
          explanation: [
            'When component state involves multiple sub-values, complex transitions, or when the next state depends on the previous state in intricate ways, `useState` becomes chaotic.',
            '`useReducer(reducer, initialState)` separates state logic from UI: components dispatch action objects (`{ type: "LOGIN", payload: user }`), and a pure `reducer(state, action)` function calculates the next state.'
          ],
          codeSnippet: {
            id: 'fs-t13-c3',
            title: 'Cart State Machine with useReducer',
            description: 'Managing complex actions with a reducer function.',
            language: 'typescript',
            code: `interface CartItem { id: string; qty: number; price: number; }
type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id);
      if (existing) {
        return state.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, action.payload];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}`,
            expectedOutput: 'Pure, deterministic state transitions easily covered by unit tests'
          },
          pitfall: 'Reducer functions MUST be pure functions without side effects. Never perform API calls, timers, or random number generation inside a reducer.',
          quickCheck: {
            question: 'Can a reducer function make an asynchronous fetch() request?',
            options: [
              'Yes, anytime',
              'No, reducers must be strictly synchronous pure functions: (state, action) => newState',
              'Only in Redux',
              'Only if wrapped in a Promise'
            ],
            correctIndex: 1,
            explanation: 'Reducers must remain pure, synchronous functions that calculate state with zero side effects.'
          }
        },
        {
          id: 'fs-w2-d13-t4',
          topicNumber: 4,
          title: 'Combining useReducer with Context API (Flux Pattern)',
          explanation: [
            'Combining `useReducer` and `Context` gives you the full architectural power of Redux without installing any third-party dependencies.',
            'The provider holds `[state, dispatch] = useReducer(reducer, initial)` and passes both down in context, allowing any component to dispatch global actions.'
          ],
          codeSnippet: {
            id: 'fs-t13-c4',
            title: 'Global Auth & Curriculum Provider with Reducer',
            description: 'Providing global state and dispatch to the application tree.',
            language: 'typescript',
            code: `interface AppState { user: string | null; unlockedWeeks: number[]; }
type AppAction = { type: 'UNLOCK_WEEK'; week: number } | { type: 'SET_USER'; user: string };

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<React.Dispatch<AppAction> | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer((s: AppState, a: AppAction): AppState => {
    if (a.type === 'UNLOCK_WEEK') return { ...s, unlockedWeeks: [...s.unlockedWeeks, a.week] };
    if (a.type === 'SET_USER') return { ...s, user: a.user };
    return s;
  }, { user: null, unlockedWeeks: [1] });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}`,
            expectedOutput: 'Splitting state and dispatch into separate contexts to prevent re-render cascades'
          },
          pitfall: 'Putting both `state` and `dispatch` in the same single context object forces components that only need `dispatch` (like a simple button) to re-render every time `state` changes. Split them!',
          quickCheck: {
            question: 'Why is it an architectural best practice to split State and Dispatch into separate Contexts?',
            options: [
              'To bypass TypeScript',
              'So components that only dispatch actions do not re-render when state changes',
              'To speed up CSS animations',
              'It is required by React 19'
            ],
            correctIndex: 1,
            explanation: 'Separating State and Dispatch contexts prevents unnecessary re-renders in components that only trigger actions.'
          }
        },
        {
          id: 'fs-w2-d13-t5',
          topicNumber: 5,
          title: 'Context Performance Pitfalls & Split Providers',
          explanation: [
            'Whenever a Context Provider `value` changes, EVERY component that calls `useContext(MyContext)` re-renders unconditionally.',
            'Keep contexts focused and granular: separate `AuthContext`, `ThemeContext`, and `NotificationContext` instead of creating one gigantic monolithic `SuperGlobalContext`.'
          ],
          codeSnippet: {
            id: 'fs-t13-c5',
            title: 'Granular Context Providers Architecture',
            description: 'Composing focused, independent providers.',
            language: 'typescript',
            code: `function AppRoot() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurriculumProvider>
          <MainApplicationRouter />
        </CurriculumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}`,
            expectedOutput: 'Theme changes do not re-render auth or curriculum components'
          },
          pitfall: 'Do not create inline object values in your Provider without `useMemo` (`value={{ a, b }}`); creating a new object literal on every render forces all consumers to re-render constantly.',
          quickCheck: {
            question: 'What happens to consumers of a Context when the Provider value changes?',
            options: [
              'Nothing',
              'Every component consuming that Context re-renders',
              'Only the root component re-renders',
              'The page refreshes'
            ],
            correctIndex: 1,
            explanation: 'Any change to a context value triggers a re-render in all components that subscribe to that context.'
          }
        },
        {
          id: 'fs-w2-d13-t6',
          topicNumber: 6,
          title: 'Zustand: Minimalist, Boilerplate-Free Global State',
          explanation: [
            'For medium-to-large full-stack apps, Zustand has emerged as the modern industry favorite over Redux and raw Context.',
            'Zustand creates stores outside React with a hook: zero boilerplate, no Provider wrappers required, and automatic selector-based re-rendering (components only re-render if the specific selected slice changes).'
          ],
          codeSnippet: {
            id: 'fs-t13-c6',
            title: 'Creating a Zustand Store in 10 Lines',
            description: 'Lightweight global store with fine-grained selectors.',
            language: 'typescript',
            code: `// Zustand pattern demonstration
// import { create } from 'zustand';

interface CourseStore {
  activeDayId: string;
  setActiveDayId: (id: string) => void;
}

// const useCourseStore = create<CourseStore>((set) => ({
//   activeDayId: 'fs-w1-d1',
//   setActiveDayId: (id) => set({ activeDayId: id }),
// }));

// In component:
// const activeDayId = useCourseStore((state) => state.activeDayId);`,
            expectedOutput: 'Fine-grained selector re-rendering without Provider nesting'
          },
          pitfall: 'Do not import the entire store without a selector `const store = useStore()`; this re-renders on every change. Always select slices `useStore(s => s.item)`.',
          quickCheck: {
            question: 'What is a key advantage of Zustand over React Context API?',
            options: [
              'It requires no Provider nesting and only re-renders components when their selected state slice changes',
              'It replaces HTML',
              'It is built into the browser',
              'It does not support TypeScript'
            ],
            correctIndex: 0,
            explanation: 'Zustand provides store access without Providers and uses selectors to prevent unnecessary re-renders.'
          }
        },
        {
          id: 'fs-w2-d13-t7',
          topicNumber: 7,
          title: 'Server State vs Client State (Why React Query Changed Everything)',
          explanation: [
            'A common mistake is storing remote server data (users, courses, posts) in client state stores (Redux/Context).',
            'Server state is remote, asynchronous, shared, and can become stale. Client state is local and synchronous (e.g. sidebar open, active tab).',
            'Tools like TanStack Query (React Query) manage caching, background re-fetching, deduplication, and stale-while-revalidate for server state automatically.'
          ],
          codeSnippet: {
            id: 'fs-t13-c7',
            title: 'Server State with TanStack Query Mental Model',
            description: 'Differentiating server cache from synchronous UI state.',
            language: 'typescript',
            code: `// Client State: Local, UI-only, synchronous
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

// Server State: Remote, cached, deduplicated with React Query
// const { data: students, isLoading } = useQuery({
//   queryKey: ['students'],
//   queryFn: () => fetch('/api/students').then(r => r.json()),
//   staleTime: 1000 * 60 * 5 // Cached for 5 minutes!
// });`,
            expectedOutput: 'Server data is cached automatically with zero manual Redux boilerplate'
          },
          pitfall: 'Do not write hundreds of lines of Redux boilerplate to cache server data; use TanStack Query or SWR for remote data.',
          quickCheck: {
            question: 'What is the primary difference between Client State and Server State?',
            options: [
              'Client state is local synchronous UI state (sidebar open); Server state is remote asynchronous data owned by a database',
              'Client state is stored in SQL',
              'Server state is only for CSS',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'Client state controls transient browser UI; Server state represents remote data requiring cache invalidation.'
          }
        },
        {
          id: 'fs-w2-d13-t8',
          topicNumber: 8,
          title: 'State Architecture Decision Matrix: Where Should State Live?',
          explanation: [
            'Follow this 4-tier decision hierarchy:',
            '1. Can it be computed? -> Derived State (No state).',
            '2. Does only one component care? -> Local useState.',
            '3. Do siblings need it? -> Lift State Up to Parent.',
            '4. Does the entire tree need it? -> Context API or Zustand.'
          ],
          codeSnippet: {
            id: 'fs-t13-c8',
            title: 'The State Placement Decision Flowchart',
            description: 'Selecting the optimal state storage tier.',
            language: 'bash',
            code: `# Question 1: Can this be derived from props or existing state?
#   YES -> Calculate inline during render! (Zero state)
# Question 2: Is this state needed outside this single component?
#   NO  -> local useState()
# Question 3: Is this shared between 2 or 3 nearby components?
#   YES -> Lift state up to their parent component!
# Question 4: Is this global across many screens (theme, auth, notifications)?
#   YES -> React Context or Zustand store!`,
            expectedOutput: 'Clean, maintainable state architecture without over-engineering'
          },
          pitfall: 'Making all state global by default creates an unmaintainable tangle of dependencies. Keep state as local as possible.',
          quickCheck: {
            question: 'Where should transient dropdown open/close state be stored?',
            options: [
              'In a global Redux store',
              'In local useState within the dropdown component',
              'In localStorage',
              'In a PostgreSQL database'
            ],
            correctIndex: 1,
            explanation: 'Dropdown open/close state is local UI state that no other part of the application needs to know about.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete Notification Toast Context & Dispatcher',
        instructions: [
          'Create a ToastContext with toasts array and pushToast(msg, type) function.',
          'Build a ToastProvider that renders floating toast cards in bottom-right.',
          'Auto-dismiss toasts after 3 seconds.',
          'Create a useToast consumer hook.'
        ],
        starterCode: `// Write your ToastProvider and useToast hook here`,
        solutionCode: `import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast { id: string; message: string; type: 'success' | 'info'; }
interface ToastContextType {
  pushToast: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="p-3 rounded-lg shadow-lg text-sm bg-slate-900 text-white border border-slate-700 animate-fade-in">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};`,
        hints: [
          'Use setTimeout to auto-remove toast by ID after 3000ms.',
          'Use useCallback on pushToast to maintain a stable reference.'
        ]
      },
      keyTakeaways: [
        'React Context eliminates prop drilling for truly global app data.',
        'useReducer formalizes complex state transitions into pure, testable reducer functions.',
        'Keep state as local as possible; only promote to Context or global stores when necessary.'
      ]
    },
    {
      id: 'fs-w2-d14',
      dayNumber: 14,
      weekNumber: 2,
      title: 'Single-Page Routing (React Router v6), Layouts & Protected Routes',
      subtitle: 'Client routing, nested layouts, outlet, search params, and authentication guards',
      durationMinutes: 50,
      overview:
        'Master client-side routing in single-page applications: how the HTML5 History API works without page reloads, structuring nested layouts with `<Outlet />`, reading URL parameters and search queries, and building protected routes for authenticated users.',
      topics: [
        {
          id: 'fs-w2-d14-t1',
          topicNumber: 1,
          title: 'How Client-Side Routing Works: HTML5 History API',
          explanation: [
            'In traditional multi-page web applications, clicking an `<a href>` triggers a full browser reload, fetching a whole new HTML document from the server.',
            'Single-Page Applications (SPAs) intercept link clicks using the browser `window.history.pushState()` API. The URL updates in the address bar, and React swaps out components instantaneously without any page reload.'
          ],
          codeSnippet: {
            id: 'fs-t14-c1',
            title: 'HTML5 History API vs React Router Link',
            description: 'Client-side navigation without full browser reload.',
            language: 'typescript',
            code: `// What React Router <Link to="/curriculum"> does under the hood:
function navigateClientSide(path: string) {
  // Update URL in browser address bar without reloading
  window.history.pushState({}, '', path);
  // Emit route change event so React re-renders active view!
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// React Router <Link> component usage:
// <Link to="/curriculum" className="text-blue-500 hover:underline">
//   Go to Curriculum
// </Link>`,
            expectedOutput: 'Instant seamless view transition without white flash or network reload'
          },
          pitfall: 'Never use plain `<a href="/path">` for internal SPA navigation; it will trigger a full browser reload and wipe out all in-memory React state!',
          quickCheck: {
            question: 'Why should you use <Link to="..."> instead of <a href="..."> in a React SPA?',
            options: [
              '<Link> is faster CSS',
              '<Link> prevents full browser page reloads, updating the URL and views via client-side routing while preserving state',
              '<Link> does not work on mobile',
              '<a> tags are deprecated'
            ],
            correctIndex: 1,
            explanation: '<Link> uses pushState under the hood, intercepting navigation to keep the application state intact.'
          }
        },
        {
          id: 'fs-w2-d14-t2',
          topicNumber: 2,
          title: 'Configuring React Router v6: createBrowserRouter & RouterProvider',
          explanation: [
            'React Router v6 uses data routers configured via `createBrowserRouter()` and `<RouterProvider router={...} />`.',
            'This enables modern features like data loaders, actions, error boundaries, and nested layouts.'
          ],
          codeSnippet: {
            id: 'fs-t14-c2',
            title: 'Standard React Router v6 Configuration',
            description: 'Declaring routes and mounting RouterProvider.',
            language: 'typescript',
            code: `// Route Configuration Pattern
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <div>Home Landing Page</div>,
  },
  {
    path: '/curriculum',
    element: <div>Course Curriculum View</div>,
  },
  {
    path: '/sandbox',
    element: <div>Code Sandbox Playground</div>,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>, // Catch-all route
  }
];

// export const router = createBrowserRouter(routes);
// <RouterProvider router={router} />`,
            expectedOutput: 'Declarative routing tree with 404 fallback handling'
          },
          pitfall: 'Always define a catch-all route `{ path: "*", element: <NotFound /> }` to handle broken or mistyped URLs gracefully.',
          quickCheck: {
            question: 'What route path pattern matches all unrecognized URLs as a 404 fallback?',
            options: ['/404', '/*', '*', '/error'],
            correctIndex: 2,
            explanation: 'The asterisk "*" is the wildcard catch-all route pattern in React Router.'
          }
        },
        {
          id: 'fs-w2-d14-t3',
          topicNumber: 3,
          title: 'Nested Routes & The <Outlet /> Component',
          explanation: [
            'Real-world applications share persistent UI shells (top navbar, sidebar navigation, footer) across multiple sub-pages.',
            'Nested routes render a parent layout component containing an `<Outlet />`. When the URL changes, React Router swaps ONLY the content inside `<Outlet />`, keeping the shell persistent without re-mounting.'
          ],
          codeSnippet: {
            id: 'fs-t14-c3',
            title: 'App Shell Layout with Nested Outlet',
            description: 'Persistent sidebar and header wrapping child views.',
            language: 'typescript',
            code: `// import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2>Full Stack Portal</h2>
        {/* Navigation links */}
      </aside>
      <main className="flex-1 p-6">
        {/* Child route components render dynamically right here! */}
        <Outlet />
      </main>
    </div>
  );
}`,
            expectedOutput: 'Sidebar remains mounted while main workspace renders nested route'
          },
          pitfall: 'Forgetting to include `<Outlet />` inside the parent layout component will cause all nested child routes to be completely invisible.',
          quickCheck: {
            question: 'What does the <Outlet /> component do in React Router v6?',
            options: [
              'Renders the 404 page',
              'Acts as a placeholder slot where child route components are rendered inside a parent layout',
              'Logs network requests',
              'Renders the HTML head'
            ],
            correctIndex: 1,
            explanation: '<Outlet /> renders the matching child route elements inside the parent layout.'
          }
        },
        {
          id: 'fs-w2-d14-t4',
          topicNumber: 4,
          title: 'Dynamic URL Parameters with useParams()',
          explanation: [
            'Routes like `/courses/:courseId/days/:dayId` define dynamic segments prefixed with a colon (`:`).',
            'The `useParams()` hook extracts these values as typed string properties in your component, allowing a single view component to dynamically render Day 1, Day 2, or Day 28.'
          ],
          codeSnippet: {
            id: 'fs-t14-c4',
            title: 'Extracting Dynamic Route Parameters',
            description: 'Reading courseId and dayId from URL path.',
            language: 'typescript',
            code: `// Route: { path: "courses/:courseId/days/:dayId", element: <LessonPage /> }
// import { useParams } from 'react-router-dom';

function LessonPage() {
  const { courseId, dayId } = useParams<{ courseId: string; dayId: string }>();

  return (
    <div>
      <h2 className="text-xl font-bold">Course: {courseId}</h2>
      <p className="text-slate-500">Active Day: {dayId}</p>
    </div>
  );
}`,
            expectedOutput: 'Displays dynamic course and day values directly from URL path'
          },
          pitfall: '`useParams()` values are always strings (or undefined). If your ID is a number, parse it with `Number(id)` or `parseInt(id, 10)`.',
          quickCheck: {
            question: 'In route path "lessons/:lessonId", how is lessonId accessed in the component?',
            options: [
              'window.location.hash',
              'const { lessonId } = useParams();',
              'props.lessonId',
              'document.title'
            ],
            correctIndex: 1,
            explanation: 'useParams() returns an object of key/value pairs of URL parameters from the current URL.'
          }
        },
        {
          id: 'fs-w2-d14-t5',
          topicNumber: 5,
          title: 'Query Search Parameters with useSearchParams()',
          explanation: [
            'Search parameters (`?tab=stats&filter=active`) are ideal for shareable URL states like search filters, pagination page numbers, and active modal dialogs.',
            '`useSearchParams()` works identically to `useState`, returning `[searchParams, setSearchParams]`.'
          ],
          codeSnippet: {
            id: 'fs-t14-c5',
            title: 'Reading and Setting URL Search Parameters',
            description: 'Synchronizing filter tabs with browser query string.',
            language: 'typescript',
            code: `// import { useSearchParams } from 'react-router-dom';

function TabSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'curriculum';

  const selectTab = (tabName: string) => {
    setSearchParams({ tab: tabName }); // Updates URL to ?tab=tabName
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => selectTab('curriculum')} className={currentTab === 'curriculum' ? 'font-bold' : ''}>Curriculum</button>
      <button onClick={() => selectTab('stats')} className={currentTab === 'stats' ? 'font-bold' : ''}>Stats</button>
    </div>
  );
}`,
            expectedOutput: 'URL updates to ?tab=stats and browser back button returns to ?tab=curriculum'
          },
          pitfall: 'Do not store private sensitive passwords or tokens in URL search parameters; URLs are saved in browser history and server logs.',
          quickCheck: {
            question: 'What is a major advantage of storing active tab selection in searchParams rather than local useState?',
            options: [
              'It encrypts data',
              'Users can bookmark, copy, and share links directly to a specific tab, and browser back/forward buttons work',
              'It speeds up database queries',
              'It eliminates CSS'
            ],
            correctIndex: 1,
            explanation: 'Storing state in search params creates deep-linkable URLs that preserve view state when shared or refreshed.'
          }
        },
        {
          id: 'fs-w2-d14-t6',
          topicNumber: 6,
          title: 'Protected Routes & Authentication Guards',
          explanation: [
            'In production applications, private routes (e.g. `/certificate`, `/admin`, `/profile`) must be protected from unauthorized access.',
            'A Protected Route wrapper checks user authentication status. If logged in, it renders `<Outlet />`; if not logged in, it redirects using `<Navigate to="/login" replace />`.'
          ],
          codeSnippet: {
            id: 'fs-t14-c6',
            title: 'Protected Route Guard Component',
            description: 'Redirecting unauthenticated visitors to login page.',
            language: 'typescript',
            code: `// import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export function ProtectedRoute({ isAuthenticated }: ProtectedRouteProps) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login while preserving the attempted URL for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}`,
            expectedOutput: 'Unauthorized visitors redirected instantly to /login'
          },
          pitfall: 'Remember to pass `replace` to `<Navigate replace />`; this replaces the attempted URL in browser history so clicking the back button does not bounce them in an infinite redirect loop.',
          quickCheck: {
            question: 'What does the replace prop on <Navigate replace /> accomplish during an auth redirect?',
            options: [
              'Replaces the entire CSS stylesheet',
              'Replaces the current entry in the history stack rather than pushing a new one, avoiding back-button redirect loops',
              'Replaces the user password',
              'Deletes cookies'
            ],
            correctIndex: 1,
            explanation: 'replace overwrites the current history entry so the user does not get stuck in a back-button loop.'
          }
        },
        {
          id: 'fs-w2-d14-t7',
          topicNumber: 7,
          title: 'Programmatic Navigation with useNavigate()',
          explanation: [
            '`useNavigate()` provides an imperative navigation function `navigate("/path")`.',
            'Use it inside form submissions, quiz completion handlers, or timer callbacks (e.g. navigating to `/certificate` after passing the final module exam).'
          ],
          codeSnippet: {
            id: 'fs-t14-c7',
            title: 'Navigating Programmatically on Form Submission',
            description: 'Triggering route transition after async action.',
            language: 'typescript',
            code: `// import { useNavigate } from 'react-router-dom';

function QuizSubmission({ onPass }: { onPass: () => void }) {
  const navigate = useNavigate();

  const handleFinishQuiz = async () => {
    onPass();
    // Navigate programmatically to stats page
    navigate('/stats', { replace: true });
  };

  return <button onClick={handleFinishQuiz}>Submit Exam</button>;
}`,
            expectedOutput: 'Smooth transition to /stats immediately upon passing exam'
          },
          pitfall: 'Do not use `window.location.href = "/stats"`; that performs a full browser reload. Always use `navigate("/stats")` to stay within the React SPA.',
          quickCheck: {
            question: 'Which hook provides programmatic client-side navigation in React Router v6?',
            options: ['useHistory()', 'useNavigate()', 'useRouter()', 'useLocation()'],
            correctIndex: 1,
            explanation: 'useNavigate() is the standard programmatic navigation hook in React Router v6.'
          }
        },
        {
          id: 'fs-w2-d14-t8',
          topicNumber: 8,
          title: 'Deploying SPAs & The Single-Page Rewrite Rule',
          explanation: [
            'Client routers work because index.html is loaded first. But if a user navigates directly to `my-app.com/curriculum` and refreshes the browser, the static web server looks for a physical file named `/curriculum/index.html` and returns 404 Not Found!',
            'To fix this, production servers (Nginx, Netlify, Vercel, Express) must be configured with a SPA Rewrite Rule: rewrite all unknown requests to `/index.html`.'
          ],
          codeSnippet: {
            id: 'fs-t14-c8',
            title: 'SPA Rewrite Configurations',
            description: 'Standard redirect rules for Vercel and Express.',
            language: 'json',
            code: `// vercel.json rewrite rule:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

// In Express.js server:
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });`,
            expectedOutput: 'Eliminates 404 errors on deep-link refreshes in production'
          },
          pitfall: 'Deploying a React SPA to static hosting without an SPA rewrite configuration causes users to see 404 errors whenever they refresh a nested page.',
          quickCheck: {
            question: 'Why do SPAs require a server rewrite rule redirecting all requests to index.html?',
            options: [
              'Because nested routes are virtual client-side paths, not actual files on the web server disk',
              'Because React requires root access',
              'To encrypt the URL',
              'To speed up DNS'
            ],
            correctIndex: 0,
            explanation: 'The server must return index.html for all routes so the client-side JavaScript router can boot up and read the URL.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete App Router with Nested Layout & Protected Route',
        instructions: [
          'Create a RootLayout with a nav bar and <Outlet />.',
          'Define a ProtectedRoute component checking auth state.',
          'Configure routes for public home, login, and protected dashboard views.',
          'Add a 404 catch-all view.'
        ],
        starterCode: `// Write your router configuration here`,
        solutionCode: `import React from 'react';
// import { createBrowserRouter, Outlet, Navigate, Link } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
      <nav className="flex gap-4 p-4 border-b">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

function ProtectedRoute({ isAuth }: { isAuth: boolean }) {
  if (!isAuth) return <Navigate to="/login" replace />;
  return <Outlet />;
}`,
        hints: [
          'Use <Outlet /> inside RootLayout for nested child rendering.',
          'Use <Navigate to="/login" replace /> in ProtectedRoute.'
        ]
      },
      keyTakeaways: [
        'Single-page routing uses HTML5 pushState to update views instantaneously without page refreshes.',
        'Nested layouts with <Outlet /> provide persistent application shells across child views.',
        'Always configure single-page rewrite rules on your production web host to prevent 404s on refresh.'
      ]
    }
  ],
  quiz: {
    id: 'fs-quiz-w2',
    weekNumber: 2,
    title: 'Module 2 Assessment: Modern React Architecture & Frontend Mastery',
    description:
      'Evaluate your comprehension of component trees, useState immutability, useEffect lifecycles, advanced hook optimization, and client routing.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'fs-q2-1',
        question: 'Why does React require state arrays and objects to be updated immutably (e.g. using spread ... or map/filter)?',
        options: [
          'Because mutating state directly breaks JavaScript syntax',
          'React relies on shallow object reference equality (Object.is); mutating properties on the same object prevents React from detecting changes and re-rendering',
          'It is required by Tailwind CSS',
          'Mutating arrays deletes all data'
        ],
        correctIndex: 1,
        explanation: 'React compares state by reference. In-place mutations do not change the memory reference, causing React to skip re-renders.'
      },
      {
        id: 'fs-q2-2',
        question: 'What is the purpose of the cleanup function returned inside a useEffect hook?',
        options: [
          'To format CSS styles',
          'To tear down subscriptions, intervals, and abort pending network requests before the effect re-runs or when the component unmounts',
          'To clear browser cookies',
          'To restart the dev server'
        ],
        correctIndex: 1,
        explanation: 'Cleanups prevent memory leaks and race conditions by releasing resources when components unmount or dependencies change.'
      },
      {
        id: 'fs-q2-3',
        question: 'How does useRef differ fundamentally from useState in React?',
        options: [
          'useRef can only hold numbers',
          'Mutating ref.current updates the value synchronously without scheduling or triggering a component re-render',
          'useState only works in production',
          'There is no difference'
        ],
        correctIndex: 1,
        explanation: 'Refs provide persistent mutable storage that does not trigger re-renders, whereas setting state triggers a component re-render.'
      },
      {
        id: 'fs-q2-4',
        question: 'What is the role of useMemo in React performance optimization?',
        options: [
          'It makes all network requests faster',
          'It caches the result of an expensive calculation, recalculating it only when specified dependencies change',
          'It automatically fixes memory leaks',
          'It replaces useEffect'
        ],
        correctIndex: 1,
        explanation: 'useMemo stores computed results across renders and only recalculates when one of its dependencies changes.'
      },
      {
        id: 'fs-q2-5',
        question: 'What architectural role does the Context API serve in React applications?',
        options: [
          'It replaces SQL databases',
          'It provides global data to any component in the tree without manually drilling props through intermediate layers',
          'It compiles TypeScript code to WebAssembly',
          'It connects to GitHub'
        ],
        correctIndex: 1,
        explanation: 'Context API allows components across the tree to access shared state directly, eliminating prop drilling.'
      },
      {
        id: 'fs-q2-6',
        question: 'Why must static web hosts (Vercel, Nginx, Render) configure a SPA rewrite rule to /index.html for React Router apps?',
        options: [
          'Because React Router runs on the server',
          'Because nested URLs (e.g. /curriculum/stats) do not correspond to physical files on the server disk; index.html must load first so client-side JavaScript can route the request',
          'To disable browser caching',
          'To enforce SSL encryption'
        ],
        correctIndex: 1,
        explanation: 'Without a rewrite rule, the web server looks for non-existent disk files on deep-link refreshes and returns 404.'
      }
    ]
  }
};
