import type { Course, Semester } from "./types";
import { prereqIssues, semesterLabel } from "./schedule";
import { semesterCredits } from "./credits";
import type { CompletedCourse } from "./types";

export interface HealthCheck { id: string; ok: boolean; label: string; detail: string }

/** Plain checks computed from the plan only. Not an eligibility or degree audit. */
export function planHealth(semesters: Semester[], courses: Course[], completed: CompletedCourse[], maxCredits: number): HealthCheck[] {
  const issues = prereqIssues(semesters, courses, completed);
  const over = semesters.filter((s) => semesterCredits(s, courses) > maxCredits);
  const empty = semesters.filter((s) => s.courses.length === 0 && s.term !== "summer");
  const unverifiedCompleted = completed.filter((c) => !c.verified).length;
  return [
    { id: "prereq", ok: issues.length === 0, label: "Prerequisites in order", detail: issues.length ? `${issues.length} course${issues.length > 1 ? "s" : ""} planned before a prerequisite.` : "Loaded prerequisites appear earlier in the plan or are reported complete; official prerequisite rules and course availability still need confirmation." },
    { id: "load", ok: over.length === 0, label: "Within your credit limit", detail: over.length ? `${over.map(semesterLabel).join(", ")} exceed${over.length > 1 ? "" : "s"} ${maxCredits} credits.` : `No semester is above ${maxCredits} credits.` },
    { id: "gaps", ok: empty.length === 0, label: "No empty fall or spring terms", detail: empty.length ? `${empty.map(semesterLabel).join(", ")} ${empty.length > 1 ? "have" : "has"} no courses yet.` : "Every fall and spring term has courses." },
    { id: "verify", ok: unverifiedCompleted === 0, label: "Completed credit verified", detail: unverifiedCompleted ? `${unverifiedCompleted} completed course${unverifiedCompleted > 1 ? "s" : ""} still need verification.` : "No unverified completed credit." },
  ];
}
