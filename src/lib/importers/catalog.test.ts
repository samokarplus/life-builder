import { expect,it } from "vitest";
import fixture from "./sample.fixture.json";
import {catalogSchema,jsonCatalogImporter,officialCatalogImporter} from "./catalog";
it("parses an explicitly illustrative fixture without fetching",async()=>{expect((await jsonCatalogImporter.parse(JSON.stringify(fixture))).sources[0].status).toBe("illustrative");});
it("rejects missing provenance and unsupported verified claims",()=>{expect(()=>catalogSchema.parse({...fixture,sources:[]})).toThrow();expect(()=>catalogSchema.parse({...fixture,sources:[{...fixture.sources[0],status:"verified"}]})).toThrow();});
it("rejects unknown sources, duplicate IDs and fabricated negative prices",()=>{expect(()=>catalogSchema.parse({...fixture,courses:[{...fixture.courses[0],sourceId:"missing"}]})).toThrow();expect(()=>catalogSchema.parse({...fixture,courses:[...fixture.courses,...fixture.courses]})).toThrow();expect(()=>catalogSchema.parse({...fixture,tuition:[{id:"x",sourceId:"src-sample",institutionId:"frcc",academicYear:"user-entered",residency:"in-state",perCredit:-1}]})).toThrow();});
it("leaves the official adapter explicitly unconfigured",async()=>{await expect(officialCatalogImporter("frcc").parse("anything")).rejects.toThrow("not configured");});
it('rejects duplicate sources, unsafe links and dangling nested policies',()=>{
 expect(()=>catalogSchema.parse({...fixture,sources:[...fixture.sources,...fixture.sources]})).toThrow();
 expect(()=>catalogSchema.parse({...fixture,sources:[{...fixture.sources[0],url:'javascript:alert(1)'}]})).toThrow();
 expect(()=>catalogSchema.parse({...fixture,requirements:[{id:'r',programId:'p',label:'r',sourceId:'src-sample',rule:{type:'all',rules:[{type:'residency',institutionId:'frcc',minCredits:3,sourceId:'missing'}]}}]})).toThrow();
 expect(()=>catalogSchema.parse({...fixture,courses:[{...fixture.courses[0],prerequisiteIds:['missing']}]})).toThrow();
});
it('retains restrictions and provenance on imported course records',()=>{
 const course={...fixture.courses[0],gtPathways:['GT-SC1'],notOffered:true,eligibilityNote:'Restricted to a reviewed agreement',prerequisiteSourceId:'src-sample'};
 expect(catalogSchema.parse({...fixture,courses:[course]}).courses[0]).toMatchObject(course);
});
