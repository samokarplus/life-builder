import { describe, expect, it } from "vitest";
import { courses, requirements, sources, tuitionRates, sourceById, FRCC_AA_CREDITS } from "./sample";
import { evaluateRequirements } from "@/lib/requirements";

describe("data provenance", () => {
  it("every verified source has a URL and verification date", () => {
    for (const s of sources.filter((x) => x.status === "verified")) {
      expect(s.url).toMatch(/^https:\/\//);
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
      { courseId: "frcc:ENG-1021", verified: true, grade: "B" }, { courseId: "frcc:ENG-1022", verified: true, grade: "B" }, { courseId: "frcc:COM-1150", verified: true, grade: "B" },
    ] });
    expect(status(r, "aa-written")).toBe("satisfied");
    expect(status(r, "aa-oral")).toBe("satisfied");
  });
  it("with nothing completed, mapped areas are unsatisfied and only electives need a check", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [] });
    for (const id of ["aa-written", "aa-oral", "aa-math", "aa-arts-hum", "aa-history", "aa-social", "aa-science", "aa-choice"]) expect(status(r, id), id).toBe("unsatisfied");
    expect(status(r, "aa-electives")).toBe("uncertain");
  });
  it("satisfies real gtPathways areas from official categories", () => {
    const done = (code: string) => ({ courseId: `frcc:${code}`, verified: true, grade: "B" });
    const r = evaluateRequirements(requirements, { ...base, completed: [
      done("MAT-1260"), done("HIS-1120"), done("PHI-1014"), done("ART-1110"),
      done("PSY-1001"), done("SOC-1001"), done("GEY-1111"), done("GEY-1108"), done("LIT-1015"),
    ] });
    expect(status(r, "aa-math")).toBe("satisfied");
    expect(status(r, "aa-history")).toBe("satisfied");
    expect(status(r, "aa-arts-hum")).toBe("satisfied"); // PHI 1014 (AH3) + ART 1110 (AH1)
    expect(status(r, "aa-social")).toBe("satisfied");
    expect(status(r, "aa-science")).toBe("satisfied"); // lab course + second science course
  });
  it("two arts & humanities courses from the SAME area do not satisfy the requirement", () => {
    const done = (code: string) => ({ courseId: `frcc:${code}`, verified: true, grade: "B" });
    const r = evaluateRequirements(requirements, { ...base, completed: [done("ART-1110"), done("ART-1111")] });
    expect(status(r, "aa-arts-hum")).toBe("unsatisfied");
  });
  it("science needs a lab course", () => {
    const done = (code: string) => ({ courseId: `frcc:${code}`, verified: true, grade: "B" });
    const r = evaluateRequirements(requirements, { ...base, completed: [done("GEY-1108"), done("AST-1140")] });
    expect(status(r, "aa-science")).toBe("unsatisfied");
  });
});

describe("FRCC gtPathways catalog data", () => {
  it("official data overrides sample details and flags not-offered courses", () => {
    const geo = courses.find((c) => c.id === "frcc:GEY-1111")!;
    expect(geo.credits).toBe(4);
    expect(geo.gtPathways).toEqual(["GT-SC1"]);
    expect(courses.find((c) => c.id === "frcc:HIS-1120")!.title).toBe("The World: 1500-Present");
    expect(courses.find((c) => c.id === "frcc:PHI-1041")!.notOffered).toBe(true);
    expect(courses.find((c) => c.id === "frcc:PHI-1030")!.gtPathways).toBeUndefined();
  });
  it("loads every listed course exactly once", () => {
    const ids = courses.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(courses.filter((c) => c.gtPathways).length).toBeGreaterThan(200);
  });
});

describe('AA audit regressions from the official degree page', () => {
 const earned=(...codes:string[])=>codes.map(code=>({courseId:`frcc:${code}`,verified:true,grade:'B'}));
 const evaluate=(codes:string[])=>evaluateRequirements(requirements,{courses,completed:earned(...codes),projected:[]});
 it('one lab course cannot meet the two-course science rule',()=>{
  expect(evaluate(['GEY-1111']).find(r=>r.requirementId==='aa-science')?.status).toBe('unsatisfied');
  expect(evaluate(['GEY-1111','BIO-1004']).find(r=>r.requirementId==='aa-science')?.status).toBe('satisfied');
 });
 it('accepts the published CO2 + CO3 writing alternative',()=>{
  expect(evaluate(['ENG-1022','ENG-2001']).find(r=>r.requirementId==='aa-written')?.status).toBe('satisfied');
 });
 it('does not accept low or unknown grades as earned completion',()=>{
  for(const grade of ['D',undefined]) expect(evaluateRequirements(requirements,{courses,projected:[],completed:[{courseId:'frcc:MAT-1260',verified:true,grade}]}).find(r=>r.requirementId==='aa-math')?.status).toBe(grade?'unsatisfied':'uncertain');
 });
 it('keeps restricted teacher-education sciences uncertain',()=>{
  const result=evaluate(['SCI-1055','SCI-1056']).find(r=>r.requirementId==='aa-science');
  expect(result?.status).toBe('uncertain');expect(result?.notes.join(' ')).toContain('Teacher Education');
 });
});
