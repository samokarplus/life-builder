import { describe, expect, it } from "vitest";
import { evaluateRequirements } from "./requirements";
import { courses, requirements } from "@/data/sample";

const base = { courses, projected: [] as string[] };
const done = (id: string, grade?: string, verified = true) => ({ courseId: `frcc:${id}`, grade, verified });
const status = (res: ReturnType<typeof evaluateRequirements>, id: string) => res.find((r) => r.requirementId === id)!.status;

describe("requirement engine", () => {
  it("AND needs every course and min grade", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("ENG-1021", "B"), done("ENG-1022", "D")] });
    expect(status(r, "req-written")).toBe("unsatisfied");
  });
  it("missing grade is uncertain, not satisfied", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("ENG-1021", "A"), done("ENG-1022")] });
    expect(status(r, "req-written")).toBe("uncertain");
  });
  it("satisfied when completed; projected when only planned", () => {
    const comp = evaluateRequirements(requirements, { ...base, completed: [done("ENG-1021", "A"), done("ENG-1022", "B")] });
    expect(status(comp, "req-written")).toBe("satisfied");
    const proj = evaluateRequirements(requirements, { ...base, completed: [], projected: ["frcc:ENG-1021", "frcc:ENG-1022"] });
    expect(status(proj, "req-written")).toBe("projected");
  });
  it("OR accepts any alternative", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("GEY-1111")] });
    expect(status(r, "req-science")).toBe("satisfied");
  });
  it("credit thresholds combine completed and planned separately", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("HIS-1120")], projected: ["frcc:PHI-1014"] });
    expect(status(r, "req-humanities")).toBe("projected");
    const only = evaluateRequirements(requirements, { ...base, completed: [done("HIS-1120")] });
    expect(status(only, "req-humanities")).toBe("unsatisfied");
  });
  it("unverified credit is uncertain", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("GEY-1108", undefined, false)] });
    expect(status(r, "req-science")).toBe("uncertain");
  });
  it("blocks double counting unless allowed", () => {
    const reqs = [
      { ...requirements[1], id: "a" },
      { ...requirements[1], id: "b" },
    ];
    const ctx = { ...base, completed: [done("GEY-1108")] };
    expect(evaluateRequirements(reqs, ctx).map((r) => r.status)).toEqual(["satisfied", "unsatisfied"]);
    expect(evaluateRequirements(reqs, { ...ctx, allowDoubleCount: true }).map((r) => r.status)).toEqual(["satisfied", "satisfied"]);
  });
});
