import type { Course, Semester } from "./types";
import { progress, semesterLabel, sortSemesters } from "./schedule";
import type { CompletedCourse } from "./types";

export interface PathMetrics {
  remainingCredits: number;
  semesterCount: number; // semesters containing courses
  avgLoad: number; // credits per non-empty semester
  summerCredits: number;
  summerCourses: number;
  lastTerm: string | null;
  lastTermKey: number;
  tuition: number | null; // null when any needed rate is missing
  unverifiedCourses: number;
  transferCredits: number; // credits planned at the destination or flagged for transfer
}

export function pathMetrics(
  semesters: Semester[], courses: Course[], completed: CompletedCourse[],
  rates: Record<string, number | null>
): PathMetrics {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const sorted = sortSemesters(semesters).filter((s) => s.courses.length > 0);
  const p = progress(semesters, courses, completed, Number.MAX_SAFE_INTEGER);
  const credits = (s: Semester) => s.courses.reduce((n, c) => n + (byId.get(c.courseId)?.credits ?? 0), 0);
  const open = (s: Semester) => s.courses.filter((c) => c.status !== "completed" && !completed.some((x) => x.courseId === c.courseId));
  const openCr = (s: Semester) => open(s).reduce((n, c) => n + (byId.get(c.courseId)?.credits ?? 0), 0);

  let tuition: number | null = 0;
  for (const s of semesters) {
    const cr = openCr(s);
    if (!cr) continue;
    const r = rates[s.institutionId];
    if (r == null) { tuition = null; break; }
    tuition += cr * r;
  }
  const summer = sorted.filter((s) => s.term === "summer");
  const total = sorted.reduce((n, s) => n + credits(s), 0);
  const last = sorted.at(-1);
  return {
    remainingCredits: p.inProgress + p.planned,
    semesterCount: sorted.length,
    avgLoad: sorted.length ? Math.round((total / sorted.length) * 10) / 10 : 0,
    summerCredits: summer.reduce((n, s) => n + credits(s), 0),
    summerCourses: summer.reduce((n, s) => n + s.courses.length, 0),
    lastTerm: last ? semesterLabel(last) : null,
    lastTermKey: last ? last.year * 3 + ({ spring: 0, summer: 1, fall: 2 } as const)[last.term] : 0,
    tuition,
    unverifiedCourses: sorted.reduce((n, s) => n + s.courses.length, 0),
    transferCredits: 0,
  };
}

/** Only states differences that the computed metrics actually show. */
export function whatChanged(nameA: string, a: PathMetrics, nameB: string, b: PathMetrics): string[] {
  const out: string[] = [];
  if (a.lastTerm !== b.lastTerm) {
    const terms = b.lastTermKey - a.lastTermKey;
    out.push(`${nameB} finishes planned coursework in ${b.lastTerm ?? "—"} vs ${a.lastTerm ?? "—"} in ${nameA}${terms !== 0 ? ` (${Math.abs(terms)} term slot${Math.abs(terms) > 1 ? "s" : ""} ${terms < 0 ? "earlier" : "later"})` : ""}.`);
  }
  if (a.semesterCount !== b.semesterCount) out.push(`${nameB} uses ${b.semesterCount} semesters vs ${a.semesterCount}.`);
  if (a.avgLoad !== b.avgLoad) out.push(`Average load is ${b.avgLoad} credits per semester vs ${a.avgLoad}.`);
  if (a.summerCredits !== b.summerCredits) out.push(`Summer credits: ${b.summerCredits} vs ${a.summerCredits}.`);
  if (a.remainingCredits !== b.remainingCredits) out.push(`Remaining credits: ${b.remainingCredits} vs ${a.remainingCredits}.`);
  if (a.tuition != null && b.tuition != null && a.tuition !== b.tuition) out.push(`Estimated tuition (your rates) differs by $${Math.abs(b.tuition - a.tuition).toLocaleString()}.`);
  if (!out.length) out.push("These two paths have the same computed results. Major requirement data isn't loaded yet, so a major change alone doesn't alter the numbers.");
  return out;
}
