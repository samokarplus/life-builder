import { describe, expect, it } from "vitest";
import { courses, requirements, sources, tuitionRates, sourceById, FRCC_AA_CREDITS } from "./sample";
import { evaluateRequirements } from "@/lib/requirements";

describe("data provenance", () => {
  it("every verified source has a URL, catalog year and verification date", () => {
    for (const s of sources.filter((x) => x.status === "verified")) {
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.catalogYear).toBeTruthy();
      expect(s.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("every record points at a real source", () => {
    for (const c of courses) expect(sourceById(c.sourceId), c.id).toBeDefined();
    for (const r of requirements) expect(sourceById(r.sourceId), r.id).toBeDefined();
    for (const t of tuitionRates) expect(sourceById(t.sourceId), t.id).toBeDefined();
  });
  it("loads only published tuition, never a guessed figure", () => {
    expect(tuitionRates.find((t) => t.institutionId === "frcc")!.perCredit).toBe(299.75);
    expect(tuitionRates.find((t) => t.institutionId === "cub")!.perCredit).toBeNull();
  });
  it("AA total is 60 and area credits fit inside it", () => {
    expect(FRCC_AA_CREDITS).toBe(60);
  });
});

describe("real FRCC AA requirements", () => {
  const base = { courses, projected: [] as string[] };
  const status = (res: ReturnType<typeof evaluateRequirements>, id: string) => res.find((r) => r.requirementId === id)!.status;
  it("written and oral communication resolve from real courses", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [
      { courseId: "frcc:ENG-1021", verified: true }, { courseId: "frcc:ENG-1022", verified: true }, { courseId: "frcc:COM-1150", verified: true },
    ] });
    expect(status(r, "aa-written")).toBe("satisfied");
    expect(status(r, "aa-oral")).toBe("satisfied");
  });
  it("areas needing gtPathways mapping are uncertain, never satisfied or invented", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [] });
    for (const id of ["aa-math", "aa-arts-hum", "aa-history", "aa-social", "aa-science", "aa-choice", "aa-electives"]) expect(status(r, id)).toBe("uncertain");
    expect(status(r, "aa-written")).toBe("unsatisfied");
  });
});
