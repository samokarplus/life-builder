"use client";
import { useConfirm } from "@/components/ui/confirmation";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copy, Download, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { courses } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { pathMetrics, whatChanged, type PathMetrics } from "@/lib/compare";
import { generatePlan, sortSemesters } from "@/lib/schedule";
import { priorityMessage } from "@/lib/profile";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "Graduate quickly", max: 18 },
  { label: "Balanced load", max: 12 },
  { label: "Lighter load", max: 9 },
];
const COLORS = ["var(--primary)", "var(--sage)", "#b8a98a"];

interface Row { id: string; name: string; major: string; m: PathMetrics }

export function Compare() {
  const confirm = useConfirm();
  const { semesters, profile, tuitionPerCredit, scenarios, saveScenario, loadScenario, deleteScenario } = usePlanner();
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>(["current"]);
  const [major, setMajor] = useState("");
  const [error, setError] = useState("");

  const rows: Row[] = useMemo(() => [
    { id: "current", name: "Current plan", major: profile.major, m: pathMetrics(semesters, courses, profile.completed, tuitionPerCredit) },
    ...scenarios.map((sc) => ({ id: sc.id, name: sc.name, major: sc.pathway.major ?? profile.major, m: pathMetrics(sc.pathway.semesters, courses, profile.completed, tuitionPerCredit) })),
  ], [semesters, scenarios, profile, tuitionPerCredit]);

  const shown = rows.filter((r) => picked.includes(r.id)).slice(0, 3);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]));

  const validName = () => {
    const n = name.trim();
    if (!n) { setError("Give this scenario a name."); return null; }
    if (rows.some((r) => r.name.toLowerCase() === n.toLowerCase())) { setError("A scenario with that name already exists."); return null; }
    setError("");
    return n;
  };
  const duplicate = () => {
    const n = validName(); if (!n) return;
    saveScenario(n, undefined, major.trim() || undefined);
    setName(""); setMajor(""); toast.success(`Saved “${n}” as a copy of your current plan`);
  };
  const generate = (label: string, max: number) => {
    const n = name.trim() || label;
    if (rows.some((r) => r.name.toLowerCase() === n.toLowerCase())) return setError("A scenario with that name already exists. Enter a different name.");
    setError("");
    const first = sortSemesters(semesters)[0];
    const plan = generatePlan({ ...profile, maxCreditsPerSemester: max }, courses, { term: first?.term === "spring" ? "spring" : "fall", year: first?.year ?? 2026 });
    saveScenario(n, plan);
    setName(""); toast.success(`“${n}” generated at up to ${max} credits per semester`);
  };

  const chart = [
    { metric: "Semesters", ...Object.fromEntries(shown.map((r) => [r.name, r.m.semesterCount])) },
    { metric: "Avg credits / term", ...Object.fromEntries(shown.map((r) => [r.name, r.m.avgLoad])) },
    { metric: "Summer credits", ...Object.fromEntries(shown.map((r) => [r.name, r.m.summerCredits])) },
    { metric: "Remaining credits", ...Object.fromEntries(shown.map((r) => [r.name, r.m.remainingCredits])) },
  ];
  const metricRows: [string, (m: PathMetrics) => string][] = [
    ["Projected last term", (m) => m.lastTerm ?? "—"],
    ["Remaining credits", (m) => String(m.remainingCredits)],
    ["Semesters with courses", (m) => String(m.semesterCount)],
    ["Average load (credits/term)", (m) => String(m.avgLoad)],
    ["Summer courses", (m) => `${m.summerCourses} (${m.summerCredits} cr)`],
    ["Est. tuition (your rates)", (m) => (m.tuition == null ? "Add rates in Settings" : `$${m.tuition.toLocaleString()}`)],
    ["Unverified courses", (m) => String(m.unverifiedCourses)],
  ];

  return (
    <div className="space-y-8">
      <p role="status" className="rounded-2xl border border-border bg-soft p-4 text-sm">{priorityMessage(profile.priorities[0],shown)}</p>
      <section className="rounded-[14px] border border-border bg-surface p-5 shadow-card">
        <h2 className="font-medium">Create a scenario</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input aria-label="Scenario name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Scenario name, e.g. Psychology path" className="h-10 min-w-48 flex-1 rounded-xl border border-border bg-background px-3 text-sm" />
          <input aria-label="Intended major (optional)" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Major (optional)" className="h-10 w-44 rounded-xl border border-border bg-background px-3 text-sm" />
          <button onClick={duplicate} className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"><Copy size={15} /> Duplicate current plan</button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">or generate:</span>
          {PRESETS.map((p) => <button key={p.label} onClick={() => generate(p.label, p.max)} className="flex h-9 items-center gap-1.5 rounded-full border border-border px-4 hover:bg-soft"><Wand2 size={14} /> {p.label} ({p.max} cr)</button>)}
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-amber-700 dark:text-amber-400">{error}</p>}
        <p className="mt-3 text-xs text-muted">Major requirement data isn&apos;t loaded yet, so changing the major label alone won&apos;t change the numbers.</p>
      </section>

      <section aria-label="Scenarios">
        <h2 className="mb-3 font-medium">Your scenarios <span className="text-xs font-normal text-muted">(pick up to 3 to compare)</span></h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {rows.map((r) => (
            <li key={r.id} className={cn("flex items-center gap-3 rounded-xl border bg-surface p-3 text-sm", picked.includes(r.id) ? "border-primary" : "border-border")}>
              <label className="flex flex-1 cursor-pointer items-center gap-3">
                <input type="checkbox" checked={picked.includes(r.id)} onChange={() => toggle(r.id)} className="accent-[var(--primary)]" />
                <span><span className="block font-medium">{r.name}</span><span className="text-xs text-muted">{r.major} · {r.m.lastTerm ?? "empty"}</span></span>
              </label>
              {r.id !== "current" && (
                <>
                  <button onClick={async () => { if (!await confirm({ title: "Use this scenario?", description: "This replaces your roadmap and intended major. Export first to keep a full backup. Roadmap Undo restores courses only.", action: "Use scenario" })) return; loadScenario(r.id); toast.success(`“${r.name}” is now your current plan`, { description: "Use Undo on the roadmap to go back." }); }} aria-label={`Make ${r.name} my current plan`} className="rounded-full p-2 hover:bg-soft"><Download size={15} /></button>
                  <button onClick={async () => { if (await confirm({ title: `Delete “${r.name}”?`, description: "This deletes the saved scenario. Your current roadmap stays available.", action: "Delete scenario" })) { deleteScenario(r.id); setPicked((p) => p.filter((x) => x !== r.id)); toast("Scenario deleted"); } }} aria-label={`Delete ${r.name}`} className="rounded-full p-2 hover:bg-soft"><Trash2 size={15} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {shown.length >= 1 && (
        <section className="rounded-[14px] border border-border bg-surface p-5 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted"><th className="py-2 pr-4 font-normal">Metric</th>{shown.map((r) => <th key={r.id} className="py-2 pr-4 font-medium text-foreground">{r.name}</th>)}</tr></thead>
              <tbody className="tabular">
                {metricRows.map(([label, fn]) => <tr key={label} className="border-t border-border"><td className="py-2 pr-4 text-muted">{label}</td>{shown.map((r) => <td key={r.id} className="py-2 pr-4">{fn(r.m)}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
          <div className="mt-6 h-64" role="img" aria-label="Bar chart comparing scenarios">
            <ResponsiveContainer>
              <BarChart data={chart}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="metric" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                {shown.map((r, i) => <Bar key={r.id} dataKey={r.name} fill={COLORS[i]} radius={[6, 6, 0, 0]} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {shown.length >= 2 && (
        <section className="rounded-[14px] bg-soft p-5">
          <h2 className="font-medium">What changed?</h2>
          <p className="mb-2 text-xs text-muted">{shown[1].name} compared with {shown[0].name}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">{whatChanged(shown[0].name, shown[0].m, shown[1].name, shown[1].m).map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="mt-3 text-xs text-muted">Differences come only from the numbers above. Whether a path is &ldquo;better&rdquo; depends on your priorities{profile.priorities.length ? ` (${profile.priorities.join(", ")})` : ""}.</p>
        </section>
      )}
      {shown.length < 2 && <p className="text-sm text-muted">Select a second scenario to see what changed.</p>}
    </div>
  );
}
