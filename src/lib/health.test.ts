import { describe, expect, it } from "vitest";
import { planHealth } from "./health";
import { courses, sampleSemesters } from "@/data/sample";

describe("planHealth", () => {
  it("flags an overloaded semester", () => {
    const h = planHealth(sampleSemesters, courses, [], 12);
    expect(h.find((c) => c.id === "load")!.ok).toBe(false);
    expect(planHealth(sampleSemesters, courses, [], 20).find((c) => c.id === "load")!.ok).toBe(true);
  });
  it("flags prerequisites and unverified completed credit", () => {
    const h = planHealth(sampleSemesters, courses, [{ courseId: "frcc:HIS-1120", kind: "regular", verified: false }], 20);
    expect(h.find((c) => c.id === "prereq")!.ok).toBe(false); // ENG 1022 without ENG 1021
    expect(h.find((c) => c.id === "verify")!.ok).toBe(false);
  });
});
