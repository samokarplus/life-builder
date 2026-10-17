import { z } from "zod";

/** How much to trust a fact behind a suggestion. Never inflated: unknowns stay "unverified". */
export type Basis = "official" | "user" | "estimate" | "unverified";

export const ACTION_STATUSES = ["suggested", "saved", "in-progress", "waiting", "completed", "dismissed"] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];
export const statusLabels: Record<ActionStatus, string> = {
  suggested: "Suggested", saved: "Saved", "in-progress": "In progress", waiting: "Waiting for response", completed: "Completed", dismissed: "Dismissed",
};

export interface Evidence { label: string; basis: Basis; sourceId?: string }
export interface ActionLink { label: string; href: string; external?: boolean }
export interface Snapshot { title: string; why: string; goalLabel?: string; evidence: Evidence[]; next?: ActionLink; dueDate?: string }

/** A computed recommendation. Not persisted; regenerated from the plan and verified data each time. */
export interface Suggestion extends Snapshot {
  id: string;
  rule: string;
  /** Lower comes first. A real date within 30 days outranks everything; nothing is marked urgent without a date. */
  priority: number;
  urgent: boolean;
}

export const actionRecordSchema = z.object({
  id: z.string().min(1).max(200),
  status: z.enum(ACTION_STATUSES).refine((s) => s !== "suggested"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(2000),
  goalId: z.string().max(200).optional(),
  links: z.array(z.object({ kind: z.enum(["opportunity", "route-step", "requirement", "deadline", "contact", "program"]), id: z.string().max(200), label: z.string().max(200) })).max(10),
  snapshot: z.object({
    title: z.string().min(1).max(300), why: z.string().max(1200), goalLabel: z.string().max(200).optional(), dueDate: z.string().optional(),
    evidence: z.array(z.object({ label: z.string().max(300), basis: z.enum(["official", "user", "estimate", "unverified"]), sourceId: z.string().max(200).optional() })).max(10),
    next: z.object({ label: z.string().max(200), href: z.string().max(500), external: z.boolean().optional() }).optional(),
  }),
  custom: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
});
export type ActionRecord = z.infer<typeof actionRecordSchema>;
export const actionsSchema = z.record(z.string(), actionRecordSchema);
export type ActionRecords = z.infer<typeof actionsSchema>;

/** What the Action Center shows: a suggestion and/or the user's saved state. */
export interface ActionView {
  id: string;
  status: ActionStatus;
  title: string;
  why: string;
  goalLabel?: string;
  evidence: Evidence[];
  next?: ActionLink;
  dueDate?: string;
  notes: string;
  urgent: boolean;
  custom: boolean;
  fromRule?: string;
  record?: ActionRecord;
}
