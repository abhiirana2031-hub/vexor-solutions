import { WeekModule } from '../types/course';
import { WEEK_1_MODULE } from './week1Data';
import { WEEK_2_MODULE } from './week2Data';
import { WEEK_3_MODULE } from './week3Data';
import { WEEK_4_MODULE } from './week4Data';

export const COURSE_MODULES: WeekModule[] = [
  WEEK_1_MODULE,
  WEEK_2_MODULE,
  WEEK_3_MODULE,
  WEEK_4_MODULE,
];

export const TOTAL_WEEKS = COURSE_MODULES.length;
export const TOTAL_DAYS = COURSE_MODULES.reduce((acc, m) => acc + m.days.length, 0);
export const TOTAL_TOPICS = COURSE_MODULES.reduce(
  (acc, m) => acc + m.days.reduce((dAcc, d) => dAcc + (d.topics?.length || 0), 0),
  0
);
