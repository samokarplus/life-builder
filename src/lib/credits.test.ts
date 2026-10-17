import { describe, expect, it } from "vitest";
import { creditsByStatus, semesterCredits } from "./credits";
import { courses, sampleSemesters } from "@/data/sample";

describe("credits", () => {
  it("sums semester credits", () => {
    expect(semesterCredits(sampleSemesters[0], courses)).toBe(9);
  });
  it("groups credits by status", () => {
    const r = creditsByStatus(sampleSemesters, courses);
    expect(r["in-progress"]).toBe(9);
    expect(r.planned).toBe(16);
    expect(r.completed).toBe(0);
  });
});
