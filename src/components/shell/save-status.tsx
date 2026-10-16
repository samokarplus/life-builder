"use client";
import { Check, LoaderCircle, AlertCircle } from "lucide-react";
import { useSaveState } from "@/lib/persistence";
import { usePlanner } from "@/store/planner";
export function SaveStatus() {
  const state = useSaveState();
  const label = state.phase === "saving" ? "Saving…" : state.phase === "loading" ? "Loading…" : state.phase === "error" ? "Not saved" : state.lastSaved ? `Saved ${new Date(state.lastSaved).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : "Local plan";
  const Icon = state.phase === "error" ? AlertCircle : state.phase === "saving" || state.phase === "loading" ? LoaderCircle : Check;
  return <div role="status" className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted sm:ml-0" title={state.error ?? "Saved only in this browser’s IndexedDB"}><Icon size={14} aria-hidden className={state.phase==="saving"?"animate-spin":""}/><span>{label}</span>{state.phase==="error"&&<button onClick={()=>state.loadFailed ? usePlanner.persist.rehydrate() : usePlanner.getState().setProfile({})} className="underline">{state.loadFailed ? "Retry load" : "Retry save"}</button>}</div>;
}
