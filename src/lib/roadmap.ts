import type { Course, Semester } from "./types";
import { semesterCredits } from "./credits";
import { sortSemesters, termKey } from "./schedule";
export function creditWarnings(semesters: Semester[], catalog: Course[], maximum: number) {
  return semesters.flatMap(semester => {
    const credits = semesterCredits(semester, catalog);
    return credits > maximum ? [{ semesterId: semester.id, credits, maximum, excess: credits - maximum }] : [];
  });
}
/** Offer one explicit move; do not rearrange anything until the student accepts. */
export function prerequisiteFix(courseId: string, semesterId: string, semesters: Semester[]) {
  const current = semesters.find(s=>s.id===semesterId);
  if (!current) return null;
  const earlier = sortSemesters(semesters).filter(s=>termKey(s)<termKey(current));
  const entry = semesters.flatMap(s=>s.courses).find(p=>p.courseId===courseId);
  const target = earlier.at(-1);
  return target ? { targetId: target.id, plannedId: entry?.id ?? null, courseId } : null;
}
export function nextSummer(semesters: Semester[], institutionId: string) {
  const sorted = sortSemesters(semesters);
  let year = sorted[0]?.year ?? new Date().getFullYear();
  if (sorted[0]?.term === "fall") year++;
  while (semesters.some(s=>s.year===year && s.term==="summer")) year++;
  return {term:"summer" as const,year,institutionId};
}
