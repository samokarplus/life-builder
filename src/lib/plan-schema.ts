import { z } from "zod";
export const semesterSchema = z.object({
  id: z.string(),
  term: z.enum(["fall", "spring", "summer"]),
  year: z.number().int().min(2000).max(2100),
  institutionId: z.string(),
  courses: z.array(z.object({ id: z.string(), courseId: z.string(), status: z.enum(["planned", "in-progress", "completed"]) })),
});
export const profileSchema = z.object({
  dream: z.string(),
  currentInstitutionId: z.string(),
  destinationInstitutionId: z.string(),
  major: z.string(),
  maxCreditsPerSemester: z.number().int().min(3).max(24),
  priorities: z.array(z.string()),
  startingSemester: z.string().regex(/^(fall|spring|summer)-20\d{2}$/).optional(), program: z.string().optional(), desiredDegree: z.string().optional(),
  budget: z.number().nonnegative().nullable().optional(), unverifiedExternalCredits: z.number().nonnegative().optional(),
  careerId: z.string().optional(), careerStageProgress: z.record(z.string(), z.array(z.string())).optional(),
  completed: z.array(z.object({ courseId: z.string(), grade: z.string().optional(), kind: z.enum(["regular", "transfer", "ap-ib"]), verified: z.boolean(), earnedInstitutionId: z.string().optional() })),
});
export const exportSchema = z.object({
  app: z.literal("dream-helper"),
  version: z.union([z.literal(1), z.literal(2)]),
  roadmapView: z.enum(["board", "timeline", "graph"]).optional(),
  onboarded: z.boolean(),
  profile: profileSchema,
  semesters: z.array(semesterSchema),
  requiredCredits: z.number().positive(),
  tuitionPerCredit: z.record(z.string(), z.number().nonnegative().nullable()),
  scenarios: z.array(z.object({
    id: z.string(), name: z.string(), createdAt: z.string(),
    pathway: z.object({ id: z.string(), name: z.string(), major: z.string().optional(), semesters: z.array(semesterSchema) }),
  })).optional(),
  costInputs: z.object({
    residency: z.enum(["in-state", "out-of-state"]), feesPerSemester: z.number().min(0), booksPerSemester: z.number().min(0),
    housingPerSemester: z.number().min(0), livingPerSemester: z.number().min(0), aid: z.number().min(0),
    destSemesters: z.number().min(0), destCreditsPerSemester: z.number().min(0),
  }).optional(),
});

