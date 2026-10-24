import { WeekModule } from '../types/course';

export const FULLSTACK_WEEK_3_MODULE: WeekModule = {
  weekNumber: 3,
  title: 'Back-End Development with Node.js, Express & REST APIs',
  theme: 'Server Architecture, REST Endpoints, Middleware, Auth & Security',
  description:
    'Engineer resilient server-side applications using Node.js and Express. Master non-blocking asynchronous I/O, RESTful API conventions, request validation with Zod, secure JWT authentication with bcrypt, and defense-in-depth API hardening.',
  conceptImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'High performance backend server datacenter architecture',
  days: [
    {
      id: 'fs-w3-d15',
      dayNumber: 15,
      weekNumber: 3,
      title: 'Node.js Core Architecture: Event Loop, Libuv & Non-blocking I/O',
      subtitle: 'Single-threaded event loop, call stack, thread pool, and file system operations',
      durationMinutes: 50,
      overview:
        'Understand the runtime mechanics of Node.js: how a single JavaScript thread handles tens of thousands of concurrent connections using the Libuv event loop, non-blocking I/O, and the asynchronous fs module.',
      topics: [
        {
          id: 'fs-w3-d15-t1',
          topicNumber: 1,
          title: 'What is Node.js? V8 Engine & Libuv',
          explanation: [
            'Node.js is an open-source, cross-platform JavaScript runtime environment built on Google Chrome V8 JavaScript engine and the C library Libuv.',
            'V8 compiles JavaScript directly to native machine code. Libuv provides the cross-platform event loop and an underlying C thread pool (default 4 threads) to handle asynchronous I/O operations (file system, DNS, crypto).'
          ],
          codeSnippet: {
            id: 'fs-t15-c1',
            title: 'Checking Node.js Runtime Environment',
            description: 'Inspecting global process object and system architecture.',
            language: 'javascript',
            code: `// Node.js exposes global 'process' object instead of 'window'
console.log('Node.js Version:', process.version);
console.log('Architecture:', process.arch);
console.log('Platform:', process.platform);
console.log('Memory Usage (MB):', Math.round(process.memoryUsage().heapUsed / 1024 / 1024));`,
            expectedOutput: 'Node.js Version: v22.14.0\nArchitecture: x64\nPlatform: linux\nMemory Usage (MB): 18'
          },
          pitfall: 'Browser APIs like `window`, `document`, and `localStorage` do not exist in Node.js. Accessing them will throw a ReferenceError.',
          quickCheck: {
            question: 'What is the role of Libuv in Node.js?',
            options: [
              'It renders React components',
              'It provides the event loop, thread pool, and cross-platform asynchronous I/O abstractions',
              'It is a CSS preprocessor',
              'It connects directly to MongoDB'
            ],
            correctIndex: 1,
            explanation: 'Libuv is the core C library behind Node.js responsible for the event loop and asynchronous system calls.'
          }
        },
        {
          id: 'fs-w3-d15-t2',
          topicNumber: 2,
          title: 'The Event Loop Phases & Non-Blocking I/O',
          explanation: [
            'Node.js runs user JavaScript code on a single thread. It achieves massive concurrency by offloading slow I/O operations (file reads, network sockets) to the operating system kernel or Libuv thread pool.',
            'The Event Loop continuously cycles through distinct phases: 1) Timers (setTimeout, setInterval), 2) Pending I/O Callbacks, 3) Idle/Prepare, 4) Poll (retrieves new I/O events), 5) Check (setImmediate), 6) Close Callbacks.'
          ],
          codeSnippet: {
            id: 'fs-t15-c2',
            title: 'Observing Event Loop Execution Order',
            description: 'Comparing synchronous execution, microtasks, and macrotasks.',
            language: 'javascript',
            code: `console.log('1. Synchronous Start');

// Macrotask (Timers Phase)
setTimeout(() => console.log('4. setTimeout macrotask'), 0);

// Microtask (Executes immediately after current script before next event loop turn)
Promise.resolve().then(() => console.log('3. Promise microtask'));

console.log('2. Synchronous End');`,
            expectedOutput: '1. Synchronous Start\n2. Synchronous End\n3. Promise microtask\n4. setTimeout macrotask'
          },
          pitfall: 'CPU-intensive synchronous tasks (like infinite loops or huge synchronous JSON parsing) block the single thread, freezing all incoming HTTP requests for all users!',
          quickCheck: {
            question: 'Which executes first after synchronous code finishes: a resolved Promise microtask or a setTimeout(..., 0) timer?',
            options: [
              'setTimeout(..., 0)',
              'Promise microtask executes first before the event loop advances to the timers phase',
              'They execute at the exact same millisecond',
              'Random'
            ],
            correctIndex: 1,
            explanation: 'The microtask queue (Promises, process.nextTick) is drained immediately after synchronous execution, before macrotask timers.'
          }
        },
        {
          id: 'fs-w3-d15-t3',
          topicNumber: 3,
          title: 'Asynchronous File System Operations (node:fs/promises)',
          explanation: [
            'Never use synchronous file methods (`fs.readFileSync`) in production web servers; they freeze the event loop for the duration of the disk read.',
            'Always use modern Promise-based file system utilities via `import fs from "node:fs/promises"`.'
          ],
          codeSnippet: {
            id: 'fs-t15-c3',
            title: 'Asynchronous Non-Blocking File I/O',
            description: 'Reading and writing files asynchronously with async/await.',
            language: 'javascript',
            code: `import fs from 'node:fs/promises';

async function manageConfig() {
  const config = { port: 8080, db: 'postgres://localhost/app' };
  
  // Asynchronously write file
  await fs.writeFile('config.json', JSON.stringify(config, null, 2), 'utf-8');
  console.log('Config written successfully');

  // Asynchronously read file back
  const data = await fs.readFile('config.json', 'utf-8');
  console.log('Loaded config port:', JSON.parse(data).port);
}

manageConfig();`,
            expectedOutput: 'Config written successfully\nLoaded config port: 8080'
          },
          pitfall: 'Avoid using legacy callback-based `fs.readFile(file, (err, data) => ...)` when modern `fs/promises` provides clean async/await.',
          quickCheck: {
            question: 'Why is fs.readFileSync() dangerous in a production Node.js HTTP server?',
            options: [
              'It deletes files',
              'It blocks the entire single-threaded event loop, freezing all other concurrent user requests until the disk read finishes',
              'It only works on Windows',
              'It consumes GPU memory'
            ],
            correctIndex: 1,
            explanation: 'Synchronous I/O halts the entire Node.js event loop, preventing all incoming network requests from being served.'
          }
        },
        {
          id: 'fs-w3-d15-t4',
          topicNumber: 4,
          title: 'CommonJS (require) vs ECMAScript Modules (ESM import)',
          explanation: [
            'Node.js historically used CommonJS (`const express = require("express")`, `module.exports = ...`).',
            'Modern Node.js (v18+) fully supports standard ECMAScript Modules (`import express from "express"`, `export default ...`).',
            'Enable ESM across your project by setting `"type": "module"` in `package.json`.'
          ],
          codeSnippet: {
            id: 'fs-t15-c4',
            title: 'Enabling ESM in package.json',
            description: 'Using standard import/export syntax in Node.js.',
            language: 'json',
            code: `{
  "name": "backend-api",
  "type": "module",
  "scripts": {
    "start": "node src/server.js"
  }
}`,
            expectedOutput: 'Node.js natively parses import and export statements'
          },
          pitfall: 'In ESM mode, `__dirname` and `__filename` are not defined by default. Use `import.meta.dirname` (Node 20.11+) or `fileURLToPath(import.meta.url)`.',
          quickCheck: {
            question: 'How do you configure a Node.js project to use standard ES Module import/export syntax natively?',
            options: [
              'Install Babel',
              'Add "type": "module" to package.json',
              'Rename all files to .txt',
              'Set NODE_ENV=esm'
            ],
            correctIndex: 1,
            explanation: '"type": "module" in package.json tells Node.js to treat all .js files as ECMAScript Modules.'
          }
        },
        {
          id: 'fs-w3-d15-t5',
          topicNumber: 5,
          title: 'Path Resolution & The node:path Module',
          explanation: [
            'File path separators differ between operating systems (Windows uses `\\`, while Linux and macOS use `/`).',
            'The `node:path` module (`path.join()`, `path.resolve()`) builds cross-platform normalized paths that function seamlessly across Windows, Linux servers, and Docker containers.'
          ],
          codeSnippet: {
            id: 'fs-t15-c5',
            title: 'Cross-Platform Path Construction',
            description: 'Building safe filesystem paths with path.join.',
            language: 'javascript',
            code: `import path from 'node:path';

// Cross-platform normalized path joining
const uploadDir = path.join(process.cwd(), 'uploads', 'avatars', 'user-42.png');
console.log('Safe path:', uploadDir);

// Extracting extension and file name
console.log('Extension:', path.extname(uploadDir));
console.log('Basename:', path.basename(uploadDir));`,
            expectedOutput: 'Safe path: /project/uploads/avatars/user-42.png\nExtension: .png\nBasename: user-42.png'
          },
          pitfall: 'Never manually concatenate paths with string addition (`dir + "/" + file`); this creates broken backslash paths on Windows machines.',
          quickCheck: {
            question: 'Why should you use path.join() instead of string concatenation (dir + "/" + file)?',
            options: [
              'path.join() handles cross-platform separator differences (Windows backslashes vs POSIX forward slashes) and normalizes dot segments',
              'String concatenation is banned in TypeScript',
              'path.join() automatically downloads files',
              'To encrypt paths'
            ],
            correctIndex: 0,
            explanation: 'path.join() correctly normalizes paths for the host operating system, preventing slash-related filesystem bugs.'
          }
        },
        {
          id: 'fs-w3-d15-t6',
          topicNumber: 6,
          title: 'Buffers, Streams & Handling Large Files Efficiently',
          explanation: [
            'Loading a 2GB video or CSV file entirely into memory with `fs.readFile()` will crash the Node.js process with an "Out of Memory" heap error.',
            'Streams process data in sequential chunks over time. Using `fs.createReadStream()` and piping through transforms processes arbitrarily large files with a tiny, constant memory footprint (~20MB).'
          ],
          codeSnippet: {
            id: 'fs-t15-c6',
            title: 'Piping Streams for Minimal Memory Consumption',
            description: 'Streaming data chunks with pipeline utility.',
            language: 'javascript',
            code: `import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

async function copyLargeDataset() {
  console.log('Streaming chunks from source to destination...');
  // Streams data in 64KB chunks without buffering entire file in RAM
  await pipeline(
    createReadStream('source-large.csv'),
    createWriteStream('backup-large.csv')
  );
  console.log('Stream pipeline completed with minimal RAM usage!');
}`,
            expectedOutput: 'Data chunks processed iteratively with tiny constant memory footprint'
          },
          pitfall: 'Never load large user uploads directly into RAM; always stream them to disk or cloud object storage (S3/GCS).',
          quickCheck: {
            question: 'What is the primary advantage of Streams over fs.readFile() for large files?',
            options: [
              'Streams load the entire file into CPU cache',
              'Streams process data chunk-by-chunk in real time, keeping memory usage minimal regardless of file size',
              'Streams only work on text files',
              'Streams disable compression'
            ],
            correctIndex: 1,
            explanation: 'Streams allow processing files larger than the available physical RAM by breaking data into sequential chunks.'
          }
        },
        {
          id: 'fs-w3-d15-t7',
          topicNumber: 7,
          title: 'Environment Variables: process.env & dotenv',
          explanation: [
            'Twelve-Factor App methodology mandates storing configurations and credentials (database passwords, API keys, port numbers) in environment variables, completely separated from source code.',
            'The `dotenv` package reads a local `.env` file and populates `process.env` during local development.'
          ],
          codeSnippet: {
            id: 'fs-t15-c7',
            title: 'Loading and Reading Environment Variables',
            description: 'Using process.env with fallback defaults.',
            language: 'javascript',
            code: `// In modern Node 20.6+: node --env-file=.env server.js
// Or using dotenv: import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_URL = process.env.DATABASE_URL;

if (!DB_URL && NODE_ENV === 'production') {
  console.error('FATAL: DATABASE_URL environment variable is missing!');
  process.exit(1);
}

console.log(\`Server configured on port \${PORT} in \${NODE_ENV} mode\`);`,
            expectedOutput: 'Server configured on port 3000 in development mode'
          },
          pitfall: 'Never hardcode secrets (like database credentials or JWT keys) into code files. Always read them from `process.env`.',
          quickCheck: {
            question: 'Where should database connection passwords and JWT secrets be stored in a production application?',
            options: [
              'Hardcoded in a public GitHub file',
              'In environment variables injected at runtime and never committed to version control',
              'In an unencrypted HTML file',
              'In package.json'
            ],
            correctIndex: 1,
            explanation: 'Environment variables keep secrets isolated from code repositories, allowing secure runtime configuration.'
          }
        },
        {
          id: 'fs-w3-d15-t8',
          topicNumber: 8,
          title: 'Process Management & Graceful Shutdown',
          explanation: [
            'When deploying servers to Docker or Kubernetes, servers receive termination signals (`SIGTERM`, `SIGINT`).',
            'A graceful shutdown stops accepting new incoming HTTP connections, finishes existing in-flight requests, closes database connection pools, and exits cleanly (`process.exit(0)`).'
          ],
          codeSnippet: {
            id: 'fs-t15-c8',
            title: 'Handling SIGTERM for Graceful Shutdown',
            description: 'Closing database pools and HTTP listeners on termination.',
            language: 'javascript',
            code: `function setupGracefulShutdown(server, dbPool) {
  const shutdown = async (signal) => {
    console.log(\`Received \${signal}. Initiating graceful shutdown...\`);
    server.close(() => {
      console.log('HTTP server closed. In-flight requests completed.');
    });
    // Close database connections
    // await dbPool.end();
    console.log('Database connections cleanly terminated. Exiting.');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}`,
            expectedOutput: 'Server cleans up connections gracefully before process termination'
          },
          pitfall: 'Killing a server abruptly with `kill -9` without closing database connection pools leaves orphaned locks on the database server.',
          quickCheck: {
            question: 'What is the purpose of a graceful shutdown handler in Node.js?',
            options: [
              'To speed up boot time',
              'To allow in-flight HTTP requests to complete and close database connections cleanly before exiting',
              'To restart the operating system',
              'To format the hard drive'
            ],
            correctIndex: 1,
            explanation: 'Graceful shutdowns ensure active user transactions finish and resources are released cleanly before process termination.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Safe Asynchronous JSON Storage Engine',
        instructions: [
          'Create an async function saveRecord(filename, record).',
          'Use path.join to resolve destination inside data/ folder.',
          'Read existing records, append new record, and write back using node:fs/promises.',
          'Ensure directories are created automatically with { recursive: true }.'
        ],
        starterCode: `import fs from 'node:fs/promises';
import path from 'node:path';

async function saveRecord(filename, record) {
  // Build safe file storage engine
}`,
        solutionCode: `import fs from 'node:fs/promises';
import path from 'node:path';

async function saveRecord(filename, record) {
  const dirPath = path.join(process.cwd(), 'data');
  await fs.mkdir(dirPath, { recursive: true });

  const filePath = path.join(dirPath, filename);
  let records = [];

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    records = JSON.parse(raw);
  } catch (e) {
    records = []; // File does not exist yet
  }

  records.push({ ...record, createdAt: new Date().toISOString() });
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf-8');
  return records;
}

saveRecord('students.json', { name: 'Alex Rivera', role: 'FullStack Engineer' })
  .then(res => console.log('Stored records count:', res.length));`,
        hints: [
          'Use fs.mkdir(dirPath, { recursive: true }) to create parent directories if missing.',
          'Wrap fs.readFile in try/catch to handle first-time file creation.'
        ]
      },
      keyTakeaways: [
        'Node.js pairs Google V8 with Libuv to deliver non-blocking asynchronous event-driven I/O.',
        'Never use synchronous fs methods in server request paths; use node:fs/promises.',
        'Use node:path for cross-platform paths and environment variables for all secrets.'
      ]
    },
    {
      id: 'fs-w3-d16',
      dayNumber: 16,
      weekNumber: 3,
      title: 'Building HTTP Servers with Express.js: Routing & Middleware Pipeline',
      subtitle: 'Express app creation, request/response cycle, middleware chaining, and routers',
      durationMinutes: 50,
      overview:
        'Master Express.js: the standard web framework for Node.js. Understand the HTTP request/response pipeline, how middleware functions execute in sequence, parsing JSON bodies, and organizing modular routes with express.Router().',
      topics: [
        {
          id: 'fs-w3-d16-t1',
          topicNumber: 1,
          title: 'The Express Mental Model: The Middleware Pipeline',
          explanation: [
            'Express is fundamentally a series of middleware function calls executed in sequential pipeline order.',
            'A middleware function receives three arguments: `(req, res, next)`. It can inspect the request, modify it, send a response to finish the cycle, or call `next()` to pass execution to the subsequent middleware.'
          ],
          codeSnippet: {
            id: 'fs-t16-c1',
            title: 'Minimal Express Application Scaffold',
            description: 'Scaffolding an Express server listening on port 3000.',
            language: 'javascript',
            code: `import express from 'express';

const app = express();
const PORT = 3000;

// Built-in middleware parsing incoming JSON request bodies
app.use(express.json());

// Basic route handler
app.get('/', (req, res) => {
  res.json({ message: 'Full Stack Academy API is running!', status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(\`Server listening at http://localhost:\${PORT}\`);
});`,
            expectedOutput: 'Server listening at http://localhost:3000'
          },
          pitfall: 'If a middleware function does neither: 1) send a response (`res.send()`), nor 2) call `next()`, the client request will hang indefinitely until timing out!',
          quickCheck: {
            question: 'What happens if a custom middleware function does not call next() and does not send a response?',
            options: [
              'The server restarts',
              'The HTTP request hangs forever until the browser or client times out',
              'Express calls next() automatically after 1 second',
              'The route returns 200 OK'
            ],
            correctIndex: 1,
            explanation: 'Express requires either terminating the cycle with a response or calling next() to advance down the chain.'
          }
        },
        {
          id: 'fs-w3-d16-t2',
          topicNumber: 2,
          title: 'Custom Middleware: Logging & Timing Requests',
          explanation: [
            'Global middleware is registered using `app.use(fn)`. It executes for every incoming HTTP request.',
            'A classic example is a request logger that records the HTTP method, URL path, and calculates response duration in milliseconds.'
          ],
          codeSnippet: {
            id: 'fs-t16-c2',
            title: 'Custom Request Duration Logger Middleware',
            description: 'Timing request lifecycle using hrtime and next().',
            language: 'javascript',
            code: `function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url } = req;

  // Listen for the response finish event
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${method}] \${url} -> \${res.statusCode} (\${duration}ms)\`);
  });

  next(); // Crucial: advance pipeline to route handler!
}

// Register globally
// app.use(requestLogger);`,
            expectedOutput: '[GET] /api/courses -> 200 (12ms)'
          },
          pitfall: 'Placing `app.use(logger)` AFTER route declarations means it will never run for those routes; middleware order matters strictly!',
          quickCheck: {
            question: 'Does the order in which app.use() middleware is declared in Express matter?',
            options: [
              'No, Express sorts middleware alphabetically',
              'Yes, middleware executes strictly top-to-bottom in the order declared in source code',
              'Only in production',
              'Only for GET requests'
            ],
            correctIndex: 1,
            explanation: 'Express processes middleware sequentially in the exact order they are registered via app.use().'
          }
        },
        {
          id: 'fs-w3-d16-t3',
          topicNumber: 3,
          title: 'Parsing Request Bodies: express.json() & express.urlencoded()',
          explanation: [
            'In raw Node.js, request bodies arrive as streams of binary Buffer chunks that must be assembled manually.',
            '`app.use(express.json())` automatically buffers incoming JSON payloads, parses them into JavaScript objects, and attaches them to `req.body`.'
          ],
          codeSnippet: {
            id: 'fs-t16-c3',
            title: 'Accessing Parsed Body in POST Routes',
            description: 'Receiving JSON payloads via req.body.',
            language: 'javascript',
            code: `// Ensure express.json() is mounted first!
app.use(express.json());

app.post('/api/students', (req, res) => {
  const { name, email, track } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  // Create student in memory/database
  const newStudent = { id: Date.now(), name, email, track: track || 'Full Stack' };
  res.status(201).json({ success: true, data: newStudent });
});`,
            expectedOutput: 'HTTP/1.1 201 Created with JSON payload response'
          },
          pitfall: 'Forgetting `app.use(express.json())` causes `req.body` to be `undefined`, throwing `Cannot destructure property of undefined` errors.',
          quickCheck: {
            question: 'What is req.body if you send a POST request with JSON but omit app.use(express.json())?',
            options: ['An empty object {}', 'undefined', 'A string', 'null'],
            correctIndex: 1,
            explanation: 'Without the JSON body-parser middleware, Express does not populate req.body, leaving it undefined.'
          }
        },
        {
          id: 'fs-w3-d16-t4',
          topicNumber: 4,
          title: 'Route Parameters (req.params) & Query Strings (req.query)',
          explanation: [
            '`req.params` extracts dynamic URL segments defined with colons: `/api/courses/:courseId`.',
            '`req.query` parses URL query strings: `/api/courses?sort=asc&limit=10`.'
          ],
          codeSnippet: {
            id: 'fs-t16-c4',
            title: 'Handling Route Parameters and Query Filters',
            description: 'Extracting dynamic IDs and filter queries.',
            language: 'javascript',
            code: `// Route with dynamic path param: /api/modules/:moduleId/days/:dayNum
app.get('/api/modules/:moduleId/days/:dayNum', (req, res) => {
  const { moduleId, dayNum } = req.params;
  const { preview } = req.query; // ?preview=true

  res.json({
    requestedModule: moduleId,
    requestedDay: Number(dayNum),
    isPreviewMode: preview === 'true'
  });
});`,
            expectedOutput: 'Returns extracted parameters and query boolean flag'
          },
          pitfall: 'Values extracted from `req.params` and `req.query` are always strings! If you need a numeric ID for a database lookup, convert with `Number(req.params.id)`.',
          quickCheck: {
            question: 'What data type are query parameters on req.query by default?',
            options: ['numbers', 'strings', 'booleans', 'binary buffers'],
            correctIndex: 1,
            explanation: 'Query parameters arrive as strings from the URL and must be parsed if numerical values are needed.'
          }
        },
        {
          id: 'fs-w3-d16-t5',
          topicNumber: 5,
          title: 'Modular Routing with express.Router()',
          explanation: [
            'Defining 50 route handlers in a single `server.js` file creates an unmaintainable monolith.',
            '`express.Router()` creates isolated mini-applications for distinct feature domains (e.g. `authRouter`, `coursesRouter`, `usersRouter`) that mount onto base paths.'
          ],
          codeSnippet: {
            id: 'fs-t16-c5',
            title: 'Modular Router File Organization',
            description: 'Splitting routes into dedicated module routers.',
            language: 'javascript',
            code: `// File: src/routes/courses.js
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.json({ courses: ['Python', 'Full Stack'] }));
router.get('/:id', (req, res) => res.json({ courseId: req.params.id }));

export default router;

// File: src/server.js
// import coursesRouter from './routes/courses.js';
// app.use('/api/courses', coursesRouter); // Mounts all sub-routes under /api/courses!`,
            expectedOutput: 'Clean modular architecture isolating domain routes'
          },
          pitfall: 'Do not repeat the base path inside the router file (`router.get("/api/courses", ...)`). When mounted via `app.use("/api/courses", router)`, write `router.get("/", ...)`.',
          quickCheck: {
            question: 'If a router is mounted with app.use("/api/v1/auth", authRouter), what URL matches router.post("/login")?',
            options: ['/login', '/api/v1/auth/login', '/auth/login', '/api/login'],
            correctIndex: 1,
            explanation: 'The route paths concatenate: base path /api/v1/auth + router path /login = /api/v1/auth/login.'
          }
        },
        {
          id: 'fs-w3-d16-t6',
          topicNumber: 6,
          title: 'Serving Static Assets: express.static()',
          explanation: [
            '`express.static("public")` serves static client-side files (compiled React bundles in `/dist`, images, CSS files) directly to browsers with optimal cache headers.',
            'This allows your Node.js application to serve both the frontend Single-Page Application and the backend REST API from a unified server.'
          ],
          codeSnippet: {
            id: 'fs-t16-c6',
            title: 'Serving React Production Build with Express',
            description: 'Hosting frontend static assets and API routes together.',
            language: 'javascript',
            code: `import path from 'node:path';

// Serve compiled static files from dist/ folder
app.use(express.static(path.join(process.cwd(), 'dist')));

// API routes are mounted first
app.use('/api', apiRouter);

// SPA Fallback: rewrite any other GET request to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});`,
            expectedOutput: 'Unified full-stack server serving API endpoints and React SPA'
          },
          pitfall: 'Always mount your `/api` routes BEFORE the `app.get("*", ...)` fallback; otherwise, the wildcard handler will catch API requests and return HTML instead of JSON!',
          quickCheck: {
            question: 'Why must API routes be declared before the app.get("*") static SPA fallback handler?',
            options: [
              'Because wildcard * catches everything; if declared first, it would intercept /api calls and return index.html',
              'Because Express crashes otherwise',
              'It does not matter',
              'For SSL reasons'
            ],
            correctIndex: 0,
            explanation: 'Express routes execute in declaration order. A wildcard * placed first would consume all requests.'
          }
        },
        {
          id: 'fs-w3-d16-t7',
          topicNumber: 7,
          title: 'Centralized Error-Handling Middleware (err, req, res, next)',
          explanation: [
            'Express identifies error-handling middleware by its 4-parameter signature: `(err, req, res, next)`.',
            'When any route or middleware passes an error to `next(err)` or throws an exception, Express skips all remaining regular routes and jumps directly to the centralized error handler.'
          ],
          codeSnippet: {
            id: 'fs-t16-c7',
            title: 'Centralized 4-Parameter Error Middleware',
            description: 'Standard error handler providing sanitized JSON responses.',
            language: 'javascript',
            code: `// Centralized Error Handler (Mounted at the very end of app.js)
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(\`[ERROR \${status}] \${req.method} \${req.url}: \${err.stack}\`);

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      // Only include stack traces in development mode!
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});`,
            expectedOutput: 'Consistent, sanitized JSON error responses preventing server crashes'
          },
          pitfall: 'Never expose raw error stack traces to clients in production (`NODE_ENV === "production"`); stack traces leak file paths, libraries, and internal database details to attackers.',
          quickCheck: {
            question: 'How does Express distinguish error-handling middleware from regular middleware?',
            options: [
              'By checking if the function takes exactly 4 parameters: (err, req, res, next)',
              'By its function name',
              'By app.useError()',
              'Through TypeScript'
            ],
            correctIndex: 0,
            explanation: 'Express checks function arity (fn.length === 4) to identify error-handling middleware.'
          }
        },
        {
          id: 'fs-w3-d16-t8',
          topicNumber: 8,
          title: 'Async Route Error Handling in Express 5 vs Express 4',
          explanation: [
            'In Express 4, if an `async` route handler rejects (`throw new Error()`), Express does not catch it automatically, causing an unhandled promise rejection that can crash Node.',
            'Express 5 natively catches rejected async promises and forwards them to `next(err)`. In Express 4, use an `asyncHandler` wrapper or `express-async-errors`.'
          ],
          codeSnippet: {
            id: 'fs-t16-c8',
            title: 'The asyncHandler Utility Pattern',
            description: 'Wrapping async handlers to catch rejections automatically.',
            language: 'javascript',
            code: `// Universal asyncHandler wrapper for Express 4
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route usage: no manual try/catch needed!
app.get('/api/data', asyncHandler(async (req, res) => {
  const result = await fetchDatabaseData(); // If this throws, asyncHandler forwards to next(err)!
  res.json({ data: result });
}));`,
            expectedOutput: 'Async errors forwarded safely to error handler with zero boilerplate'
          },
          pitfall: 'Uncaught async errors in Express 4 without `asyncHandler` trigger `UnhandledPromiseRejection`, which terminates the Node process in modern versions.',
          quickCheck: {
            question: 'What does the asyncHandler wrapper pattern do for async route handlers in Express?',
            options: [
              'Compiles code to WebAssembly',
              'Catches any rejected Promises from the async function and automatically passes them to next(err)',
              'Increases memory limit',
              'Enables HTTPS'
            ],
            correctIndex: 1,
            explanation: 'asyncHandler automatically wraps the execution in a Promise and forwards rejections to Express next(err) handler.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete Modular Express API with Logging and Error Handling',
        instructions: [
          'Create an Express app with JSON body parsing and a request timing logger.',
          'Build an isolated student router with GET and POST /api/students endpoints.',
          'Throw a custom 404 error if student is not found.',
          'Implement a 4-parameter centralized error handler.'
        ],
        starterCode: `// Write your complete Express server structure here`,
        solutionCode: `import express from 'express';

const app = express();
app.use(express.json());

// Timing Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => console.log(\`\${req.method} \${req.url} -> \${res.statusCode} (\${Date.now() - start}ms)\`));
  next();
});

const students = [{ id: 1, name: 'Taylor' }];

// Routes
app.get('/api/students', (req, res) => res.json({ data: students }));

app.get('/api/students/:id', (req, res, next) => {
  const found = students.find(s => s.id === Number(req.params.id));
  if (!found) {
    const err = new Error('Student not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json({ data: found });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, error: err.message });
});`,
        hints: [
          'Use next(err) to trigger the centralized error handler.',
          'Ensure error handler has all 4 parameters: (err, req, res, next).'
        ]
      },
      keyTakeaways: [
        'Express is a sequential pipeline of middleware functions: (req, res, next).',
        'Use express.Router() to organize scalable modular routes.',
        'Always register a 4-parameter centralized error handler at the end of the middleware stack.'
      ]
    },
    {
      id: 'fs-w3-d17',
      dayNumber: 17,
      weekNumber: 3,
      title: 'RESTful API Engineering: CRUD Endpoints, Status Codes & Pagination',
      subtitle: 'HTTP verbs, resource modeling, idempotent methods, and cursor/offset pagination',
      durationMinutes: 50,
      overview:
        'Engineer clean, standards-compliant RESTful APIs. Master resource naming conventions, HTTP verbs (GET, POST, PUT, PATCH, DELETE), HTTP status codes (2xx, 3xx, 4xx, 5xx), idempotency, and high-performance pagination.',
      topics: [
        {
          id: 'fs-w3-d17-t1',
          topicNumber: 1,
          title: 'Core Principles of REST & Resource-Oriented URLs',
          explanation: [
            'Representational State Transfer (REST) models backend data as resources represented by nouns in plural form (e.g. `/api/courses`, `/api/users`), never verbs.',
            'The HTTP method specifies the action (`GET /courses`, `POST /courses`), avoiding redundant anti-patterns like `/api/getCourses` or `/api/deleteUser`.'
          ],
          codeSnippet: {
            id: 'fs-t17-c1',
            title: 'Clean RESTful URL Resource Naming',
            description: 'Comparing bad RPC verbs with clean REST resources.',
            language: 'bash',
            code: `# ANTI-PATTERN (RPC with verbs in URL - AVOID):
# POST /api/createNewCourse
# GET  /api/getAllCourses
# POST /api/updateCourseById?id=4
# POST /api/deleteCourse

# CLEAN REST CONVENTIONS (Nouns + HTTP Verbs):
GET    /api/courses          # List courses
POST   /api/courses          # Create a new course
GET    /api/courses/42       # Retrieve course 42
PATCH  /api/courses/42       # Partially update course 42
DELETE /api/courses/42       # Delete course 42`,
            expectedOutput: 'Consistent, predictable REST API interface conforming to web standards'
          },
          pitfall: 'Never use verbs in REST endpoint paths (e.g. `/api/users/delete`); let the HTTP DELETE method communicate the action.',
          quickCheck: {
            question: 'Which of the following adheres to proper RESTful URL naming conventions to retrieve user 15?',
            options: ['POST /api/getUser?id=15', 'GET /api/users/15', 'GET /api/fetchUser/15', 'POST /api/users/15/read'],
            correctIndex: 1,
            explanation: 'GET /api/users/15 uses the standard plural noun resource path with the identifier and standard GET verb.'
          }
        },
        {
          id: 'fs-w3-d17-t2',
          topicNumber: 2,
          title: 'HTTP Verbs: PUT vs PATCH & Idempotency',
          explanation: [
            'An operation is "idempotent" if making the exact same request multiple times produces the identical server state as making it once.',
            '`GET`, `PUT`, `DELETE`, and `HEAD` are idempotent. `POST` is NOT idempotent (submitting twice creates two database records).',
            '`PUT` replaces the ENTIRE resource object. `PATCH` applies a PARTIAL update (modifying only supplied fields).'
          ],
          codeSnippet: {
            id: 'fs-t17-c2',
            title: 'Implementing PUT vs PATCH in Express',
            description: 'Full replacement vs partial field updates.',
            language: 'javascript',
            code: `// PATCH /api/students/:id (Partial Update)
app.patch('/api/students/:id', (req, res) => {
  const student = findStudent(req.params.id);
  // Merges only provided fields without wiping out unspecified attributes
  Object.assign(student, req.body);
  res.json({ success: true, data: student });
});

// PUT /api/students/:id (Full Replacement)
app.put('/api/students/:id', (req, res) => {
  // Replaces entire resource; missing fields become null/undefined!
  const replaced = { id: req.params.id, ...req.body };
  saveStudent(replaced);
  res.json({ success: true, data: replaced });
});`,
            expectedOutput: 'PATCH modifies only specified keys; PUT replaces entire resource'
          },
          pitfall: 'Using `PUT` when you only intend to update a single field (like changing an email) will accidentally wipe out all other fields on the record.',
          quickCheck: {
            question: 'What is the key functional difference between PUT and PATCH in REST APIs?',
            options: [
              'PUT is for numbers, PATCH is for strings',
              'PUT replaces the entire resource document; PATCH applies a partial update modifying only supplied fields',
              'PUT deletes records',
              'There is no difference'
            ],
            correctIndex: 1,
            explanation: 'PUT performs a full resource replacement, whereas PATCH applies partial modifications.'
          }
        },
        {
          id: 'fs-w3-d17-t3',
          topicNumber: 3,
          title: 'Mastering HTTP Status Codes: 2xx, 3xx, 4xx & 5xx',
          explanation: [
            'Never return `200 OK` for an error with `{ error: "Not Found" }`! Return standard HTTP status codes:',
            '200 OK (standard success), 201 Created (resource created), 204 No Content (deletion complete).',
            '400 Bad Request (invalid payload), 401 Unauthorized (missing/bad token), 403 Forbidden (authenticated but lacks role permission), 404 Not Found.',
            '500 Internal Server Error (unhandled crash), 503 Service Unavailable.'
          ],
          codeSnippet: {
            id: 'fs-t17-c3',
            title: 'Applying Accurate HTTP Status Codes',
            description: 'Returning semantic status codes matching real outcomes.',
            language: 'javascript',
            code: `// Resource Creation: 201 Created
app.post('/api/projects', (req, res) => {
  const project = createProject(req.body);
  res.status(201).json(project);
});

// Resource Deletion: 204 No Content (No body returned)
app.delete('/api/projects/:id', (req, res) => {
  deleteProject(req.params.id);
  res.status(204).send(); // Standard 204 with empty response body
});

// Missing resource: 404 Not Found
app.get('/api/projects/:id', (req, res) => {
  const p = getProject(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.status(200).json(p);
});`,
            expectedOutput: 'Semantic status codes enabling automated client error handling'
          },
          pitfall: 'Confusing 401 Unauthorized (unauthenticated - server does not know who you are) with 403 Forbidden (authenticated, but user lacks permission to view the resource).',
          quickCheck: {
            question: 'What HTTP status code should be returned after successfully deleting a resource with no content returned?',
            options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
            correctIndex: 2,
            explanation: 'HTTP 204 No Content indicates that the action succeeded and there is no message body to return.'
          }
        },
        {
          id: 'fs-w3-d17-t4',
          topicNumber: 4,
          title: 'Nested Resources & Sub-Collections',
          explanation: [
            'When a resource belongs strictly to a parent resource (e.g. comments belonging to a post, or topics belonging to a day lesson), express this hierarchy naturally in the URL path.',
            'Example: `GET /api/courses/:courseId/weeks/:weekNum/days/:dayNum/topics`.'
          ],
          codeSnippet: {
            id: 'fs-t17-c4',
            title: 'Nested Sub-Resource Routing',
            description: 'Fetching reviews belonging to a specific course.',
            language: 'javascript',
            code: `// Nested endpoint retrieving reviews for a specific course
app.get('/api/courses/:courseId/reviews', (req, res) => {
  const { courseId } = req.params;
  const courseReviews = db.reviews.filter(r => r.courseId === courseId);
  res.json({ data: courseReviews, total: courseReviews.length });
});

// Adding a review to a specific course
app.post('/api/courses/:courseId/reviews', (req, res) => {
  const { courseId } = req.params;
  const newReview = { id: Date.now(), courseId, ...req.body };
  db.reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});`,
            expectedOutput: 'Hierarchical relationship cleanly expressed in URL routing'
          },
          pitfall: 'Avoid nesting resources deeper than 2 or 3 levels (e.g. `/users/1/orgs/2/teams/3/projects/4/tasks/5`). Use top-level endpoints `/tasks?projectId=4` for deeply nested records.',
          quickCheck: {
            question: 'Why should you avoid nesting URL endpoints deeper than 2 or 3 levels?',
            options: [
              'Because URLs become unwieldy, difficult to maintain, and over-couple parent-child relationships',
              'Because browsers reject URLs with more than 3 slashes',
              'Node does not support it',
              'It disables caching'
            ],
            correctIndex: 0,
            explanation: 'Excessively nested endpoints become difficult to query and maintain. Flatten deeply nested queries using query filters.'
          }
        },
        {
          id: 'fs-w3-d17-t5',
          topicNumber: 5,
          title: 'Pagination: Offset/Limit vs Cursor-Based Pagination',
          explanation: [
            'Returning 100,000 records in a single query exhausts memory and crashes browsers.',
            'Offset/Limit Pagination (`?page=2&limit=20`) uses SQL `OFFSET 20 LIMIT 20`. It is easy to implement but gets slow on large tables and skips/duplicates records when items are inserted concurrently.',
            'Cursor-Based Pagination (`?cursor=usr_109&limit=20`) uses indexed IDs (`WHERE id > cursor LIMIT 20`), providing O(1) speed and real-time stability.'
          ],
          codeSnippet: {
            id: 'fs-t17-c5',
            title: 'Offset & Limit Pagination Implementation',
            description: 'Calculating pages, total count, and slicing datasets.',
            language: 'javascript',
            code: `app.get('/api/lessons', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;

  const totalItems = allLessons.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedData = allLessons.slice(offset, offset + limit);

  res.json({
    data: paginatedData,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
});`,
            expectedOutput: 'Paginated response metadata allowing client-side page controls'
          },
          pitfall: 'Always clamp the maximum `limit` with `Math.min(50, limit)` to prevent malicious users from requesting `?limit=1000000` to DDoS your database.',
          quickCheck: {
            question: 'Why should you always cap the maximum limit parameter in paginated endpoints?',
            options: [
              'To prevent malicious or accidental requests from pulling millions of rows and exhausting server RAM',
              'SQL requires it',
              'Browsers can only display 10 rows',
              'To save CSS space'
            ],
            correctIndex: 0,
            explanation: 'Enforcing a maximum limit prevents clients from causing memory exhaustion and database lockups.'
          }
        },
        {
          id: 'fs-w3-d17-t6',
          topicNumber: 6,
          title: 'Filtering, Sorting & Field Selection',
          explanation: [
            'Production APIs empower clients to specify sorting order (`?sort=createdAt:desc`), filters (`?status=active`), and field selection (`?fields=id,name`).',
            'This reduces payload size across mobile networks.'
          ],
          codeSnippet: {
            id: 'fs-t17-c6',
            title: 'Dynamic Filtering and Sorting Query Handler',
            description: 'Filtering in-memory or database records by query parameters.',
            language: 'javascript',
            code: `app.get('/api/students', (req, res) => {
  let results = [...allStudents];
  const { track, sort } = req.query;

  // 1. Filter
  if (track) {
    results = results.filter(s => s.track.toLowerCase() === track.toLowerCase());
  }

  // 2. Sort
  if (sort === 'name:asc') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'score:desc') {
    results.sort((a, b) => b.score - a.score);
  }

  res.json({ count: results.length, data: results });
});`,
            expectedOutput: 'Filtered and sorted dataset delivered matching client parameters'
          },
          pitfall: 'Never pass raw un-sanitized client `sort` strings directly into SQL queries (`ORDER BY ${req.query.sort}`) to prevent SQL injection vulnerabilities.',
          quickCheck: {
            question: 'What is the risk of interpolating req.query.sort directly into a raw SQL query string?',
            options: ['SQL Injection vulnerability', 'Slow CSS', 'CORS error', '404 error'],
            correctIndex: 0,
            explanation: 'Directly interpolating user input into SQL statements opens severe SQL injection attack vectors.'
          }
        },
        {
          id: 'fs-w3-d17-t7',
          topicNumber: 7,
          title: 'HTTP Caching Headers: ETag, Cache-Control & 304 Not Modified',
          explanation: [
            'High-performance APIs leverage HTTP caching to reduce server load.',
            '`Cache-Control: max-age=3600` instructs clients to reuse cached responses for 1 hour.',
            '`ETag` generates an MD5 hash of the response. If the client sends `If-None-Match: <hash>`, Express returns `304 Not Modified` with zero response body, saving 99% of bandwidth.'
          ],
          codeSnippet: {
            id: 'fs-t17-c7',
            title: 'Setting Cache Headers in Express',
            description: 'Configuring Cache-Control and verifying ETag.',
            language: 'javascript',
            code: `app.get('/api/course-catalog', (req, res) => {
  // Instruct client and CDN to cache response for 10 minutes
  res.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
  
  // Express automatically computes and attaches ETag header!
  res.json(staticCourseCatalog);
});`,
            expectedOutput: 'HTTP/1.1 200 OK with ETag and Cache-Control headers attached'
          },
          pitfall: 'Never cache private, user-specific data (like profile details or credit cards) in public shared proxies. Use `Cache-Control: private, no-store`.',
          quickCheck: {
            question: 'What HTTP status code is returned when a client sends an ETag matching the server content (content unchanged)?',
            options: ['200 OK', '304 Not Modified', '204 No Content', '404 Not Found'],
            correctIndex: 1,
            explanation: '304 Not Modified informs the browser that its cached copy is fresh and no data needs to be transferred.'
          }
        },
        {
          id: 'fs-w3-d17-t8',
          topicNumber: 8,
          title: 'API Versioning Strategies (URI, Header, and Query)',
          explanation: [
            'As APIs evolve, breaking changes (removing fields, renaming keys) will break existing mobile and web clients in production.',
            'Versioning provides backwards compatibility. The industry standard is URI versioning: `/api/v1/courses` and `/api/v2/courses`.'
          ],
          codeSnippet: {
            id: 'fs-t17-c8',
            title: 'URI-Based API Versioning Architecture',
            description: 'Mounting v1 and v2 routers simultaneously.',
            language: 'javascript',
            code: `import v1Router from './routes/v1/index.js';
import v2Router from './routes/v2/index.js';

// Both versions run concurrently in production!
app.use('/api/v1', v1Router); // Legacy clients continue functioning
app.use('/api/v2', v2Router); // Upgraded modern clients leverage new schema`,
            expectedOutput: 'Concurrently supports legacy and modern clients without breaking changes'
          },
          pitfall: 'Do not create breaking changes on unversioned `/api` routes; existing mobile apps will crash until users update from the app store.',
          quickCheck: {
            question: 'What is the most common and visible API versioning strategy adopted by public APIs (like Stripe, GitHub)?',
            options: [
              'URI Path Versioning (e.g. /api/v1/...)',
              'Subdomain per git commit',
              'Renaming the company',
              'Deleting the old server'
            ],
            correctIndex: 0,
            explanation: 'URI Path Versioning (/api/v1/...) is explicit, easily routed by API gateways, and transparent to developers.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete Paginated REST Resource with Full CRUD',
        instructions: [
          'Build an Express CRUD router for /api/v1/articles.',
          'Implement GET with offset/limit pagination, POST (201), PATCH (partial update), and DELETE (204).',
          'Ensure 404 is returned if article ID does not exist.'
        ],
        starterCode: `// Write complete paginated articles REST router`,
        solutionCode: `import { Router } from 'express';
const router = Router();

let articles = [
  { id: 1, title: 'Introduction to Node.js', category: 'backend' },
  { id: 2, title: 'Mastering React Hooks', category: 'frontend' }
];

// GET Paginated
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  res.json({
    data: articles.slice(offset, offset + limit),
    pagination: { page, limit, total: articles.length }
  });
});

// POST
router.post('/', (req, res) => {
  const newArticle = { id: Date.now(), ...req.body };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// PATCH
router.patch('/:id', (req, res) => {
  const article = articles.find(a => a.id === Number(req.params.id));
  if (!article) return res.status(404).json({ error: 'Article not found' });
  Object.assign(article, req.body);
  res.json(article);
});

// DELETE
router.delete('/:id', (req, res) => {
  articles = articles.filter(a => a.id !== Number(req.params.id));
  res.status(204).send();
});

export default router;`,
        hints: [
          'Return 201 on POST and 204 on DELETE.',
          'Use Number(req.params.id) for matching numeric IDs.'
        ]
      },
      keyTakeaways: [
        'REST uses nouns in plural for resources and HTTP verbs for actions.',
        'PUT replaces the entire resource; PATCH applies partial modifications.',
        'Always implement pagination with capped limits to protect server resources.'
      ]
    },
    {
      id: 'fs-w3-d18',
      dayNumber: 18,
      weekNumber: 3,
      title: 'Request Validation & Error Handling with Zod Schemas',
      subtitle: 'Schema validation, type inference, sanitize inputs, and robust error formatting',
      durationMinutes: 50,
      overview:
        'Protect your backend from malformed and malicious payloads. Learn schema-based validation using Zod: declaring validation rules, inferring static TypeScript types, creating validation middleware, and returning clear error messages.',
      topics: [
        {
          id: 'fs-w3-d18-t1',
          topicNumber: 1,
          title: 'Why Schema Validation is Critical: Never Trust User Input',
          explanation: [
            'All input received from HTTP requests (headers, query params, request bodies) is untrusted user input.',
            'Without strict validation, missing fields cause unhandled exceptions, malformed emails corrupt databases, and injected payloads cause NoSQL/SQL injections.',
            'Schema validation guarantees data adheres to exact types and constraints before business logic runs.'
          ],
          codeSnippet: {
            id: 'fs-t18-c1',
            title: 'Vulnerable Manual Checking vs Schema Validation',
            description: 'Why manual if checks fail compared to declarative schemas.',
            language: 'javascript',
            code: `// FRAGILE (Manual Checking):
// if (!req.body.email || typeof req.body.email !== 'string') ...
// Misses email format, min lengths, extraneous unexpected properties!

// BULLETPROOF (Schema Validation with Zod):
// Ensures email is a valid RFC format, password >= 8 chars, strips unknown fields automatically!`,
            expectedOutput: 'Declarative schemas enforce exhaustive data contracts'
          },
          pitfall: 'Do not rely solely on frontend React validation. Anyone can bypass frontend forms using curl, Postman, or automated scripts.',
          quickCheck: {
            question: 'Why must input validation always be enforced on the backend server even if frontend forms already validate input?',
            options: [
              'Because frontend validation can be easily bypassed by sending direct HTTP requests using curl or API clients',
              'To make the app slower',
              'Because browsers block frontend validation',
              'To satisfy HTML5 standards'
            ],
            correctIndex: 0,
            explanation: 'Attackers can bypass browser UI controls completely; the backend server is the true boundary of trust.'
          }
        },
        {
          id: 'fs-w3-d18-t2',
          topicNumber: 2,
          title: 'Introduction to Zod: Declaring Primitives & Objects',
          explanation: [
            'Zod is a TypeScript-first schema declaration and validation library.',
            'You declare schemas using chained methods: `z.string().email()`, `z.number().int().min(1)`, `z.enum(["admin", "user"])`.',
            'Zod validates at runtime and parses data safely.'
          ],
          codeSnippet: {
            id: 'fs-t18-c2',
            title: 'Declaring a Zod User Registration Schema',
            description: 'Validating email, password strength, and optional fields.',
            language: 'typescript',
            code: `// import { z } from 'zod';

// Simulating Zod schema structure
const RegisterSchema = {
  parse: (input: any) => {
    if (!input.email || !input.email.includes('@')) throw new Error('Invalid email format');
    if (!input.password || input.password.length < 8) throw new Error('Password must be at least 8 characters');
    return {
      email: input.email.toLowerCase().trim(),
      password: input.password,
      role: input.role || 'student'
    };
  }
};

const validated = RegisterSchema.parse({ email: 'ALEX@DEV.IO', password: 'secure_password_123' });
console.log('Sanitized email:', validated.email);`,
            expectedOutput: 'Sanitized email: alex@dev.io'
          },
          pitfall: '`schema.parse()` throws an exception on failure. Use `schema.safeParse()` if you prefer receiving a `{ success: true, data } | { success: false, error }` result object without try/catch.',
          quickCheck: {
            question: 'What is the return difference between schema.parse() and schema.safeParse() in Zod?',
            options: [
              'parse() returns a boolean; safeParse() returns a string',
              'parse() throws a ZodError on failure; safeParse() returns a { success, data/error } result object without throwing',
              'There is no difference',
              'safeParse() requires a database'
            ],
            correctIndex: 1,
            explanation: 'safeParse returns an object with a success boolean and the data or error, avoiding exceptions.'
          }
        },
        {
          id: 'fs-w3-d18-t3',
          topicNumber: 3,
          title: 'Static Type Inference with z.infer<typeof Schema>',
          explanation: [
            'In traditional development, you have to write a TypeScript interface AND write validation logic separately. When you change one, they fall out of sync.',
            'Zod eliminates duplication: define the schema once, and use `type User = z.infer<typeof UserSchema>` to infer the exact static TypeScript type automatically.'
          ],
          codeSnippet: {
            id: 'fs-t18-c3',
            title: 'Inferring TypeScript Types from Zod Schemas',
            description: 'Single source of truth for runtime validation and static types.',
            language: 'typescript',
            code: `// import { z } from 'zod';

// const StudentInputSchema = z.object({
//   name: z.string().min(2, 'Name too short'),
//   age: z.number().int().min(18),
//   track: z.enum(['python', 'fullstack']),
// });

// Infer the TypeScript type automatically!
// type StudentInput = z.infer<typeof StudentInputSchema>;

// Now StudentInput is statically guaranteed to match StudentInputSchema!`
            ,
            expectedOutput: 'Single source of truth for runtime validation and static compile types'
          },
          pitfall: 'Writing separate TypeScript interfaces that duplicate Zod schemas creates maintenance overhead; always derive types using `z.infer`.'
          ,
          quickCheck: {
            question: 'What does z.infer<typeof Schema> do in TypeScript?',
            options: [
              'Generates a SQL table',
              'Infers the TypeScript type definition directly from the runtime Zod schema',
              'Validates cookies',
              'Formats strings'
            ],
            correctIndex: 1,
            explanation: 'z.infer derives the static TypeScript type corresponding to the Zod validation schema.'
          }
        },
        {
          id: 'fs-w3-d18-t4',
          topicNumber: 4,
          title: 'Building a Reusable validateBody(schema) Express Middleware',
          explanation: [
            'Instead of calling validation manually in every route, create a reusable higher-order middleware `validateBody(schema)` that validates `req.body` before the controller runs.',
            'If validation fails, it immediately returns `400 Bad Request` with structured error messages.'
          ],
          codeSnippet: {
            id: 'fs-t18-c4',
            title: 'Generic Validation Middleware for Express',
            description: 'Reusable middleware intercepting and parsing request payloads.',
            language: 'typescript',
            code: `// Generic validate middleware factory
function validate(schema: any) {
  return (req: any, res: any, next: any) => {
    try {
      // safeParse or parse validates and transforms
      req.body = schema.parse(req.body);
      next(); // Advance to route handler with guaranteed valid req.body!
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: 'Validation Failed',
        details: err.errors || err.message
      });
    }
  };
}

// Route usage:
// app.post('/api/enroll', validate(EnrollmentSchema), enrollmentController);`,
            expectedOutput: 'Controller only executes when payload passes all schema rules'
          },
          pitfall: 'Remember to reassign `req.body = schema.parse(req.body)` so that any Zod transformations (like `.trim()`, `.toLowerCase()`, default values) are preserved.'
          ,
          quickCheck: {
            question: 'What HTTP status code should validation middleware return when a payload fails schema constraints?',
            options: ['200 OK', '400 Bad Request', '500 Internal Server Error', '301 Moved'],
            correctIndex: 1,
            explanation: '400 Bad Request indicates that the server cannot process the request due to client validation error.'
          }
        },
        {
          id: 'fs-w3-d18-t5',
          topicNumber: 5,
          title: 'Validating Query Parameters & URL Params with Zod',
          explanation: [
            'Express `req.query` and `req.params` always contain strings. For example, `?limit=10` yields string `"10"`.',
            'Zod `.coerce.number()` or `.transform(Number)` automatically coerces incoming string numbers into real JavaScript numbers during validation.'
          ],
          codeSnippet: {
            id: 'fs-t18-c5',
            title: 'Coercing Query Parameters with Zod',
            description: 'Coercing string query parameters to numbers safely.',
            language: 'typescript',
            code: `// import { z } from 'zod';

// const PaginationQuerySchema = z.object({
//   page: z.coerce.number().int().positive().default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
//   search: z.string().optional()
// });

// Input from req.query: { page: "2", limit: "25" }
// Parsed Output: { page: 2, limit: 25, search: undefined }`,
            expectedOutput: 'String numbers seamlessly converted into validated integers with defaults'
          },
          pitfall: 'Do not use `z.number()` directly on `req.query`; query params are always strings, so `z.number()` will fail. Use `z.coerce.number()`.'
          ,
          quickCheck: {
            question: 'Why is z.coerce.number() necessary when validating req.query parameters with Zod?',
            options: [
              'Because HTTP query parameters are always parsed as strings (e.g. "20"), and coerce converts them to numbers before validating',
              'Because Zod does not support numbers',
              'It is required by TypeScript',
              'For encryption'
            ],
            correctIndex: 0,
            explanation: 'Query parameters always arrive as strings; z.coerce converts the string to a number prior to validation.'
          }
        },
        {
          id: 'fs-w3-d18-t6',
          topicNumber: 6,
          title: 'Custom Refinements (.refine()) for Complex Cross-Field Rules',
          explanation: [
            'Sometimes validation rules span multiple fields (e.g. `password` must equal `confirmPassword`, or `startDate` must be before `endDate`).',
            'Zod `.refine()` allows writing custom validation predicates and attaching errors to specific field paths.'
          ],
          codeSnippet: {
            id: 'fs-t18-c6',
            title: 'Matching Passwords with Zod refine()',
            description: 'Cross-field password confirmation validation.',
            language: 'javascript',
            code: `// z.object({
//   password: z.string().min(8),
//   confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords must match",
//   path: ["confirmPassword"] // Attaches error indicator to confirmPassword field!
// });`,
            expectedOutput: 'Rejects requests where confirmPassword does not equal password'
          },
          pitfall: 'Forgetting to specify `path: ["confirmPassword"]` in `.refine()` will attach the error to the root object rather than the specific input field.'
          ,
          quickCheck: {
            question: 'What is Zod .refine() used for?',
            options: [
              'Styling CSS components',
              'Declaring custom validation logic, such as cross-field comparisons (e.g. password matching)',
              'Connecting to MongoDB',
              'Compiling React'
            ],
            correctIndex: 1,
            explanation: '.refine() allows developers to inject custom boolean logic and validation checks into Zod schemas.'
          }
        },
        {
          id: 'fs-w3-d18-t7',
          topicNumber: 7,
          title: 'Formatting Clean Error Responses for Frontend Forms',
          explanation: [
            'Raw Zod errors contain verbose internal metadata. For a great developer experience, transform Zod error arrays into clean key-value maps: `{ [field]: "Error message" }`.',
            'This allows React frontend form libraries (React Hook Form) to bind errors directly to form input fields.'
          ],
          codeSnippet: {
            id: 'fs-t18-c7',
            title: 'Flattening Zod Errors for UI Forms',
            description: 'Transforming issue arrays into clean field-to-message dictionaries.',
            language: 'javascript',
            code: `function formatZodErrors(zodError) {
  // zodError.flatten().fieldErrors transforms errors into { fieldName: ['Error 1', ...] }
  const fieldErrors = {};
  for (const issue of zodError.issues || []) {
    const field = issue.path.join('.') || 'root';
    if (!fieldErrors[field]) fieldErrors[field] = [];
    fieldErrors[field].push(issue.message);
  }
  return fieldErrors;
}

const mockIssues = { issues: [{ path: ['email'], message: 'Invalid email' }] };
console.log('Formatted field errors:', formatZodErrors(mockIssues));`,
            expectedOutput: 'Formatted field errors: { email: [ \'Invalid email\' ] }'
          },
          pitfall: 'Do not return unformatted stack traces or internal raw error objects to client browsers; keep error payloads consistent and clean.'
          ,
          quickCheck: {
            question: 'Why is formatting validation errors into field-to-message pairs advantageous for frontend clients?',
            options: [
              'It speeds up JavaScript',
              'It allows frontend forms to display error messages directly underneath each corresponding input field',
              'It disables CSS',
              'It saves database space'
            ],
            correctIndex: 1,
            explanation: 'Mapping errors by field name enables instant, precise field-level feedback in user interfaces.'
          }
        },
        {
          id: 'fs-w3-d18-t8',
          topicNumber: 8,
          title: 'Stripping Unknown Properties & Preventing Parameter Tampering',
          explanation: [
            'By default, if an attacker sends extra malicious properties (like `{ role: "admin", isVerified: true }`), un-strict parsers might pass them to the database (Mass Assignment vulnerability).',
            'Zod `.strict()` rejects unexpected keys, or Zod standard `.strip()` automatically deletes unspecified properties, neutralizing mass assignment attacks.'
          ],
          codeSnippet: {
            id: 'fs-t18-c8',
            title: 'Neutralizing Mass Assignment Attacks',
            description: 'Stripping unexpected properties from request payloads.',
            language: 'javascript',
            code: `// Attacker sends extra privileged parameter: { name: 'Taylor', isAdmin: true }
// UserSchema only defines 'name':
// const sanitized = UserSchema.parse(req.body);
// Output strictly contains: { name: 'Taylor' } -> 'isAdmin' is stripped!`,
            expectedOutput: 'Unauthorized fields silently removed before database insertion'
          },
          pitfall: 'Passing raw `req.body` directly into database inserts (`db.users.create(req.body)`) is one of the most critical vulnerabilities in web applications. Always validate and sanitize!'
          ,
          quickCheck: {
            question: 'What security vulnerability occurs when an application passes raw unvalidated req.body directly into a database update?',
            options: ['CSS Overlap', 'Mass Assignment / Parameter Tampering', '404 Error', 'DDoS'],
            correctIndex: 1,
            explanation: 'Mass Assignment occurs when attackers inject privileged fields (e.g. isAdmin: true) into unvalidated payloads.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Strict User Registration Validator with Zod',
        instructions: [
          'Create a validation function validating email (valid email), username (alphanumeric 3-16 chars), and password (min 8 chars).',
          'Reject unexpected fields.',
          'Format and return clean errors on failure.'
        ],
        starterCode: `function validateRegistration(payload) {
  // Implement validation
}`,
        solutionCode: `function validateRegistration(payload) {
  const errors = {};
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = 'Valid email is required';
  }
  if (!payload.username || payload.username.length < 3 || payload.username.length > 16) {
    errors.username = 'Username must be between 3 and 16 characters';
  }
  if (!payload.password || payload.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      email: payload.email.toLowerCase().trim(),
      username: payload.username.trim(),
      password: payload.password
    }
  };
}

console.log(validateRegistration({ email: 'bad-email', username: 'al', password: '123' }));`,
        hints: [
          'Validate each field and collect descriptive messages into an errors object.',
          'Return sanitized data on success.'
        ]
      },
      keyTakeaways: [
        'Never trust user input; always validate on the server side.',
        'Zod provides both runtime validation and inferred static TypeScript types.',
        'Sanitizing payloads prevents Mass Assignment attacks and parameter tampering.'
      ]
    },
    {
      id: 'fs-w3-d19',
      dayNumber: 19,
      weekNumber: 3,
      title: 'User Authentication: Password Hashing (bcrypt) & JWT Architecture',
      subtitle: 'Salting, bcrypt hashing, JSON Web Token issuance, verification, and HTTP-only cookies',
      durationMinutes: 55,
      overview:
        'Implement production-grade authentication from scratch. Understand why passwords must never be stored in plaintext, how adaptive hashing with bcrypt and salt works, how JSON Web Tokens (JWT) are signed and verified, and how to store tokens securely in HTTP-only cookies.',
      topics: [
        {
          id: 'fs-w3-d19-t1',
          topicNumber: 1,
          title: 'Why Passwords Must Never Be Stored Plaintext: The bcrypt Standard',
          explanation: [
            'Storing passwords in plaintext or using fast general-purpose hashes (MD5, SHA-256) is catastrophic: GPU rigs can calculate billions of MD5 hashes per second, cracking passwords via rainbow tables.',
            'bcrypt is an adaptive, computationally expensive password-hashing algorithm designed to be slow. It automatically generates a unique random Salt (defeating rainbow tables) and uses a configurable Work Factor (cost) that can be increased over time as CPUs get faster.'
          ],
          codeSnippet: {
            id: 'fs-t19-c1',
            title: 'Hashing and Verifying Passwords with bcrypt',
            description: 'Salting and comparing passwords securely.',
            language: 'javascript',
            code: `// import bcrypt from 'bcrypt';

// Simulating bcrypt hash and comparison workflow
async function simulateAuth() {
  const plainPassword = 'SuperSecretPassword!2026';
  const saltRounds = 12; // Standard industry cost factor

  console.log('Generating salt and hashing password...');
  // $2b$12$... indicates bcrypt version and 12 cost factor rounds
  const simulatedHash = '$2b$12$e8k...simulated_secure_hash_string';

  // Verifying password on login:
  const isMatch = (plainPassword === 'SuperSecretPassword!2026');
  console.log('Password verified successfully:', isMatch);
}

simulateAuth();`,
            expectedOutput: 'Generating salt and hashing password...\nPassword verified successfully: true'
          },
          pitfall: 'Never use MD5 or plain SHA-256 for passwords. Always use slow, salted cryptographic functions: bcrypt, Argon2, or scrypt.',
          quickCheck: {
            question: 'Why is bcrypt preferred over SHA-256 for password hashing?',
            options: [
              'bcrypt is faster',
              'bcrypt is intentionally slow and adaptive with built-in salting, making brute-force dictionary attacks computationally infeasible',
              'bcrypt is for numbers only',
              'SHA-256 is deprecated by browsers'
            ],
            correctIndex: 1,
            explanation: 'bcrypt slow adaptive work factor protects against GPU-accelerated brute-force and rainbow table attacks.'
          }
        },
        {
          id: 'fs-w3-d19-t2',
          topicNumber: 2,
          title: 'Session-Based Authentication vs Token-Based Authentication (JWT)',
          explanation: [
            'Session-Based Auth: server creates a session in memory/Redis and sends a Session ID cookie. The server must query session storage on every single request, complicating horizontal scaling across multiple servers.',
            'Token-Based Auth (JWT): server signs a stateless token containing user claims and returns it to the client. The server verifies the cryptographic signature without querying a session store, enabling effortless horizontal scaling.'
          ],
          codeSnippet: {
            id: 'fs-t19-c2',
            title: 'Comparing Sessions vs Stateless JWTs',
            description: 'Architectural trade-offs of stateful sessions vs stateless tokens.',
            language: 'bash',
            code: `# SESSION AUTH:
# Client -> Server: Sends Cookie with sessionId: "sess_9021"
# Server -> Redis: "SELECT * FROM sessions WHERE id = 'sess_9021'" (Stateful DB read on every request!)

# JWT AUTH:
# Client -> Server: Sends Header "Authorization: Bearer <jwt_token>"
# Server: Verifies cryptographic signature using HMAC/RSA secret key (Zero database queries required!)`,
            expectedOutput: 'Stateless verification allows effortless multi-server scaling'
          },
          pitfall: 'Stateless JWTs cannot be revoked easily before they expire. Keep access token lifespans short (15 minutes) and pair with refresh tokens.',
          quickCheck: {
            question: 'What is a major architectural advantage of stateless JWT authentication over server-side session stores?',
            options: [
              'Tokens can be verified cryptographically without querying a central session database on every request',
              'Tokens never expire',
              'Tokens encrypt the entire database',
              'Tokens eliminate HTTPS'
            ],
            correctIndex: 0,
            explanation: 'Stateless JWT verification eliminates database session lookups, allowing distributed servers to verify requests independently.'
          }
        },
        {
          id: 'fs-w3-d19-t3',
          topicNumber: 3,
          title: 'The Anatomy of a JSON Web Token (Header, Payload, Signature)',
          explanation: [
            'A JWT consists of three Base64URL-encoded strings separated by dots: `Header.Payload.Signature`.',
            '1) Header: algorithm and token type (`{ "alg": "HS256", "typ": "JWT" }`).',
            '2) Payload: claims/data (`{ "userId": "usr_42", "role": "admin", "exp": 1770000000 }`).',
            '3) Signature: cryptographic hash of (Header + Payload) signed with the server private secret key.'
          ],
          codeSnippet: {
            id: 'fs-t19-c3',
            title: 'Inspecting JWT Structure',
            description: 'Deconstructing the 3 segments of a JWT.',
            language: 'javascript',
            code: `// Example JWT token structure:
const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXgiLCJyb2xlIjoiYWRtaW4ifQ.simulated_signature_segment';

const [headerBase64, payloadBase64, signature] = sampleJWT.split('.');

// Base64URL decode payload
const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
console.log('Decoded Claims:', decodedPayload.name, 'Role:', decodedPayload.role);`,
            expectedOutput: 'Decoded Claims: Alex Role: admin'
          },
          pitfall: 'JWT payloads are only Base64-encoded, NOT encrypted! Anyone can decode and read the payload. Never store sensitive passwords or credit card numbers inside a JWT payload.',
          quickCheck: {
            question: 'Is the payload of a standard signed JWT encrypted or readable by anyone who has the token?',
            options: [
              'It is encrypted with military-grade encryption',
              'It is merely Base64-encoded and can be read by anyone; the signature only prevents tampering, it does not hide data',
              'It can only be read on Linux',
              'It is completely blank'
            ],
            correctIndex: 1,
            explanation: 'Standard JWTs are signed, not encrypted. The signature verifies authenticity, but the payload data is visible to anyone.'
          }
        },
        {
          id: 'fs-w3-d19-t4',
          topicNumber: 4,
          title: 'Issuing JWTs: jwt.sign() with Expiration (exp)',
          explanation: [
            'Use `jsonwebtoken.sign(payload, secret, { expiresIn: "15m" })` to generate signed tokens.',
            'Always set an explicit expiration time (`exp` claim) to limit the damage window if a token is ever intercepted.'
          ],
          codeSnippet: {
            id: 'fs-t19-c4',
            title: 'Signing JWTs upon Successful Login',
            description: 'Generating access token with 15-minute expiration.',
            language: 'javascript',
            code: `// import jwt from 'jsonwebtoken';

function issueAccessToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_signing_key_2026';
  
  // Sign token with 15-minute expiration
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  return 'Bearer eyJhbGciOi...simulated_signed_token';
}

console.log(issueAccessToken({ id: 'usr-1', email: 'alex@dev.io', role: 'admin' }));`,
            expectedOutput: 'Bearer eyJhbGciOi...simulated_signed_token'
          },
          pitfall: 'Never use weak secrets like `"secret"` or `"123456"`; attackers can brute-force the HMAC key offline and forge arbitrary administrator tokens. Use at least 256 bits of high entropy.',
          quickCheck: {
            question: 'What is the recommended lifespan for stateless JWT access tokens in production?',
            options: ['10 years', '15 to 30 minutes', 'Never expire', '1 millisecond'],
            correctIndex: 1,
            explanation: 'Short token lifespans (15-30 minutes) mitigate security risks if a token is intercepted.'
          }
        },
        {
          id: 'fs-w3-d19-t5',
          topicNumber: 5,
          title: 'Verifying JWTs in Express Authentication Middleware',
          explanation: [
            'Protected endpoints require an `authenticateToken` middleware that checks the incoming `Authorization: Bearer <token>` header.',
            'If the signature is valid and not expired, the middleware attaches the decoded user payload to `req.user` and calls `next()`. If invalid or expired, it returns `401 Unauthorized`.'
          ],
          codeSnippet: {
            id: 'fs-t19-c5',
            title: 'The authenticateToken Middleware Pattern',
            description: 'Extracting Bearer token and verifying cryptographic signature.',
            language: 'javascript',
            code: `function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or malformed' });
  }

  try {
    // const user = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = user; // Attach authenticated identity to request object
    req.user = { userId: 'usr-42', role: 'admin' };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token is invalid or expired' });
  }
}`,
            expectedOutput: 'Attaches authenticated identity to req.user before controller executes'
          },
          pitfall: 'Check that `Authorization` starts with `"Bearer "`; clients frequently forget the prefix or send raw strings.',
          quickCheck: {
            question: 'What HTTP header is standard for transmitting JWT access tokens from client to server?',
            options: ['Content-Type', 'Authorization: Bearer <token>', 'User-Agent', 'Accept-Encoding'],
            correctIndex: 1,
            explanation: 'The standard HTTP authorization header format is "Authorization: Bearer <token>".'
          }
        },
        {
          id: 'fs-w3-d19-t6',
          topicNumber: 6,
          title: 'Storing Tokens: LocalStorage vs HTTP-Only Cookies',
          explanation: [
            'Storing JWTs in browser `localStorage` exposes them to Cross-Site Scripting (XSS) attacks: any rogue third-party script or npm dependency can execute `localStorage.getItem("token")` and exfiltrate credentials.',
            'Storing tokens in `httpOnly, secure, sameSite=lax` cookies protects tokens: JavaScript running in the browser CANNOT access HTTP-only cookies, neutralizing XSS credential theft.'
          ],
          codeSnippet: {
            id: 'fs-t19-c6',
            title: 'Setting Secure HTTP-Only Cookie in Express',
            description: 'Transmitting authentication cookie safely to browser.',
            language: 'javascript',
            code: `app.post('/api/auth/login', async (req, res) => {
  // Validate credentials and issue token
  const token = 'simulated_jwt_token';

  // Set secure HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript access (Defeats XSS!)
    secure: process.env.NODE_ENV === 'production', // Transmitted over HTTPS only
    sameSite: 'lax', // Protects against Cross-Site Request Forgery (CSRF)
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.json({ success: true, message: 'Logged in successfully' });
});`,
            expectedOutput: 'Set-Cookie header transmitted with httpOnly and secure flags'
          },
          pitfall: 'Setting `httpOnly: true` means frontend React code cannot read the cookie string directly; this is intentional and is what keeps the token secure.',
          quickCheck: {
            question: 'Why are HTTP-Only cookies safer than localStorage for storing authentication tokens?',
            options: [
              'Because HTTP-Only cookies cannot be read or stolen by malicious JavaScript running in the page (mitigating XSS)',
              'Cookies are faster than memory',
              'Cookies have no expiration',
              'localStorage is deprecated'
            ],
            correctIndex: 0,
            explanation: 'The httpOnly flag instructs browsers that client scripts cannot access the cookie, preventing credential theft via XSS.'
          }
        },
        {
          id: 'fs-w3-d19-t7',
          topicNumber: 7,
          title: 'Refresh Tokens & Silent Token Rotation',
          explanation: [
            'To balance security and user convenience, modern systems use two tokens: a short-lived Access Token (15 min) and a long-lived Refresh Token (7 days).',
            'When the access token expires, the client calls `/api/auth/refresh`. The server validates the refresh token in the database, invalidates it (Token Rotation), and issues a fresh pair.'
          ],
          codeSnippet: {
            id: 'fs-t19-c7',
            title: 'Refresh Token Rotation Architecture',
            description: 'Issuing fresh access token and rotating refresh token.',
            language: 'javascript',
            code: `app.post('/api/auth/refresh', async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) return res.status(401).send();

  // 1. Verify refresh token in DB
  // 2. Rotate: delete old refresh token, generate new refresh token
  // 3. Issue fresh 15-minute access token
  res.json({
    accessToken: 'new_fresh_access_token_15m',
    expiresIn: 900
  });
});`,
            expectedOutput: 'Seamless session maintenance without forcing user to re-enter password'
          },
          pitfall: 'Always revoke and delete the old refresh token upon rotation; if a compromised refresh token is used twice, revoke the entire session family immediately (reuse detection).'
          ,
          quickCheck: {
            question: 'What is the purpose of Refresh Token Rotation?',
            options: [
              'It encrypts passwords',
              'It replaces the refresh token with a new one upon every use, detecting token theft and unauthorized reuse',
              'It deletes database records',
              'It speeds up CSS rendering'
            ],
            correctIndex: 1,
            explanation: 'Token rotation invalidates old refresh tokens upon use, allowing systems to detect replay attacks and compromise.'
          }
        },
        {
          id: 'fs-w3-d19-t8',
          topicNumber: 8,
          title: 'Logging Out & Token Invalidation',
          explanation: [
            'Because JWTs are stateless, "logging out" on the client merely involves deleting the stored token or clearing the HTTP-only cookie (`res.clearCookie("token")`).',
            'For high-security systems, maintain a Redis token blocklist or increment a `tokenVersion` integer on the user database record to invalidate all tokens issued prior to logout.'
          ],
          codeSnippet: {
            id: 'fs-t19-c8',
            title: 'Clearing Authentication Cookies on Logout',
            description: 'Purging auth cookies from browser.',
            language: 'javascript',
            code: `app.post('/api/auth/logout', (req, res) => {
  // Clear the HTTP-only auth cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  res.json({ success: true, message: 'Logged out successfully' });
});`,
            expectedOutput: 'Set-Cookie header expires cookie immediately, completing user logout'
          },
          pitfall: 'Merely deleting the token in the React frontend does not stop an attacker who already stolen the token from using it until its `exp` expires. Use short expirations!'
          ,
          quickCheck: {
            question: 'How do you immediately invalidate all active JWTs for a user whose password was changed or compromised?',
            options: [
              'Delete the database',
              'Increment a tokenVersion integer on the user record and verify it in the auth middleware',
              'Restart the server',
              'Change the port'
            ],
            correctIndex: 1,
            explanation: 'Tracking a tokenVersion allows invalidating all previously issued tokens instantaneously on password reset.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Complete JWT Login and Authentication Guard',
        instructions: [
          'Create a mock user database with hashed passwords.',
          'Build a POST /login endpoint that verifies passwords and issues a signed JWT.',
          'Build an authenticateToken middleware checking Authorization header.',
          'Protect a GET /api/me profile endpoint.'
        ],
        starterCode: `// Write login endpoint and authentication middleware`,
        solutionCode: `import express from 'express';
const app = express();
app.use(express.json());

const users = [
  { id: 'u1', email: 'alex@dev.io', passwordPlain: 'pass1234', role: 'student' }
];

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.passwordPlain === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  // In production: jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '15m' })
  const token = \`mock_jwt_for_\${user.id}_\${user.role}\`;
  res.json({ success: true, token });
});

// Guard Middleware
function authGuard(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = auth.split(' ')[1];
  req.user = { id: 'u1', role: 'student' }; // Decoded token
  next();
}

app.get('/api/me', authGuard, (req, res) => {
  res.json({ user: req.user });
});`,
        hints: [
          'Check for Bearer prefix in Authorization header.',
          'Return 401 when token is missing.'
        ]
      },
      keyTakeaways: [
        'Never store plaintext passwords; use slow adaptive bcrypt with high cost factors.',
        'JWTs contain Base64 claims verified by cryptographic signatures, enabling stateless horizontal scaling.',
        'Store authentication tokens in secure, HTTP-only cookies to eliminate XSS token theft.'
      ]
    },
    {
      id: 'fs-w3-d20',
      dayNumber: 20,
      weekNumber: 3,
      title: 'Authorization & API Security: RBAC, CORS, Helmet & Rate Limiting',
      subtitle: 'Role-based access control, cross-origin resource sharing, security headers, and DDoS defense',
      durationMinutes: 50,
      overview:
        'Harden your backend against common attack vectors. Implement Role-Based Access Control (RBAC), configure Cross-Origin Resource Sharing (CORS) correctly, apply HTTP security headers with Helmet, prevent brute-force attacks with rate limiting, and protect against injection attacks.',
      topics: [
        {
          id: 'fs-w3-d20-t1',
          topicNumber: 1,
          title: 'Authentication vs Authorization: Who You Are vs What You Can Do',
          explanation: [
            'Authentication (AuthN) verifies identity: "Who are you?" (e.g. logging in with email and password to prove you are Devon).',
            'Authorization (AuthZ) verifies permissions: "What actions are you allowed to perform?" (e.g. Can Devon delete another student account? Can Devon publish a new course?).'
          ],
          codeSnippet: {
            id: 'fs-t20-c1',
            title: 'Authentication vs Authorization in Middleware Chain',
            description: 'Sequential execution: authenticate identity first, then authorize role.',
            language: 'javascript',
            code: `// 1. Authenticate Identity (401 Unauthorized if unauthenticated)
// 2. Authorize Role (403 Forbidden if wrong permissions)
app.delete(
  '/api/courses/:id',
  authenticateUser,             // AuthN: Verifies token and sets req.user
  requireRole(['admin', 'lead']), // AuthZ: Checks req.user.role has permission
  deleteCourseController
);`,
            expectedOutput: 'Strict separation of identity verification and permission checks'
          },
          pitfall: 'Do not combine authentication and role checking in a single messy function. Keep them as distinct, composable middleware steps.',
          quickCheck: {
            question: 'What is the distinction between 401 Unauthorized and 403 Forbidden status codes?',
            options: [
              '401 means the client is unauthenticated (missing/invalid login); 403 means the client is authenticated but lacks permission for this resource',
              'They are completely identical',
              '403 means database is down',
              '401 is only for CSS'
            ],
            correctIndex: 0,
            explanation: '401 Unauthorized indicates unauthenticated identity; 403 Forbidden indicates insufficient privileges.'
          }
        },
        {
          id: 'fs-w3-d20-t2',
          topicNumber: 2,
          title: 'Role-Based Access Control (RBAC) Middleware',
          explanation: [
            'RBAC restricts system access based on user roles (e.g. `student`, `instructor`, `admin`).',
            'Create a higher-order middleware factory `requireRole(allowedRoles)` that inspects `req.user.role` and returns `403 Forbidden` if unauthorized.'
          ],
          codeSnippet: {
            id: 'fs-t20-c2',
            title: 'Role-Based Access Control Middleware Factory',
            description: 'Enforcing role constraints on sensitive administrative routes.',
            language: 'typescript',
            code: `function requireRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: \`Forbidden: Role '\${req.user.role}' lacks sufficient privileges.\`
      });
    }

    next(); // Authorized!
  };
}`,
            expectedOutput: 'Blocks non-admin users with clean 403 Forbidden response'
          },
          pitfall: 'Never trust role strings sent from the client in the request body (`req.body.role`); always read the role from the cryptographically verified JWT payload (`req.user.role`).',
          quickCheck: {
            question: 'Where should the user role be read from during authorization checks?',
            options: [
              'req.body.role sent from form input',
              'The cryptographically verified req.user object populated by the JWT authentication middleware',
              'URL query parameter ?role=admin',
              'User-Agent header'
            ],
            correctIndex: 1,
            explanation: 'Roles must only be derived from trusted, verified tokens or server database records, never untrusted client payloads.'
          }
        },
        {
          id: 'fs-w3-d20-t3',
          topicNumber: 3,
          title: 'Cross-Origin Resource Sharing (CORS): The Preflight OPTIONS Request',
          explanation: [
            'Browsers enforce the Same-Origin Policy: frontend JavaScript at `https://myapp.com` cannot read responses from `https://api.myapp.com` unless the API explicitly sends CORS headers.',
            'For non-simple requests (JSON POST/PUT/DELETE or custom headers), browsers first dispatch an HTTP `OPTIONS` Preflight request to ask permission before sending the real request.'
          ],
          codeSnippet: {
            id: 'fs-t20-c3',
            title: 'Configuring Secure CORS in Express',
            description: 'Whitelisting trusted origins and allowed HTTP methods.',
            language: 'javascript',
            code: `import cors from 'cors';

const allowedOrigins = ['http://localhost:5173', 'https://academy.io'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or whitelisted client origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true // Crucial: allows browser to send HTTP-only auth cookies!
}));`,
            expectedOutput: 'Access-Control-Allow-Origin header attached for approved domains'
          },
          pitfall: 'Setting `origin: "*"` while also setting `credentials: true` will be rejected by browsers! Browsers forbid wildcard origins when credentials (cookies) are enabled.',
          quickCheck: {
            question: 'What is a CORS Preflight request?',
            options: [
              'An HTTP OPTIONS request sent automatically by the browser to verify permissions before executing the actual request',
              'A DNS query',
              'A database check',
              'A CSS file'
            ],
            correctIndex: 0,
            explanation: 'Browsers send an OPTIONS request to ask the server which origins and methods are permitted before sending complex requests.'
          }
        },
        {
          id: 'fs-w3-d20-t4',
          topicNumber: 4,
          title: 'Hardening HTTP Headers with Helmet.js',
          explanation: [
            'Helmet is a collection of 15 smaller middleware functions that set security-related HTTP response headers.',
            'It protects against Clickjacking (`X-Frame-Options: SAMEORIGIN`), MIME-sniffing (`X-Content-Type-Options: nosniff`), enforces HTTPS (`Strict-Transport-Security`), and configures Content Security Policy (CSP).'
          ],
          codeSnippet: {
            id: 'fs-t20-c4',
            title: 'Mounting Helmet Security Middleware',
            description: 'Setting 15 protective HTTP security headers with one line.',
            language: 'javascript',
            code: `import helmet from 'helmet';

// Mount helmet at top of middleware chain
app.use(helmet());

// Removes the revealing 'X-Powered-By: Express' header automatically,
// preventing attackers from fingerprinting the server framework!`
            ,
            expectedOutput: 'Secure HTTP headers attached to all outbound responses'
          },
          pitfall: 'Do not leak your technology stack. Helmet automatically strips `X-Powered-By: Express` so attackers cannot target version-specific vulnerabilities.',
          quickCheck: {
            question: 'What header does Helmet remove to prevent attackers from fingerprinting the server technology?',
            options: ['Content-Type', 'X-Powered-By', 'Host', 'Accept'],
            correctIndex: 1,
            explanation: 'X-Powered-By reveals the backend framework (e.g. Express); removing it prevents automated attacker scanning.'
          }
        },
        {
          id: 'fs-w3-d20-t5',
          topicNumber: 5,
          title: 'Rate Limiting & DDoS / Brute-Force Defense (express-rate-limit)',
          explanation: [
            'Without rate limiting, attackers can launch automated brute-force attacks against `/api/login` (testing 10,000 passwords per second) or spam resource-heavy endpoints to crash the server.',
            'Rate limiting tracks request IP addresses and restricts clients to a specified budget (e.g. maximum 5 login attempts per 15 minutes, returning `429 Too Many Requests`).'
          ],
          codeSnippet: {
            id: 'fs-t20-c5',
            title: 'Configuring Rate Limiter on Authentication Routes',
            description: 'Restricting brute force login attempts to 5 per 15 minutes.',
            language: 'javascript',
            code: `// import rateLimit from 'express-rate-limit';

// Stricter limiter for sensitive authentication endpoints
const authLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,    // Return rate limit info in RateLimit-* headers
  legacyHeaders: false
};

// app.use('/api/auth/login', rateLimit(authLimiter));`,
            expectedOutput: 'Returns HTTP 429 Too Many Requests when rate threshold exceeded'
          },
          pitfall: 'When deploying behind reverse proxies (Nginx, Cloudflare, Vercel), enable `app.set("trust proxy", 1)` so the rate limiter reads the real client IP from `X-Forwarded-For` rather than the proxy internal IP.',
          quickCheck: {
            question: 'What HTTP status code indicates that a client has exceeded their permitted request rate limit?',
            options: ['400 Bad Request', '429 Too Many Requests', '503 Service Unavailable', '404 Not Found'],
            correctIndex: 1,
            explanation: 'HTTP 429 Too Many Requests communicates that the user has sent too many requests in a given amount of time.'
          }
        },
        {
          id: 'fs-w3-d20-t6',
          topicNumber: 6,
          title: 'Preventing Injection Attacks: SQL Injection & NoSQL Injection',
          explanation: [
            'Injection occurs when untrusted user data is concatenated directly into database query commands.',
            'Never build queries via string concatenation: `SELECT * FROM users WHERE email = \x27${email}\x27`.',
            'Always use Parameterized Queries (Prepared Statements) or ORMs (Prisma, Drizzle), which treat user inputs strictly as literal values rather than executable SQL commands.'
          ],
          codeSnippet: {
            id: 'fs-t20-c6',
            title: 'Vulnerable vs Parameterized SQL Queries',
            description: 'Why parameterized placeholders neutralize SQL injection.',
            language: 'javascript',
            code: `// VULNERABLE TO SQL INJECTION (CRITICAL BUG):
// const query = \`SELECT * FROM users WHERE email = '\${email}' AND pass = '\${pass}'\`;
// Attacker sends: email = "admin' --" -> Bypasses password check completely!

// SAFE (Parameterized Prepared Query):
// const query = 'SELECT * FROM users WHERE email = $1';
// const user = await pool.query(query, [email]);
// The database engine treats $1 strictly as a literal string value!`
            ,
            expectedOutput: 'Database engine treats parameter strictly as data, making injection impossible'
          },
          pitfall: 'NoSQL databases (like MongoDB) are also vulnerable to operator injection (e.g. passing `{ "password": { "$ne": null } }`). Always validate types with Zod.'
          ,
          quickCheck: {
            question: 'How do Parameterized Queries prevent SQL injection attacks?',
            options: [
              'They encrypt the database',
              'They separate SQL code from data; the database treats parameterized inputs strictly as literal values, never as executable SQL commands',
              'They disable the network',
              'They use cookies'
            ],
            correctIndex: 1,
            explanation: 'Parameterized queries compile the query structure first, ensuring user input is interpreted solely as literal data.'
          }
        },
        {
          id: 'fs-w3-d20-t7',
          topicNumber: 7,
          title: 'Cross-Site Scripting (XSS) & Content Security Policy (CSP)',
          explanation: [
            'Cross-Site Scripting (XSS) occurs when an application includes untrusted data in a web page without proper escaping, allowing attackers to execute arbitrary JavaScript in victim browsers.',
            'Content Security Policy (CSP) is an HTTP header that specifies which domains are trusted sources for scripts, images, and styles, preventing malicious injected scripts from running.'
          ],
          codeSnippet: {
            id: 'fs-t20-c7',
            title: 'Content Security Policy (CSP) Header Configuration',
            description: 'Restricting executable script sources.',
            language: 'javascript',
            code: `// CSP Header Example:
// Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none';

// React automatically escapes strings rendered inside JSX {userInput},
// protecting against Reflected and Stored XSS by default!
// NEVER use dangerouslySetInnerHTML with untrusted user input!`
            ,
            expectedOutput: 'Browser rejects and blocks untrusted injected inline scripts'
          },
          pitfall: 'Never use React `dangerouslySetInnerHTML={{ __html: userInput }}` with unsanitized data; always sanitize with DOMPurify if HTML rendering is required.',
          quickCheck: {
            question: 'Why does React JSX protect against standard XSS attacks by default?',
            options: [
              'Because React automatically escapes all string expressions rendered inside curly braces { ... }',
              'Because React disables JavaScript',
              'Because React runs on the server only',
              'It does not protect against anything'
            ],
            correctIndex: 0,
            explanation: 'React treats strings inside JSX as safe text, automatically escaping HTML characters (<, >, &, ") before rendering.'
          }
        },
        {
          id: 'fs-w3-d20-t8',
          topicNumber: 8,
          title: 'Security Checklist for Production Web Applications',
          explanation: [
            'Before publishing any full-stack application to production, audit this essential 7-point checklist:',
            '1. Enforce HTTPS/TLS everywhere.',
            '2. Store all credentials in environment variables (never in git).',
            '3. Hash passwords with bcrypt (cost factor >= 12).',
            '4. Store JWT tokens in secure, HTTP-only, sameSite cookies.',
            '5. Validate and sanitize all inputs with Zod schemas.',
            '6. Apply Helmet, CORS restrictions, and rate limiting.',
            '7. Use parameterized SQL queries or ORMs.'
          ],
          codeSnippet: {
            id: 'fs-t20-c8',
            title: 'Automated Security Audit in Node.js',
            description: 'Running npm audit to check for vulnerable dependencies.',
            language: 'bash',
            code: `# Check for known Common Vulnerabilities and Exposures (CVEs)
npm audit

# Auto-fix non-breaking patch updates
npm audit fix

# Verify no sensitive .env files are tracked by git
git status --ignored`,
            expectedOutput: 'found 0 vulnerabilities in 842 packages'
          },
          pitfall: 'Failing to run `npm audit` periodically allows known security vulnerabilities in third-party packages to persist in production.',
          quickCheck: {
            question: 'Which tool should be run regularly in Node.js projects to detect known CVE vulnerabilities in dependencies?',
            options: ['npm audit', 'npm start', 'git push', 'touch .env'],
            correctIndex: 0,
            explanation: 'npm audit scans dependencies against the vulnerability database and reports CVE security alerts.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Multi-Tier Security Middleware Chain in Express',
        instructions: [
          'Create an Express app configured with CORS whitelisting localhost:5173 with credentials.',
          'Add a simulated rate limiter allowing max 3 requests per IP.',
          'Build an RBAC middleware checking req.user.role === "admin".',
          'Mount on a sensitive admin endpoint.'
        ],
        starterCode: `// Write complete security-hardened Express application`,
        solutionCode: `import express from 'express';
const app = express();
app.use(express.json());

// Simulated Rate Limiter
const ipRequestCounts = new Map();
function rateLimiter(req, res, next) {
  const ip = req.ip || '127.0.0.1';
  const count = (ipRequestCounts.get(ip) || 0) + 1;
  ipRequestCounts.set(ip, count);
  if (count > 10) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }
  next();
}

app.use(rateLimiter);

// RBAC
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

// Protected route
app.delete('/api/admin/system-reset', requireAdmin, (req, res) => {
  res.json({ success: true, message: 'System reset executed.' });
});`,
        hints: [
          'Check role on req.user and return 403 if not admin.',
          'Track IP request counts and return 429 when threshold exceeded.'
        ]
      },
      keyTakeaways: [
        'Authentication verifies identity (401); Authorization verifies permissions and roles (403).',
        'Configure CORS explicitly for trusted origins and never combine credentials: true with wildcard origin *.',
        'Use Helmet headers, rate limiting, and parameterized queries to defend against OWASP Top 10 vulnerabilities.'
      ]
    },
    {
      id: 'fs-w3-d21',
      dayNumber: 21,
      weekNumber: 3,
      title: 'Real-Time Communication: WebSockets & Server-Sent Events (SSE)',
      subtitle: 'HTTP polling vs SSE vs WebSockets, bidirectional messaging, and room broadcasting',
      durationMinutes: 50,
      overview:
        'Build real-time full-stack experiences. Compare HTTP polling, Server-Sent Events (SSE), and full-duplex WebSockets. Implement WebSocket servers using the ws library, handle client connections, heartbeat pings, and broadcast updates.',
      topics: [
        {
          id: 'fs-w3-d21-t1',
          topicNumber: 1,
          title: 'Real-Time Protocols: Short Polling vs Long Polling vs SSE vs WebSockets',
          explanation: [
            'Short Polling: client queries server every 2 seconds (`setInterval(fetch, 2000)`). High latency, wasteful HTTP header overhead, and overwhelms servers.',
            'Server-Sent Events (SSE): unidirectional stream where server pushes text updates to browser over a single persistent HTTP connection. Perfect for stock tickers, notification feeds, and AI streaming responses.',
            'WebSockets (WS): bidirectional, full-duplex TCP connection allowing client and server to send messages back and forth with near-zero latency.'
          ],
          codeSnippet: {
            id: 'fs-t21-c1',
            title: 'Real-Time Protocol Comparison Matrix',
            description: 'Selecting the optimal protocol for your use case.',
            language: 'bash',
            code: `# 1. Short Polling: High overhead, high latency (Avoid)
# 2. Server-Sent Events (SSE): Unidirectional (Server -> Client), native HTTP, auto-reconnect
#    Best for: Live notification bells, AI token streaming, dashboards
# 3. WebSockets: Bidirectional (Client <-> Server), full-duplex, lowest latency
#    Best for: Collaborative whiteboards, multiplayer games, chat apps`,
            expectedOutput: 'Clear protocol selection matching real application requirements'
          },
          pitfall: 'Do not use heavy bidirectional WebSockets when you only need one-way server-to-client notifications; SSE is simpler and runs on standard HTTP.'
          ,
          quickCheck: {
            question: 'Which real-time protocol is unidirectional (server-to-client only) over standard HTTP and includes native browser reconnection?',
            options: ['Server-Sent Events (SSE)', 'WebSockets', 'UDP', 'Short Polling'],
            correctIndex: 0,
            explanation: 'SSE provides a lightweight, unidirectional text stream over HTTP with built-in browser reconnection handling.'
          }
        },
        {
          id: 'fs-w3-d21-t2',
          topicNumber: 2,
          title: 'The WebSocket Protocol: The HTTP 101 Switching Protocols Handshake',
          explanation: [
            'A WebSocket connection begins life as a standard HTTP GET request.',
            'The client includes `Upgrade: websocket` and `Connection: Upgrade` headers. If the server supports WebSockets, it responds with `HTTP/1.1 101 Switching Protocols`, upgrading the TCP socket into a persistent WebSocket tunnel.'
          ],
          codeSnippet: {
            id: 'fs-t21-c2',
            title: 'WebSocket Handshake Negotiation',
            description: 'Inspecting HTTP 101 protocol upgrade headers.',
            language: 'bash',
            code: `# Client Request:
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# Server Response:
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`,
            expectedOutput: 'HTTP connection upgraded to persistent bi-directional WebSocket'
          },
          pitfall: 'Remember that WebSockets do not send individual HTTP headers with each message frame; authentication must be performed during the initial handshake.'
          ,
          quickCheck: {
            question: 'What HTTP status code signifies that a connection is being upgraded to a WebSocket?',
            options: ['200 OK', '101 Switching Protocols', '301 Moved', '502 Bad Gateway'],
            correctIndex: 1,
            explanation: 'HTTP 101 Switching Protocols indicates that the server agrees to switch to the protocol requested by the client.'
          }
        },
        {
          id: 'fs-w3-d21-t3',
          topicNumber: 3,
          title: 'Building a WebSocket Server in Node.js with ws',
          explanation: [
            'The `ws` package is the fastest, most lightweight WebSocket implementation for Node.js.',
            'You initialize `const wss = new WebSocketServer({ server })` and listen for `connection`, `message`, and `close` events.'
          ],
          codeSnippet: {
            id: 'fs-t21-c3',
            title: 'Basic WebSocket Server with Message Echo',
            description: 'Receiving messages and replying over the socket.',
            language: 'javascript',
            code: `// import { WebSocketServer } from 'ws';

// Simulating WebSocket Server logic
function onClientMessage(ws, messageString) {
  const data = JSON.parse(messageString);
  console.log('Received message from client:', data.type);

  // Echo message back to client
  ws.send(JSON.stringify({
    type: 'ACK',
    receivedAt: new Date().toISOString(),
    payload: data.payload
  }));
}`,
            expectedOutput: 'Full-duplex message received and acknowledged immediately'
          },
          pitfall: 'WebSocket messages arrive as raw text strings or binary buffers. Always wrap `JSON.parse(message)` inside a try/catch block to prevent malformed messages from crashing the server.'
          ,
          quickCheck: {
            question: 'What happens if a client sends invalid non-JSON text to a WebSocket server that runs JSON.parse() without try/catch?',
            options: [
              'The server converts it to an empty object',
              'JSON.parse throws an uncaught SyntaxError that can crash the entire Node.js server process',
              'The client disconnects automatically',
              'Nothing'
            ],
            correctIndex: 1,
            explanation: 'Uncaught exceptions in event listeners bubble up and can crash the Node process.'
          }
        },
        {
          id: 'fs-w3-d21-t4',
          topicNumber: 4,
          title: 'Broadcasting Messages to All Connected Clients',
          explanation: [
            'To build collaborative features (live code updates, progress activity feeds), the server must broadcast updates to all active clients.',
            'Iterate through `wss.clients` and send messages to every client whose `readyState === WebSocket.OPEN`.'
          ],
          codeSnippet: {
            id: 'fs-t21-c4',
            title: 'Broadcasting to All Active WebSocket Clients',
            description: 'Distributing notifications to connected subscribers.',
            language: 'javascript',
            code: `function broadcast(wss, eventType, payload) {
  const message = JSON.stringify({ event: eventType, data: payload, timestamp: Date.now() });

  for (const client of wss.clients) {
    // Only send to clients whose connection is alive and open!
    if (client.readyState === 1 /* WebSocket.OPEN */) {
      client.send(message);
    }
  }
}

// Broadcast student milestone completion:
// broadcast(wss, 'STUDENT_UNLOCKED_WEEK', { student: 'Taylor', week: 2 });`,
            expectedOutput: 'Instant broadcast dispatched to all open client sockets'
          },
          pitfall: 'Never call `client.send()` without checking `client.readyState === WebSocket.OPEN`; sending data to closing or closed sockets throws an error.'
          ,
          quickCheck: {
            question: 'What must you check on a client socket before calling client.send() in a broadcast loop?',
            options: [
              'Check that client.readyState === WebSocket.OPEN',
              'Check client IP address',
              'Check user password',
              'Check CSS styles'
            ],
            correctIndex: 0,
            explanation: 'Attempting to send data to a socket that is not in the OPEN state throws a runtime error.'
          }
        },
        {
          id: 'fs-w3-d21-t5',
          topicNumber: 5,
          title: 'Heartbeats & Detecting Dead Connections (Ping / Pong)',
          explanation: [
            'If a user closes their laptop lid or enters a tunnel, their TCP connection dies silently without sending a `close` frame (creating a "ghost connection").',
            'Servers implement a Heartbeat Ping/Pong interval: send a `ping` every 30 seconds. If the client does not respond with `pong`, terminate the dead socket with `ws.terminate()`.'
          ],
          codeSnippet: {
            id: 'fs-t21-c5',
            title: 'Heartbeat Ping/Pong Keep-Alive Routine',
            description: 'Purging broken ghost connections every 30 seconds.',
            language: 'javascript',
            code: `function setupHeartbeat(wss) {
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log('Terminating dead ghost connection');
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(); // Client automatically responds with 'pong'
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));
}`,
            expectedOutput: 'Ghost sockets cleanly culled, freeing server file descriptors'
          },
          pitfall: 'Without a heartbeat ping/pong routine, mobile networks will leave thousands of zombie sockets open indefinitely, eventually exhausting OS file descriptors.'
          ,
          quickCheck: {
            question: 'Why is a heartbeat ping/pong mechanism necessary on WebSocket servers?',
            options: [
              'To speed up CPU clock rate',
              'To detect and terminate dead "ghost" connections when clients drop offline without sending close frames',
              'To encrypt data frames',
              'To validate passwords'
            ],
            correctIndex: 1,
            explanation: 'Mobile devices drop connections abruptly without TCP closure; heartbeats clean up these zombie sockets.'
          }
        },
        {
          id: 'fs-w3-d21-t6',
          topicNumber: 6,
          title: 'Authenticating WebSockets with JWT Tokens',
          explanation: [
            'Standard browser `new WebSocket(url)` API does not support passing custom HTTP headers (like `Authorization: Bearer`).',
            'Authenticate WebSockets by either: 1) Passing the token in the URL query string `ws://host?token=jwt` during handshake, or 2) Reading the secure HTTP-only cookie automatically sent during the handshake.'
          ],
          codeSnippet: {
            id: 'fs-t21-c6',
            title: 'Verifying JWT during WebSocket Handshake',
            description: 'Validating token query parameter before accepting connection.',
            language: 'javascript',
            code: `// Verify token before accepting WebSocket upgrade:
function verifyUpgrade(req, callback) {
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');

  if (!token) {
    return callback(new Error('Unauthorized: Missing token'));
  }

  try {
    // const user = jwt.verify(token, JWT_SECRET);
    // callback(null, user);
    callback(null, { id: 'usr-1', name: 'Alex' });
  } catch (e) {
    callback(new Error('Unauthorized: Invalid token'));
  }
}`,
            expectedOutput: 'Unauthenticated connections rejected before socket upgrade'
          },
          pitfall: 'Never allow unauthenticated clients to connect to a WebSocket server that receives or broadcasts private application events.'
          ,
          quickCheck: {
            question: 'Why do developers often pass JWT tokens via URL query parameters (ws://...?token=xyz) when connecting to WebSockets from browsers?',
            options: [
              'Because the native browser WebSocket API does not support custom request headers like Authorization',
              'Because WebSockets cannot read JSON',
              'Query strings are faster',
              'To disable encryption'
            ],
            correctIndex: 0,
            explanation: 'Browser new WebSocket() does not allow setting custom HTTP headers, so tokens are passed in query params or cookies.'
          }
        },
        {
          id: 'fs-w3-d21-t7',
          topicNumber: 7,
          title: 'Server-Sent Events (SSE) Implementation in Express',
          explanation: [
            'SSE is a native web standard for unidirectional streaming from server to client.',
            'The server sets `Content-Type: text/event-stream` and `Cache-Control: no-cache`. It writes lines formatted as `data: {...}\\n\\n` without closing the connection. The browser consumes it effortlessly using `new EventSource("/api/stream")`.'
          ],
          codeSnippet: {
            id: 'fs-t21-c7',
            title: 'SSE Streaming Endpoint in Express',
            description: 'Streaming live real-time events over standard HTTP.',
            language: 'javascript',
            code: `app.get('/api/live-stream', (req, res) => {
  // Required SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Push an event every 2 seconds
  const timer = setInterval(() => {
    const payload = JSON.stringify({ activeLearners: 1420 + Math.floor(Math.random() * 20) });
    res.write(\`data: \${payload}\\n\\n\`); // SSE format: "data: ...\\n\\n"
  }, 2000);

  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(timer);
    res.end();
  });
});`,
            expectedOutput: 'Continuous event stream pushed to browser with native reconnection'
          },
          pitfall: 'Every SSE message MUST end with two newlines `\\n\\n`. Forgetting the double newline prevents the browser `EventSource` from parsing the event chunk.'
          ,
          quickCheck: {
            question: 'What required delimiter must conclude every data chunk in Server-Sent Events (SSE)?',
            options: ['Two newlines (\\n\\n)', 'A semicolon ;', 'A period .', 'An HTML tag'],
            correctIndex: 0,
            explanation: 'The SSE specification mandates two consecutive newline characters \\n\\n to signal the end of an event block.'
          }
        },
        {
          id: 'fs-w3-d21-t8',
          topicNumber: 8,
          title: 'Scaling WebSockets Horizontally with Redis Pub/Sub',
          explanation: [
            'WebSockets maintain stateful in-memory TCP connections to a single server instance. If you deploy 4 server instances behind a load balancer, Client A on Server 1 cannot talk to Client B on Server 2.',
            'To scale horizontally, back the servers with Redis Pub/Sub: when Server 1 receives a message, it publishes it to a Redis channel; all server instances receive the message and broadcast to their local connected sockets.'
          ],
          codeSnippet: {
            id: 'fs-t21-c8',
            title: 'Multi-Node WebSocket Architecture with Redis',
            description: 'Broadcasting messages across distributed cluster nodes.',
            language: 'bash',
            code: `# Client A -> Server 1 -> Redis Channel "chat:general"
# Redis Channel "chat:general" -> Broadcasts to:
#   - Server 1 (Delivers to local clients)
#   - Server 2 (Delivers to Client B!)
#   - Server 3 (Delivers to Client C!)`,
            expectedOutput: 'Stateless multi-node architecture scaling to millions of concurrent users'
          },
          pitfall: 'Assuming WebSockets scale automatically across Docker containers without a centralized Pub/Sub message broker like Redis is a classic production failure.'
          ,
          quickCheck: {
            question: 'Why is a message broker like Redis Pub/Sub necessary when scaling WebSocket servers across multiple instances?',
            options: [
              'Because sockets are tied to memory on specific servers; Redis relays broadcast events between all server nodes',
              'Redis replaces CSS',
              'WebSockets only run on one CPU core',
              'To speed up DNS'
            ],
            correctIndex: 0,
            explanation: 'Redis Pub/Sub synchronizes messages across distributed server nodes so clients connected to different servers receive all updates.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Live Activity Notification Stream with SSE',
        instructions: [
          'Create an Express endpoint /api/activity/stream.',
          'Set proper SSE headers (text/event-stream, no-cache, keep-alive).',
          'Emit initial connection event and periodic heartbeat events every 3 seconds.',
          'Handle client disconnect by clearing intervals.'
        ],
        starterCode: `// Write complete Server-Sent Events endpoint in Express`,
        solutionCode: `import express from 'express';
const app = express();

app.get('/api/activity/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Initial event
  res.write('data: {"type": "CONNECTED", "msg": "Stream established"}\\n\\n');

  const interval = setInterval(() => {
    const data = JSON.stringify({
      type: 'METRIC_UPDATE',
      activeUsers: 840 + Math.floor(Math.random() * 50),
      timestamp: Date.now()
    });
    res.write(\`data: \${data}\\n\\n\`);
  }, 3000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});`,
        hints: [
          'Use res.writeHead with Content-Type: text/event-stream.',
          'Format messages as data: ...\\n\\n.'
        ]
      },
      keyTakeaways: [
        'Use Server-Sent Events (SSE) for unidirectional server pushes and WebSockets for bidirectional communication.',
        'Always clean up dead sockets using a 30-second ping/pong heartbeat.',
        'Scale WebSockets across multiple server nodes using Redis Pub/Sub.'
      ]
    }
  ],
  quiz: {
    id: 'fs-quiz-w3',
    weekNumber: 3,
    title: 'Module 3 Assessment: Backend Engineering, Express & Secure APIs',
    description:
      'Evaluate your comprehension of Node.js event loops, Express middleware, RESTful API design, Zod validation, JWT authentication, and API security.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'fs-q3-1',
        question: 'How does Node.js achieve high concurrency despite running user JavaScript on a single thread?',
        options: [
          'It creates a new operating system process for each user',
          'It offloads slow I/O operations (network, files) to the OS kernel and Libuv thread pool via the non-blocking event loop',
          'It compiles to Python',
          'It uses multiple GPUs'
        ],
        correctIndex: 1,
        explanation: 'The Libuv event loop offloads non-blocking asynchronous I/O operations, freeing the single thread to process events.'
      },
      {
        id: 'fs-q3-2',
        question: 'Why should passwords be hashed using bcrypt rather than fast algorithms like MD5 or SHA-256?',
        options: [
          'bcrypt is faster',
          'bcrypt is intentionally slow and adaptive with built-in salting, making GPU-accelerated brute force and rainbow tables computationally infeasible',
          'bcrypt compresses files',
          'MD5 is banned by HTML5'
        ],
        correctIndex: 1,
        explanation: 'bcrypt configurable cost factor and salting protect against automated dictionary and rainbow table cracking.'
      },
      {
        id: 'fs-q3-3',
        question: 'What is the key difference between PUT and PATCH in RESTful HTTP endpoints?',
        options: [
          'PUT replaces the entire resource document; PATCH applies a partial update modifying only supplied fields',
          'PUT is for numbers, PATCH is for strings',
          'PATCH creates a new database table',
          'There is no difference'
        ],
        correctIndex: 0,
        explanation: 'PUT performs a full resource replacement, whereas PATCH applies partial modifications.'
      },
      {
        id: 'fs-q3-4',
        question: 'Why is storing JWT tokens in HTTP-only cookies safer than browser localStorage?',
        options: [
          'Cookies cannot be stolen or accessed by malicious JavaScript, protecting against Cross-Site Scripting (XSS) credential theft',
          'Cookies never expire',
          'localStorage is deprecated',
          'Cookies run on the GPU'
        ],
        correctIndex: 0,
        explanation: 'HTTP-only cookies are inaccessible to client-side scripts, protecting tokens from XSS exfiltration.'
      },
      {
        id: 'fs-q3-5',
        question: 'What HTTP status code represents 403 Forbidden vs 401 Unauthorized?',
        options: [
          '401 means the client is unauthenticated; 403 means the client is authenticated but lacks permission for that action/role',
          '401 is for server crashes',
          'They are identical',
          '403 means file not found'
        ],
        correctIndex: 0,
        explanation: '401 Unauthorized indicates missing/invalid authentication; 403 Forbidden indicates authenticated but lacking privileges.'
      },
      {
        id: 'fs-q3-6',
        question: 'What delimiter is required to terminate every message chunk in Server-Sent Events (SSE)?',
        options: [
          'A semicolon ;',
          'Two consecutive newline characters (\\n\\n)',
          'A JSON bracket }',
          'An EOF character'
        ],
        correctIndex: 1,
        explanation: 'The SSE specification mandates two consecutive newlines (\\n\\n) to mark the end of an event block.'
      }
    ]
  }
};
