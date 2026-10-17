import { describe, expect, it } from "vitest";
import { approvedElectiveBasis } from "./frcc-electives";
import { courses, requirements } from "./sample";
import { evaluateRequirements } from "@/lib/requirements";

describe("approved elective list", () => {
  it("every gtPathways course is approved", () => {
    for (const c of courses.filter((x) => x.gtPathways?.length)) expect(approvedElectiveBasis(c.code, c.gtPathways), c.code).toBe("gtPathways");
  });
  it("named courses and 'or higher' ranges follow the catalog", () => {
    expect(approvedElectiveBasis("NRE 2000")).toBe("listed");
    expect(approvedElectiveBasis("PHY 1105")).toBe("or-higher");
    expect(approvedElectiveBasis("PHY 2111")).toBe("or-higher");
    expect(approvedElectiveBasis("BUS 1002")).toBe("or-higher");
    expect(approvedElectiveBasis("COM 1150")).toBe("or-higher");
  });
  it("rejects courses below the starting number, excluded numbers, and 3000/4000-level", () => {
    expect(approvedElectiveBasis("PHY 1010")).toBeNull();
    expect(approvedElectiveBasis("MAT 1210")).toBeNull();
    expect(approvedElectiveBasis("HLT 2008")).toBeNull();
    expect(approvedElectiveBasis("HLT 2010")).toBe("or-higher");
    expect(approvedElectiveBasis("PHY 3010")).toBeNull();
    expect(approvedElectiveBasis("ZZZ 1000")).toBeNull();
  });
  it("exact entries do not extend upward", () => {
    expect(approvedElectiveBasis("DAT 1001")).toBe("listed");
    expect(approvedElectiveBasis("DAT 1002")).toBeNull();
  });
});

describe("AA electives requirement", () => {
  const base = { courses, projected: [] as string[] };
  const done = (code: string) => ({ courseId: `frcc:${code.replace(" ", "-")}`, verified: true });
  it("is satisfied by 18 credits of approved electives that other areas don't need", () => {
    const completed = ["ART 1110", "ART 1111", "ART 1112", "ART 1113", "MUS 1020", "MUS 1021", "MUS 1022", "MUS 1023", "MUS 1025"].map(done);
    const r = evaluateRequirements(requirements, { ...base, completed });
    expect(r.find((x) => x.requirementId === "aa-electives")!.status).toBe("satisfied");
  });
  it("is not satisfied by credits from courses the list doesn't approve", () => {
    const r = evaluateRequirements(requirements, { ...base, completed: [done("PHI 1030"), done("ENP 1005"), done("AIR 2001")] });
    expect(r.find((x) => x.requirementId === "aa-electives")!.status).not.toBe("satisfied");
  });
});

it("illustrative course numbers cannot verify an official AA elective requirement", () => {
 const elective = requirements.find(r=>r.id==='aa-electives')!;
 const completed=['ART-1110','ART-1111','ART-1112','ART-1113','MUS-1020','PHI-1030'].map(code=>({courseId:`frcc:${code}`,verified:true,grade:'B'}));
 const result=evaluateRequirements([elective],{courses,completed,projected:[]})[0];
 expect(result.status).toBe('unsatisfied');
 expect(result.usedCourseIds).not.toContain('frcc:PHI-1030');
 expect(elective.sourceId).toBe('src-frcc-electives-2627');
});
