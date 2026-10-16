import { describe, expect, it } from "vitest";
import { pathMetrics, whatChanged } from "./compare";
import { generatePlan } from "./schedule";
import { courses, sampleSemesters } from "@/data/sample";

const rates = { frcc: 100, cub: 400 };
const profile = { currentInstitutionId: "frcc", destinationInstitutionId: "cub", completed: [] };

describe("pathMetrics", () => {
  it("computes load, summer credits and tuition", () => {
    const m = pathMetrics(sampleSemesters, courses, [], rates);
    expect(m.remainingCredits).toBe(24);
    expect(m.semesterCount).toBe(2);
    expect(m.avgLoad).toBe(12);
    expect(m.summerCredits).toBe(0);
    expect(m.tuition).toBe(2400);
  });
  it("returns null tuition when a rate is missing", () => {
    expect(pathMetrics(sampleSemesters, courses, [], { frcc: null, cub: null }).tuition).toBeNull();
  });
  it("excludes completed courses from cost", () => {
    const done = sampleSemesters.map((s) => ({ ...s, courses: s.courses.map((c) => ({ ...c, status: "completed" as const })) }));
    expect(pathMetrics(done, courses, [], rates).tuition).toBe(0);
  });
});

describe("scenario comparison", () => {
  const fast = pathMetrics(generatePlan({ ...profile, maxCreditsPerSemester: 18 }, courses, { term: "fall", year: 2026 }), courses, [], rates);
  const slow = pathMetrics(generatePlan({ ...profile, maxCreditsPerSemester: 6 }, courses, { term: "fall", year: 2026 }), courses, [], rates);
  it("lighter load takes more semesters", () => {
    expect(slow.semesterCount).toBeGreaterThan(fast.semesterCount);
    expect(slow.avgLoad).toBeLessThan(fast.avgLoad);
  });
  it("what-changed only reports real differences", () => {
    const msgs = whatChanged("Fast", fast, "Slow", slow);
    expect(msgs.some((m) => m.includes("semesters"))).toBe(true);
    expect(whatChanged("A", fast, "B", fast)[0]).toMatch(/same computed results/);
  });
});
