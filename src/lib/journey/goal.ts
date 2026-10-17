import { pathways, type Pathway, type Stage } from "@/data/pathways";
import { careerMeta, type CareerMeta } from "@/data/career-meta";
import { institutions } from "@/data/sample";
import { pathForDream } from "@/lib/dreams";
import type { StudentProfile } from "@/lib/types";

export interface Goal {
  pathId: string | null;
  path: Pathway | null;
  meta: CareerMeta | null;
  career: string;
  destination: string;
  major: string;
  stage: Stage;
  /** Where the route id came from, so the UI can say whether the student chose it or we matched it. */
  basis: "chosen" | "matched" | "none";
}

/** One continuous journey from the profile: a chosen route wins, then a match from the dream text. */
export function resolveGoal(profile: StudentProfile): Goal {
  const chosen = profile.careerId && pathways.some((p) => p.id === profile.careerId) ? profile.careerId : null;
  const matched = chosen ?? pathForDream(profile.dream);
  const path = matched ? pathways.find((p) => p.id === matched) ?? null : null;
  const dest = institutions.find((i) => i.id === profile.destinationInstitutionId);
  return {
    pathId: path?.id ?? null,
    path,
    meta: path ? careerMeta[path.id] ?? null : null,
    career: path?.career ?? (profile.dream?.trim() || "Your dream (not chosen yet)"),
    destination: dest?.shortName ?? "your destination school",
    major: profile.major,
    stage: profile.currentStage === "high-school" ? "high-school" : "community-college",
    basis: chosen ? "chosen" : path ? "matched" : "none",
  };
}
