"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Compass, ExternalLink, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { courses, institutions, requirementsForProfile } from "@/data/sample";
import { pathways, stageLabels } from "@/data/pathways";
import { CareerBadge } from "@/components/brand/career-badge";
import { usePlanner } from "@/store/planner";
import { evaluateRequirements } from "@/lib/requirements";
import { planContext } from "@/lib/plan-context";
import { progress } from "@/lib/schedule";
import { resolveGoal } from "@/lib/journey/goal";
import { buildSuggestions } from "@/lib/journey/suggest";
import { filterActions, mergeActions, STATUS_ORDER } from "@/lib/journey/actions";
import { eligibilityLabels, opportunityActionId, opportunitySnapshot, relevantOpportunities, type Eligibility } from "@/lib/journey/opportunities";
import { statusLabels, type ActionStatus, type ActionView } from "@/lib/journey/types";
import { ActionCard, toSnapshot, type CardHandlers } from "./action-card";
import { cn } from "@/lib/utils";

type Filter = ActionStatus | "active" | "all";
const filters: { id: Filter; label: string }[] = [
  { id: "active", label: "To do" }, { id: "suggested", label: "Suggested" }, { id: "saved", label: "Saved" }, { id: "in-progress", label: "In progress" },
  { id: "waiting", label: "Waiting" }, { id: "completed", label: "Completed" }, { id: "dismissed", label: "Dismissed" }, { id: "all", label: "All" },
];
const eligStyle: Record<Eligibility, string> = {
  "appears-eligible": "bg-soft text-primary", "potential-match": "bg-gold-soft text-foreground", unknown: "bg-warm text-muted", "not-eligible": "bg-warm text-muted",
};

export function NextSteps() {
  const store = usePlanner();
  const { profile, semesters, requiredCredits, actions } = store;
  const today = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<Filter>("active");
  const [draft, setDraft] = useState({ title: "", due: "", notes: "" });
  const [err, setErr] = useState("");

  const goal = resolveGoal(profile);
  const suggestions = useMemo(() => buildSuggestions({ profile, semesters, today }), [profile, semesters, today]);
  const views = useMemo(() => mergeActions(suggestions, actions), [suggestions, actions]);
  const shown = filterActions(views, filter).sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || Number(b.urgent) - Number(a.urgent));
  const count = (f: Filter) => filterActions(views, f).length;

  const prog = progress(semesters, courses, profile.completed, requiredCredits);
  const reqs = requirementsForProfile(profile);
  const req = reqs.length ? evaluateRequirements(reqs, { courses, ...planContext(semesters, profile.completed) }) : [];
  const covered = req.filter((r) => r.status === "satisfied" || r.status === "projected").length;
  const routeDone = goal.path ? (profile.careerStageProgress?.[`path:${goal.path.id}`] ?? []).length : 0;
  const cur = institutions.find((i) => i.id === profile.currentInstitutionId)?.shortName ?? "your school";
  const opps = relevantOpportunities(profile, goal).slice(0, 6);
  const savedOpp = (id: string) => actions[opportunityActionId(id)];

  const h: CardHandlers = {
    setStatus: (v, status) => { store.setActionStatus(v.id, status, toSnapshot(v)); toast(status === "completed" ? "Marked done" : status === "dismissed" ? "Dismissed" : `Moved to ${statusLabels[status].toLowerCase()}`, status === "dismissed" ? { action: { label: "Undo", onClick: () => usePlanner.getState().restoreAction(v.id) } } : undefined); },
    update: (v, patch) => store.updateAction(v.id, patch, toSnapshot(v)),
    restore: (v) => store.restoreAction(v.id),
    reopen: (v) => store.reopenAction(v.id),
    remove: (v) => { store.deleteAction(v.id); toast("Action deleted"); },
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return setErr("Give the action a short title.");
    if (draft.due && Number.isNaN(Date.parse(draft.due))) return setErr("Enter a valid date or leave it blank.");
    setErr("");
    store.addCustomAction({ title: draft.title, notes: draft.notes, dueDate: draft.due || undefined, goalLabel: goal.path ? `${goal.career} route` : undefined, goalId: goal.pathId ?? undefined });
    setDraft({ title: "", due: "", notes: "" });
    toast.success("Action added");
  };

  const section = (title: string, list: ActionView[]) => list.length > 0 && (
    <section aria-label={title} className="mt-6">
      <h3 className="text-xs font-semibold uppercase tracking-[.16em] text-muted">{title} <span className="tabular">({list.length})</span></h3>
      <ul className="mt-2 space-y-3">{list.map((v) => <ActionCard key={v.id} view={v} today={today} h={h} />)}</ul>
    </section>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <section className="hero-glow rounded-[24px] border border-border bg-surface p-6 shadow-card sm:p-8" aria-labelledby="goal-h">
        <p className="eyebrow flex items-center gap-2"><Sparkles size={13} aria-hidden /> Your journey</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          {goal.meta && <CareerBadge icon={goal.meta.icon} theme={goal.meta.theme} size={72} />}
          <div className="min-w-0 flex-1 break-words">
            <h2 id="goal-h" className="font-serif text-2xl sm:text-3xl">{goal.path ? goal.path.title : "Pick a dream to get your next steps"}</h2>
            <p className="mt-1 text-sm text-muted">{cur} → {goal.destination}{goal.major ? ` · ${goal.major}` : ""} · {stageLabels[goal.stage]}</p>
            {goal.basis === "matched" && <p className="mt-1 text-xs text-muted">We matched this from what you wrote in your profile. Choose a route in Colorado Dreams to set it yourself.</p>}
            {goal.basis === "none" && <p className="mt-1 text-xs text-muted">Without a goal, we can still show plan and funding steps, but not a route.</p>}
          </div>
          <Link href="/paths" className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-primary hover:bg-soft"><Compass size={15} aria-hidden /> {goal.path ? "Change or review route" : "Browse dreams"}</Link>
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Where you are now">
          <div className="rounded-xl bg-background p-3"><dt className="text-xs text-muted">Credits reported complete</dt><dd className="tabular font-serif text-2xl">{prog.completed}<span className="text-sm text-muted"> of {requiredCredits}</span></dd></div>
          <div className="rounded-xl bg-background p-3"><dt className="text-xs text-muted">In progress or planned</dt><dd className="tabular font-serif text-2xl">{prog.inProgress + prog.planned}</dd></div>
          <div className="rounded-xl bg-background p-3"><dt className="text-xs text-muted">Degree areas covered or planned</dt><dd className="tabular font-serif text-2xl">{req.length ? `${covered} of ${req.length}` : "n/a"}</dd></div>
          <div className="rounded-xl bg-background p-3"><dt className="text-xs text-muted">Route steps you&apos;ve checked off</dt><dd className="tabular font-serif text-2xl">{goal.path ? `${routeDone} of ${goal.path.steps.length}` : "n/a"}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-muted">Everything here reflects what you&apos;ve told us. Nothing is verified against your school record.</p>
      </section>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter actions by status">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id} className={cn("rounded-full border px-3.5 py-1.5 text-sm", filter === f.id ? "border-primary bg-soft text-primary" : "border-border bg-surface text-muted hover:text-foreground")}>
            {f.label} <span className="tabular text-xs">{count(f.id)}</span>
          </button>
        ))}
      </div>

      {filter === "active" ? (
        <>
          {shown.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted"><CheckCircle2 className="mx-auto mb-2" size={20} aria-hidden />You&apos;re all caught up. New suggestions appear as your plan and the calendar change.</p>}
          {section("In progress", shown.filter((v) => v.status === "in-progress"))}
          {section("Waiting on", shown.filter((v) => v.status === "waiting"))}
          {section("Saved", shown.filter((v) => v.status === "saved"))}
          {section("Recommended next steps", shown.filter((v) => v.status === "suggested"))}
        </>
      ) : (
        <>
          {shown.length === 0 ? <p className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">Nothing here yet.</p> : <ul className="mt-4 space-y-3">{shown.map((v) => <ActionCard key={v.id} view={v} today={today} h={h} />)}</ul>}
        </>
      )}

      <form onSubmit={add} className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-card" aria-labelledby="add-h">
        <h3 id="add-h" className="flex items-center gap-2 font-medium"><Plus size={15} aria-hidden /> Add your own action</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_11rem]">
          <label className="flex flex-col gap-1 text-xs">What do you want to do?
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={300} placeholder="e.g. Call FRCC advising about my transfer plan" className="h-10 rounded-xl border border-border bg-background px-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-xs">Due date (optional)
            <input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} className="h-10 rounded-xl border border-border bg-background px-3 text-sm" />
          </label>
        </div>
        {err && <p role="alert" className="mt-2 text-sm text-amber-700 dark:text-amber-400">{err}</p>}
        <button className="mt-3 h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Add action</button>
      </form>

      <section aria-labelledby="opp-h" className="mt-10">
        <h2 id="opp-h" className="font-serif text-2xl">Opportunities that may fit you</h2>
        <p className="mt-1 text-sm text-muted">Based on your goal and stage. We say plainly when we can&apos;t tell whether you qualify, and we never score matches.</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {opps.map((o) => {
            const saved = savedOpp(o.item.id);
            return (
              <li key={o.item.id} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", eligStyle[o.eligibility])}>{eligibilityLabels[o.eligibility]}</span>
                <p className="mt-2 font-medium">{o.item.title}</p>
                <p className="mt-1 text-sm text-muted">{o.relevance} {o.reason}</p>
                {o.item.amount && <p className="mt-2 text-xs"><span className="font-medium">Amount: </span>{o.item.amount}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button disabled={!!saved} onClick={() => { store.setActionStatus(opportunityActionId(o.item.id), "saved", opportunitySnapshot(o, goal.path ? `${goal.career} route` : undefined)); toast.success("Saved to your actions"); }} className="h-8 rounded-full border border-border bg-background px-3 text-xs font-medium hover:bg-soft disabled:opacity-60">{saved ? "Saved to actions" : "Save to my actions"}</button>
                  <a href={o.item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary underline"><BadgeCheck size={12} aria-hidden /> Official page <ExternalLink size={11} aria-hidden /></a>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/funding" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">See all funding and deadlines <ArrowRight size={14} aria-hidden /></Link>
      </section>
      <p className="mt-8 text-xs text-muted">{pathways.length} Colorado routes are loaded. Dream Helper plans and prepares; it never contacts anyone or submits anything for you.</p>
    </div>
  );
}
