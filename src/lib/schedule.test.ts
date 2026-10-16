import { describe, expect, it } from "vitest";
import { generatePlan, prereqIssues, progress, sortSemesters } from "./schedule";
import { courses, sampleSemesters } from "@/data/sample";
import type { Semester } from "./types";

const sem = (id: string, term: Semester["term"], year: number, ids: string[]): Semester => ({
  id, term, year, institutionId: "frcc", courses: ids.map((c, i) => ({ id: `${id}-${i}`, courseId: c, status: "planned" })),
});

describe("prereqIssues", () => {
  it("flags prerequisite in same semester", () => {
    const r = prereqIssues([sem("a", "fall", 2026, ["frcc:ENG-1021", "frcc:ENG-1022"])], courses);
    expect(r).toHaveLength(1);
    expect(r[0].missing).toEqual(["frcc:ENG-1021"]);
  });
  it("accepts prerequisite in earlier semester or completed", () => {
    expect(prereqIssues([sem("a", "fall", 2026, ["frcc:ENG-1021"]), sem("b", "spring", 2027, ["frcc:ENG-1022"])], courses)).toHaveLength(0);
    expect(prereqIssues([sem("b", "spring", 2027, ["frcc:ENG-1022"])], courses, [{ courseId: "frcc:ENG-1021", kind: "regular", verified: false }])).toHaveLength(0);
  });
  it("flags prerequisite planned later", () => {
    expect(prereqIssues([sem("a", "fall", 2026, ["frcc:ENG-1022"]), sem("b", "spring", 2027, ["frcc:ENG-1021"])], courses)).toHaveLength(1);
  });
});

describe("progress", () => {
  it("does not double count completed profile courses", () => {
    const ss = [{ ...sampleSemesters[0], courses: [{ id: "x", courseId: "frcc:HIS-1120", status: "completed" as const }] }];
    const p = progress(ss, courses, [{ courseId: "frcc:HIS-1120", kind: "regular", verified: false }], 60);
    expect(p.completed).toBe(3);
    expect(p.percent).toBe(5);
  });
});

describe("generatePlan", () => {
  const profile = { maxCreditsPerSemester: 9, completed: [], currentInstitutionId: "frcc", destinationInstitutionId: "cub" };
  const plan = generatePlan(profile, courses, { term: "fall", year: 2026 });
  it("respects credit cap and prerequisites", () => {
    expect(plan.every((s) => s.courses.length <= 3)).toBe(true);
    expect(prereqIssues(plan, courses)).toHaveLength(0);
  });
  it("places every course and ends at the destination", () => {
    expect(plan.flatMap((s) => s.courses)).toHaveLength(courses.length);
    expect(sortSemesters(plan).at(-1)!.institutionId).toBe("cub");
  });
});
