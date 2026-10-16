import type { Course, DegreeRequirement, RequirementRule, CompletedCourse } from "./types";

/** completed = earned; projected = planned or in progress. Never mixed. */
export type ReqStatus = "satisfied" | "projected" | "uncertain" | "unsatisfied";

export interface ReqResult {
  requirementId: string;
  label: string;
  status: ReqStatus;
  creditsCounted: number;
  usedCourseIds: string[];
  notes: string[];
}

export interface EvalContext {
  courses: Course[];
  completed: Pick<CompletedCourse, "courseId" | "grade" | "verified">[];
  projected: string[]; // course ids planned / in progress
  /** Institution rule: if false, one course can satisfy only one requirement. */
  allowDoubleCount?: boolean;
}

const GRADES = ["A", "B", "C", "D", "F"];
const meets = (grade: string | undefined, min: string) => {
  if (!grade) return null; // unknown
  const g = GRADES.indexOf(grade.toUpperCase()[0]);
  return g === -1 ? null : g <= GRADES.indexOf(min);
};

interface Eval { status: ReqStatus; credits: number; used: string[]; notes: string[] }

function evalRule(rule: RequirementRule, ctx: EvalContext, taken: Set<string>): Eval {
  const byId = new Map(ctx.courses.map((c) => [c.id, c]));
  const comp = new Map(ctx.completed.map((c) => [c.courseId, c]));
  const proj = new Set(ctx.projected);

  switch (rule.type) {
    case "course": {
      const code = byId.get(rule.courseId)?.code ?? rule.courseId;
      const cr = byId.get(rule.courseId)?.credits ?? 0;
      if (taken.has(rule.courseId)) return { status: "unsatisfied", credits: 0, used: [], notes: [`${code} already counts toward another requirement`] };
      const c = comp.get(rule.courseId);
      if (c) {
        if (rule.minGrade) {
          const ok = meets(c.grade, rule.minGrade);
          if (ok === null) return { status: "uncertain", credits: cr, used: [rule.courseId], notes: [`${code} needs a ${rule.minGrade} or better; no grade entered`] };
          if (!ok) return { status: "unsatisfied", credits: 0, used: [], notes: [`${code} grade is below ${rule.minGrade}`] };
        }
        if (!c.verified) return { status: "uncertain", credits: cr, used: [rule.courseId], notes: [`${code} credit is not yet verified`] };
        return { status: "satisfied", credits: cr, used: [rule.courseId], notes: [] };
      }
      if (proj.has(rule.courseId)) return { status: "projected", credits: cr, used: [rule.courseId], notes: [`${code} is planned, not yet complete`] };
      return { status: "unsatisfied", credits: 0, used: [], notes: [`${code} not in your plan`] };
    }
    case "all": {
      const parts: Eval[] = [];
      const local = new Set(taken);
      for (const r of rule.rules) { const e = evalRule(r, ctx, local); e.used.forEach((u) => local.add(u)); parts.push(e); }
      return combine(parts);
    }
    case "any": {
      const parts = rule.rules.map((r) => evalRule(r, ctx, new Set(taken)));
      const rank: ReqStatus[] = ["satisfied", "uncertain", "projected", "unsatisfied"];
      const best = parts.reduce((a, b) => (rank.indexOf(b.status) < rank.indexOf(a.status) ? b : a), parts[0]);
      return best ?? { status: "unsatisfied", credits: 0, used: [], notes: [] };
    }
    case "group":
      // A bare group has no threshold; it only has meaning inside a "credits" rule.
      return { status: "unsatisfied", credits: 0, used: [], notes: ["Course group needs a credit threshold"] };
    case "credits": {
      const list = rule.from.type === "group" ? rule.from.courseIds : [];
      const items = list.filter((id) => !taken.has(id));
      let done = 0, proj_ = 0, unverified = 0;
      const used: string[] = [];
      for (const id of items) {
        const cr = byId.get(id)?.credits ?? 0;
        const c = comp.get(id);
        if (c) { done += cr; if (!c.verified) unverified += cr; used.push(id); }
        else if (proj.has(id)) { proj_ += cr; used.push(id); }
      }
      const notes = [`${done} completed + ${proj_} planned of ${rule.min} credits`];
      if (done >= rule.min) return unverified && done - unverified < rule.min
        ? { status: "uncertain", credits: done, used, notes: [...notes, "some credits unverified"] }
        : { status: "satisfied", credits: done, used, notes };
      if (done + proj_ >= rule.min) return { status: "projected", credits: done + proj_, used, notes };
      return { status: "unsatisfied", credits: done + proj_, used, notes };
    }
  }
}

function combine(parts: Eval[]): Eval {
  const used = parts.flatMap((p) => p.used);
  const credits = parts.reduce((n, p) => n + p.credits, 0);
  const notes = parts.flatMap((p) => p.notes);
  const has = (s: ReqStatus) => parts.some((p) => p.status === s);
  const status: ReqStatus = has("unsatisfied") ? "unsatisfied" : has("uncertain") ? "uncertain" : has("projected") ? "projected" : "satisfied";
  return { status, credits, used, notes };
}

export function evaluateRequirements(reqs: DegreeRequirement[], ctx: EvalContext): ReqResult[] {
  const taken = new Set<string>();
  return reqs.map((r) => {
    const e = evalRule(r.rule, ctx, ctx.allowDoubleCount ? new Set() : taken);
    // Only completed or projected usage reserves a course for this requirement.
    if (!ctx.allowDoubleCount && e.status !== "unsatisfied") e.used.forEach((u) => taken.add(u));
    return { requirementId: r.id, label: r.label, status: e.status, creditsCounted: e.credits, usedCourseIds: e.used, notes: e.notes };
  });
}
