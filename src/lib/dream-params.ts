import { pathways, stageOrder, type Stage } from "@/data/pathways";
import type { Profile } from "./types";

/** Query strings are navigation hints, never saved profile changes. */
export function parseDreamParams(params: Pick<URLSearchParams, "get">, profile: Pick<Profile, "currentStage">) {
  const requestedPath = params.get("path");
  const requestedStage = params.get("stage");
  return {
    pathId: pathways.find(p => p.id === requestedPath)?.id ?? pathways[0].id,
    stage: stageOrder.includes(requestedStage as Stage) ? requestedStage as Stage : profile.currentStage === "high-school" ? "high-school" as const : "community-college" as const,
    query: (params.get("q") ?? "").slice(0, 200),
  };
}

/** Ignore imported/retired step IDs when calculating self-reported progress. */
export function routeProgress(pathId: string, recorded: string[] = []) {
  const path = pathways.find(p => p.id === pathId);
  return path ? path.steps.filter(step => recorded.includes(step.id)).map(step => step.id) : [];
}
