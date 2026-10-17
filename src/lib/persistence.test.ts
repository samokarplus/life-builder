import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { createPlannerStorage } from "./persistence";
import { migratePlan, usePlanner } from "@/store/planner";
import type { Database } from "./persistence";
function memory() { const m = new Map<string,string>(); return {m, db:{get:async(k:string)=>m.get(k),set:async(k:string,v:string)=>{m.set(k,v);},del:async(k:string)=>{m.delete(k);}} satisfies Database}; }
describe("versioned IndexedDB adapter",()=>{
 it("migrates v1 localStorage data without changing choices and preserves original backup",async()=>{
  const old=JSON.parse(usePlanner.getState().exportJson());old.version=1;delete old.roadmapView;old.profile.major="User's major";
  const legacy=JSON.stringify({state:old,version:0});const {db,m}=memory();let reads=0;
  const adapter=createPlannerStorage(db,()=>({getItem:()=>{reads++;return legacy;}}));
  const envelope=JSON.parse(await adapter.getItem("dream-helper:v1") as string);
  const migrated=migratePlan(envelope.state);expect(migrated.profile?.major).toBe("User's major");expect(migrated.roadmapView).toBe("board");expect(migrated.semesters).toEqual(old.semesters);
  await adapter.setItem("dream-helper:v1",JSON.stringify({state:migrated,version:2}));expect(m.size).toBe(1);await adapter.getItem("dream-helper:v1");expect(reads).toBe(1);
 });
 it("serializes writes so the latest edit wins",async()=>{const {db,m}=memory();const adapter=createPlannerStorage(db,()=>undefined);await Promise.all([adapter.setItem("p","first"),adapter.setItem("p","last")]);expect(m.get("p")).toBe("last");});
 it("does not overwrite data after a failed read",async()=>{let writes=0;const adapter=createPlannerStorage({get:async()=>{throw Error("unavailable");},set:async()=>{writes++;},del:async()=>{}},()=>undefined);await expect(adapter.getItem("p")).rejects.toThrow();await adapter.setItem("p","replacement");expect(writes).toBe(0);});
 it("rejects malformed legacy state instead of silently replacing it",()=>{expect(()=>migratePlan({profile:{major:"only field"}})).toThrow();});
});
it("retains an actual write timestamp in the persisted envelope",async()=>{const {db,m}=memory();const adapter=createPlannerStorage(db,()=>undefined);await adapter.setItem("p",JSON.stringify({state:{value:1},version:2}));const envelope=JSON.parse(m.get("p")!);expect(envelope.savedAt).toBeTypeOf("number");expect(envelope.state).toEqual({value:1});expect(JSON.parse(await adapter.getItem("p") as string).savedAt).toBe(envelope.savedAt);});
it('can block queued future writes after a validation failure',async()=>{
 const {db,m}=memory();const adapter=createPlannerStorage(db,()=>undefined);
 adapter.blockWrites();await adapter.setItem('p','replacement');expect(m.size).toBe(0);
 await adapter.getItem('p');await adapter.setItem('p','validated retry');expect(m.get('p')).toBe('validated retry');
});
it('rejects ambiguous IDs on import without changing the current plan',()=>{
 const original=usePlanner.getState().exportJson();const data=JSON.parse(original);
 data.semesters[1].courses.push({...data.semesters[0].courses[0]});
 expect(usePlanner.getState().importJson(JSON.stringify(data)).ok).toBe(false);
 expect(usePlanner.getState().exportJson()).toBe(original);
});
it('round-trips plan settings and scenarios without losing choices',()=>{
 const before=usePlanner.getState().exportJson();expect(usePlanner.getState().importJson(before).ok).toBe(true);
 expect(usePlanner.getState().exportJson()).toBe(before);
});
it('refuses to migrate a future envelope version',()=>{
 const migrate=usePlanner.persist.getOptions().migrate!;
 expect(()=>migrate(JSON.parse(usePlanner.getState().exportJson()),999)).toThrow(/Unsupported/);
});
it('does not relabel a foreign or future state as a v2 Dream Helper plan',()=>{
 const state=JSON.parse(usePlanner.getState().exportJson());
 expect(()=>migratePlan({...state,app:'other-app'})).toThrow();
 expect(()=>migratePlan({...state,version:999})).toThrow();
});
it('exports the exact invalid original without unblocking writes',async()=>{
 const original='{invalid JSON';const {db,m}=memory();m.set('p',original);const adapter=createPlannerStorage(db,()=>undefined);adapter.blockWrites();
 expect(await adapter.readBackup('p')).toBe(original);await adapter.setItem('p','replacement');expect(m.get('p')).toBe(original);
});

it('preserves high-school starting point through legacy migration and JSON import/export',async()=>{
 const before=usePlanner.getState().exportJson();
 try {
  const old=JSON.parse(before);old.version=1;old.profile.currentStage='high-school';
  const legacy=JSON.stringify({state:old,version:0});const {db}=memory();
  const adapter=createPlannerStorage(db,()=>({getItem:()=>legacy}));
  const envelope=JSON.parse(await adapter.getItem('dream-helper:v1') as string);
  expect(migratePlan(envelope.state).profile?.currentStage).toBe('high-school');
  expect(usePlanner.getState().importJson(JSON.stringify(old)).ok).toBe(true);
  expect(JSON.parse(usePlanner.getState().exportJson()).profile.currentStage).toBe('high-school');
  old.profile.currentStage='invalid';expect(usePlanner.getState().importJson(JSON.stringify(old)).ok).toBe(false);
  expect(JSON.parse(usePlanner.getState().exportJson()).profile.currentStage).toBe('high-school');
 }finally{usePlanner.getState().importJson(before);}
});
