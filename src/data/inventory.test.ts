import { expect, it } from "vitest";
import { sourceRecords, inventoryModules } from "./inventory";
import { sources } from "./sources";
import { checkSourceIds } from "@/lib/source-health";
import { readdirSync } from "node:fs";
it("every factual record and secondary citation has registered provenance",()=>{
 expect(checkSourceIds(sourceRecords,sources)).toEqual([]);
 expect(sourceRecords.length).toBeGreaterThan(400);
 const modules=readdirSync(new URL('.',import.meta.url)).filter(f=>f.endsWith('.ts')&&!f.endsWith('.test.ts')).map(f=>f.slice(0,-3));
 expect(modules.filter(module=>!inventoryModules.includes(module))).toEqual([]);
});
