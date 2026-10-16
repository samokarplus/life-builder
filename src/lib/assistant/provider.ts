import type { Course, Semester, StudentProfile } from "../types";
import type { ReqResult } from "../requirements";
import type { PathMetrics } from "../compare";

export interface AssistantContext {
  profile: StudentProfile;
  semesters: Semester[];
  courses: Course[];
  requirements: ReqResult[];
  metrics: PathMetrics;
  tuitionPerCredit: Record<string, number | null>;
  prereqIssueCount: number;
}

/** Swap in an LLM-backed provider here later; it receives the same structured context. */
export interface AssistantProvider {
  name: string;
  answer(question: string, ctx: AssistantContext): Promise<string>;
}
