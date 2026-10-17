import { fundingItems, type FundingItem } from "@/data/funding";
import { stageOrder, type Stage } from "@/data/pathways";
import type { StudentProfile } from "@/lib/types";
import type { Goal } from "./goal";
import type { Snapshot } from "./types";
import { sourceById } from "@/data/sample";

/** Transparent states. We never compute a match percentage. */
export type Eligibility = "appears-eligible" | "potential-match" | "not-eligible" | "unknown";
export const eligibilityLabels: Record<Eligibility, string> = {
  "appears-eligible": "Appears eligible based on known information",
  "potential-match": "Potential match; more information needed",
  "not-eligible": "Does not meet a confirmed requirement",
  unknown: "Eligibility unknown",
};

export interface Opportunity { item: FundingItem; eligibility: Eligibility; reason: string; relevance: string }

function judge(item: FundingItem, profile: StudentProfile): { eligibility: Eligibility; reason: string } {
  const toCub = profile.destinationInstitutionId === "cub";
  switch (item.id) {
    case "fafsa": case "fafsa-deadlines":
      return { eligibility: "potential-match", reason: "Anyone can file the FAFSA. Whether you receive aid depends on federal rules we don't ask about, such as citizenship status and need." };
    case "cub-aid-timeline":
      return toCub ? { eligibility: "potential-match", reason: "Applies if you apply to CU Boulder. Your plan lists CU Boulder as your destination." } : { eligibility: "not-eligible", reason: "This is CU Boulder's timeline, and your plan's destination isn't CU Boulder." };
    case "cub-first-gen":
      return toCub ? { eligibility: "unknown", reason: "Depends on whether neither parent earned a bachelor's degree and on financial need. We don't have that information." } : { eligibility: "not-eligible", reason: "It's a CU Boulder scholarship, and your plan's destination isn't CU Boulder." };
    case "cub-transfer-scholarship":
      return toCub ? { eligibility: "potential-match", reason: "For transfer applicants to CU Boulder. You submit an admission application first; you don't need to be admitted before applying for it." } : { eligibility: "not-eligible", reason: "It's for CU Boulder transfer applicants, and your plan's destination isn't CU Boulder." };
    case "cosgc":
      return { eligibility: "appears-eligible", reason: "The program page says it's open to high school, undergraduate and graduate students, from community colleges or four-year schools, in or out of STEM. Some positions are CU Boulder students only." };
    default:
      return { eligibility: "unknown", reason: item.kind === "fellowship" ? "Listed because students in this group have won it. The sponsor sets eligibility, and we haven't loaded it." : "We don't have enough information to tell." };
  }
}

/** Funding records relevant to the goal and the student's current or next stage, with a clear reason. */
export function relevantOpportunities(profile: StudentProfile, goal: Goal, items: FundingItem[] = fundingItems): Opportunity[] {
  const idx = stageOrder.indexOf(goal.stage);
  const near = new Set<Stage>([goal.stage, stageOrder[Math.min(idx + 1, stageOrder.length - 1)]]);
  const order: Eligibility[] = ["appears-eligible", "potential-match", "unknown", "not-eligible"];
  return items
    .filter((i) => (i.paths.includes("all") || (goal.pathId && (i.paths as string[]).includes(goal.pathId))) && i.stages.some((s) => near.has(s)))
    .map((item) => {
      const j = judge(item, profile);
      const routeSpecific = goal.pathId && (item.paths as string[]).includes(goal.pathId);
      return { item, ...j, relevance: routeSpecific ? `Listed for the ${goal.career} route.` : `Open to students at your stage (${goal.stage.replace("-", " ")}).` };
    })
    .sort((a, b) => order.indexOf(a.eligibility) - order.indexOf(b.eligibility) || a.item.title.localeCompare(b.item.title));
}

/** What gets stored when the student saves an opportunity to their actions. */
export function opportunitySnapshot(o: Opportunity, goalLabel?: string): Snapshot {
  return {
    title: `Look into: ${o.item.title}`,
    why: `${o.relevance} ${o.reason}`,
    goalLabel,
    evidence: [{ label: eligibilityLabels[o.eligibility], basis: o.eligibility === "appears-eligible" ? "official" : "unverified" }, { label: "Official source", basis: sourceById(o.item.sourceId)?.status === "verified" ? "official" : "unverified", sourceId: o.item.sourceId }],
    next: { label: "Official page", href: o.item.url, external: true },
  };
}
export const opportunityActionId = (itemId: string) => `opp:${itemId}`;
