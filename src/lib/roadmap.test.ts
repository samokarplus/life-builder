import type { Course } from "./types";
import { expect, it } from "vitest";
import { courses, sampleSemesters } from "@/data/sample";
import { creditWarnings, nextSummer, prerequisiteFix } from "./roadmap";
it("warns per term without changing a user's plan",()=>{const ss=structuredClone(sampleSemesters);expect(creditWarnings(ss,courses,12)[0]).toMatchObject({semesterId:"s-sp27",excess:4});expect(ss).toEqual(sampleSemesters);});
it("offers a strictly earlier prerequisite move",()=>{expect(prerequisiteFix("frcc:ENG-1021","s-sp27",sampleSemesters)?.targetId).toBe("s-f26");expect(prerequisiteFix("frcc:ENG-1021","s-f26",sampleSemesters)).toBeNull();});
it("quick-add skips existing summers",()=>{expect(nextSummer(sampleSemesters,"frcc")).toEqual({term:"summer",year:2028,institutionId:"frcc"});});


it('flags institution mismatches without moving a course or assuming an equivalency',async()=>{
 const {institutionWarnings}=await import('./roadmap');
 const semesters=structuredClone(sampleSemesters);
 const before=JSON.stringify(semesters);
 const catalog=[{id:'foreign',code:'ASEN 5016',institutionId:'cub',credits:3,level:5000,title:'Space Life Sciences',sourceId:'s',prerequisiteIds:[],category:'x'}] as Course[];
 const mixed=[{...semesters[0],courses:[{id:'p',courseId:'foreign',status:'planned' as const}]}];
 expect(institutionWarnings(mixed,catalog)).toMatchObject([{courseId:'foreign',institutionId:'cub'}]);
 expect(institutionWarnings([{...mixed[0],institutionId:'cub'}],catalog)).toEqual([]);
 expect(JSON.stringify(semesters)).toBe(before);
});
