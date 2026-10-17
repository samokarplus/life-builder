import { expect, it } from "vitest";
import { sourceHealth, checkSourceIds } from "./source-health";
import type { DataSource } from "./types";
const source: DataSource = { id:"s",url:"https://official.example",institutionId:null,catalogYear:null,lastVerified:"2026-10-16",status:"verified" };
it("flags strictly older than90 civil days, including DST and year rollover",()=>{
 expect(sourceHealth(source,new Date(2027,0,14,23)).state).toBe('fresh');
 expect(sourceHealth(source,new Date(2027,0,15)).state).toBe('stale');
 expect(sourceHealth(source,new Date(2026,9,16)).age).toBe(0);
});
it("does not turn future, malformed, missing or unverified checks into verification",()=>{
 for(const lastVerified of ['2026-02-30','2027-01-01',null]) expect(sourceHealth({...source,lastVerified},new Date(2026,9,16)).state).toBe('invalid');
 expect(sourceHealth({...source,status:'unverified'},new Date(2026,9,16)).label).toContain('confirm with the official source');
 expect(sourceHealth({...source,status:'unverified'},new Date(2027,0,15)).state).toBe('stale');
 expect(sourceHealth({...source,status:'unverified'},new Date(2027,0,15)).label).toContain('Unverified');
 expect(sourceHealth(undefined,new Date()).state).toBe('invalid');
});
it("fails missing records and dangling nested/secondary citations",()=>{
 expect(checkSourceIds([{location:'course',record:{title:'No citation'}}],[source])).toEqual(expect.arrayContaining([expect.stringContaining('course: missing')]));
 expect(checkSourceIds([{location:'step',record:{sourceId:'s',additionalSourceIds:['unknown'],funding:[{sourceId:'missing'}]}}],[source])).toHaveLength(2);
 expect(checkSourceIds([{location:'step',record:{sourceId:'s',rule:{type:'residency'},funding:[{label:'uncited'}],datedEvents:[{date:'2027-01-01'}]}}],[source])).toHaveLength(3);
 expect(checkSourceIds([{location:'step',record:{sourceId:'s',rule:{sourceId:'s'}}}],[source])).toEqual([]);
});
