import { it,expect } from "vitest";
import { coloradoCampuses } from "@/data/campuses";
import { campusDeadlines } from "./campus-deadlines";
it("never rolls a fixed admission cycle into a new year",()=>{
 const campus=coloradoCampuses.find(c=>c.id==="cud")!;
 expect(campusDeadlines(campus,"transfer","fall",2028,new Date(2027,9,16))).toEqual([]);
 const [date]=campusDeadlines(campus,"transfer","fall",2027,new Date(2027,6,16));
 expect(date).toMatchObject({date:"2027-07-15",state:"passed",days:-1});
 expect(campusDeadlines(campus,"transfer","fall",2027,new Date(2027,6,15,23))[0].state).toBe("today");
});
it("distinguishes applicant type and prior-year patterns across DST",()=>{
 const unc=coloradoCampuses.find(c=>c.id==="unc")!;
 expect(campusDeadlines(unc,"first-year","fall",2027,new Date(2026,9,16))[0].date).toBe("2027-02-01");
 expect(campusDeadlines(unc,"transfer","fall",2027,new Date(2026,9,16))[0].date).toBe("2027-06-01");
 expect(campusDeadlines(unc,"transfer","spring",2027,new Date(2026,9,31))[0]).toMatchObject({date:"2026-11-01",days:1});
 expect(()=>campusDeadlines(unc,"transfer","fall",NaN,new Date())).toThrow();
});
it("leaves unknown deadlines empty rather than inventing an admission cutoff",()=>{
 expect(campusDeadlines(coloradoCampuses.find(c=>c.id==="uccs")!,"transfer","fall",2027,new Date())).toEqual([]);
});
