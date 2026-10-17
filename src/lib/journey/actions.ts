import type { ActionRecord, ActionRecords, ActionStatus, ActionView, Snapshot, Suggestion } from "./types";

const stamp = (d: Date) => d.toISOString();
const snap = (s: Snapshot): Snapshot => ({ title: s.title, why: s.why, goalLabel: s.goalLabel, evidence: s.evidence, next: s.next, dueDate: s.dueDate });

/** Combine computed suggestions with what the student has saved. Saved items survive even after their trigger goes away. */
export function mergeActions(suggestions: Suggestion[], records: ActionRecords): ActionView[] {
  const views: ActionView[] = [];
  const seen = new Set<string>();
  for (const s of suggestions) {
    seen.add(s.id);
    const r = records[s.id];
    views.push({
      id: s.id, status: r?.status ?? "suggested", title: s.title, why: s.why, goalLabel: s.goalLabel, evidence: s.evidence, next: s.next,
      dueDate: r?.dueDate ?? s.dueDate, notes: r?.notes ?? "", urgent: s.urgent && (r?.status ?? "suggested") !== "completed", custom: false, fromRule: s.rule, record: r,
    });
  }
  for (const r of Object.values(records)) {
    if (seen.has(r.id)) continue;
    views.push({
      id: r.id, status: r.status, title: r.snapshot.title, why: r.snapshot.why, goalLabel: r.snapshot.goalLabel, evidence: r.snapshot.evidence, next: r.snapshot.next,
      dueDate: r.dueDate ?? r.snapshot.dueDate, notes: r.notes, urgent: false, custom: !!r.custom, record: r,
    });
  }
  return views;
}

export function setActionStatus(records: ActionRecords, id: string, status: Exclude<ActionStatus, "suggested">, snapshot: Snapshot, now: Date): ActionRecords {
  const prev = records[id];
  const next: ActionRecord = {
    id, status, notes: prev?.notes ?? "", links: prev?.links ?? [], dueDate: prev?.dueDate, goalId: prev?.goalId, custom: prev?.custom,
    snapshot: prev?.snapshot ?? snap(snapshot), createdAt: prev?.createdAt ?? stamp(now), updatedAt: stamp(now),
    completedAt: status === "completed" ? stamp(now) : undefined,
  };
  return { ...records, [id]: next };
}

export function updateActionDetails(records: ActionRecords, id: string, patch: Partial<Pick<ActionRecord, "notes" | "dueDate" | "goalId" | "links">>, snapshot: Snapshot, now: Date): ActionRecords {
  const prev = records[id];
  const base: ActionRecord = prev ?? { id, status: "saved", notes: "", links: [], snapshot: snap(snapshot), createdAt: stamp(now), updatedAt: stamp(now) };
  const merged: ActionRecord = { ...base, ...patch, updatedAt: stamp(now) };
  if (merged.dueDate === undefined || merged.dueDate === "") delete merged.dueDate;
  return { ...records, [id]: merged };
}

/** Un-dismiss or reopen a suggestion. Keeps the record only if the student added notes or a date. */
export function restoreSuggested(records: ActionRecords, id: string, now: Date): ActionRecords {
  const r = records[id];
  if (!r || r.custom) return records;
  if (!r.notes && !r.dueDate && r.links.length === 0) { const { [id]: _drop, ...rest } = records; void _drop; return rest; }
  return { ...records, [id]: { ...r, status: "saved", completedAt: undefined, updatedAt: stamp(now) } };
}

export function reopenAction(records: ActionRecords, id: string, now: Date): ActionRecords {
  const r = records[id];
  if (!r || r.status !== "completed") return records;
  return { ...records, [id]: { ...r, status: "in-progress", completedAt: undefined, updatedAt: stamp(now) } };
}

export function createCustomAction(records: ActionRecords, input: { title: string; notes?: string; dueDate?: string; goalLabel?: string; goalId?: string }, uid: string, now: Date): ActionRecords {
  const title = input.title.trim();
  if (!title) return records;
  const id = `custom:${uid}`;
  const rec: ActionRecord = {
    id, status: "saved", notes: (input.notes ?? "").slice(0, 2000), links: [], custom: true, goalId: input.goalId,
    dueDate: input.dueDate || undefined,
    snapshot: { title: title.slice(0, 300), why: "An action you added yourself.", goalLabel: input.goalLabel, evidence: [{ label: "Added by you", basis: "user" }], dueDate: input.dueDate || undefined },
    createdAt: stamp(now), updatedAt: stamp(now),
  };
  return { ...records, [id]: rec };
}

export function removeAction(records: ActionRecords, id: string): ActionRecords {
  const { [id]: _drop, ...rest } = records; void _drop;
  return rest;
}

export const STATUS_ORDER: ActionStatus[] = ["in-progress", "waiting", "saved", "suggested", "completed", "dismissed"];

export function filterActions(views: ActionView[], filter: ActionStatus | "all" | "active"): ActionView[] {
  if (filter === "all") return views.filter((v) => v.status !== "dismissed");
  if (filter === "active") return views.filter((v) => v.status !== "dismissed" && v.status !== "completed");
  return views.filter((v) => v.status === filter);
}
