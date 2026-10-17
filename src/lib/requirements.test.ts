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

describe("institution policies and nested requirements",()=>{
 const a="frcc:HIS-1120", b="frcc:PHI-1014", c="frcc:PHI-1030";
 const req=(id:string,rule:import('./types').RequirementRule,institutionId="frcc")=>({id,programId:"test",label:id,sourceId:"src-sample",institutionId,rule});
 const earned=(id:string,grade="B",verified=true,kind:"regular"|"transfer"|"ap-ib"="regular")=>({courseId:id,grade,verified,kind});
 it("allocates shared courses to a narrow requirement and uses the OR alternative",()=>{const r=evaluateRequirements([req("choice",{type:"any",rules:[{type:"course",courseId:a},{type:"course",courseId:b}]}),req("fixed",{type:"course",courseId:a})],{...base,completed:[earned(a),earned(b)]});expect(r.map(x=>x.status)).toEqual(["satisfied","satisfied"]);expect(r[0].usedCourseIds).toEqual([b]);});
 it("applies policy only to its institution",()=>{const r=evaluateRequirements([req("a",{type:"course",courseId:a}),req("b",{type:"course",courseId:a})],{...base,completed:[earned(a)],institutionPolicies:[{institutionId:"cub",sourceId:"src-sample",allowDoubleCount:true}]});expect(r[1].status).toBe("unsatisfied");});
 it("allows explicit institution-specific shared requirement pairs",()=>{const r=evaluateRequirements([req("a",{type:"course",courseId:a}),req("b",{type:"course",courseId:a}),req("c",{type:"course",courseId:a})],{...base,completed:[earned(a)],institutionPolicies:[{institutionId:"frcc",sourceId:"src-sample",allowDoubleCount:false,sharedRequirementPairs:[["a","b"]]}]});expect(r.map(x=>x.status)).toEqual(["satisfied","satisfied","unsatisfied"]);});
 it("handles nested AND/OR under a threshold",()=>{const r=evaluateRequirements([req("nested",{type:"credits",min:6,from:{type:"all",rules:[{type:"course",courseId:a},{type:"any",rules:[{type:"course",courseId:b},{type:"course",courseId:c}]}]}})],{...base,completed:[earned(a),earned(c)]});expect(r[0].status).toBe("satisfied");expect(r[0].creditsCounted).toBe(6);});
 it("deduplicates shared clauses and repeated group IDs",()=>{for(const from of [{type:"all",rules:[{type:"course",courseId:a},{type:"course",courseId:a}]},{type:"group",courseIds:[a,a]}] as import('./types').RequirementRule[]) {const r=evaluateRequirements([req("dup",{type:"credits",min:6,from})],{...base,completed:[earned(a)]});expect(r[0].status).toBe("unsatisfied");expect(r[0].creditsCounted).toBe(3);}});
 it("does not reserve all available group credit when a threshold needs less",()=>{const r=evaluateRequirements([req("x",{type:"credits",min:3,from:{type:"group",courseIds:[a,b,c]}}),req("y",{type:"credits",min:3,from:{type:"group",courseIds:[a,b,c]}})],{...base,completed:[earned(a),earned(b),earned(c)]});expect(r.map(x=>x.status)).toEqual(["satisfied","satisfied"]);expect(r[0].usedCourseIds).toHaveLength(1);});
 it("does not treat C- as meeting C; unknown pass grades remain uncertain",()=>{for(const [grade,status] of [["C-","unsatisfied"],["C+","satisfied"],["P","uncertain"],["","uncertain"]]){expect(evaluateRequirements([req("g",{type:"course",courseId:a,minGrade:"C"})],{...base,completed:[earned(a,grade)]})[0].status).toBe(status);}});
 it("applies group minimum grades",()=>{expect(evaluateRequirements([req("g",{type:"credits",min:3,from:{type:"group",courseIds:[a],minGrade:"C"}})],{...base,completed:[earned(a,"D")]})[0].status).toBe("unsatisfied");});
 it("keeps mixed unverified and projected thresholds uncertain",()=>{const r=evaluateRequirements([req("mixed",{type:"credits",min:6,from:{type:"group",courseIds:[a,b]}})],{courses,completed:[earned(a,"B",false,"ap-ib")],projected:[b]})[0];expect(r.status).toBe("uncertain");expect(r.completedCourseIds).toEqual([a]);expect(r.projectedCourseIds).toEqual([b]);});
 it("does not count unverified transfer as verified completion",()=>{expect(evaluateRequirements([req("t",{type:"course",courseId:a})],{...base,completed:[earned(a,"B",false,"transfer")]})[0].status).toBe("uncertain");});
 it("excludes transfer credit from institutional residency",()=>{const rule={type:"residency",institutionId:"frcc",minCredits:3,sourceId:"src-sample"} as const;expect(evaluateRequirements([req("r",rule)],{...base,completed:[earned(a,"B",true,"transfer")]})[0].status).toBe("unsatisfied");expect(evaluateRequirements([req("r",rule)],{...base,completed:[earned(a)]})[0].status).toBe("satisfied");});
 it("respects a transfer cap and picks an allowed alternative",()=>{const r=evaluateRequirements([req("cap",{type:"transfer",maxCredits:0,sourceId:"src-sample",from:{type:"any",rules:[{type:"course",courseId:a},{type:"course",courseId:b}]}})],{...base,completed:[earned(a,"A",true,"transfer"),earned(b)]});expect(r[0].usedCourseIds).toEqual([b]);expect(r[0].status).toBe("satisfied");});
 it("never satisfies a missing course record",()=>{expect(evaluateRequirements([req("missing",{type:"course",courseId:"unknown"})],{...base,completed:[earned("unknown")]})[0].status).toBe("unsatisfied");});
 it("handles empty alternatives and a zero-credit threshold",()=>{expect(evaluateRequirements([req("any",{type:"any",rules:[]}),req("zero",{type:"credits",min:0,from:{type:"group",courseIds:[]}})],{...base,completed:[]}).map(x=>x.status)).toEqual(["unsatisfied","satisfied"]);});
});
it("backtracks across flexible rules instead of greedily exhausting shared courses",()=>{
 const [a,b,c]=courses.slice(0,3).map(c=>c.id);const either=(id:string,ids:string[])=>({id,label:id,sourceId:"src-sample",programId:"test",rule:{type:"any" as const,rules:ids.map(courseId=>({type:"course" as const,courseId}))}});
 const result=evaluateRequirements([either("first",[a,b]),either("second",[a,c]),either("third",[a,c])],{courses,projected:[],completed:[a,b,c].map(courseId=>({courseId,verified:true}))});
 expect(result.map(r=>r.status)).toEqual(["satisfied","satisfied","satisfied"]);expect(result[0].usedCourseIds).toEqual([b]);
});
