import type { Course, Semester } from "./types";
import { semesterCredits } from "./credits";
import { semesterLabel, sortSemesters } from "./schedule";

export type StopState = "done" | "current" | "ahead";
export interface RouteStop { id: string; label: string; short: string; credits: number; institutionId: string; state: StopState; courseCount: number }

/** A semester is "done" when it has courses and all are completed; the first unfinished one is "current". */
export function routeStops(semesters: Semester[], courses: Course[]): RouteStop[] {
  const sorted = sortSemesters(semesters);
  let currentFound = false;
  return sorted.map((s) => {
    const finished = s.courses.length > 0 && s.courses.every((c) => c.status === "completed");
    let state: StopState = "ahead";
    if (finished) state = "done";
    else if (!currentFound) { state = "current"; currentFound = true; }
    return { id: s.id, label: semesterLabel(s), short: `${s.term.slice(0, 2).toUpperCase()} '${String(s.year).slice(2)}`, credits: semesterCredits(s, courses), institutionId: s.institutionId, state, courseCount: s.courses.length };
  });
}
