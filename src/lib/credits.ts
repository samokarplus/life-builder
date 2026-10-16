import type { Course, Semester } from "./types";

export function semesterCredits(sem: Semester, courses: Course[]): number {
  const byId = new Map(courses.map((c) => [c.id, c]));
  return sem.courses.reduce((sum, p) => sum + (byId.get(p.courseId)?.credits ?? 0), 0);
}

export function creditsByStatus(semesters: Semester[], courses: Course[]) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const out = { completed: 0, "in-progress": 0, planned: 0 };
  for (const s of semesters) for (const p of s.courses) out[p.status] += byId.get(p.courseId)?.credits ?? 0;
  return out;
}
