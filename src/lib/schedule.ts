import type { Course, CompletedCourse, Semester, StudentProfile } from "./types";

const TERM_ORDER = { spring: 0, summer: 1, fall: 2 } as const;

export const termKey = (s: Pick<Semester, "term" | "year">) => s.year * 3 + TERM_ORDER[s.term];
export const sortSemesters = (ss: Semester[]) => [...ss].sort((a, b) => termKey(a) - termKey(b));
export const semesterLabel = (s: Pick<Semester, "term" | "year">) =>
  `${s.term[0].toUpperCase()}${s.term.slice(1)} ${s.year}`;

export interface PrereqIssue {
  plannedId: string;
  courseId: string;
  semesterId: string;
  missing: string[]; // prerequisite course ids not satisfied beforehand
}

/** A prerequisite is satisfied if completed (profile) or planned in a strictly earlier semester. */
export function prereqIssues(semesters: Semester[], courses: Course[], completed: CompletedCourse[] = []): PrereqIssue[] {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const done = new Set(completed.map((c) => c.courseId));
  const sorted = sortSemesters(semesters);
  const issues: PrereqIssue[] = [];
  sorted.forEach((sem, i) => {
    const before = new Set(done);
    for (const prev of sorted.slice(0, i)) for (const p of prev.courses) before.add(p.courseId);
    for (const p of sem.courses) {
      const missing = (byId.get(p.courseId)?.prerequisiteIds ?? []).filter((id) => !before.has(id));
      if (missing.length) issues.push({ plannedId: p.id, courseId: p.courseId, semesterId: sem.id, missing });
    }
  });
  return issues;
}

export interface Progress {
  completed: number;
  verifiedCompleted: number;
  unverifiedCompleted: number;
  inProgress: number;
  planned: number;
  remaining: number;
  percent: number;
}

/** Completed = profile-completed courses + planned entries marked completed (no double counting). */
export function progress(semesters: Semester[], courses: Course[], completed: CompletedCourse[], required: number): Progress {
  const byId = new Map(courses.map((c) => [c.id, c.credits]));
  const statusRank = { planned: 0, "in-progress": 1, completed: 2 };
  const entries = new Map<string, { status: "planned" | "in-progress" | "completed"; verified: boolean }>();
  for (const c of completed) entries.set(c.courseId, { status: "completed", verified: c.verified || entries.get(c.courseId)?.verified === true });
  for (const sem of semesters) for (const p of sem.courses) {
    const previous=entries.get(p.courseId);
    if (!previous || statusRank[p.status] > statusRank[previous.status]) entries.set(p.courseId,{status:p.status,verified:false});
  }
  let done=0,inProg=0,planned=0,verifiedCompleted=0;
  for (const [id,entry] of entries) {
    const cr=byId.get(id)??0;
    if(entry.status==="completed"){done+=cr;if(entry.verified)verifiedCompleted+=cr;}
    else if(entry.status==="in-progress")inProg+=cr;
    else planned+=cr;
  }
  const remaining = Math.max(0, required - done - inProg);
  return { completed: done, verifiedCompleted, unverifiedCompleted: done - verifiedCompleted, inProgress: inProg, planned, remaining, percent: required ? Math.min(100, Math.round((done / required) * 100)) : 0 };
}

/**
 * Builds an initial plan from catalog courses not yet completed: prerequisites
 * always land in an earlier semester; fall/spring only; capped at maxCredits.
 */
export function generatePlan(
  profile: Pick<StudentProfile, "maxCreditsPerSemester" | "completed" | "currentInstitutionId" | "destinationInstitutionId">,
  catalog: Course[],
  start: { term: "fall" | "spring"; year: number }
): Semester[] {
  const done = new Set(profile.completed.map((c) => c.courseId));
  const todo = catalog.filter((c) => c.institutionId === profile.currentInstitutionId && !done.has(c.id));
  const placedIn = new Map<string, number>();
  const semesters: Semester[] = [];
  let term = start.term, year = start.year, idx = 0, n = 0;
  const remaining = [...todo];
  let guard = 0;
  while (remaining.length && guard++ < 40) {
    const sem: Semester = { id: `gen-${year}-${term}`, term, year, institutionId: profile.currentInstitutionId, courses: [] };
    let credits = 0;
    for (const c of [...remaining]) {
      const ready = c.prerequisiteIds.every((p) => done.has(p) || (placedIn.has(p) && placedIn.get(p)! < idx));
      if (ready && credits + c.credits <= profile.maxCreditsPerSemester) {
        sem.courses.push({ id: `gen-pc-${++n}`, courseId: c.id, status: "planned" });
        placedIn.set(c.id, idx);
        credits += c.credits;
        remaining.splice(remaining.indexOf(c), 1);
      }
    }
    semesters.push(sem);
    idx++;
    if (term === "fall") { term = "spring"; year++; } else term = "fall";
  }
  const last = semesters[semesters.length - 1];
  const nextTerm = last ? (last.term === "fall" ? { term: "spring" as const, year: last.year + 1 } : { term: "fall" as const, year: last.year }) : start;
  semesters.push({ id: `gen-dest-${nextTerm.year}-${nextTerm.term}`, term: nextTerm.term, year: nextTerm.year, institutionId: profile.destinationInstitutionId, courses: [] });
  return semesters;
}
