import { expect,it } from "vitest";
import fixture from "./sample.fixture.json";
import {catalogSchema,jsonCatalogImporter,officialCatalogImporter} from "./catalog";
it("parses an explicitly illustrative fixture without fetching",async()=>{expect((await jsonCatalogImporter.parse(JSON.stringify(fixture))).sources[0].status).toBe("illustrative");});
it("rejects missing provenance and unsupported verified claims",()=>{expect(()=>catalogSchema.parse({...fixture,sources:[]})).toThrow();expect(()=>catalogSchema.parse({...fixture,sources:[{...fixture.sources[0],status:"verified"}]})).toThrow();});
it("rejects unknown sources, duplicate IDs and fabricated negative prices",()=>{expect(()=>catalogSchema.parse({...fixture,courses:[{...fixture.courses[0],sourceId:"missing"}]})).toThrow();expect(()=>catalogSchema.parse({...fixture,courses:[...fixture.courses,...fixture.courses]})).toThrow();expect(()=>catalogSchema.parse({...fixture,tuition:[{id:"x",sourceId:"src-sample",institutionId:"frcc",academicYear:"user-entered",residency:"in-state",perCredit:-1}]})).toThrow();});
it("leaves the official adapter explicitly unconfigured",async()=>{await expect(officialCatalogImporter("frcc").parse("anything")).rejects.toThrow("not configured");});
