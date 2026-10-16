import type { Course, Semester } from "./types";

export interface CostInputsLike {
  feesPerSemester: number; booksPerSemester: number; housingPerSemester: number; livingPerSemester: number;
  aid: number; destSemesters: number; destCreditsPerSemester: number;
}

export interface CostBreakdown {
  frcc: { credits: number; semesters: number; tuition: number | null; fees: number; books: number };
  dest: { credits: number; semesters: number; tuition: number | null; fees: number; books: number };
  housing: number; living: number; aid: number;
  total: number | null; // null when a needed tuition rate is missing
  transferSavings: number | null; // if every FRCC credit transferred (unverified)
}

export function costBreakdown(
  semesters: Semester[], courses: Course[], rates: Record<string, number | null>,
  inst: { current: string; dest: string }, x: CostInputsLike
): CostBreakdown {
  const byId = new Map(courses.map((c) => [c.id, c.credits]));
  const open = semesters.filter((s) => s.institutionId === inst.current).map((s) => ({
    s, cr: s.courses.filter((c) => c.status !== "completed").reduce((n, c) => n + (byId.get(c.courseId) ?? 0), 0),
  })).filter((r) => r.cr > 0);
  const fCredits = open.reduce((n, r) => n + r.cr, 0);
  const fSem = open.length;
  const fRate = rates[inst.current] ?? null, dRate = rates[inst.dest] ?? null;
  const dCredits = x.destSemesters * x.destCreditsPerSemester;
  const frcc = { credits: fCredits, semesters: fSem, tuition: fCredits === 0 ? 0 : fRate == null ? null : fCredits * fRate, fees: fSem * x.feesPerSemester, books: fSem * x.booksPerSemester };
  const dest = { credits: dCredits, semesters: x.destSemesters, tuition: dCredits === 0 ? 0 : dRate == null ? null : dCredits * dRate, fees: x.destSemesters * x.feesPerSemester, books: x.destSemesters * x.booksPerSemester };
  const all = fSem + x.destSemesters;
  const housing = all * x.housingPerSemester, living = all * x.livingPerSemester;
  const total = frcc.tuition == null || dest.tuition == null ? null
    : Math.max(0, frcc.tuition + dest.tuition + frcc.fees + dest.fees + frcc.books + dest.books + housing + living - x.aid);
  return { frcc, dest, housing, living, aid: x.aid, total, transferSavings: fRate == null || dRate == null ? null : fCredits * (dRate - fRate) };
}
