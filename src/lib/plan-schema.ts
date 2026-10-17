import { z } from "zod";
import { actionsSchema } from "@/lib/journey/types";
export const semesterSchema = z.object({
  id: z.string().min(1).max(200),
  term: z.enum(["fall", "spring", "summer"]),
  year: z.number().int().min(2000).max(2100),
  institutionId: z.string().min(1).max(200),
  courses: z.array(z.object({ id: z.string().min(1).max(200), courseId: z.string().min(1).max(200), status: z.enum(["planned", "in-progress", "completed"]) })).max(500),
});
export const profileSchema = z.object({
  dream: z.string(),
  currentInstitutionId: z.string(),
  destinationInstitutionId: z.string(),
  major: z.string(),
  maxCreditsPerSemester: z.number().int().min(1).max(30),
  priorities: z.array(z.string()),
  startingSemester: z.string().regex(/^(fall|spring|summer)-20\d{2}$/).optional(), program: z.string().optional(), desiredDegree: z.string().optional(),
  budget: z.number().nonnegative().nullable().optional(), unverifiedExternalCredits: z.number().nonnegative().optional(),
  currentStage: z.enum(["high-school", "college"]).optional(), careerId: z.string().optional(), careerStageProgress: z.record(z.string(), z.array(z.string())).optional(),
  completed: z.array(z.object({ courseId: z.string().min(1).max(200), grade: z.string().optional(), kind: z.enum(["regular", "transfer", "ap-ib"]), verified: z.boolean(), earnedInstitutionId: z.string().optional() })),
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
    id: z.string().min(1).max(200), name: z.string(), createdAt: z.string(),
    pathway: z.object({ id: z.string().min(1).max(200), name: z.string(), major: z.string().optional(), semesters: z.array(semesterSchema) }),
  })).optional(),
  actions: actionsSchema.optional(),
  costInputs: z.object({
    residency: z.enum(["in-state", "out-of-state"]), feesPerSemester: z.number().min(0), booksPerSemester: z.number().min(0),
    housingPerSemester: z.number().min(0), livingPerSemester: z.number().min(0), aid: z.number().min(0),
    destSemesters: z.number().min(0), destCreditsPerSemester: z.number().min(0),
  }).optional(),
});


/** Stable IDs must be unambiguous for drag/drop, removal, undo and React keys. */
function checkUnique(ids: string[], ctx: z.RefinementCtx, path: (string | number)[]) {
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", path, message: "Duplicate stable IDs in saved plan." });
}
export const validatedExportSchema = exportSchema.superRefine((data, ctx) => {
  const plans = [{ semesters: data.semesters, path: ["semesters"] as (string | number)[] }, ...(data.scenarios ?? []).map((s, i) => ({ semesters: s.pathway.semesters, path: ["scenarios", i, "pathway", "semesters"] as (string | number)[] }))];
  for (const { semesters, path } of plans) {
    checkUnique(semesters.map(s => s.id), ctx, path);
    checkUnique(semesters.map(s => `${s.year}-${s.term}`), ctx, path);
    checkUnique(semesters.flatMap(s => s.courses.map(c => c.id)), ctx, path);
  }
  checkUnique(data.profile.completed.map(c => c.courseId), ctx, ["profile", "completed"]);
  checkUnique((data.scenarios ?? []).map(s => s.id), ctx, ["scenarios"]);
});
