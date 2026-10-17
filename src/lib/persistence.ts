import { createStore, get, set, del } from "idb-keyval";
import { useSyncExternalStore } from "react";
import type { StateStorage } from "zustand/middleware";
export interface SaveState { phase: "loading" | "saving" | "saved" | "error"; lastSaved: number | null; error?: string; loadFailed?: boolean }
let snapshot: SaveState = { phase: "loading", lastSaved: null };
const serverSnapshot = snapshot;
const listeners = new Set<() => void>();
function report(next: Partial<SaveState>) { snapshot = { ...snapshot, ...next }; listeners.forEach(fn=>fn()); }
export function useSaveState() { return useSyncExternalStore(fn=>{listeners.add(fn);return ()=>{listeners.delete(fn);};},()=>snapshot,()=>serverSnapshot); }
export interface Database { get(key: string): Promise<string | undefined>; set(key: string, value: string): Promise<void>; del(key: string): Promise<void> }
/** Serialized writes prevent slow earlier writes from replacing newer user choices. */
export function createPlannerStorage(db: Database, legacy: () => Pick<Storage, "getItem"> | undefined): StateStorage {
  let queue = Promise.resolve();
  let revision = 0;
  let blocked = false;
  return {
    async getItem(key) {
      report({phase:"loading",error:undefined,loadFailed:false});
      try {
        const current = await db.get(key);
        const previous = current == null ? legacy()?.getItem("dream-helper:v1") : null;
        // Keep the original localStorage entry as a backup. Zustand validates/migrates before writing v2.
        blocked = false;
        let lastSaved: number | null = null;
        try { const time = JSON.parse(current ?? "null")?.savedAt; if (typeof time === "number" && Number.isFinite(time)) lastSaved = time; } catch { /* validation is handled by persist */ }
        report({phase:"saved",lastSaved});
        return current ?? previous ?? null;
      } catch {
        blocked = true;
        report({phase:"error",loadFailed:true,error:"Browser storage could not be read. Your existing data has not been overwritten."});
        throw new Error("Unable to load saved plan");
      }
    },
    async setItem(key, value) {
      const ticket = ++revision;
      if (blocked) { report({phase:"error",error:"Reload saved data before making changes."}); return; }
      // Unit tests / SSR have no browser database, and must not claim a successful save.
      if (typeof indexedDB === "undefined" && typeof window === "undefined") return;
      report({phase:"saving",error:undefined});
      queue = queue.then(async()=>{
        try {
          const writtenAt=Date.now();
          let record=value;
          try { const envelope=JSON.parse(value); if(envelope && typeof envelope==="object" && !Array.isArray(envelope)) record=JSON.stringify({...envelope,savedAt:writtenAt}); } catch { /* StateStorage also accepts opaque strings. */ }
          await db.set(key,record);
          if(ticket===revision) report({phase:"saved",lastSaved:writtenAt,error:undefined});
        }
        catch { if(ticket===revision) report({phase:"error",error:"Your latest changes could not be saved. Export a backup or retry saving."}); }
      });
      await queue;
    },
    async removeItem(key) { await queue; await db.del(key); },
  };
}
let store: ReturnType<typeof createStore> | undefined;
const database = () => store ??= createStore("dream-helper", "plans");
export const plannerStorage = createPlannerStorage({ get:key=>get<string>(key,database()), set:(key,value)=>set(key,value,database()), del:key=>del(key,database()) }, ()=>typeof localStorage === "undefined" ? undefined : localStorage);
export function hydrationFailed() { report({phase:"error",loadFailed:true,error:"The saved plan could not be validated or loaded. It has not been replaced. Export the original backup before resetting storage."}); }
