import type { CompletedCourse, Semester } from "./types";

/** Splits a plan into earned vs projected coursework for the requirement engine. */
export function planContext(semesters: Semester[], profileCompleted: CompletedCourse[]) {
  const completed = [...profileCompleted.map((c) => ({ courseId: c.courseId, grade: c.grade, verified: c.verified }))];
  const projected: string[] = [];
  for (const s of semesters) for (const p of s.courses) {
    if (p.status === "completed") { if (!completed.some((c) => c.courseId === p.courseId)) completed.push({ courseId: p.courseId, grade: undefined, verified: false }); }
    else projected.push(p.courseId);
  }
  return { completed, projected };
}
