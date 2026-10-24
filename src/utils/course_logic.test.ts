import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isModuleUnlocked,
  isDayUnlocked,
  calculateQuizScore,
  calculateProgressStats,
  executePythonSnippet,
} from './course_logic';
import { QuizQuestion, UserProgress } from '../types/course';

test('isModuleUnlocked: Week 1 is always unlocked by default', () => {
  assert.equal(isModuleUnlocked(1, [1]), true);
  assert.equal(isModuleUnlocked(1, []), true);
});

test('isModuleUnlocked: Week 2, 3, 4 require prior unlock unless devMode', () => {
  assert.equal(isModuleUnlocked(2, [1]), false);
  assert.equal(isModuleUnlocked(2, [1, 2]), true);
  assert.equal(isModuleUnlocked(3, [1, 2]), false);
  assert.equal(isModuleUnlocked(4, [1, 2, 3, 4]), true);
  assert.equal(isModuleUnlocked(4, [1], true), true); // devMode true
});

test('isDayUnlocked: checks week status correctly', () => {
  assert.equal(isDayUnlocked(1, 1, [1]), true);
  assert.equal(isDayUnlocked(8, 2, [1]), false);
  assert.equal(isDayUnlocked(8, 2, [1, 2]), true);
});

test('calculateQuizScore: evaluates passing threshold correctly', () => {
  const mockQuestions: QuizQuestion[] = [
    { id: 'q1', question: 'What is Python?', options: ['A', 'B'], correctIndex: 0, explanation: '' },
    { id: 'q2', question: 'Is Python typed?', options: ['A', 'B'], correctIndex: 1, explanation: '' },
    { id: 'q3', question: 'Which is mutable?', options: ['A', 'B'], correctIndex: 0, explanation: '' },
    { id: 'q4', question: 'What is GIL?', options: ['A', 'B'], correctIndex: 0, explanation: '' },
    { id: 'q5', question: 'What is lambda?', options: ['A', 'B'], correctIndex: 1, explanation: '' },
  ];

  // 4 out of 5 correct = 80% (Passes)
  const userAnswersPass = { q1: 0, q2: 1, q3: 0, q4: 0, q5: 0 };
  const resultPass = calculateQuizScore(userAnswersPass, mockQuestions, 80);
  assert.equal(resultPass.correctCount, 4);
  assert.equal(resultPass.percentage, 80);
  assert.equal(resultPass.passed, true);

  // 3 out of 5 correct = 60% (Fails)
  const userAnswersFail = { q1: 0, q2: 1, q3: 0, q4: 1, q5: 0 };
  const resultFail = calculateQuizScore(userAnswersFail, mockQuestions, 80);
  assert.equal(resultFail.correctCount, 3);
  assert.equal(resultFail.percentage, 60);
  assert.equal(resultFail.passed, false);
});

test('calculateProgressStats: accurately tallies completion percentages', () => {
  const mockProgress: UserProgress = {
    unlockedWeeks: [1, 2],
    completedDays: [1, 2, 3, 4, 5, 6, 7],
    quizScores: {
      1: { score: 5, total: 5, passed: true, completedAt: '2026-10-24' },
    },
    savedCodeSnippets: {},
  };

  const stats = calculateProgressStats(mockProgress, 28, 4);
  assert.equal(stats.completedDaysCount, 7);
  assert.equal(stats.passedQuizzesCount, 1);
  assert.equal(stats.dayPercentage, 25);
  assert.equal(stats.quizPercentage, 25);
  assert.equal(stats.isCourseCompleted, false);
});

test('executePythonSnippet: runs print and math correctly', () => {
  const code = `
x = 10
y = 20
print("Result is:", x + y)
`;
  const res = executePythonSnippet(code);
  assert.match(res.output, /Result is: 30/);
  assert.equal(res.error, undefined);
});

test('executePythonSnippet: runs for loops and range', () => {
  const code = `
total = 0
for i in range(1, 6):
    total = total + i
print("Sum is:", total)
`;
  const res = executePythonSnippet(code);
  assert.match(res.output, /Sum is: 15/);
});

test('executePythonSnippet: runs Day 1 memory reference code without errors', () => {
  const code = `
x = 256
y = 256
print("x == y (value):", x == y)
print("x is y (identity):", x is y)
print("Memory ID of x:", id(x))
x = x + 1
print("New x value:", x)
`;
  const res = executePythonSnippet(code);
  assert.match(res.output, /x == y \(value\): True/);
  assert.match(res.output, /x is y \(identity\): True/);
  assert.match(res.output, /New x value: 257/);
  assert.equal(res.error, undefined);
});

test('curriculum integrity: exactly 4 weeks, 28 days, and at least 7 topics per day', async () => {
  const { COURSE_MODULES } = await import('../data/courseData');
  assert.equal(COURSE_MODULES.length, 4, 'Must have exactly 4 week modules');

  let totalDays = 0;
  let totalTopics = 0;

  for (const module of COURSE_MODULES) {
    assert.equal(module.days.length, 7, `Week ${module.weekNumber} must have 7 days`);
    assert.ok(module.quiz.questions.length >= 5, `Week ${module.weekNumber} quiz must have at least 5 questions`);

    for (const day of module.days) {
      totalDays++;
      assert.ok(
        day.topics && day.topics.length >= 7,
        `Day ${day.dayNumber} (${day.title}) must have at least 7 topics, had ${day.topics?.length}`
      );
      totalTopics += day.topics.length;
    }
  }

  assert.equal(totalDays, 28, 'Must have exactly 28 days');
  assert.equal(totalTopics, 196, 'Must have exactly 196 topics (7 topics per day x 28 days)');
});

test('calculateModuleProgress: calculates accurate completion and percentages per module', async () => {
  const { calculateModuleProgress } = await import('./course_logic');

  // Week 1 has days 1..7. User completed days 1, 2, 3 -> 3/7 = 43%
  const resW1 = calculateModuleProgress(1, [1, 2, 3]);
  assert.equal(resW1.completedCount, 3);
  assert.equal(resW1.totalDaysInWeek, 7);
  assert.equal(resW1.percentage, 43);
  assert.equal(resW1.isComplete, false);
  assert.deepEqual(resW1.completedDayNumbers, [1, 2, 3]);

  // Week 2 has days 8..14. User completed all 7 days -> 100%
  const resW2 = calculateModuleProgress(2, [8, 9, 10, 11, 12, 13, 14]);
  assert.equal(resW2.completedCount, 7);
  assert.equal(resW2.percentage, 100);
  assert.equal(resW2.isComplete, true);
});

test('computeDayOfWeekActivity: correctly identifies most active day and proportions', async () => {
  const { computeDayOfWeekActivity } = await import('./course_logic');

  // 2026-10-20 was Tuesday, 2026-10-22 was Thursday
  const mockLog = {
    '2026-10-19': 2, // Mon
    '2026-10-20': 8, // Tue (Most active)
    '2026-10-21': 3, // Wed
    '2026-10-22': 5, // Thu
    '2026-10-23': 1, // Fri
    '2026-10-24': 4, // Sat
    '2026-10-25': 2, // Sun
  };

  const analysis = computeDayOfWeekActivity(mockLog);
  assert.equal(analysis.totalActivities, 25);
  assert.equal(analysis.mostActiveDay.dayName, 'Tuesday');
  assert.equal(analysis.mostActiveDay.count, 8);
  assert.equal(analysis.mostActiveDay.percentage, 32); // 8/25 = 32%
  assert.equal(analysis.leastActiveDay.dayName, 'Friday');
  assert.equal(analysis.leastActiveDay.count, 1);
});

test('generateHeatmapGrid: creates 8-week matrix with correct intensity levels', async () => {
  const { generateHeatmapGrid } = await import('./course_logic');

  const anchor = new Date(2026, 9, 24); // Oct 24, 2026
  const mockLog = {
    '2026-10-24': 7, // Level 4
    '2026-10-23': 3, // Level 2
    '2026-10-22': 1, // Level 1
  };

  const grid = generateHeatmapGrid(mockLog, 8, anchor);
  assert.equal(grid.weeks.length, 8);
  assert.equal(grid.weeks[0].length, 7);

  // Flatten cells and check level assignment
  const cells = grid.weeks.flat();
  const oct24 = cells.find((c) => c.dateStr === '2026-10-24');
  assert.ok(oct24);
  assert.equal(oct24.level, 4);
  assert.equal(oct24.count, 7);
  assert.equal(oct24.isToday, true);

  const oct23 = cells.find((c) => c.dateStr === '2026-10-23');
  assert.ok(oct23);
  assert.equal(oct23.level, 2);
});

test('full stack curriculum integrity: exactly 4 weeks, 28 days, and at least 7-8 topics per day', async () => {
  const { FULLSTACK_MODULES } = await import('../data/coursesCatalog');
  assert.equal(FULLSTACK_MODULES.length, 4, 'Must have exactly 4 week modules');

  let totalDays = 0;
  let totalTopics = 0;

  for (const module of FULLSTACK_MODULES) {
    assert.equal(module.days.length, 7, `Week ${module.weekNumber} must have 7 days`);
    assert.ok(module.quiz.questions.length >= 5, `Week ${module.weekNumber} quiz must have at least 5 questions`);

    for (const day of module.days) {
      totalDays++;
      assert.ok(
        day.topics && day.topics.length >= 7,
        `Day ${day.dayNumber} (${day.title}) must have at least 7 topics, had ${day.topics?.length}`
      );
      totalTopics += day.topics.length;
    }
  }

  assert.equal(totalDays, 28, 'Must have exactly 28 days');
  assert.equal(totalTopics, 224, 'Must have exactly 224 topics (8 topics per day x 28 days)');
});

test('executeJavaScriptSnippet: captures console.log and evaluates arithmetic', async () => {
  const { executeJavaScriptSnippet } = await import('./course_logic');
  const code = `
    const a = 10;
    const b = 32;
    console.log("Full Stack Sum:", a + b);
  `;
  const res = executeJavaScriptSnippet(code);
  assert.match(res.output, /Full Stack Sum: 42/);
  assert.equal(res.error, undefined);
});

test('executeCode: routes bash and sql accurately', async () => {
  const { executeCode } = await import('./course_logic');
  const bashRes = executeCode('git status', 'bash');
  assert.match(bashRes.output, /On branch main/);

  const sqlRes = executeCode('SELECT * FROM courses;', 'sql');
  assert.match(sqlRes.output, /Full Stack Web Development/);
});

test('cpp curriculum integrity: exactly 4 weeks, 28 days, and at least 8 topics per day (224 topics total)', async () => {
  const { COURSES } = await import('../data/coursesCatalog');
  const cppCourse = COURSES.cpp;
  assert.ok(cppCourse, 'COURSES.cpp must exist');
  assert.equal(cppCourse.modules.length, 4, 'C++ Academy must have 4 modules');

  let totalDays = 0;
  let totalTopics = 0;

  for (const module of cppCourse.modules) {
    assert.equal(module.days.length, 7, `C++ Week ${module.weekNumber} must have 7 days`);
    assert.ok(module.quiz.questions.length >= 5, `C++ Week ${module.weekNumber} quiz must have >= 5 questions`);

    for (const day of module.days) {
      totalDays++;
      assert.ok(
        day.topics && day.topics.length >= 8,
        `C++ Day ${day.dayNumber} (${day.title}) must have at least 8 topics, had ${day.topics?.length}`
      );
      totalTopics += day.topics.length;
    }
  }

  assert.equal(totalDays, 28, 'C++ Academy must have exactly 28 days');
  assert.equal(totalTopics, 224, 'C++ Academy must have exactly 224 topics');
});

test('dsa curriculum integrity: exactly 4 weeks, 28 days, and at least 8 topics per day (224 topics total)', async () => {
  const { COURSES } = await import('../data/coursesCatalog');
  const dsaCourse = COURSES.dsa;
  assert.ok(dsaCourse, 'COURSES.dsa must exist');
  assert.equal(dsaCourse.modules.length, 4, 'DSA Academy must have 4 modules');

  let totalDays = 0;
  let totalTopics = 0;

  for (const module of dsaCourse.modules) {
    assert.equal(module.days.length, 7, `DSA Week ${module.weekNumber} must have 7 days`);
    assert.ok(module.quiz.questions.length >= 5, `DSA Week ${module.weekNumber} quiz must have >= 5 questions`);

    for (const day of module.days) {
      totalDays++;
      assert.ok(
        day.topics && day.topics.length >= 8,
        `DSA Day ${day.dayNumber} (${day.title}) must have at least 8 topics, had ${day.topics?.length}`
      );
      totalTopics += day.topics.length;
    }
  }

  assert.equal(totalDays, 28, 'DSA Academy must have exactly 28 days');
  assert.equal(totalTopics, 224, 'DSA Academy must have exactly 224 topics');
});

test('executeCppSnippet: compiles and runs C++ code with std::cout parsing', async () => {
  const { executeCppSnippet, executeCode } = await import('./course_logic');
  const cppCode = `
#include <iostream>
int main() {
    std::cout << "Hello C++ Systems Architecture!" << std::endl;
    std::cout << "Value: " << (10 + 32) << "\\n";
    return 0;
}
`;
  const res = executeCppSnippet(cppCode);
  assert.equal(res.error, undefined);
  assert.match(res.output, /clang\+\+ -std=c\+\+20/);
  assert.match(res.output, /Hello C\+\+ Systems Architecture!/);
  assert.match(res.output, /Value: 42/);
  assert.match(res.output, /Process finished with exit code 0/);

  // Test routing via executeCode
  const routedRes = executeCode(cppCode, 'cpp');
  assert.match(routedRes.output, /Hello C\+\+ Systems Architecture!/);
});



