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
