import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { sources } from "../src/data/sources";
import { inventoryModules, sourceRecords } from "../src/data/inventory";
import { checkSourceIds, sourceHealth } from "../src/lib/source-health";
import { parseIsoDay } from "../src/lib/calendar";

async function main() {
 const arg=process.argv.find(a=>a.startsWith('--as-of='))?.slice(8);
 let today=new Date();
 if(arg){parseIsoDay(arg);const [year,month,day]=arg.split('-').map(Number);today=new Date(year,month-1,day);}
 const files=await readdir(fileURLToPath(new URL('../src/data/',import.meta.url)));
 const errors=checkSourceIds(sourceRecords,sources);
 for(const file of files.filter(f=>f.endsWith('.ts')&&!f.endsWith('.test.ts'))) if(!inventoryModules.includes(file.slice(0,-3))) errors.push(`${file}: data module missing from source inventory`);
 const health=sources.map(source=>({source,...sourceHealth(source,today)}));
 for(const item of health.filter(h=>h.state==='invalid')) errors.push(`${item.source.id}: ${item.label}`);
 errors.forEach(error=>console.error(`ERROR ${error}`));
 if(!process.argv.includes('--provenance-only')) {
  for(const item of health.filter(h=>h.state==='stale'||h.state==='unverified')) console.warn(`WARN ${item.source.id}: ${item.label} (${item.source.url??'no official URL'})`);
  console.log(`${sources.length} sources; ${sourceRecords.length} cited records; ${health.filter(h=>h.state==='stale').length} older than90 days. No network requests made.`);
 }
 if(errors.length || process.argv.includes('--strict')&&health.some(h=>h.state==='stale')) process.exitCode=1;
 else if(process.argv.includes('--provenance-only')) console.log(`Provenance OK: ${sourceRecords.length} records, all data modules registered.`);
}
main().catch(error=>{console.error(error instanceof Error?error.message:'Source validation failed');process.exitCode=1;});
