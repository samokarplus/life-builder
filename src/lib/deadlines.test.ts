import { describe, expect, it } from "vitest";
import { cuTransferDeadlines, describeDeadline, nextFallEntry } from "./deadlines";

describe("cuTransferDeadlines", () => {
  it("fall entry has early, final and scholarship dates in the entry year", () => {
    expect(cuTransferDeadlines("fall", 2027).map((d) => d.date)).toEqual(["2027-03-15", "2027-06-01", "2027-06-15"]);
  });
  it("spring entry deadline falls in October of the previous year", () => {
    expect(cuTransferDeadlines("spring", 2027)[0].date).toBe("2026-10-01");
  });
  it("labels the published March 15 summer application deadline correctly", () => {
    expect(cuTransferDeadlines("summer", 2027)).toMatchObject([{label:"Summer application deadline",date:"2027-03-15"}]);
  });
});

describe("describeDeadline", () => {
  const d = { id: "x", label: "x", date: "2026-10-20" };
  it("counts days and classifies", () => {
    expect(describeDeadline(d, new Date(2026, 9, 16))).toEqual({ days: 4, state: "soon" });
    expect(describeDeadline(d, new Date(2026, 9, 20)).state).toBe("today");
    expect(describeDeadline(d, new Date(2026, 9, 21)).state).toBe("passed");
    expect(describeDeadline(d, new Date(2026, 5, 1)).state).toBe("upcoming");
  });
});

describe("nextFallEntry", () => {
  it("rolls to next year after the June 1 fall deadline", () => {
    expect(nextFallEntry(new Date(2026, 9, 16))).toBe(2027);
    expect(nextFallEntry(new Date(2026, 2, 1))).toBe(2026);
    expect(nextFallEntry(new Date(2026, 5, 1))).toBe(2026);
    expect(nextFallEntry(new Date(2026, 5, 2))).toBe(2027);
  });
});
it('handles leap days, local midnight, and daylight-saving boundaries',()=>{
 const d={id:'x',label:'x',date:'2028-03-01'};
 expect(describeDeadline(d,new Date(2028,1,29,23,59)).days).toBe(1);
 expect(describeDeadline({...d,date:'2027-03-15'},new Date(2027,2,13)).days).toBe(2);
 for(const date of ['2027-02-29','2026-02-30','2026-13-01','oops']) expect(()=>describeDeadline({...d,date},new Date())).toThrow(RangeError);
 expect(()=>cuTransferDeadlines('fall',NaN)).toThrow();
 expect(()=>nextFallEntry(new Date('invalid'))).toThrow();
});
