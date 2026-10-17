import { it,expect } from "vitest";
import fixture from "./campus.fixture.json";
import { campusBundleSchema,campusImporter,campusSchema } from "./campuses";
import { coloradoCampuses } from "@/data/campuses";
import { sources } from "@/data/sources";
it("parses reviewed local JSON and validates all six live campus records and citations",async()=>{
 expect((await campusImporter.parse(JSON.stringify(fixture))).campuses[0].id).toBe("cud");
 expect(coloradoCampuses).toHaveLength(6);
 const ids=new Set(sources.map(s=>s.id));
 for(const c of coloradoCampuses){expect(campusSchema.safeParse(c).success).toBe(true);for(const r of [c,...c.admissions,...c.deadlines,c.tuition,c.transfer])expect(ids.has(r.sourceId)).toBe(true);}
});
it("rejects uncited facts, duplicate identifiers, missing provenance, unsafe URLs and impossible prices/dates",()=>{
 const mutations=[
 (b:typeof fixture)=>{b.campuses[0].tuition.sourceId="missing";},
 (b:typeof fixture)=>{b.campuses[0].admissions[0].audience="transfer";},
 (b:typeof fixture)=>{b.sources.push(b.sources[0]);},
 (b:typeof fixture)=>{b.campuses.push(b.campuses[0]);},
 (b:typeof fixture)=>{b.campuses[0].deadlines.push(b.campuses[0].deadlines[0]);},
 (b:typeof fixture)=>{b.sources[0].lastVerified="";},
 (b:typeof fixture)=>{b.sources[0].url="javascript:alert(1)";},
 (b:typeof fixture)=>{b.campuses[0].tuition.residentBase=-1;},
 (b:typeof fixture)=>{b.campuses[0].tuition.cof=1000;},
 (b:typeof fixture)=>{b.campuses[0].deadlines[0].when.date="2027-02-30";},
 ];
 for(const change of mutations){const b=structuredClone(fixture);change(b);expect(campusBundleSchema.safeParse(b).success).toBe(false);}
 const b=structuredClone(fixture) as unknown as Record<string,unknown>;
 const raw=JSON.stringify(b).replace('"basis":"fixed-cycle","date":"2027-07-15","entryYear":2027','"basis":"annual-pattern","month":2,"day":30,"yearOffset":0');
 expect(campusBundleSchema.safeParse(JSON.parse(raw)).success).toBe(false);
});
