import { WeekModule } from '../types/course';

export const FULLSTACK_WEEK_4_MODULE: WeekModule = {
  weekNumber: 4,
  title: 'Databases, Full-Stack Integration, Git Collaboration & Production Deploy',
  theme: 'SQL, ORMs, Docker, Advanced GitHub Workflows & Cloud Publishing',
  description:
    'Complete the full-stack journey from scratch to cloud production. Master relational databases with PostgreSQL and SQL, type-safe data access with Prisma ORM, containerization with Docker, advanced GitHub collaborative pull request workflows, and automated continuous deployment (CI/CD) to production clouds.',
  conceptImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Global cloud production infrastructure and continuous deployment telemetry',
  days: [
    {
      id: 'fs-w4-d22',
      dayNumber: 22,
      weekNumber: 4,
      title: 'Relational Databases & SQL from Scratch: PostgreSQL',
      subtitle: 'Tables, primary keys, foreign keys, SELECT, JOINs, indexing, and ACID transactions',
      durationMinutes: 55,
      overview:
        'Master relational databases from zero. Learn how Structured Query Language (SQL) operates, create tables with data types, enforce data integrity with primary and foreign keys, write multi-table INNER/LEFT JOINs, and execute atomic transactions.',
      topics: [
        {
          id: 'fs-w4-d22-t1',
          topicNumber: 1,
          title: 'What is a Relational Database Management System (RDBMS)?',
          explanation: [
            'An RDBMS stores structured data in tables consisting of rows (records) and columns (attributes). Tables relate to each other through keys.',
            'PostgreSQL is the gold standard open-source enterprise RDBMS, renowned for robust ACID compliance, advanced indexing, and rich data types (JSONB, UUID, timestamps).'
          ],
          codeSnippet: {
            id: 'fs-t22-c1',
            title: 'Connecting to PostgreSQL via CLI (psql)',
            description: 'Basic PostgreSQL connection and version inspection.',
            language: 'sql',
            code: `-- Connect to PostgreSQL server
-- psql -U postgres -d academy_production

-- Inspect server version and current database
SELECT version();
SELECT current_database(), current_user;`,
            expectedOutput: 'PostgreSQL 16.2 on x86_64-pc-linux-gnu'
          },
          pitfall: 'Do not store relational structured data in flat JSON files; flat files lack concurrency controls, crash under simultaneous writes, and require O(N) full scans.',
          quickCheck: {
            question: 'What is the primary language used to manage and query relational databases like PostgreSQL?',
            options: ['HTML', 'SQL (Structured Query Language)', 'JSON', 'CSS'],
            correctIndex: 1,
            explanation: 'SQL (Structured Query Language) is the standard language for querying and manipulating relational databases.'
          }
        },
        {
          id: 'fs-w4-d22-t2',
          topicNumber: 2,
          title: 'Creating Tables, Data Types & Primary Keys',
          explanation: [
            '`CREATE TABLE` defines the schema: column names, data types (`VARCHAR`, `INT`, `BOOLEAN`, `TIMESTAMP`, `UUID`), and constraints.',
            'Every table MUST have a `PRIMARY KEY` (a unique identifier for each row, such as `BIGSERIAL` or `UUID`).'
          ],
          codeSnippet: {
            id: 'fs-t22-c2',
            title: 'Creating Students Table Schema',
            description: 'Table definition with constraints and primary key.',
            language: 'sql',
            code: `CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);`,
            expectedOutput: 'CREATE TABLE\nTable "students" created with primary key and unique email constraint'
          },
          pitfall: 'Never use plain text without length limits or validation for emails; always add `UNIQUE NOT NULL` to prevent duplicate accounts.',
          quickCheck: {
            question: 'What constraint guarantees that no two rows in a table share the exact same identifier?',
            options: ['CHECK', 'PRIMARY KEY', 'DEFAULT', 'FOREIGN KEY'],
            correctIndex: 1,
            explanation: 'PRIMARY KEY uniquely identifies each record in a database table, enforcing uniqueness and non-nullability.'
          }
        },
        {
          id: 'fs-w4-d22-t3',
          topicNumber: 3,
          title: 'Relationships & Foreign Keys: One-to-Many & Many-to-Many',
          explanation: [
            'A `FOREIGN KEY` creates a link between two tables, referencing the primary key of another table.',
            'One-to-Many (1:N): One course has many modules. The `modules` table contains `course_id REFERENCES courses(id)`.',
            'Many-to-Many (N:M): Students can enroll in multiple courses, and courses have multiple students. Modeled via a Junction Table (`enrollments`).'
          ],
          codeSnippet: {
            id: 'fs-t22-c3',
            title: 'Junction Table Modeling Many-to-Many Relationship',
            description: 'Creating enrollments table linking students and courses.',
            language: 'sql',
            code: `CREATE TABLE enrollments (
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (student_id, course_id) -- Composite Primary Key
);`,
            expectedOutput: 'CREATE TABLE\nComposite primary key junction table linking students and courses'
          },
          pitfall: 'Always specify `ON DELETE CASCADE` or `ON DELETE RESTRICT` on foreign keys so you control what happens when parent records are deleted.',
          quickCheck: {
            question: 'How is a Many-to-Many relationship implemented between two tables in a relational database?',
            options: [
              'By storing an array of IDs in a text column',
              'By creating a Junction (Join) Table containing foreign keys referencing both tables',
              'Relational databases cannot model many-to-many relationships',
              'By duplicating the tables'
            ],
            correctIndex: 1,
            explanation: 'A junction table with foreign keys referencing both primary tables cleanly models many-to-many relationships.'
          }
        },
        {
          id: 'fs-w4-d22-t4',
          topicNumber: 4,
          title: 'SQL CRUD Queries: INSERT, SELECT, UPDATE & DELETE',
          explanation: [
            '`INSERT INTO table (cols) VALUES (vals) RETURNING *` inserts records.',
            '`SELECT cols FROM table WHERE cond ORDER BY col LIMIT n` reads filtered data.',
            '`UPDATE table SET col = val WHERE cond` modifies matching rows.',
            '`DELETE FROM table WHERE cond` removes rows.'
          ],
          codeSnippet: {
            id: 'fs-t22-c4',
            title: 'Standard SQL CRUD Operations',
            description: 'Inserting, reading, updating, and deleting rows safely.',
            language: 'sql',
            code: `-- 1. Insert and return created record
INSERT INTO students (name, email) 
VALUES ('Taylor Smith', 'taylor@dev.io')
RETURNING id, name, enrolled_at;

-- 2. Query with filter and ordering
SELECT id, name, email 
FROM students 
WHERE is_active = TRUE 
ORDER BY enrolled_at DESC 
LIMIT 10;

-- 3. Safe update with WHERE condition
UPDATE students 
SET is_active = FALSE 
WHERE id = 42;`,
            expectedOutput: 'INSERT 0 1\nReturned newly created row with generated ID'
          },
          pitfall: 'NEVER execute `UPDATE` or `DELETE` without a `WHERE` clause! Omitting `WHERE` will update or wipe out EVERY single row in your entire table!',
          quickCheck: {
            question: 'What catastrophic error occurs if you run DELETE FROM students; without a WHERE clause?',
            options: [
              'It deletes the first row only',
              'It permanently deletes EVERY record in the students table',
              'PostgreSQL returns an error',
              'It deletes the database server'
            ],
            correctIndex: 1,
            explanation: 'Without a WHERE clause, UPDATE and DELETE apply to every single row in the target table.'
          }
        },
        {
          id: 'fs-w4-d22-t5',
          topicNumber: 5,
          title: 'Mastering SQL JOINs: INNER JOIN vs LEFT JOIN',
          explanation: [
            '`INNER JOIN` returns only rows that have matching values in both tables.',
            '`LEFT JOIN` returns all rows from the left table, plus matched rows from the right table (unmatched columns are populated with `NULL`).'
          ],
          codeSnippet: {
            id: 'fs-t22-c5',
            title: 'Joining Students and Completed Quizzes',
            description: 'LEFT JOIN including students even if they have not taken any quizzes yet.',
            language: 'sql',
            code: `SELECT 
  s.id AS student_id,
  s.name,
  s.email,
  q.week_number,
  COALESCE(q.score, 0) AS quiz_score
FROM students s
LEFT JOIN quiz_submissions q ON s.id = q.student_id
WHERE s.is_active = TRUE;`,
            expectedOutput: 'Combined result set displaying student info alongside optional quiz scores'
          },
          pitfall: 'Using `INNER JOIN` when you should use `LEFT JOIN` will silently hide students who have not yet submitted a quiz from your reports!',
          quickCheck: {
            question: 'What is returned by a LEFT JOIN for rows in the left table that have no matching records in the right table?',
            options: [
              'Those rows are excluded from the result set',
              'Those rows are included with NULL values for all columns from the right table',
              'The query fails with an error',
              'Zero'
            ],
            correctIndex: 1,
            explanation: 'LEFT JOIN preserves all rows from the left table, filling in NULL for missing right-table columns.'
          }
        },
        {
          id: 'fs-w4-d22-t6',
          topicNumber: 6,
          title: 'Database Indexing: B-Tree Indexes & EXPLAIN ANALYZE',
          explanation: [
            'Without an index, querying `SELECT * FROM users WHERE email = \x27...\x27` performs a Sequential Scan: scanning every row on disk (O(N) time). On 10 million rows, this takes seconds.',
            'A B-Tree Index creates a sorted balanced search tree (O(log N) lookup time), reducing query duration from 3,000ms to 2ms. Use `EXPLAIN ANALYZE` to inspect query plans.'
          ],
          codeSnippet: {
            id: 'fs-t22-c6',
            title: 'Creating an Index and Analyzing Execution Plan',
            description: 'Optimizing search performance with B-tree index.',
            language: 'sql',
            code: `-- Create an index on search/lookup column
CREATE INDEX idx_students_email ON students(email);

-- Analyze execution plan and actual runtime in milliseconds
EXPLAIN ANALYZE 
SELECT * FROM students WHERE email = 'alex@dev.io';`,
            expectedOutput: 'Index Scan using idx_students_email (cost=0.29..8.30 rows=1 width=72) (actual time=0.042ms)'
          },
          pitfall: 'Do not index every single column; indexes consume disk space and slow down `INSERT`, `UPDATE`, and `DELETE` operations because every index must be updated on write.',
          quickCheck: {
            question: 'What SQL command shows the execution plan, cost estimate, and actual execution time in milliseconds for a query?',
            options: ['SHOW TIME', 'EXPLAIN ANALYZE', 'DEBUG QUERY', 'SELECT PERFORMANCE'],
            correctIndex: 1,
            explanation: 'EXPLAIN ANALYZE executes the statement and displays the execution plan with real millisecond timings.'
          }
        },
        {
          id: 'fs-w4-d22-t7',
          topicNumber: 7,
          title: 'ACID Properties & Database Transactions (BEGIN, COMMIT, ROLLBACK)',
          explanation: [
            'ACID guarantees financial and mission-critical reliability: Atomicity (all-or-nothing), Consistency (rules enforced), Isolation (concurrent operations do not interfere), Durability (committed data survives crashes).',
            'Transactions bundle multiple queries together: if any query fails, `ROLLBACK` undoes all prior steps, leaving the database clean.'
          ],
          codeSnippet: {
            id: 'fs-t22-c7',
            title: 'Executing an Atomic Transfer Transaction',
            description: 'Safely transferring balance between accounts.',
            language: 'sql',
            code: `BEGIN; -- Start transaction block

-- Deduct from Account A
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

-- Deposit into Account B
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If both succeeded without error, commit changes permanently:
COMMIT;

-- If an error or crash occurs at any point before commit:
-- ROLLBACK;`,
            expectedOutput: 'COMMIT\nBoth updates committed atomically; money is never created or lost'
          },
          pitfall: 'Executing multi-step operations (like charging a credit card and unlocking a course) without a database transaction risks leaving your database in a corrupt, half-finished state if a crash occurs midway.',
          quickCheck: {
            question: 'What does Atomicity in ACID mean for a multi-query database transaction?',
            options: [
              'Queries run at atomic speed',
              'All statements within the transaction succeed together, or if any fails, all changes are rolled back completely (All or Nothing)',
              'Queries use nuclear encryption',
              'Only one user can use the database'
            ],
            correctIndex: 1,
            explanation: 'Atomicity ensures that all modifications in a transaction are treated as a single indivisible unit: either all succeed or none do.'
          }
        },
        {
          id: 'fs-w4-d22-t8',
          topicNumber: 8,
          title: 'Connection Pooling: pg.Pool & Managing Server Concurrency',
          explanation: [
            'Establishing a new TCP/TLS connection to PostgreSQL takes 50-100ms and spawns an operating system process on the database host.',
            'A Connection Pool (`pg.Pool`) maintains a pre-warmed set of reusable connections (e.g. 10-20 connections). Requests borrow a connection, run their query, and return it to the pool in 1ms.'
          ],
          codeSnippet: {
            id: 'fs-t22-c8',
            title: 'Configuring pg.Pool in Node.js',
            description: 'Reusing database connections across HTTP requests.',
            language: 'javascript',
            code: `// import { Pool } from 'pg';

const pool = {
  query: async (text, params) => {
    // Borrows connection from pool, executes parameterized query, releases back to pool
    console.log('Executing parameterized query:', text);
    return { rows: [{ id: 1, name: 'Taylor' }], rowCount: 1 };
  }
};

async function getStudentById(id) {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  return result.rows[0];
}`,
            expectedOutput: 'Executing parameterized query: SELECT * FROM students WHERE id = $1'
          },
          pitfall: 'Creating a new client connection on every single HTTP request (`new Client()`) will quickly exhaust PostgreSQL maximum connection limit (`max_connections = 100`) and crash your server.',
          quickCheck: {
            question: 'Why should a backend server use a Connection Pool (pg.Pool) instead of opening a new database connection on every HTTP request?',
            options: [
              'Opening new connections is slow and quickly exhausts PostgreSQL connection limits; a pool reuses existing open connections efficiently',
              'PostgreSQL only allows 1 connection',
              'Connection pools encrypt passwords',
              'To avoid writing SQL'
            ],
            correctIndex: 0,
            explanation: 'Connection pools maintain a pool of open connections that are reused across requests, dramatically improving speed and throughput.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Design a Normalized Course & Enrollment Database Schema',
        instructions: [
          'Write SQL to create a courses table (id, title, weeks, created_at).',
          'Create a students table (id, name, email, unique).',
          'Create an enrollments junction table with foreign keys referencing both tables and composite primary key.',
          'Add an index on students(email).'
        ],
        starterCode: `-- Write SQL schema definitions here`,
        solutionCode: `CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  total_weeks INT NOT NULL CHECK (total_weeks > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrollments (
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id)
);

CREATE INDEX idx_students_email ON students(email);`,
        hints: [
          'Use REFERENCES table(id) ON DELETE CASCADE for foreign keys.',
          'Define PRIMARY KEY (student_id, course_id) on the junction table.'
        ]
      },
      keyTakeaways: [
        'PostgreSQL delivers robust ACID-compliant relational data management.',
        'Use Primary Keys to uniquely identify rows and Foreign Keys to enforce referential integrity.',
        'Always use B-Tree indexes on lookup columns and connection pools in Node.js applications.'
      ]
    },
    {
      id: 'fs-w4-d23',
      dayNumber: 23,
      weekNumber: 4,
      title: 'ORMs & Modern Data Modeling: Prisma ORM & Migrations',
      subtitle: 'Schema definition, declarative data modeling, migrations, type-safe queries, and seeding',
      durationMinutes: 50,
      overview:
        'Master modern Object-Relational Mapping (ORM) with Prisma. Define data models declaratively in schema.prisma, run database migrations, query databases with 100% static type safety in TypeScript, and seed initial test datasets.',
      topics: [
        {
          id: 'fs-w4-d23-t1',
          topicNumber: 1,
          title: 'Why Use an ORM? Raw SQL vs Type-Safe Data Mapping',
          explanation: [
            'Writing raw SQL strings (`"SELECT * FROM users"`) inside JavaScript provides zero compile-time type safety. If you rename a database column, TypeScript cannot warn you, causing runtime crashes.',
            'An Object-Relational Mapper (ORM) maps database tables to typed TypeScript objects. Prisma generates fully typed query methods (`prisma.user.findMany()`) directly from your schema file.'
          ],
          codeSnippet: {
            id: 'fs-t23-c1',
            title: 'Raw SQL Strings vs Type-Safe Prisma Queries',
            description: 'Comparing brittle string queries with autocomplete-backed ORM calls.',
            language: 'typescript',
            code: `// Raw SQL: No autocomplete, typos only caught at runtime
// const res = await db.query('SELECT user_nme FROM usrs WHERE id = $1', [id]);

// Prisma ORM: 100% Type-Safe with IDE Autocomplete
// const user = await prisma.user.findUnique({
//   where: { id: 'usr-1' },
//   select: { id: true, name: true, email: true }
// });
// TypeScript knows the exact type of 'user' based on selected fields!`,
            expectedOutput: 'Full compile-time type safety and instant autocomplete on database queries'
          },
          pitfall: 'Do not use ORMs blindly for complex statistical aggregation queries where a hand-optimized raw SQL query performs 10x faster.',
          quickCheck: {
            question: 'What is the primary benefit of Prisma ORM over writing raw SQL strings in TypeScript?',
            options: [
              'Prisma replaces the database entirely',
              'Prisma generates 100% type-safe query clients with autocomplete matching your database schema',
              'Prisma makes CSS faster',
              'Prisma only works with SQLite'
            ],
            correctIndex: 1,
            explanation: 'Prisma generates a typed client from your schema, catching database query mismatches at compile time.'
          }
        },
        {
          id: 'fs-w4-d23-t2',
          topicNumber: 2,
          title: 'The schema.prisma File: Models, Relations & Attributes',
          explanation: [
            'The `schema.prisma` file is the declarative single source of truth for your database models and connection.',
            'You define models with fields, types, and attributes: `@id`, `@default(autoincrement())`, `@unique`, `@updatedAt`, and `@relation`.'
          ],
          codeSnippet: {
            id: 'fs-t23-c2',
            title: 'Declarative Model Definition in schema.prisma',
            description: 'Declaring Course and Lesson models with 1:N relation.',
            language: 'bash',
            code: `// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }

// model Course {
//   id        String   @id @default(cuid())
//   title     String
//   theme     String
//   createdAt DateTime @default(now())
//   days      DayLesson[]
// }

// model DayLesson {
//   id         String   @id @default(cuid())
//   dayNumber  Int
//   title      String
//   courseId   String
//   course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
// }`,
            expectedOutput: 'Declarative schema mapping models, relations, and cascade deletion rules'
          },
          pitfall: 'Always define the relation on both sides of the model in `schema.prisma`; Prisma will report a schema validation error if the opposing relation field is missing.',
          quickCheck: {
            question: 'What Prisma attribute automatically updates a timestamp field whenever a record is modified?',
            options: ['@default(now())', '@updatedAt', '@autoUpdate', '@timestamp'],
            correctIndex: 1,
            explanation: '@updatedAt automatically manages timestamp updates on record mutation in Prisma.'
          }
        },
        {
          id: 'fs-w4-d23-t3',
          topicNumber: 3,
          title: 'Database Migrations with prisma migrate dev',
          explanation: [
            'Database schemas evolve over time as features are added (adding columns, renaming tables).',
            '`npx prisma migrate dev --name <migration_name>` compares your `schema.prisma` against your database, generates a version-controlled SQL migration file, and applies it to your database.'
          ],
          codeSnippet: {
            id: 'fs-t23-c3',
            title: 'Running Database Migrations via CLI',
            description: 'Generating and applying SQL migrations.',
            language: 'bash',
            code: `# 1. Update schema.prisma with new fields
# 2. Run migration command
npx prisma migrate dev --name add_quiz_submission_model

# Output generated in prisma/migrations/20261024_add_quiz_submission_model/migration.sql:
# CREATE TABLE "QuizSubmission" ( ... );

# 3. In production CI/CD, apply migrations without generating new ones:
npx prisma migrate deploy`,
            expectedOutput: 'Your database is now in sync with your schema.\nGenerated Prisma Client.'
          },
          pitfall: 'Never manually edit existing migration files that have already been applied to production; create a new migration instead.',
          quickCheck: {
            question: 'What command applies pending migrations safely in a production deployment environment?',
            options: ['prisma migrate dev', 'prisma migrate deploy', 'prisma db push', 'prisma reset'],
            correctIndex: 1,
            explanation: 'prisma migrate deploy applies pending migrations safely in production without prompting or generating new files.'
          }
        },
        {
          id: 'fs-w4-d23-t4',
          topicNumber: 4,
          title: 'CRUD Queries with Prisma Client',
          explanation: [
            'Prisma Client provides expressive query methods for all CRUD operations: `findUnique`, `findFirst`, `findMany`, `create`, `update`, `delete`, and `upsert`.',
            'All methods return native Promises that resolve to strongly typed objects.'
          ],
          codeSnippet: {
            id: 'fs-t23-c4',
            title: 'Executing Typed CRUD Queries with Prisma Client',
            description: 'Creating and querying records with filtering.',
            language: 'typescript',
            code: `// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

async function runQueries() {
  // 1. Create a student
  // const student = await prisma.student.create({
  //   data: { name: 'Morgan Lee', email: 'morgan@dev.io' }
  // });

  // 2. Query with filtering and sorting
  // const activeStudents = await prisma.student.findMany({
  //   where: { isActive: true },
  //   orderBy: { enrolledAt: 'desc' },
  //   take: 10 // LIMIT 10
  // });

  console.log('Queries executed type-safely');
}

runQueries();`,
            expectedOutput: 'Queries executed type-safely'
          },
          pitfall: 'Do not instantiate `new PrismaClient()` inside every route handler function. In Node/Next.js/Express, maintain a single global singleton instance to avoid exhausting connection pools.',
          quickCheck: {
            question: 'Why should PrismaClient be instantiated as a singleton rather than created inside each route handler?',
            options: [
              'Prisma throws an error otherwise',
              'Each PrismaClient instance creates its own database connection pool; creating new instances on every request exhausts connections',
              'Prisma is only for single-user apps',
              'To save CSS memory'
            ],
            correctIndex: 1,
            explanation: 'Each PrismaClient instance manages its own connection pool, so instantiating multiple clients exhausts database connections.'
          }
        },
        {
          id: 'fs-w4-d23-t5',
          topicNumber: 5,
          title: 'Eager Loading & Nested Relations with include and select',
          explanation: [
            'The N+1 Query Problem occurs when you fetch a list of 50 courses, and then run 50 separate queries to fetch the lessons for each course (51 queries total!).',
            'Prisma solves this with the `include` option: `prisma.course.findMany({ include: { days: true } })` fetches courses and their related lessons in a single optimized JOIN/batch query.'
          ],
          codeSnippet: {
            id: 'fs-t23-c5',
            title: 'Fetching Related Data with include and select',
            description: 'Eager loading nested relations in one efficient query.',
            language: 'typescript',
            code: `// Eager loading relations without N+1 problem
// const courseWithModules = await prisma.course.findUnique({
//   where: { id: 'fs-mastery' },
//   include: {
//     days: {
//       select: { id: true, dayNumber: true, title: true } // Nested field selection
//     }
//   }
// });

// Output shape: { id, title, days: [{ id, dayNumber, title }, ...] }`,
            expectedOutput: 'Complete nested course tree loaded in a single performant database trip'
          },
          pitfall: 'Avoid using `include` blindly on massive tables (like including all 50,000 comments on a post); use pagination on nested relations.',
          quickCheck: {
            question: 'How do you prevent the N+1 query problem when loading parent-child relations with Prisma?',
            options: [
              'Use the include option to fetch related records in a single optimized query',
              'Run a for loop with individual queries',
              'Disable foreign keys',
              'Restart the database'
            ],
            correctIndex: 0,
            explanation: 'The include option instructs Prisma to batch or join related records, eliminating N+1 sequential round-trips.'
          }
        },
        {
          id: 'fs-w4-d23-t6',
          topicNumber: 6,
          title: 'Database Transactions in Prisma ($transaction)',
          explanation: [
            'Prisma supports atomic transactions using `prisma.$transaction([op1, op2])` (sequential array) or interactive transactions `prisma.$transaction(async (tx) => { ... })`.',
            'If any step within the transaction fails or throws an error, all operations rollback automatically.'
          ],
          codeSnippet: {
            id: 'fs-t23-c6',
            title: 'Interactive Transaction with Prisma $transaction',
            description: 'Enrolling student and creating payment record atomically.',
            language: 'typescript',
            code: `// async function enrollStudentAtomic(studentId: string, courseId: string) {
//   return await prisma.$transaction(async (tx) => {
//     // 1. Create enrollment record
//     const enrollment = await tx.enrollment.create({
//       data: { studentId, courseId }
//     });
//     // 2. Increment active student count on course
//     await tx.course.update({
//       where: { id: courseId },
//       data: { studentCount: { increment: 1 } }
//     });
//     return enrollment;
//   });
// }`,
            expectedOutput: 'Enrollment and student count updated atomically within single transaction'
          },
          pitfall: 'Never execute slow external HTTP calls (like calling Stripe API) INSIDE a database transaction block; keep database transactions as short as possible to prevent holding table locks.',
          quickCheck: {
            question: 'What happens to changes made within a prisma.$transaction block if an error is thrown?',
            options: [
              'Successful operations are kept, failed ones are skipped',
              'The entire transaction is automatically aborted and all changes are rolled back',
              'The database shuts down',
              'Prisma retries infinitely'
            ],
            correctIndex: 1,
            explanation: 'If any error occurs inside $transaction, Prisma executes a ROLLBACK, undoing all queries in the block.'
          }
        },
        {
          id: 'fs-w4-d23-t7',
          topicNumber: 7,
          title: 'Automated Database Seeding (prisma/seed.ts)',
          explanation: [
            'Spinning up a fresh development environment requires initial data: sample courses, days, quizzes, and default admin users.',
            'Prisma provides automated seeding via `prisma/seed.ts` configured in `package.json`. Running `npx prisma db seed` populates the database deterministically.'
          ],
          codeSnippet: {
            id: 'fs-t23-c7',
            title: 'Automated Seed Script Pattern in TypeScript',
            description: 'Populating initial curriculum data via seed script.',
            language: 'typescript',
            code: `// File: prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial curriculum data...');
  // await prisma.course.upsert({
  //   where: { id: 'fullstack-academy' },
  //   update: {},
  //   create: { id: 'fullstack-academy', title: 'Full Stack Web Development', theme: 'Engineering' }
  // });
  console.log('Database seeding finished successfully!');
}

main();`,
            expectedOutput: 'Seeding initial curriculum data...\nDatabase seeding finished successfully!'
          },
          pitfall: 'Use `upsert` (update if exists, insert if not) rather than plain `create` in seed scripts so running the seed command multiple times does not throw unique constraint violations.',
          quickCheck: {
            question: 'Why is upsert preferred over create when writing database seed scripts?',
            options: [
              'upsert is faster',
              'upsert is idempotent: if the record already exists, it updates it instead of throwing a unique constraint error',
              'upsert deletes tables',
              'Prisma requires it'
            ],
            correctIndex: 1,
            explanation: 'upsert allows seed scripts to be executed repeatedly without crashing due to duplicate key errors.'
          }
        },
        {
          id: 'fs-w4-d23-t8',
          topicNumber: 8,
          title: 'Prisma Studio: Visual Database GUI in the Browser',
          explanation: [
            'Inspecting data in terminals can be tedious.',
            '`npx prisma studio` launches a local visual web interface at `http://localhost:5555`. It allows viewing, filtering, editing, and deleting records across all database tables with an intuitive spreadsheet-style GUI.'
          ],
          codeSnippet: {
            id: 'fs-t23-c8',
            title: 'Launching Prisma Studio Web Interface',
            description: 'Starting local visual database browser.',
            language: 'bash',
            code: `# Launch visual database interface in local browser
npx prisma studio

# Output:
# Prisma Studio is up on http://localhost:5555`,
            expectedOutput: 'Prisma Studio is up on http://localhost:5555'
          },
          pitfall: 'Do not expose Prisma Studio on public production ports without strict password protection and firewall rules.',
          quickCheck: {
            question: 'What does npx prisma studio provide to developers?',
            options: [
              'A code editor for React',
              'A local browser-based GUI to visually explore, filter, and edit database records',
              'A deployment cloud',
              'A CSS library'
            ],
            correctIndex: 1,
            explanation: 'Prisma Studio is a visual browser GUI for inspecting and modifying database models and records.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Define a Complete Full-Stack Academy Prisma Schema',
        instructions: [
          'Create Course model with id (cuid), title, and relation to Module.',
          'Create Module model with weekNumber, title, and relation to DayLesson.',
          'Create DayLesson model with dayNumber, title, and relation to SubTopic.',
          'Configure CASCADE deletion across all parent-child relationships.'
        ],
        starterCode: `// Write complete schema.prisma models`,
        solutionCode: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Course {
  id        String   @id @default(cuid())
  title     String
  modules   Module[]
  createdAt DateTime @default(now())
}

model Module {
  id         String      @id @default(cuid())
  weekNumber Int
  title      String
  courseId   String
  course     Course      @relation(fields: [courseId], references: [id], onDelete: Cascade)
  days       DayLesson[]
}

model DayLesson {
  id        String   @id @default(cuid())
  dayNumber Int
  title     String
  moduleId  String
  module    Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
}`,
        hints: [
          'Use @relation(fields: [...], references: [...], onDelete: Cascade).',
          'Use @id @default(cuid()) for unique primary keys.'
        ]
      },
      keyTakeaways: [
        'Prisma ORM provides 100% type-safe database queries synchronized with your schema.',
        'Use prisma migrate dev to version-control schema changes and apply migrations.',
        'Use include to eliminate N+1 queries and upsert for idempotent seed scripts.'
      ]
    },
    {
      id: 'fs-w4-d24',
      dayNumber: 24,
      weekNumber: 4,
      title: 'NoSQL Databases & In-Memory Caching: MongoDB & Redis',
      subtitle: 'Document stores, JSON collections, Redis key-value caching, TTL, and cache invalidation',
      durationMinutes: 50,
      overview:
        'Explore non-relational data architectures. Understand when to choose document stores (MongoDB) over relational databases, model flexible nested JSON documents, and implement lightning-fast in-memory caching with Redis (TTL, cache-aside pattern).',
      topics: [
        {
          id: 'fs-w4-d24-t1',
          topicNumber: 1,
          title: 'SQL vs NoSQL: Relational Tables vs Document Stores',
          explanation: [
            'Relational (SQL): Rigid predefined schemas, strict tabular structure, ACID transactions, and JOINs. Ideal for financial ledgers, user accounts, and relational systems.',
            'NoSQL (Document/MongoDB): Dynamic schema, hierarchical JSON/BSON documents, high write scalability, and horizontal sharding. Ideal for polymorphic catalogs, IoT telemetry, and rapidly evolving payloads.'
          ],
          codeSnippet: {
            id: 'fs-t24-c1',
            title: 'Relational Tables vs MongoDB Document Structure',
            description: 'Comparing normalized tables with embedded document hierarchy.',
            language: 'json',
            code: `// MongoDB Document representation (JSON/BSON):
{
  "_id": "653b1e84a2d",
  "courseTitle": "Full Stack Mastery",
  "instructor": { "name": "Devon Lane", "role": "Staff Architect" },
  "tags": ["react", "node", "docker", "postgres"],
  "stats": { "enrolled": 1420, "rating": 4.98 }
}`,
            expectedOutput: 'Rich nested JSON document stored directly in a single document collection'
          },
          pitfall: 'Do not use MongoDB if your domain requires complex relational JOINs across dozens of normalized entities; SQL is far superior for relational queries.',
          quickCheck: {
            question: 'What format does MongoDB use to store documents on disk?',
            options: ['Plain CSV', 'BSON (Binary JSON)', 'XML', 'Raw text'],
            correctIndex: 1,
            explanation: 'MongoDB stores documents in BSON, a binary-encoded serialization of JSON that supports additional types (like Date and ObjectId).'
          }
        },
        {
          id: 'fs-w4-d24-t2',
          topicNumber: 2,
          title: 'Embedding vs Referencing in Document Databases',
          explanation: [
            'Embedding: nesting related data inside a single document (e.g. embedding 7 subtopics inside a day lesson document). Eliminates JOINs, allowing atomic reads of the entire hierarchy in one disk seek.',
            'Referencing: storing ObjectIds of separate documents (normalized). Preferred when child collections grow unboundedly (like millions of log entries).'
          ],
          codeSnippet: {
            id: 'fs-t24-c2',
            title: 'Embedding Subtopics inside Lesson Document',
            description: 'One-to-few relationship modeled via embedded array.',
            language: 'javascript',
            code: `// Embedded schema pattern (Atomic O(1) fetch)
const dayLessonDocument = {
  dayNumber: 24,
  title: 'NoSQL & Caching',
  // Embedded sub-topics array: Read entire day in a single query!
  topics: [
    { topicNumber: 1, title: 'SQL vs NoSQL' },
    { topicNumber: 2, title: 'Embedding vs Referencing' },
    { topicNumber: 3, title: 'Redis In-Memory Caching' }
  ]
};`,
            expectedOutput: 'Entire lesson and nested topics retrieved in a single O(1) query'
          },
          pitfall: 'Beware of MongoDB 16MB document size limit. Never embed unbounded arrays (like infinite chat messages) inside a single parent document.',
          quickCheck: {
            question: 'What is the maximum single document size limit in MongoDB?',
            options: ['1 MB', '16 MB', '1 GB', 'Unlimited'],
            correctIndex: 1,
            explanation: 'MongoDB enforces a 16MB BSON document size limit to preserve high RAM and disk performance.'
          }
        },
        {
          id: 'fs-w4-d24-t3',
          topicNumber: 3,
          title: 'What is Redis? In-Memory Key-Value Architecture',
          explanation: [
            'Redis (Remote Dictionary Server) is an ultra-fast, in-memory key-value data store.',
            'Because data resides in physical RAM rather than disk drives, Redis operations execute in sub-millisecond speeds (100,000+ operations per second).',
            'Used for caching database queries, storing user sessions, rate-limit counters, and real-time leaderboards.'
          ],
          codeSnippet: {
            id: 'fs-t24-c3',
            title: 'Basic Redis CLI Operations',
            description: 'Setting and getting keys with expiration TTL.',
            language: 'bash',
            code: `# 1. Set key with value
SET course:fs:title "Full Stack Web Development"

# 2. Get key value (sub-millisecond!)
GET course:fs:title

# 3. Set key with Time-To-Live (TTL) expiration of 60 seconds
SETEX cache:stats 60 '{"activeStudents": 1420}'

# 4. Check remaining TTL in seconds
TTL cache:stats`,
            expectedOutput: '"Full Stack Web Development"\nOK\n(integer) 58'
          },
          pitfall: 'RAM is significantly more expensive than disk storage; do not store gigabytes of cold static assets in Redis. Use Redis for hot, frequently accessed data.',
          quickCheck: {
            question: 'Why are read and write operations in Redis orders of magnitude faster than PostgreSQL?',
            options: [
              'Redis compiles to C++',
              'Redis stores data directly in system RAM (in-memory) rather than performing persistent disk I/O',
              'Redis disables networking',
              'Redis is a browser tool'
            ],
            correctIndex: 1,
            explanation: 'RAM read/write speeds are thousands of times faster than magnetic or SSD persistent disk reads.'
          }
        },
        {
          id: 'fs-w4-d24-t4',
          topicNumber: 4,
          title: 'The Cache-Aside (Lazy Loading) Pattern',
          explanation: [
            'The Cache-Aside pattern is the standard caching strategy:',
            '1) When a request arrives, check Redis first (`Cache Hit`). If found, return immediately without touching the database!',
            '2) If key is not in Redis (`Cache Miss`), query PostgreSQL, write the result into Redis with a TTL, and return to the client.'
          ],
          codeSnippet: {
            id: 'fs-t24-c4',
            title: 'Implementing the Cache-Aside Pattern',
            description: 'Checking Redis before querying primary database.',
            language: 'javascript',
            code: `async function getCourseMetricsWithCache(courseId) {
  const cacheKey = \`metrics:course:\${courseId}\`;

  // 1. Check Redis in-memory cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('⚡ Cache Hit! Returned from Redis in 0.8ms');
    return JSON.parse(cached);
  }

  // 2. Cache Miss: Query slow relational database
  console.log('🐢 Cache Miss: Querying PostgreSQL database...');
  const data = await db.query('SELECT * FROM complex_analytics_view WHERE id = $1', [courseId]);

  // 3. Populate Redis cache with 5-minute TTL (300 seconds)
  await redis.setex(cacheKey, 300, JSON.stringify(data));

  return data;
}`,
            expectedOutput: 'Subsequent requests served instantly from RAM in under 1ms'
          },
          pitfall: 'Always set a Time-To-Live (`TTL`) when caching in Redis; otherwise, the cache will grow unbounded and run out of RAM.',
          quickCheck: {
            question: 'What is a "Cache Hit" in the Cache-Aside pattern?',
            options: [
              'When the database crashes',
              'When the requested data is found already stored in the fast in-memory cache, avoiding a database query',
              'A DDoS attack',
              'A syntax error'
            ],
            correctIndex: 1,
            explanation: 'A Cache Hit occurs when the requested record exists in the fast cache, delivering instant responses.'
          }
        },
        {
          id: 'fs-w4-d24-t5',
          topicNumber: 5,
          title: 'Cache Invalidation: The Hard Problem in Computer Science',
          explanation: [
            '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
            'When data is updated in the database (`UPDATE course SET title = ...`), the Redis cache becomes stale and out-of-sync.',
            'Strategies: 1) TTL (passive expiration), 2) Write-Through / Invalidate-on-Write (explicitly call `redis.del(cacheKey)` whenever an update mutation runs).'
          ],
          codeSnippet: {
            id: 'fs-t24-c5',
            title: 'Invalidating Cache on Data Mutation',
            description: 'Purging stale cache upon database update.',
            language: 'javascript',
            code: `app.patch('/api/courses/:id', async (req, res) => {
  const { id } = req.params;

  // 1. Update source of truth (PostgreSQL)
  const updated = await prisma.course.update({ where: { id }, data: req.body });

  // 2. Invalidate cache: delete stale key from Redis!
  await redis.del(\`metrics:course:\${id}\`);
  console.log('Stale cache purged from Redis');

  res.json({ success: true, data: updated });
});`,
            expectedOutput: 'Stale cache purged, guaranteeing fresh data on subsequent reads'
          },
          pitfall: 'Updating the database without clearing the corresponding Redis cache key means users will continue seeing outdated stale data until the TTL expires.',
          quickCheck: {
            question: 'What should you do to the Redis cache key when a user updates their profile in the database?',
            options: [
              'Delete or update the cache key immediately (Invalidate on write)',
              'Do nothing and wait 24 hours',
              'Restart the server',
              'Format Redis'
            ],
            correctIndex: 0,
            explanation: 'Invalidating or updating the cache upon data mutation ensures clients immediately receive fresh data.'
          }
        },
        {
          id: 'fs-w4-d24-t6',
          topicNumber: 6,
          title: 'Redis Data Structures: Hashes, Lists, Sets & Sorted Sets',
          explanation: [
            'Redis is not just a plain string store; it provides rich native data structures:',
            'Strings (text/JSON), Hashes (objects like `HSET user:1 name "Alex"`), Lists (queues with `LPUSH/RPOP`), Sets (unique items `SADD`), and Sorted Sets (leaderboards with scores `ZADD`).'
          ],
          codeSnippet: {
            id: 'fs-t24-c6',
            title: 'High-Performance Leaderboard with Sorted Sets (ZSET)',
            description: 'O(log N) ranking of top students by quiz score.',
            language: 'bash',
            code: `# Add students and scores to leaderboard
ZADD leaderboard:week1 95 "alex"
ZADD leaderboard:week1 100 "taylor"
ZADD leaderboard:week1 88 "jordan"

# Retrieve top 3 students sorted highest to lowest score
ZREVRANGE leaderboard:week1 0 2 WITHSCORES

# Output:
# 1) "taylor" (100)
# 2) "alex"   (95)
# 3) "jordan" (88)`,
            expectedOutput: 'O(log N) leaderboard sorted instantly in memory'
          },
          pitfall: 'Do not parse and re-stringify entire JSON arrays for simple queue or set operations; use native Redis Lists (`LPUSH/RPOP`) and Sets (`SADD/SMEMBERS`).',
          quickCheck: {
            question: 'Which Redis data structure is ideal for implementing real-time gaming or quiz score leaderboards?',
            options: ['Sorted Sets (ZSET)', 'Strings', 'Blobs', 'HTML'],
            correctIndex: 0,
            explanation: 'Sorted Sets maintain elements ordered by floating-point score, providing instant ranking lookups.'
          }
        },
        {
          id: 'fs-w4-d24-t7',
          topicNumber: 7,
          title: 'Distributed Session Storage with Redis',
          explanation: [
            'If you deploy your backend across 3 server instances (load balanced), storing session memory inside Node.js `MemoryStore` means a user logging into Server 1 will appear logged out when the balancer directs them to Server 2.',
            'Pointing `express-session` or token blocklists to a centralized Redis cluster shares session state across all server instances seamlessly.'
          ],
          codeSnippet: {
            id: 'fs-t24-c7',
            title: 'Configuring Redis Session Store in Express',
            description: 'Centralized session state across distributed clusters.',
            language: 'javascript',
            code: `// import session from 'express-session';
// import { RedisStore } from 'connect-redis';

// const sessionMiddleware = session({
//   store: new RedisStore({ client: redisClient }),
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true, httpOnly: true, maxAge: 86400000 }
// });`,
            expectedOutput: 'Sessions accessible across all cluster nodes without memory leaks'
          },
          pitfall: 'Never use the default `MemoryStore` for `express-session` in production; it leaks memory and fails in multi-process/multi-server deployments.',
          quickCheck: {
            question: 'Why is the default in-memory session store unusable when running multiple backend server instances?',
            options: [
              'Because memory is not shared between server instances; a request routed to a different instance will lose the session',
              'Because memory stores are too fast',
              'Because Express bans it',
              'It requires Docker'
            ],
            correctIndex: 0,
            explanation: 'Separate server processes do not share RAM; a central store like Redis is required for shared sessions.'
          }
        },
        {
          id: 'fs-w4-d24-t8',
          topicNumber: 8,
          title: 'Database Architecture Decision Matrix: Choosing the Right Storage Tier',
          explanation: [
            'Production enterprise systems use Polyglot Persistence: using multiple specialized storage engines together:',
            'PostgreSQL: Core transactional source of truth (Users, Orders, Billing, Relational models).',
            'Redis: Ephemeral fast caching, rate limiting, pub/sub messaging, and sessions.',
            'MongoDB / S3: Flexible documents, unstructured payloads, and static media files.'
          ],
          codeSnippet: {
            id: 'fs-t24-c8',
            title: 'Polyglot Architecture Blueprint',
            description: 'Combining PostgreSQL, Redis, and Object Storage.',
            language: 'bash',
            code: `# PostgreSQL: Primary Source of Truth (ACID, Financial, Relations)
# Redis: Caching Tier (Sub-millisecond reads, Session store, Rate limit)
# S3 / GCS: Cloud Object Storage (Video lessons, Avatars, PDF Certificates)`,
            expectedOutput: 'Balanced full-stack architecture leveraging the strengths of each storage tier'
          },
          pitfall: 'Trying to force one single database engine to do everything (e.g. using relational SQL as an in-memory cache or using Redis as a 500GB primary database) leads to severe performance degradation.',
          quickCheck: {
            question: 'What is Polyglot Persistence in software architecture?',
            options: [
              'Using only one database for everything',
              'Using different database technologies to handle different data storage needs based on their strengths',
              'Translating SQL to Spanish',
              'Deleting old databases'
            ],
            correctIndex: 1,
            explanation: 'Polyglot persistence leverages the optimal database engine (SQL, Redis, S3) for each specific data requirement.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Implement a Cached API Endpoint with Cache-Aside & Invalidation',
        instructions: [
          'Create a mock Redis cache and PostgreSQL database.',
          'Build getCourseStats(id) implementing the cache-aside pattern with 60-second TTL.',
          'Build updateCourseStats(id, updates) that modifies the database and invalidates the cache.',
          'Verify that updates clear the cache.'
        ],
        starterCode: `// Write complete cache-aside and invalidation implementation`,
        solutionCode: `const mockDb = { 1: { id: 1, title: 'Full Stack Web Dev', views: 500 } };
const mockRedis = new Map();

async function getCourseStats(id) {
  const cacheKey = \`stats:course:\${id}\`;
  if (mockRedis.has(cacheKey)) {
    console.log('Cache Hit!');
    return JSON.parse(mockRedis.get(cacheKey));
  }

  console.log('Cache Miss! Fetching from DB...');
  const data = mockDb[id];
  mockRedis.set(cacheKey, JSON.stringify(data));
  return data;
}

async function updateCourseStats(id, updates) {
  Object.assign(mockDb[id], updates);
  // Cache Invalidation
  mockRedis.delete(\`stats:course:\${id}\`);
  console.log('Cache invalidated for course:', id);
}

// Test flow
getCourseStats(1).then(() => {
  getCourseStats(1); // Should hit cache
  updateCourseStats(1, { views: 600 });
  getCourseStats(1); // Should miss cache and re-fetch fresh views
});`,
        hints: [
          'Check mockRedis before reading mockDb.',
          'Call mockRedis.delete on mutation to invalidate.'
        ]
      },
      keyTakeaways: [
        'Document databases (MongoDB) excel at hierarchical, polymorphic JSON data.',
        'Redis delivers sub-millisecond in-memory speeds for caching, sessions, and leaderboards.',
        'Always implement the Cache-Aside pattern with TTL and invalidate on write.'
      ]
    },
    {
      id: 'fs-w4-d25',
      dayNumber: 25,
      weekNumber: 4,
      title: 'Full-Stack Integration: Connecting React Frontend to Node/DB Backend',
      subtitle: 'API client abstraction, TanStack Query, optimistic UI, and error boundaries',
      durationMinutes: 50,
      overview:
        'Bridge the gap between client and server. Wire up your React frontend to your Express backend: building an API client abstraction with Axios/Fetch, managing server caching with TanStack React Query, executing optimistic UI updates, and catching errors with Error Boundaries.',
      topics: [
        {
          id: 'fs-w4-d25-t1',
          topicNumber: 1,
          title: 'The Unified Full-Stack Architecture Blueprint',
          explanation: [
            'A production full-stack application connects a client layer (React, Tailwind CSS, TypeScript), a network boundary (HTTP/REST, JSON, HTTPS, CORS), a server layer (Node.js, Express, Middleware, Zod, JWT), and a data layer (PostgreSQL, Prisma, Redis).',
            'Keeping interfaces typed and consistent across the boundary ensures end-to-end type safety.'
          ],
          codeSnippet: {
            id: 'fs-t25-c1',
            title: 'End-to-End Type Sharing Across Frontend & Backend',
            description: 'Shared types package or directory imported by client and server.',
            language: 'typescript',
            code: `// Shared Interface: types/curriculum.ts
export interface CourseProgressDto {
  courseId: string;
  completedDays: number[];
  unlockedWeeks: number[];
  percentage: number;
}

// Both Express controller and React frontend import the EXACT same interface!
// Backend returns CourseProgressDto -> Frontend receives CourseProgressDto!`,
            expectedOutput: 'End-to-end contract synchronization preventing client-server discrepancies'
          },
          pitfall: 'Do not define different shapes of the same data model independently in frontend and backend code; share types via a shared directory or monorepo package.',
          quickCheck: {
            question: 'What is the primary benefit of sharing TypeScript interfaces between frontend and backend?',
            options: [
              'It eliminates the need for a database',
              'Any change to the backend API response contract will immediately flag type errors in frontend components during compilation',
              'It speeds up CSS animations',
              'It replaces Docker'
            ],
            correctIndex: 1,
            explanation: 'Shared type contracts ensure frontend components and backend endpoints stay perfectly synchronized at compile time.'
          }
        },
        {
          id: 'fs-w4-d25-t2',
          topicNumber: 2,
          title: 'Building a Centralized API Client with Fetch & Axios',
          explanation: [
            'Never scatter raw `fetch("http://localhost:3000/api/...")` calls across 30 different React components.',
            'Create a centralized `apiClient` that automatically attaches the base URL, handles `Authorization: Bearer <token>` headers, sets JSON content headers, and intercepts 401 errors for auto-redirect.'
          ],
          codeSnippet: {
            id: 'fs-t25-c2',
            title: 'Type-Safe Centralized API Client Wrapper',
            description: 'Centralized fetch wrapper handling base URL and error parsing.',
            language: 'typescript',
            code: `const API_BASE = '/api';

export async function apiRequest<TResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: \`Bearer \${token}\` }),
    ...options.headers,
  };

  const response = await fetch(\`\${API_BASE}\${endpoint}\`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || \`HTTP error \${response.status}\`);
  }

  return response.json();
}`,
            expectedOutput: 'Clean, centralized network abstraction used across all React views'
          },
          pitfall: 'Do not hardcode `http://localhost:3000` inside your API client; use relative paths `/api` or environment variables `import.meta.env.VITE_API_BASE` so it works in production.',
          quickCheck: {
            question: 'Why should you use relative paths (e.g. /api/users) or environment variables instead of hardcoding http://localhost:3000?',
            options: [
              'Because localhost:3000 only exists on your local laptop; in production, the code runs on cloud domains with HTTPS',
              'Browsers block the word localhost',
              'To save memory',
              'It is required by Tailwind'
            ],
            correctIndex: 0,
            explanation: 'Hardcoding localhost will break in production where the app runs on a public domain.'
          }
        },
        {
          id: 'fs-w4-d25-t3',
          topicNumber: 3,
          title: 'Server State Management with TanStack React Query',
          explanation: [
            'TanStack Query (React Query) replaces fragile `useEffect` data fetching.',
            'It provides `useQuery({ queryKey, queryFn })`: automatic caching, loading and error states, background re-fetching on window focus, and deduplication of simultaneous requests.'
          ],
          codeSnippet: {
            id: 'fs-t25-c3',
            title: 'Declarative Data Fetching with useQuery',
            description: 'Zero boilerplate loading, error, and cached data states.',
            language: 'typescript',
            code: `// import { useQuery } from '@tanstack/react-query';

function CourseCatalogView() {
  // const { data: courses, isLoading, error } = useQuery({
  //   queryKey: ['courses'],
  //   queryFn: () => apiRequest<Course[]>('/courses'),
  //   staleTime: 1000 * 60 * 5 // 5 minutes cache
  // });

  // if (isLoading) return <LoadingSpinner />;
  // if (error) return <ErrorMessage message={error.message} />;
  return <div>Loaded courses cleanly</div>;
}`,
            expectedOutput: 'Automatic caching, background re-fetching, and declarative UI states'
          },
          pitfall: 'Do not duplicate React Query data into local `useState`; let React Query serve as the single source of truth for all remote server state.',
          quickCheck: {
            question: 'What does staleTime: 60000 do in TanStack React Query?',
            options: [
              'Deletes the data after 60 seconds',
              'Considers data fresh for 60 seconds, skipping background network re-fetches during that window',
              'Slows down the browser',
              'Closes the tab'
            ],
            correctIndex: 1,
            explanation: 'staleTime specifies the duration data is considered fresh before a background re-fetch is triggered.'
          }
        },
        {
          id: 'fs-w4-d25-t4',
          topicNumber: 4,
          title: 'Optimistic UI Updates: Zero-Latency User Interactions',
          explanation: [
            'In standard apps, clicking "Complete Day" makes the UI wait 300ms for the server to reply before changing the icon.',
            'Optimistic UI immediately updates the client screen assuming success. If the server request fails, it rolls back to previous state and displays an error toast, giving users a blazing fast, native-feeling UI.'
          ],
          codeSnippet: {
            id: 'fs-t25-c4',
            title: 'Optimistic State Toggle Pattern',
            description: 'Immediate local UI update with server error rollback.',
            language: 'typescript',
            code: `function handleToggleDayComplete(dayNumber: number) {
  // 1. Snapshot previous state for rollback
  const previousCompleted = [...progress.completedDays];

  // 2. Immediately update UI optimistically (Instant 0ms feedback!)
  setProgress(prev => ({
    ...prev,
    completedDays: prev.completedDays.includes(dayNumber)
      ? prev.completedDays.filter(d => d !== dayNumber)
      : [...prev.completedDays, dayNumber]
  }));

  // 3. Fire server mutation in background
  fetch('/api/progress/toggle', { method: 'POST', body: JSON.stringify({ dayNumber }) })
    .catch(() => {
      // Rollback on server error!
      console.error('Server sync failed! Rolling back...');
      setProgress(prev => ({ ...prev, completedDays: previousCompleted }));
    });
}`,
            expectedOutput: 'Instantaneous UI feedback with reliable error rollback protection'
          },
          pitfall: 'Always preserve a rollback snapshot before applying an optimistic update so you can restore the exact previous state if the network fails.',
          quickCheck: {
            question: 'What is the primary user experience advantage of Optimistic UI updates?',
            options: [
              'Zero-latency perception: UI responds immediately to user clicks without waiting for network round-trips',
              'It encrypts data',
              'It eliminates backend databases',
              'It works without electricity'
            ],
            correctIndex: 0,
            explanation: 'Optimistic UI makes interactions feel instantaneous by updating the interface before the server response returns.'
          }
        },
        {
          id: 'fs-w4-d25-t5',
          topicNumber: 5,
          title: 'Handling Errors Gracefully: React Error Boundaries',
          explanation: [
            'By default, if an unhandled JavaScript error occurs inside any component render, React unmounts the entire application tree, leaving the user with a blank white screen.',
            'An Error Boundary is a React component that catches JavaScript errors anywhere in its child component tree and displays a graceful fallback UI.'
          ],
          codeSnippet: {
            id: 'fs-t25-c5',
            title: 'React Error Boundary Component',
            description: 'Catching runtime render errors and presenting recovery screen.',
            language: 'typescript',
            code: `import React from 'react';

interface ErrorBoundaryProps { children: React.ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: Error | null; }

export class AppErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Captured in Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-md mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
          <p className="text-sm text-slate-500">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
            expectedOutput: 'Catches runtime exceptions and prevents full-page whiteout crashes'
          },
          pitfall: 'Error boundaries catch errors during rendering, in lifecycle methods, and in constructors. They do NOT catch errors in asynchronous event handlers (use `try/catch` there).',
          quickCheck: {
            question: 'What happens if a child component throws an unhandled error during render without an Error Boundary?',
            options: [
              'React unmounts the entire application tree, leaving the user with a blank white screen',
              'React ignores the error',
              'The browser reboots',
              'A popup alert appears'
            ],
            correctIndex: 0,
            explanation: 'Uncaught render errors cause React to unmount the entire component tree to avoid corrupt UI state.'
          }
        },
        {
          id: 'fs-w4-d25-t6',
          topicNumber: 6,
          title: 'Vite Proxy: Seamless Local Full-Stack Development',
          explanation: [
            'In development, Vite frontend runs on `http://localhost:5173` and Express backend runs on `http://localhost:3000`. Direct requests trigger CORS errors.',
            'Vite built-in development proxy (`vite.config.ts`) proxies all `/api` requests from Vite to Express, eliminating CORS issues during development completely.'
          ],
          codeSnippet: {
            id: 'fs-t25-c6',
            title: 'Configuring Vite Development Proxy',
            description: 'Forwarding /api calls to backend server transparently.',
            language: 'typescript',
            code: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Forward to Express server
        changeOrigin: true,
        secure: false
      }
    }
  }
});`,
            expectedOutput: 'Frontend fetch("/api/courses") routes cleanly to Express port 3000 without CORS'
          },
          pitfall: 'Vite proxy only runs during local development (`npm run dev`). In production, configure reverse proxy in Nginx/Vercel or serve static assets from Express.',
          quickCheck: {
            question: 'What problem does the Vite dev server proxy solve during local development?',
            options: [
              'It eliminates CORS errors by forwarding /api requests directly to the backend server behind the same origin',
              'It compiles TypeScript',
              'It minifies CSS',
              'It runs unit tests'
            ],
            correctIndex: 0,
            explanation: 'The proxy forwards requests to the backend server seamlessly from the same origin, bypassing browser CORS restrictions.'
          }
        },
        {
          id: 'fs-w4-d25-t7',
          topicNumber: 7,
          title: 'Full-Stack Form Submissions: React Hook Form & Zod Resolver',
          explanation: [
            'Combining React Hook Form with Zod (`@hookform/resolvers/zod`) shares your backend validation schema directly with the frontend form.',
            'Forms validate instantly on the client as users type, while the identical schema validates on the Express server upon submission.'
          ],
          codeSnippet: {
            id: 'fs-t25-c7',
            title: 'Shared Zod Schema in React Hook Form',
            description: 'Single validation schema powering client and server forms.',
            language: 'typescript',
            code: `// Shared schema: LoginSchema
// const { register, handleSubmit, formState: { errors } } = useForm({
//   resolver: zodResolver(LoginSchema)
// });

// const onSubmit = async (data) => {
//   await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) });
// };`,
            expectedOutput: 'Client form immediately highlights invalid inputs matching backend rules'
          },
          pitfall: 'Do not duplicate validation regular expressions in React; import the exact same Zod schema used on the backend.'
          ,
          quickCheck: {
            question: 'What is the primary advantage of using a Zod resolver in React Hook Form?',
            options: [
              'It allows using the exact same Zod validation schema across both frontend forms and backend API routes',
              'It speeds up CSS',
              'It removes HTML',
              'It eliminates the need for passwords'
            ],
            correctIndex: 0,
            explanation: 'Using the same schema on frontend and backend guarantees identical validation rules and eliminates code duplication.'
          }
        },
        {
          id: 'fs-w4-d25-t8',
          topicNumber: 8,
          title: 'Telemetry & Full-Stack Health Checks (/api/health)',
          explanation: [
            'Every production web service must expose an unauthenticated `/api/health` or `/livez` endpoint.',
            'Cloud load balancers and container orchestrators (Kubernetes, AWS ECS) poll this endpoint every 10 seconds: if it returns `200 OK`, traffic is routed; if the database is down or memory exhausted, it fails over.'
          ],
          codeSnippet: {
            id: 'fs-t25-c8',
            title: 'Production Health Check Endpoint in Express',
            description: 'Verifying database connectivity and uptime.',
            language: 'javascript',
            code: `app.get('/api/health', async (req, res) => {
  const healthcheck = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: { database: 'unknown' }
  };

  try {
    // Ping database: SELECT 1
    // await prisma.$queryRaw\`SELECT 1\`;
    healthcheck.checks.database = 'connected';
    res.status(200).json(healthcheck);
  } catch (err) {
    healthcheck.status = 'unhealthy';
    healthcheck.checks.database = 'disconnected';
    res.status(503).json(healthcheck);
  }
});`,
            expectedOutput: 'HTTP/1.1 200 OK\n{"status":"healthy","uptime":1420,"checks":{"database":"connected"}}'
          },
          pitfall: 'Never protect `/api/health` behind authentication; load balancers cannot authenticate and will mark your server unhealthy.',
          quickCheck: {
            question: 'Why must the /api/health endpoint be publicly accessible without authentication?',
            options: [
              'Because cloud load balancers and orchestrators must poll it anonymously to determine if the server is healthy',
              'To let hackers test the server',
              'Because health checks do not support JSON',
              'It does not matter'
            ],
            correctIndex: 0,
            explanation: 'Automated infrastructure load balancers require unauthenticated access to monitor node vitality.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Wire Up an End-to-End Course Progress Toggle Flow',
        instructions: [
          'Create a client-side function toggleDay(dayNum) that updates local state optimistically.',
          'Send POST /api/progress/toggle with the day number.',
          'Revert state and show an alert if the network call rejects.',
          'Add a /api/health endpoint.'
        ],
        starterCode: `// Write complete optimistic toggle integration and healthcheck`,
        solutionCode: `async function toggleDayOptimistic(dayNumber, currentDays, setDays) {
  const previous = [...currentDays];
  const next = previous.includes(dayNumber)
    ? previous.filter(d => d !== dayNumber)
    : [...previous, dayNumber];

  // Optimistic UI
  setDays(next);

  try {
    const res = await fetch('/api/progress/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dayNumber })
    });
    if (!res.ok) throw new Error('Failed to persist');
  } catch (e) {
    console.error('Sync failed, rolling back UI');
    setDays(previous); // Rollback!
  }
}`,
        hints: [
          'Store previous state array before setting optimistic state.',
          'Revert to previous in catch block.'
        ]
      },
      keyTakeaways: [
        'Centralize API client requests to handle base URLs, auth headers, and errors consistently.',
        'Use Optimistic UI updates to provide instant native-feeling responsiveness.',
        'Always expose an unauthenticated /api/health endpoint for cloud load balancers.'
      ]
    },
    {
      id: 'fs-w4-d26',
      dayNumber: 26,
      weekNumber: 4,
      title: 'Advanced Git & GitHub Collaboration: PRs, Rebase & Conflicts',
      subtitle: 'Git branching models, interactive rebase, pull requests, code reviews, and resolving conflicts',
      durationMinutes: 50,
      overview:
        'Level up your version control to senior software engineering standards. Master trunk-based development vs Gitflow, interactive rebase (git rebase -i) to squash messy commit histories, resolving gnarly merge conflicts, and conducting professional GitHub code reviews.',
      topics: [
        {
          id: 'fs-w4-d26-t1',
          topicNumber: 1,
          title: 'Git Branching Strategies: Trunk-Based Development vs Gitflow',
          explanation: [
            'Gitflow: Long-lived branches (`develop`, `release`, `hotfix`, `feature`). Feature branches live for weeks, causing painful "merge hell" when integrating.',
            'Trunk-Based Development: Modern industry standard. Developers merge small, short-lived feature branches (< 1-2 days) frequently into `main` (the trunk), backed by automated CI tests and feature flags.'
          ],
          codeSnippet: {
            id: 'fs-t26-c1',
            title: 'Trunk-Based Workflow Commands',
            description: 'Fast, short-lived branch creation and synchronization.',
            language: 'bash',
            code: `# 1. Pull latest trunk (main)
git switch main
git pull --rebase origin main

# 2. Create small, focused feature branch
git switch -c feat/navbar-theme-toggle

# 3. Commit atomic changes
git commit -am "feat: add light and dark mode toggle"

# 4. Push and open PR within 24 hours
git push -u origin feat/navbar-theme-toggle`,
            expectedOutput: 'Short-lived branch ready for rapid peer review and automated CI merge'
          },
          pitfall: 'Letting feature branches linger for weeks without pulling changes from `main` guarantees massive, painful merge conflicts.',
          quickCheck: {
            question: 'What is the core principle of Trunk-Based Development compared to Gitflow?',
            options: [
              'Developers avoid using branches completely',
              'Developers merge small, short-lived branches frequently into the main trunk, avoiding long-lived branch divergence',
              'Git is not used',
              'Commits are disabled'
            ],
            correctIndex: 1,
            explanation: 'Trunk-Based Development emphasizes short-lived branches merged quickly into main to prevent merge conflicts.'
          }
        },
        {
          id: 'fs-w4-d26-t2',
          topicNumber: 2,
          title: 'Git Merge vs Git Rebase: Linear vs Historical Graph',
          explanation: [
            '`git merge` creates a new "Merge Commit" that ties two histories together, preserving exact branch history but cluttering the commit log with "Merge branch..." noise.',
            '`git rebase` lifts your branch commits and replays them one-by-one on top of the target branch tip, creating a clean, perfectly linear project history without merge commits.'
          ],
          codeSnippet: {
            id: 'fs-t26-c2',
            title: 'Rebasing a Feature Branch onto Latest Main',
            description: 'Replaying commits on top of updated upstream main.',
            language: 'bash',
            code: `# Switch to feature branch
git switch feat/auth-service

# Rebase commits on top of the latest main branch
git fetch origin
git rebase origin/main

# History is now linear: [main commits] -> [your feature commits]`,
            expectedOutput: 'Successfully rebased and updated refs/heads/feat/auth-service'
          },
          pitfall: 'THE GOLDEN RULE OF REBASE: Never rebase a public shared branch (like `main` or `develop`)! Rebasing rewrites commit SHA hashes and breaks teammates repositories. Only rebase your local private feature branches.',
          quickCheck: {
            question: 'What is the Golden Rule of Git Rebase?',
            options: [
              'Never rebase on a laptop',
              'Never rebase commits that exist outside your local repository and have been pushed to a shared public branch',
              'Always rebase main into master',
              'Rebase once a year'
            ],
            correctIndex: 1,
            explanation: 'Rebasing rewrites commit hashes; doing so on shared branches corrupts teammates Git histories.'
          }
        },
        {
          id: 'fs-w4-d26-t3',
          topicNumber: 3,
          title: 'Interactive Rebase: Squashing Messy Commits (git rebase -i)',
          explanation: [
            'During local feature development, developers create messy exploratory commits: "wip", "fix typo", "testing again", "oops".',
            'Before submitting a Pull Request, run `git rebase -i HEAD~4` to Squash multiple trivial commits into a single cohesive, beautifully documented commit.'
          ],
          codeSnippet: {
            id: 'fs-t26-c3',
            title: 'Interactive Rebase Command and Editor Commands',
            description: 'Squashing 3 exploratory commits into one clean commit.',
            language: 'bash',
            code: `# Interactively rebase the last 3 commits
git rebase -i HEAD~3

# In the interactive editor:
# pick 3a1b4c5 feat: scaffold registration endpoint
# squash 7e8f9a0 fix typo in email validator
# squash 1c2d3e4 clean up console logs
# (Saves and prompts for a single unified commit message!)`,
            expectedOutput: '[detached HEAD 9a4e21c] feat: implement registration endpoint with email validation'
          },
          pitfall: 'Do not panic if you make a mistake during rebase; `git rebase --abort` immediately restores your branch to its exact state before you started rebasing.',
          quickCheck: {
            question: 'What command immediately cancels an ongoing interactive rebase and returns your repository to its original state?',
            options: ['git cancel', 'git rebase --abort', 'git reset --hard', 'git exit'],
            correctIndex: 1,
            explanation: 'git rebase --abort stops the rebase operation and resets the working branch to where it started.'
          }
        },
        {
          id: 'fs-w4-d26-t4',
          topicNumber: 4,
          title: 'Resolving Merge Conflicts Confidently',
          explanation: [
            'When two commits modify the exact same line of code in different ways, Git halts and inserts conflict markers:',
            '`<<<<<<< HEAD` (your current branch code), `=======` (separator), `>>>>>>> branch` (incoming branch code).',
            'To resolve: inspect both changes, choose the correct combination, delete the conflict markers, stage with `git add`, and continue.'
          ],
          codeSnippet: {
            id: 'fs-t26-c4',
            title: 'Anatomy and Resolution of a Merge Conflict',
            description: 'Editing conflict markers in source code.',
            language: 'typescript',
            code: `// CONFLICT MARKERS IN SOURCE CODE:
// <<<<<<< HEAD (Current Change on main)
// const maxRetries = 5;
// =======
// const maxRetries = 3;
// >>>>>>> feat/login-security (Incoming Change)

// RESOLUTION (Pick correct logic and delete markers):
const maxRetries = 5; // Retain 5 retries agreed upon in team review`,
            expectedOutput: 'Conflict resolved, file staged with git add, and merge continued'
          },
          pitfall: 'Accidentally leaving a `<<<<<<< HEAD` marker inside your file will cause immediate syntax errors when the code compiles.',
          quickCheck: {
            question: 'What should you do with the <<<<<<<, =======, and >>>>>>> markers when resolving a merge conflict?',
            options: [
              'Leave them for the browser to parse',
              'Delete all marker lines completely after selecting the desired code',
              'Comment them out',
              'Copy them to another file'
            ],
            correctIndex: 1,
            explanation: 'Conflict markers are temporary visual aids inserted by Git and must be removed before staging the resolved file.'
          }
        },
        {
          id: 'fs-w4-d26-t5',
          topicNumber: 5,
          title: 'Git Cherry-Pick: Selectively Transplanting a Single Commit',
          explanation: [
            '`git cherry-pick <commit-hash>` applies the changes introduced by a specific commit from another branch directly onto your current branch, without merging the whole branch.',
            'Invaluable for extracting a single critical hotfix or isolated feature from an incomplete branch.'
          ],
          codeSnippet: {
            id: 'fs-t26-c5',
            title: 'Cherry-Picking a Hotfix Commit to Main',
            description: 'Transplanting a single commit SHA directly onto main.',
            language: 'bash',
            code: `# Find the commit hash on experimental branch
git log experimental-branch --oneline -n 3
# Output: e4a81c2 fix: patch critical auth token expiration

# Switch to main and cherry-pick only that specific commit!
git switch main
git cherry-pick e4a81c2`,
            expectedOutput: '[main 91b2c4e] fix: patch critical auth token expiration\n 1 file changed, 4 insertions(+), 2 deletions(-)'
          },
          pitfall: 'Cherry-picking creates a duplicate commit with a new SHA hash; overusing cherry-picking instead of clean merging can lead to duplicated commit histories.',
          quickCheck: {
            question: 'What does git cherry-pick <hash> do?',
            options: [
              'Deletes a commit',
              'Applies the exact changes from a specific commit onto your current branch',
              'Pushes to GitHub',
              'Creates a pull request'
            ],
            correctIndex: 1,
            explanation: 'Cherry-pick takes the patch introduced by a single commit and applies it on top of the currently checked out branch.'
          }
        },
        {
          id: 'fs-w4-d26-t6',
          topicNumber: 6,
          title: 'The Safety Net: git reflog and Recovering "Lost" Commits',
          explanation: [
            'In Git, it is almost impossible to truly lose committed work.',
            '`git reflog` (reference log) records every time HEAD was updated (commits, checkouts, rebases, resets).',
            'Even if you run `git reset --hard` and accidentally delete your work, `git reflog` shows the commit hash, allowing you to restore it instantly via `git reset --hard HEAD@{1}`.'
          ],
          codeSnippet: {
            id: 'fs-t26-c6',
            title: 'Rescuing Deleted Commits with Reflog',
            description: 'Inspecting reflog and restoring state after accidental reset.',
            language: 'bash',
            code: `# View history of all past HEAD pointer movements
git reflog

# Output:
# 3b4e1a2 HEAD@{0}: reset: moving to HEAD~1 (Accidental deletion!)
# 9f8c2b1 HEAD@{1}: commit: feat: complete database integration (Lost commit!)

# Restore the lost commit instantly:
git reset --hard 9f8c2b1`,
            expectedOutput: 'HEAD is now at 9f8c2b1 feat: complete database integration\nLost work completely restored!'
          },
          pitfall: 'Reflog only tracks committed work or staged states; uncommitted, unstaged modifications in your working directory cannot be recovered if wiped with `git checkout -- .`. Commit often!',
          quickCheck: {
            question: 'What tool allows developers to find and recover commits that were accidentally deleted via git reset --hard?',
            options: ['git status', 'git reflog', 'git diff', 'npm recover'],
            correctIndex: 1,
            explanation: 'git reflog tracks every movement of HEAD, providing an immutable audit trail to recover discarded commits.'
          }
        },
        {
          id: 'fs-w4-d26-t7',
          topicNumber: 7,
          title: 'Conducting Professional Pull Request Code Reviews on GitHub',
          explanation: [
            'Code review is a collaborative quality gate, not an interrogation.',
            'Effective reviewers check: architectural soundness, edge cases, test coverage, security vulnerabilities (un-sanitized inputs), and maintainability.',
            'Use GitHub Suggestion blocks (```suggestion) so authors can apply one-click fixes directly in the PR diff.'
          ],
          codeSnippet: {
            id: 'fs-t26-c7',
            title: 'GitHub Suggestion Block in Markdown Review',
            description: 'Providing executable one-click code suggestions in PR comments.',
            language: 'bash',
            code: `# In GitHub PR review comment:
# \`\`\`suggestion
# const token = req.headers.authorization?.split(' ')[1];
# if (!token) return res.status(401).json({ error: 'Token missing' });
# \`\`\`
# Author clicks "Commit suggestion" to accept change instantly!`,
            expectedOutput: 'Collaborative code review with actionable, one-click patch application'
          },
          pitfall: 'Avoid nitpicking purely stylistic formatting (tabs vs spaces); automate formatting with Prettier and ESLint in CI so human reviewers focus on architecture and logic.',
          quickCheck: {
            question: 'What should automated CI linters (ESLint/Prettier) handle instead of human code reviewers?',
            options: [
              'Architectural design decisions',
              'Stylistic formatting, semicolon rules, and indentation nitpicks',
              'Company business strategy',
              'Security audits'
            ],
            correctIndex: 1,
            explanation: 'Formatting and style enforcement should be 100% automated so engineers focus on logic, architecture, and edge cases.'
          }
        },
        {
          id: 'fs-w4-d26-t8',
          topicNumber: 8,
          title: 'GitHub Branch Protection Rules & Required Status Checks',
          explanation: [
            'In enterprise repositories, developers are forbidden from pushing directly to `main`.',
            'GitHub Branch Protection Rules enforce: 1) Require a Pull Request before merging, 2) Require at least 1-2 approving peer reviews, 3) Require all automated CI checks (linting, tests, build) to pass green.'
          ],
          codeSnippet: {
            id: 'fs-t26-c8',
            title: 'Configuring Branch Protection Safeguards',
            description: 'Enforcing merge criteria on production branches.',
            language: 'bash',
            code: `# GitHub Repository Settings -> Branches -> Add rule: "main"
# [X] Require a pull request before merging
#     [X] Require approvals: 1
#     [X] Dismiss stale pull request approvals when new commits are pushed
# [X] Require status checks to pass before merging
#     [X] Require branches to be up to date before merging
#     Status checks: "test", "build", "lint"
# [X] Do not allow bypassing the above settings`,
            expectedOutput: 'Production branch permanently protected against accidental or broken pushes'
          },
          pitfall: 'Never disable branch protection to push a quick emergency fix; emergency fixes are the most likely to introduce critical regressions.',
          quickCheck: {
            question: 'What does a GitHub Branch Protection Rule requiring "status checks to pass before merging" prevent?',
            options: [
              'Prevents merging PRs whose automated tests, linting, or build checks have failed',
              'Prevents anyone from reading the code',
              'Deletes branches automatically',
              'Prevents opening new issues'
            ],
            correctIndex: 0,
            explanation: 'Required status checks block PRs with failing automated test suites from merging into production.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Simulate Interactive Rebase and Conflict Resolution',
        instructions: [
          'Create a git repository with an initial commit on main.',
          'Create two branches: feature-a and feature-b modifying the same file line.',
          'Merge feature-a into main.',
          'Attempt to merge feature-b, observe conflict markers, resolve, and commit.'
        ],
        starterCode: `# Write bash commands to simulate conflict resolution`,
        solutionCode: `git init
echo "version = 1" > config.txt
git add config.txt
git commit -m "chore: initial version"

git switch -c feature-a
echo "version = 2 (feature-a)" > config.txt
git commit -am "feat: bump version to 2"

git switch main
git switch -c feature-b
echo "version = 3 (feature-b)" > config.txt
git commit -am "feat: bump version to 3"

# Merge feature-a into main
git switch main
git merge feature-a

# Merge feature-b -> CONFLICT!
git merge feature-b || true

# Resolve conflict
echo "version = 3 (resolved)" > config.txt
git add config.txt
git commit -m "merge: resolve version conflict between feature-a and feature-b"
git log --oneline -n 4`,
        hints: [
          'Both branches modify config.txt, creating conflict on merge.',
          'Overwrite config.txt with resolved version and stage with git add.'
        ]
      },
      keyTakeaways: [
        'Trunk-based development with short-lived branches minimizes painful merge conflicts.',
        'Use interactive rebase (git rebase -i) to squash messy commits before submitting PRs.',
        'Protect production branches using GitHub Branch Protection Rules requiring peer approvals and green CI checks.'
      ]
    },
    {
      id: 'fs-w4-d27',
      dayNumber: 27,
      weekNumber: 4,
      title: 'Containerization with Docker: Dockerfile, Images & Docker Compose',
      subtitle: 'OS containers, Dockerfile instructions, multi-stage builds, and multi-container composition',
      durationMinutes: 50,
      overview:
        'Eliminate the "it works on my machine" problem forever. Master containerization with Docker: understand containers vs virtual machines, write optimized multi-stage Dockerfiles for Node.js and React, manage environment variables, and orchestrate multi-container apps (Node + PostgreSQL + Redis) using Docker Compose.',
      topics: [
        {
          id: 'fs-w4-d27-t1',
          topicNumber: 1,
          title: 'Containers vs Virtual Machines: The Docker Revolution',
          explanation: [
            'Virtual Machines (VMs) virtualize physical hardware, running a complete guest Operating System (several gigabytes, slow boots, heavy CPU/RAM overhead).',
            'Docker Containers virtualize the OS kernel. Containers share the host OS kernel and run as isolated processes with their own filesystem, environment variables, and networking (megabytes, sub-second boot).'
          ],
          codeSnippet: {
            id: 'fs-t27-c1',
            title: 'Verifying Docker CLI and Running Hello-World',
            description: 'Inspecting Docker daemon and running first test container.',
            language: 'bash',
            code: `# Verify Docker installation
docker --version

# Run official hello-world container
docker run hello-world

# List active running containers
docker ps`,
            expectedOutput: 'Hello from Docker! This message shows that your installation appears to be working correctly.'
          },
          pitfall: 'Do not confuse Docker Images with Containers. An Image is a read-only blueprint (class); a Container is a live, running instance of an image (object).',
          quickCheck: {
            question: 'What is the fundamental architectural difference between Docker containers and Virtual Machines (VMs)?',
            options: [
              'Containers share the host OS kernel and run as lightweight isolated user-space processes; VMs package a full guest OS on virtual hardware',
              'VMs do not use RAM',
              'Docker is only for CSS',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'Containers share the host operating system kernel, making them lightweight and fast compared to full VMs.'
          }
        },
        {
          id: 'fs-w4-d27-t2',
          topicNumber: 2,
          title: 'The Anatomy of a Dockerfile: Core Instructions',
          explanation: [
            'A `Dockerfile` is a text document containing instructions to build a Docker image.',
            'Core instructions: `FROM` (base image), `WORKDIR` (working directory), `COPY` (transfer files into container), `RUN` (execute shell commands during build), `EXPOSE` (document port), `CMD` (default runtime command).'
          ],
          codeSnippet: {
            id: 'fs-t27-c2',
            title: 'Standard Node.js Dockerfile',
            description: 'Containerizing a Node.js Express server.',
            language: 'bash',
            code: `# 1. Base Image: Lean Node 22 Alpine Linux
FROM node:22-alpine

# 2. Set container working directory
WORKDIR /app

# 3. Copy package manifests first for optimal layer caching!
COPY package*.json ./

# 4. Install production dependencies
RUN npm ci --only=production

# 5. Copy remaining application source code
COPY . .

# 6. Expose HTTP port
EXPOSE 3000

# 7. Start server process
CMD ["node", "src/server.js"]`,
            expectedOutput: 'Step 1/7 : FROM node:22-alpine\nSuccessfully tagged my-backend:latest'
          },
          pitfall: 'Copying source code before `package.json` (`COPY . .` before `RUN npm install`) invalidates Docker layer cache every time you change a line of code, forcing slow re-installations of node_modules!',
          quickCheck: {
            question: 'Why should COPY package*.json ./ and RUN npm install precede COPY . . in a Dockerfile?',
            options: [
              'Docker requires it',
              'To take advantage of Docker layer caching: if dependencies did not change, Docker reuses the cached layer and skips npm install',
              'To speed up CSS',
              'To delete files'
            ],
            correctIndex: 1,
            explanation: 'Docker caches layers sequentially. Copying package manifests first prevents unnecessary npm re-installations on code changes.'
          }
        },
        {
          id: 'fs-w4-d27-t3',
          topicNumber: 3,
          title: 'The .dockerignore File: Keeping Images Lean and Secure',
          explanation: [
            'Just like `.gitignore`, `.dockerignore` prevents copying unwanted, sensitive, or heavy files into the Docker build context.',
            'Always exclude `node_modules/` (let container build its own Linux binaries), `.env` (prevents baking secrets into image layers!), `.git/`, and build artifacts.'
          ],
          codeSnippet: {
            id: 'fs-t27-c3',
            title: 'Essential .dockerignore Configuration',
            description: 'Preventing secret leakage and bloat in container builds.',
            language: 'bash',
            code: `# Ignore local machine dependencies
node_modules/

# NEVER bake secrets into image layers! (CRITICAL SECURITY)
.env
.env.*

# Ignore version control metadata
.git/
.gitignore

# Ignore local build logs
npm-debug.log*
dist/`,
            expectedOutput: 'Clean build context transferred to Docker daemon'
          },
          pitfall: 'If you omit `.dockerignore` and have a `.env` with AWS or database keys, running `COPY . .` will bake your secrets into the public Docker image layer history!',
          quickCheck: {
            question: 'Why should .env files be strictly excluded in .dockerignore?',
            options: [
              'Docker will crash',
              'Because copying .env bakes private secrets into image layers that anyone pulling the image can inspect and steal',
              'node_modules needs it',
              'It disables HTTPS'
            ],
            correctIndex: 1,
            explanation: 'Docker image layers are inspectable; embedding .env exposes secrets to anyone with access to the image.'
          }
        },
        {
          id: 'fs-w4-d27-t4',
          topicNumber: 4,
          title: 'Multi-Stage Docker Builds for High-Performance Production Images',
          explanation: [
            'A naive build leaves TypeScript compilers, build tools, devDependencies, and test runners in the final production image (bloating images to 1.5GB).',
            'Multi-Stage Builds use multiple `FROM` statements: Stage 1 ("builder") compiles TypeScript and builds React; Stage 2 ("runner") copies ONLY the compiled output into a pristine Alpine runtime image (reducing image size to 50MB!).'
          ],
          codeSnippet: {
            id: 'fs-t27-c4',
            title: 'Multi-Stage Dockerfile for React SPA with Nginx',
            description: 'Compiling React in Node and serving via ultra-light Nginx.',
            language: 'bash',
            code: `# --- STAGE 1: Build Frontend Assets ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build # Outputs compiled static files to /app/dist

# --- STAGE 2: Lightweight Production Nginx Server ---
FROM nginx:alpine
# Copy compiled HTML/JS/CSS from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
            expectedOutput: 'Final production image size shrunk from 1.2GB down to 23MB!'
          },
          pitfall: 'Leaving build-time devDependencies and TypeScript compilers in production containers increases image attack surface and deployment transfer times.',
          quickCheck: {
            question: 'What is the primary advantage of Multi-Stage Docker Builds?',
            options: [
              'Allows separating build tools from runtime environments, creating tiny, secure, stripped-down production images',
              'Compiles code to Python',
              'Eliminates the need for Docker',
              'Runs containers on mobile phones'
            ],
            correctIndex: 0,
            explanation: 'Multi-stage builds leave compilers and devDependencies behind, copying only final artifacts to the production image.'
          }
        },
        {
          id: 'fs-w4-d27-t5',
          topicNumber: 5,
          title: 'Managing Containers: build, run, exec, stop & logs',
          explanation: [
            'Essential Docker CLI commands for daily engineering:',
            '`docker build -t my-app .` (builds image), `docker run -p 3000:3000 -d my-app` (runs container detached with port mapping), `docker logs -f <id>` (follows logs), `docker exec -it <id> sh` (opens interactive shell inside container).'
          ],
          codeSnippet: {
            id: 'fs-t27-c5',
            title: 'Docker Lifecycle CLI Commands',
            description: 'Building, running, inspecting, and debugging containers.',
            language: 'bash',
            code: `# 1. Build image with tag 'fullstack-api'
docker build -t fullstack-api:v1 .

# 2. Run container in background (-d) mapping host port 8080 to container 3000
docker run -d -p 8080:3000 --name api-service fullstack-api:v1

# 3. Stream live server logs
docker logs -f api-service

# 4. Open bash shell inside running container for debugging
docker exec -it api-service sh

# 5. Stop and remove container
docker stop api-service && docker rm api-service`,
            expectedOutput: 'Container started with port forwarding 8080 -> 3000'
          },
          pitfall: 'Remember port mapping `-p <host_port>:<container_port>`. If your app listens on 3000 inside the container, running `-p 8080:3000` makes it accessible at `localhost:8080` on your laptop.',
          quickCheck: {
            question: 'In docker run -p 8080:3000 my-image, what does 8080 represent?',
            options: [
              'The port on the host machine where external requests arrive',
              'The port inside the container',
              'The container memory limit',
              'The user ID'
            ],
            correctIndex: 0,
            explanation: 'The format is -p <hostPort>:<containerPort>. 8080 is the port opened on the host machine.'
          }
        },
        {
          id: 'fs-w4-d27-t6',
          topicNumber: 6,
          title: 'Multi-Container Orchestration with Docker Compose',
          explanation: [
            'Real-world full-stack applications require multiple coordinated services (Node backend + PostgreSQL database + Redis cache).',
            '`docker-compose.yml` declares all services, their environment variables, networks, and persistent storage volumes in a single file. Running `docker compose up` boots the entire stack in one command.'
          ],
          codeSnippet: {
            id: 'fs-t27-c6',
            title: 'Full-Stack docker-compose.yml Configuration',
            description: 'Orchestrating Node.js, PostgreSQL, and Redis together.',
            language: 'bash',
            code: `# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://dev:pass@db:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine

volumes:
  postgres_data:`,
            expectedOutput: 'Network fullstack_default Created\nContainer db Started\nContainer cache Started\nContainer api Started'
          },
          pitfall: 'Notice that inside Docker Compose, services communicate using their service name as the host! The API connects to PostgreSQL at `db:5432`, NOT `localhost:5432`.',
          quickCheck: {
            question: 'How do containers in the same docker-compose.yml network address each other?',
            options: [
              'By their service name (e.g. host "db" or "cache")',
              'Using public IP addresses',
              'Via localhost only',
              'Through USB'
            ],
            correctIndex: 0,
            explanation: 'Docker Compose creates a shared bridge network where service names act as automatic DNS hostnames.'
          }
        },
        {
          id: 'fs-w4-d27-t7',
          topicNumber: 7,
          title: 'Persistent Storage: Docker Named Volumes',
          explanation: [
            'Containers are ephemeral: when a container is deleted (`docker rm`), any files written inside its filesystem vanish forever.',
            'Docker Volumes (`volumes: [ "postgres_data:/var/lib/postgresql/data" ]`) mount dedicated storage outside the container filesystem directly on the host machine, preserving database records across container restarts and upgrades.'
          ],
          codeSnippet: {
            id: 'fs-t27-c7',
            title: 'Managing Docker Named Volumes',
            description: 'Inspecting persistent storage volumes.',
            language: 'bash',
            code: `# List active Docker volumes
docker volume ls

# Inspect physical host mount path
docker volume inspect postgres_data

# Back up volume data
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/db_backup.tar.gz /data`,
            expectedOutput: 'Data persisted safely on host drive surviving container destruction'
          },
          pitfall: 'Running a PostgreSQL database container without a mounted volume means destroying the container destroys your entire database permanently!',
          quickCheck: {
            question: 'Why must databases running inside Docker containers use Docker Volumes?',
            options: [
              'Because container filesystems are ephemeral; volumes persist database files on the host disk even when containers are deleted',
              'Volumes encrypt SQL',
              'Docker requires volumes to boot',
              'To avoid using RAM'
            ],
            correctIndex: 0,
            explanation: 'Volumes ensure data persistence beyond the ephemeral lifecycle of individual container instances.'
          }
        },
        {
          id: 'fs-w4-d27-t8',
          topicNumber: 8,
          title: 'Container Security: Non-Root Users & Least Privilege',
          explanation: [
            'By default, processes inside containers run as the Linux `root` superuser (UID 0). If an attacker breaches the application via remote code execution, they gain root access within the container and potentially the host.',
            'Production Dockerfiles must switch to a non-root user (e.g. `USER node`) after installation, adhering to the principle of least privilege.'
          ],
          codeSnippet: {
            id: 'fs-t27-c8',
            title: 'Enforcing Non-Root Execution in Dockerfile',
            description: 'Switching process execution to unprivileged node user.',
            language: 'bash',
            code: `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Change ownership of application directory to 'node' user
RUN chown -R node:node /app

# Switch to unprivileged non-root user (SECURITY REQUIREMENT)
USER node

EXPOSE 3000
CMD ["node", "src/server.js"]`,
            expectedOutput: 'Container processes execute with restricted unprivileged node user credentials'
          },
          pitfall: 'Never run production containers as `root`; always declare `USER node` (or equivalent unprivileged user).'
          ,
          quickCheck: {
            question: 'Why should production Dockerfiles declare USER node to run as a non-root user?',
            options: [
              'To speed up boot time',
              'To enforce the principle of least privilege, preventing an attacker who breaches the app from gaining root superuser capabilities',
              'Node requires it',
              'To disable CSS'
            ],
            correctIndex: 1,
            explanation: 'Running as non-root limits the damage of security vulnerabilities by restricting process permissions.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Build a Multi-Stage Dockerfile with Non-Root Security',
        instructions: [
          'Create a 2-stage Dockerfile: builder stage compiles TypeScript with devDependencies.',
          'Runner stage uses node:22-alpine, copies dist/ and production node_modules.',
          'Set USER node for non-root execution.',
          'Expose port 3000 and declare CMD.'
        ],
        starterCode: `# Write multi-stage production Dockerfile`,
        solutionCode: `# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        hints: [
          'Use AS builder and AS runner.',
          'Copy compiled output using COPY --from=builder /app/dist ./dist.'
        ]
      },
      keyTakeaways: [
        'Containers virtualize OS processes, ensuring identical execution across local dev and production clouds.',
        'Multi-stage Docker builds shrink image sizes by 95% and remove build-time attack surfaces.',
        'Use Docker Compose to orchestrate multi-container apps (Node + PostgreSQL + Redis) with named volumes.'
      ]
    },
    {
      id: 'fs-w4-d28',
      dayNumber: 28,
      weekNumber: 4,
      title: 'Production Deployment & Publishing: CI/CD, Cloud Hosting & SSL',
      subtitle: 'GitHub Actions, automated test pipelines, Vercel/Render deployment, SSL certificates, and monitoring',
      durationMinutes: 55,
      overview:
        'Cross the finish line: publish your full-stack application to the world! Automate Continuous Integration and Continuous Deployment (CI/CD) with GitHub Actions, deploy static frontends to Vercel/Netlify, deploy Dockerized backend APIs to Render/Fly.io/AWS, configure custom domains with SSL, and monitor errors with Sentry.',
      topics: [
        {
          id: 'fs-w4-d28-t1',
          topicNumber: 1,
          title: 'What is CI/CD? Continuous Integration & Continuous Deployment',
          explanation: [
            'Continuous Integration (CI): automatically builds code, runs linters, and executes automated test suites on every GitHub push and Pull Request, catching bugs before merging.',
            'Continuous Deployment (CD): automatically packages passing code into Docker containers and deploys them to production cloud servers without manual intervention.'
          ],
          codeSnippet: {
            id: 'fs-t28-c1',
            title: 'Visualizing the Automated CI/CD Pipeline',
            description: 'Git push triggers automated testing, building, and deployment.',
            language: 'bash',
            code: `# Step 1: Developer pushes commit to GitHub
# Step 2: GitHub Actions triggers CI runner in cloud
#   ├── Run ESLint (npm run lint)
#   ├── Run Unit Tests (npm test)
#   └── Run Production Build (npm run build)
# Step 3: If all pass -> CD automatically deploys to Production Cloud!`,
            expectedOutput: 'Automated pipeline guarantees only verified, tested code reaches production'
          },
          pitfall: 'Never deploy to production manually by dragging files via FTP or running commands on live servers; manual deployments are prone to human error and lack audit trails.',
          quickCheck: {
            question: 'What is the primary role of Continuous Integration (CI)?',
            options: [
              'Automatically test and validate code changes on every commit before they merge into the production codebase',
              'To sell subscriptions',
              'To format CSS files',
              'To restart user laptops'
            ],
            correctIndex: 0,
            explanation: 'CI automatically executes builds and tests on every push, ensuring changes do not break existing features.'
          }
        },
        {
          id: 'fs-w4-d28-t2',
          topicNumber: 2,
          title: 'Building a CI Pipeline with GitHub Actions (.github/workflows)',
          explanation: [
            'GitHub Actions workflows are declared in YAML files inside `.github/workflows/ci.yml`.',
            'You define events (`on: [push, pull_request]`), environments (`runs-on: ubuntu-latest`), matrix strategies (testing on Node 20 and 22), and steps.'
          ],
          codeSnippet: {
            id: 'fs-t28-c2',
            title: 'Production GitHub Actions CI Workflow (ci.yml)',
            description: 'Automated linting, testing, and building pipeline.',
            language: 'bash',
            code: `# .github/workflows/ci.yml
name: Full Stack CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Test Suite
        run: npm test

      - name: Verify Production Build
        run: npm run build`,
            expectedOutput: 'GitHub Actions checks pass: All jobs finished successfully (Green checkmark!)'
          },
          pitfall: 'Use `npm ci` (clean install) instead of `npm install` in CI pipelines; `npm ci` strictly honors `package-lock.json` and fails if dependencies drift.',
          quickCheck: {
            question: 'Why should npm ci be used in CI/CD pipelines instead of npm install?',
            options: [
              'npm ci is faster and strictly installs exact versions from package-lock.json without modifying it',
              'npm install does not work on Linux',
              'npm ci disables tests',
              'It is required by YAML'
            ],
            correctIndex: 0,
            explanation: 'npm ci performs an automated clean install directly against the lockfile, guaranteeing reproducible builds.'
          }
        },
        {
          id: 'fs-w4-d28-t3',
          topicNumber: 3,
          title: 'Deploying Frontend Single-Page Apps to Vercel / Netlify / Cloudflare Pages',
          explanation: [
            'Static Single-Page Apps (React, Vite, HTML/CSS/JS) do not require a heavy Node.js server to serve them. Deploying them to global Edge CDNs (Vercel, Netlify, Cloudflare) provides sub-50ms latency worldwide.',
            'Connect your GitHub repository: on every push to `main`, the CDN runs `npm run build`, uploads `/dist` to global edge servers, and generates unique Preview URLs for every Pull Request.'
          ],
          codeSnippet: {
            id: 'fs-t28-c3',
            title: 'Deploying to Vercel via CLI',
            description: 'Deploying production build to edge network.',
            language: 'bash',
            code: `# Install Vercel CLI
npm i -g vercel

# Deploy preview build
vercel

# Deploy directly to live production domain
vercel --prod

# Output:
# Inspect: https://vercel.com/dev/fullstack-app
# Production: https://fullstack-academy.vercel.app [320ms]`,
            expectedOutput: 'Production: https://fullstack-academy.vercel.app'
          },
          pitfall: 'Remember to configure the SPA redirect rewrite in `vercel.json` (`{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`) to prevent 404s when users refresh nested routes!',
          quickCheck: {
            question: 'What is a major advantage of deploying static React SPAs to Edge CDNs (Vercel/Cloudflare Pages)?',
            options: [
              'Static assets are replicated across hundreds of global edge data centers, delivering sub-50ms loading times worldwide',
              'It replaces the need for a backend',
              'It allows running Python scripts directly in CSS',
              'It is free for all enterprise banks'
            ],
            correctIndex: 0,
            explanation: 'Edge CDNs cache static assets geographically close to users worldwide, minimizing network latency.'
          }
        },
        {
          id: 'fs-w4-d28-t4',
          topicNumber: 4,
          title: 'Deploying Backend Node APIs & Databases to Render / Railway / Fly.io',
          explanation: [
            'Backend servers require persistent compute environments to listen on ports and connect to databases.',
            'Platforms like Render, Railway, and Fly.io connect to your GitHub repo, automatically detect your Dockerfile or `package.json`, provision a managed PostgreSQL database, inject environment variables, and manage zero-downtime rolling deploys.'
          ],
          codeSnippet: {
            id: 'fs-t28-c4',
            title: 'Configuring Render Blueprint (render.yaml)',
            description: 'Infrastructure as code for backend and managed PostgreSQL database.',
            language: 'bash',
            code: `# render.yaml Blueprint
services:
  - type: web
    name: fullstack-api
    runtime: node
    plan: starter
    buildCommand: npm ci && npx prisma migrate deploy
    startCommand: node src/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: fullstack-db
          property: connectionString

databases:
  - name: fullstack-db
    plan: starter`,
            expectedOutput: 'Infrastructure provisioned: Node service + Managed PostgreSQL connected'
          },
          pitfall: 'Never configure managed databases with public internet access without IP whitelisting or SSL enforcement (`sslmode=require`).',
          quickCheck: {
            question: 'Why must npx prisma migrate deploy be executed during backend deployment before the server starts?',
            options: [
              'To apply any pending schema changes to the production database so the server code and database tables match',
              'To format TypeScript files',
              'To generate SSL keys',
              'Prisma requires it to turn on'
            ],
            correctIndex: 0,
            explanation: 'Running migrations during deployment ensures the database schema is updated to support the new application code.'
          }
        },
        {
          id: 'fs-w4-d28-t5',
          topicNumber: 5,
          title: 'Custom Domains, DNS Records & Free Automated SSL/TLS (Let\x27s Encrypt)',
          explanation: [
            'To use your own domain (`academy.io`), configure DNS records at your domain registrar:',
            '1) A Record: maps `@` (root domain) to your server IP address (e.g. `76.76.21.21`).',
            '2) CNAME Record: maps `www` to your hosting alias (e.g. `cname.vercel-dns.com`).',
            'Modern cloud platforms automatically provision free, auto-renewing SSL/TLS certificates via Let\x27s Encrypt, securing connections via HTTPS.'
          ],
          codeSnippet: {
            id: 'fs-t28-c5',
            title: 'Verifying SSL/TLS Certificate and HTTPS Redirection',
            description: 'Inspecting live SSL certificate parameters.',
            language: 'bash',
            code: `# Verify HTTPS TLS handshake and certificate issuer
curl -I https://academy.io

# Output:
# HTTP/2 200
# date: Fri, 24 Oct 2026 12:00:00 GMT
# content-type: text/html; charset=utf-8
# strict-transport-security: max-age=63072000; includeSubDomains; preload`,
            expectedOutput: 'HTTP/2 200 OK with Strict-Transport-Security (HSTS) enforced'
          },
          pitfall: 'DNS propagation can take up to 24 hours (governed by DNS TTL). Set your TTL low (300 seconds) prior to cutover to minimize waiting time.',
          quickCheck: {
            question: 'Which DNS record type is used to alias a subdomain (like www.example.com) to another hostname?',
            options: ['A Record', 'CNAME Record', 'TXT Record', 'MX Record'],
            correctIndex: 1,
            explanation: 'A CNAME (Canonical Name) record aliases one domain name to another canonical hostname.'
          }
        },
        {
          id: 'fs-w4-d28-t6',
          topicNumber: 6,
          title: 'Managing Production Secrets & Environment Variables',
          explanation: [
            'Production secrets (`DATABASE_URL`, `JWT_SECRET`, `STRIPE_KEY`) must NEVER be in your code or git history.',
            'Inject them via your cloud platform dashboard (Vercel Project Settings / Render Environment / AWS Secrets Manager) or encrypted secret management tools (Infisical, Doppler).'
          ],
          codeSnippet: {
            id: 'fs-t28-c6',
            title: 'Adding Secrets via GitHub CLI for CI/CD',
            description: 'Injecting encrypted repository secrets for automated workflows.',
            language: 'bash',
            code: `# Set encrypted repository secret using GitHub CLI
gh secret set DATABASE_URL --body "postgres://prod_user:secret_pass@db.cloud.com/app"
gh secret set JWT_SECRET --body "super_secret_high_entropy_random_key_64_bytes"

# Workflows access them securely: \${{ secrets.DATABASE_URL }}`
            ,
            expectedOutput: '✓ Set secret DATABASE_URL for developer/fullstack-app'
          },
          pitfall: 'Never echo or print environment variables in build scripts or logs (`console.log(process.env)`); this leaks production secrets into public CI build logs!',
          quickCheck: {
            question: 'Where should production API keys and database credentials be managed?',
            options: [
              'Hardcoded in App.tsx',
              'In encrypted environment variable settings on your production hosting provider or secret manager',
              'In a public README.md file',
              'In a shared spreadsheet'
            ],
            correctIndex: 1,
            explanation: 'Hosting providers offer secure, encrypted environment variable vaults that inject secrets at runtime without exposing them.'
          }
        },
        {
          id: 'fs-w4-d28-t7',
          topicNumber: 7,
          title: 'Production Error Tracking & Observability with Sentry',
          explanation: [
            'In production, when a user encounters a crash, you cannot open their Chrome console. Without observability, bugs remain invisible.',
            'Sentry captures unhandled exceptions in real time across both frontend and backend, recording stack traces, user breadcrumbs, browser versions, and alerts you via Slack/email.'
          ],
          codeSnippet: {
            id: 'fs-t28-c7',
            title: 'Initializing Sentry in React and Express',
            description: 'Automated real-time exception reporting.',
            language: 'typescript',
            code: `// import * as Sentry from '@sentry/react';

// Sentry.init({
//   dsn: process.env.VITE_SENTRY_DSN,
//   integrations: [Sentry.browserTracingIntegration()],
//   tracesSampleRate: 0.1, // Sample 10% of transactions for performance monitoring
//   environment: 'production'
// });

// Unhandled errors are automatically captured with breadcrumbs and user session context!`
            ,
            expectedOutput: 'Real-time error telemetry dispatched to centralized dashboard upon crash'
          },
          pitfall: 'Do not log personally identifiable information (PII) like credit cards or raw passwords to error reporting tools; sanitize data before dispatching.',
          quickCheck: {
            question: 'What is the role of an error tracking service like Sentry in production?',
            options: [
              'To compile CSS',
              'To capture and alert on unhandled runtime exceptions and performance metrics across real users in production',
              'To replace the database',
              'To restart the router'
            ],
            correctIndex: 1,
            explanation: 'Sentry monitors production applications in real time, capturing error stack traces and alerting developers to regressions.'
          }
        },
        {
          id: 'fs-w4-d28-t8',
          topicNumber: 8,
          title: 'Graduation: The Full Stack Engineer Identity & Lifelong Learning',
          explanation: [
            'You have mastered full-stack web engineering from the ground up: Web protocols, HTML5, CSS layout engines, JavaScript programming, React architecture, Node.js servers, Express REST APIs, PostgreSQL databases, Prisma ORMs, Docker containers, and Cloud CI/CD publishing.',
            'Engineering is a continuous journey. Continue building real-world projects, contributing to open-source software, and adhering to clean, tested, accessible software craftsmanship.'
          ],
          codeSnippet: {
            id: 'fs-t28-c8',
            title: 'Full Stack Academy Certification Seal',
            description: 'Verification of 4 modules, 28 days, and 224 mastered concepts.',
            language: 'bash',
            code: `# ========================================================
# FULL STACK WEB DEVELOPMENT ACADEMY
# VERIFIED GRADUATE STATUS: PASS
# --------------------------------------------------------
# Module 1: Web Fundamentals, HTML5, CSS3 & Git/GitHub
# Module 2: Front-End React, TypeScript & State Management
# Module 3: Back-End Node.js, Express & Secure REST APIs
# Module 4: Relational Databases, Docker & Cloud CI/CD
# ========================================================
echo "Congratulations, Full Stack Engineer! Ready to build the future."`,
            expectedOutput: 'Congratulations, Full Stack Engineer! Ready to build the future.'
          },
          pitfall: 'Do not stop learning after graduating; technology evolves continuously. Build real production applications and share your code with the world.',
          quickCheck: {
            question: 'What defines a true Full Stack Software Engineer?',
            options: [
              'Someone who only writes HTML',
              'Someone who understands the end-to-end system lifecycle: from user interface design to network protocols, server architecture, database modeling, and cloud production deployment',
              'Someone who memorized all CSS attributes',
              'Someone who only uses Windows'
            ],
            correctIndex: 1,
            explanation: 'A full-stack engineer grasps the entire software lifecycle from frontend UX to backend services and cloud infrastructure.'
          }
        }
      ],
      practiceChallenge: {
        title: 'Author a Production GitHub Actions CI/CD Pipeline',
        instructions: [
          'Write a complete GitHub Actions YAML workflow named deploy.yml.',
          'Trigger on push to main branch.',
          'Define jobs for test (lint, test, build) and deploy (simulated deploy step).',
          'Ensure deploy only runs if test passes (needs: test).'
        ],
        starterCode: `# Write complete GitHub Actions deploy.yml workflow`,
        solutionCode: `name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloud Provider
        run: echo "Deploying verified build to production cloud..."`,
        hints: [
          'Use needs: test on the deploy job so it waits for testing to pass.',
          'Use uses: actions/setup-node@v4 with cache: npm.'
        ]
      },
      keyTakeaways: [
        'Automated CI/CD pipelines guarantee that only validated, tested code merges into production.',
        'Deploy static frontends to Edge CDNs and containerized backends to managed cloud hosts.',
        'Always protect secrets in encrypted environment variables and monitor production with Sentry.'
      ]
    }
  ],
  quiz: {
    id: 'fs-quiz-w4',
    weekNumber: 4,
    title: 'Module 4 & Comprehensive Certification Exam: Full Stack Production Engineering',
    description:
      'The comprehensive capstone evaluation for the Full Stack Web Development Academy. Proves mastery across databases, ORMs, Docker containers, advanced Git, and cloud deployment.',
    passingScorePercent: 80,
    questions: [
      {
        id: 'fs-q4-1',
        question: 'What is the purpose of a FOREIGN KEY constraint in a relational database like PostgreSQL?',
        options: [
          'It translates SQL to English',
          'It enforces referential integrity between two tables by ensuring values match the primary key of the referenced table',
          'It makes the table read-only',
          'It deletes the database automatically'
        ],
        correctIndex: 1,
        explanation: 'Foreign keys establish relationships and enforce referential integrity between related tables.'
      },
      {
        id: 'fs-q4-2',
        question: 'What is the N+1 query problem, and how does Prisma include resolve it?',
        options: [
          'It is a math bug',
          'It occurs when fetching a list of parent records and then making N separate queries for their children; include batches or joins them in an optimized query',
          'It only happens in Python',
          'It deletes records'
        ],
        correctIndex: 1,
        explanation: 'include eager-loads related child data in a single joined or batched query, avoiding N separate round-trips.'
      },
      {
        id: 'fs-q4-3',
        question: 'What is the primary advantage of Redis in-memory caching in the Cache-Aside pattern?',
        options: [
          'It stores data in RAM, allowing frequently requested queries to be served in sub-millisecond time without querying the primary database',
          'It replaces HTML',
          'It compresses images',
          'It deletes passwords'
        ],
        correctIndex: 0,
        explanation: 'Serving cached reads from in-memory RAM delivers sub-millisecond response times and protects primary databases.'
      },
      {
        id: 'fs-q4-4',
        question: 'What does a Multi-Stage Dockerfile accomplish for a production web application?',
        options: [
          'It separates build tools and compilers from runtime files, producing small, secure, stripped-down production images',
          'It compiles code to PHP',
          'It runs 10 operating systems at once',
          'It disables JavaScript'
        ],
        correctIndex: 0,
        explanation: 'Multi-stage builds leave heavy compilers and devDependencies behind, copying only final runtime artifacts.'
      },
      {
        id: 'fs-q4-5',
        question: 'What is the Golden Rule of Git Rebase?',
        options: [
          'Never rebase on a public, shared branch because rewriting commit hashes breaks collaborators repositories',
          'Never rebase on a Tuesday',
          'Rebase only on Windows',
          'Always rebase main into feature branches'
        ],
        correctIndex: 0,
        explanation: 'Rebasing rewrites commit histories and should only ever be performed on local, unshared private branches.'
      },
      {
        id: 'fs-q4-6',
        question: 'Why should npm ci be executed in Continuous Integration (CI) workflows instead of npm install?',
        options: [
          'npm ci strictly installs exact versions from package-lock.json without modifying it, guaranteeing reproducible builds',
          'npm install is deprecated',
          'npm ci only works on CSS',
          'To format TypeScript code'
        ],
        correctIndex: 0,
        explanation: 'npm ci strictly respects the committed package-lock.json, ensuring identical dependency builds in CI.'
      }
    ]
  }
};
