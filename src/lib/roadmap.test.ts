import { expect, it } from "vitest";
import { courses, sampleSemesters } from "@/data/sample";
import { creditWarnings, nextSummer, prerequisiteFix } from "./roadmap";
it("warns per term without changing a user's plan",()=>{const ss=structuredClone(sampleSemesters);expect(creditWarnings(ss,courses,12)[0]).toMatchObject({semesterId:"s-sp27",excess:3});expect(ss).toEqual(sampleSemesters);});
it("offers a strictly earlier prerequisite move",()=>{expect(prerequisiteFix("frcc:ENG-1021","s-sp27",sampleSemesters)?.targetId).toBe("s-f26");expect(prerequisiteFix("frcc:ENG-1021","s-f26",sampleSemesters)).toBeNull();});
it("quick-add skips existing summers",()=>{expect(nextSummer(sampleSemesters,"frcc")).toEqual({term:"summer",year:2028,institutionId:"frcc"});});
