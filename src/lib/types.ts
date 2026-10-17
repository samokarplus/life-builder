/** Core domain model. All official facts carry provenance. */

export type VerificationStatus = "verified" | "unverified" | "illustrative" | "user-entered";

export interface DataSource {
  id: string;
  url: string | null;
  institutionId: string | null;
  catalogYear: string | null;
  lastVerified: string | null; // ISO date
  status: VerificationStatus;
  note?: string;
}

export interface Provenance {
  sourceId: string;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  kind: "community-college" | "university";
  state: string;
}

export interface Course extends Provenance {
  /** false = real catalog course that is an option, not auto-placed by plan generation. */
  planDefault?: boolean;
  id: string; // stable, e.g. "frcc:HIS-1120"
  institutionId: string;
  code: string;
  title: string;
  credits: number;
  level: 1000 | 2000 | 3000 | 4000;
  prerequisiteIds: string[];
  category: string; // requirement category label
  description?: string;
}

export interface CourseOffering extends Provenance {
  id: string;
  courseId: string;
  term: string; // "2026-fall"
  modality: "online" | "in-person" | "hybrid" | "unknown";
}

export interface TransferEquivalency extends Provenance {
  id: string;
  fromCourseId: string;
  toCourseId: string | null;
  note?: string;
}

export type RequirementRule =
  | { type: "course"; courseId: string; minGrade?: string }
  | { type: "all"; rules: RequirementRule[] }
  | { type: "any"; rules: RequirementRule[] }
  | { type: "credits"; min: number; from: RequirementRule }
  | { type: "group"; courseIds: string[]; minGrade?: string }
  /** A real requirement whose course mapping (e.g. gtPathways attributes) is not loaded yet. Always "uncertain". */
  | { type: "unmapped"; credits: number; note: string }
  | { type: "residency"; institutionId: string; minCredits: number; sourceId: string }
  | { type: "transfer"; from: RequirementRule; maxCredits: number; sourceId: string };

export interface DegreeRequirement extends Provenance {
  id: string;
  programId: string;
  label: string;
  institutionId?: string;
  rule: RequirementRule;
}

export interface InstitutionRequirementPolicy extends Provenance {
  institutionId: string;
  allowDoubleCount: boolean;
  sharedRequirementPairs?: [string, string][];
}

export interface AcademicProgram extends Provenance {
  id: string;
  institutionId: string;
  name: string;
  degree: string;
  totalCredits: number;
  requirementIds: string[];
}

export interface Career extends Provenance {
  id: string;
  name: string;
  status: "detailed" | "placeholder";
  jurisdiction?: string;
  stages: { label: string; description: string }[];
}

export interface TuitionRate extends Provenance {
  id: string;
  institutionId: string;
  academicYear: string;
  perCredit: number | null; // null = not yet sourced
  /** College Opportunity Fund stipend applied for eligible Colorado residents, when published. */
  cofStipend?: number;
  note?: string;
  residency: "in-state" | "out-of-state";
}

export type CourseStatus = "planned" | "in-progress" | "completed";

export interface CompletedCourse {
  courseId: string;
  grade?: string;
  kind: "regular" | "transfer" | "ap-ib";
  verified: boolean;
  earnedInstitutionId?: string;
}

export interface PlannedCourse {
  id: string; // instance id
  courseId: string;
  status: CourseStatus;
}

export interface Semester {
  id: string;
  term: "fall" | "spring" | "summer";
  year: number;
  institutionId: string;
  courses: PlannedCourse[];
}

export interface StudentProfile {
  dream: string;
  currentInstitutionId: string;
  destinationInstitutionId: string;
  major: string;
  maxCreditsPerSemester: number;
  priorities: string[];
  completed: CompletedCourse[];
  startingSemester?: string;
  program?: string;
  desiredDegree?: string;
  budget?: number | null;
  unverifiedExternalCredits?: number;
  careerId?: string;
  careerStageProgress?: Record<string, string[]>; // explicitly user-reported, never inferred eligibility
}

export interface AcademicPathway {
  id: string;
  name: string;
  major?: string;
  semesters: Semester[];
}

export interface PlanningScenario {
  id: string;
  name: string;
  pathway: AcademicPathway;
  createdAt: string;
}
