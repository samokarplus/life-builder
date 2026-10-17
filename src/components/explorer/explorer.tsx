"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { courses, institutions, requirements } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { semesterLabel, sortSemesters } from "@/lib/schedule";
import type { Course } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const subject = (c: Course) => c.code.split(" ")[0];
const subjects = [...new Set(courses.map(subject))].sort();
import { ruleCourseIds as idsOf } from "@/lib/requirements";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button aria-pressed={active} onClick={onClick} className={cn("rounded-full border px-3 py-1 text-xs", active ? "border-primary bg-soft text-primary" : "border-border bg-surface text-muted hover:text-foreground")}>{children}</button>;
}

export function Explorer() {
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  return <CourseExplorer key={initialQuery} initialQuery={initialQuery} />;
}
function CourseExplorer({ initialQuery }: { initialQuery: string }) {
  const { semesters, profile, tuitionPerCredit, addCourse } = usePlanner();
  const [q, setQ] = useState(initialQuery);
  const search = q;
  const [inst, setInst] = useState("all");
  const [subj, setSubj] = useState("all");
  const [credits, setCredits] = useState("all");
  const [level, setLevel] = useState("all");
  const [req, setReq] = useState("all");
  const [prereq, setPrereq] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Course | null>(null);
  const [target, setTarget] = useState("");

  const planned = new Map(semesters.flatMap((s) => s.courses.map((p) => [p.courseId, p.status] as const)));
  const done = new Set(profile.completed.map((c) => c.courseId));
  const stateOf = (c: Course) => (done.has(c.id) ? "completed" : planned.get(c.id) ?? "not-planned");
  const query = search.trim().toLowerCase();
  const results = courses.filter((c) =>
    (!query || c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query)) &&
    (inst === "all" || c.institutionId === inst) &&
    (subj === "all" || subject(c) === subj) &&
    (credits === "all" || c.credits === Number(credits)) &&
    (level === "all" || c.level === Number(level)) &&
    (req === "all" || idsOf(requirements.find((r) => r.id === req)!.rule).includes(c.id)) &&
    (prereq === "all" || (prereq === "has" ? c.prerequisiteIds.length > 0 : c.prerequisiteIds.length === 0)) &&
    (status === "all" || stateOf(c) === status)
  );

  const sorted = sortSemesters(semesters);
  const add = () => {
    if (!open) return;
    const sid = target || sorted[0]?.id;
    if (!sid) return toast.error("Add a semester to your roadmap first.");
    const sem = semesters.find((s) => s.id === sid)!;
    addCourse(sid, open.id);
    toast.success(`${open.code} added to ${semesterLabel(sem)}`);
    setOpen(null);
  };

  const sel = "h-9 rounded-full border border-border bg-surface px-3 text-xs";
  const rate = open ? tuitionPerCredit[open.institutionId] : null;
  const satisfies = open ? requirements.filter((r) => idsOf(r.rule).includes(open.id)) : [];
  const prereqs = open ? open.prerequisiteIds.map((id) => courses.find((c) => c.id === id)?.code ?? id) : [];

  return (
    <div>
      <label className="relative block max-w-md">
        <span className="sr-only">Search courses</span>
        <Search size={16} className="absolute left-3 top-3 text-muted" aria-hidden />
        <input value={search} onChange={(e) => setQ(e.target.value)} placeholder="Search by code or title" className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm" />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filters">
        <select aria-label="Institution" className={sel} value={inst} onChange={(e) => setInst(e.target.value)}><option value="all">All institutions</option>{institutions.map((i) => <option key={i.id} value={i.id}>{i.shortName}</option>)}</select>
        <select aria-label="Subject" className={sel} value={subj} onChange={(e) => setSubj(e.target.value)}><option value="all">All subjects</option>{subjects.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Credit hours" className={sel} value={credits} onChange={(e) => setCredits(e.target.value)}><option value="all">Any credits</option>{[...new Set(courses.map((c) => c.credits))].map((n) => <option key={n} value={n}>{n} credits</option>)}</select>
        <select aria-label="Level" className={sel} value={level} onChange={(e) => setLevel(e.target.value)}><option value="all">Any level</option><option value="1000">1000-level</option><option value="2000">2000-level</option></select>
        <select aria-label="Degree requirement" className={sel} value={req} onChange={(e) => setReq(e.target.value)}><option value="all">Any requirement</option>{requirements.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
        <select aria-label="Prerequisites" className={sel} value={prereq} onChange={(e) => setPrereq(e.target.value)}><option value="all">Prereqs: any</option><option value="has">Has prerequisites</option><option value="none">No prerequisites</option></select>
        <div className="flex gap-1" role="group" aria-label="Plan status">
          {[["all", "All"], ["not-planned", "Not in plan"], ["planned", "Planned"], ["in-progress", "In progress"], ["completed", "Completed"]].map(([v, l]) => <Pill key={v} active={status === v} onClick={() => setStatus(v)}>{l}</Pill>)}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted" role="status">{results.length} course{results.length === 1 ? "" : "s"} · sample catalog. Term availability (online/in-person) isn&apos;t verified, so it can&apos;t be filtered yet.</p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <li key={c.id}>
            <button onClick={() => { setOpen(c); setTarget(""); }} className="h-full w-full rounded-[14px] border border-border bg-surface p-4 text-left shadow-card transition hover:border-sage">
              <div className="flex justify-between"><span className="tabular text-xs font-semibold text-primary">{c.code}</span><span className="tabular text-xs text-muted">{c.credits} cr</span></div>
              <p className="mt-1 text-sm">{c.title}</p>
              <p className="mt-2 text-xs text-muted">{c.category}{stateOf(c) !== "not-planned" ? ` · ${stateOf(c)}` : ""}</p>
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <div className="py-16 text-center text-muted">
          <p>No courses match those filters.</p>
          <button onClick={() => { setQ(""); setInst("all"); setSubj("all"); setCredits("all"); setLevel("all"); setReq("all"); setPrereq("all"); setStatus("all"); }} className="mt-3 text-sm text-primary underline">Clear filters</button>
        </div>
      )}

      <Modal drawer open={!!open} onClose={() => setOpen(null)} title={open ? `${open.code} — ${open.title}` : ""}>
        {open && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-y-2">
              <dt className="text-muted">Institution</dt><dd>{institutions.find((i) => i.id === open.institutionId)?.name}</dd>
              <dt className="text-muted">Credits</dt><dd className="tabular">{open.credits} <span className="text-xs text-muted">(assumed in sample)</span></dd>
              <dt className="text-muted">Description</dt><dd className="text-muted">Not loaded. Check the official catalog.</dd>
              <dt className="text-muted">Prerequisites</dt><dd>{prereqs.length ? prereqs.join(", ") : "None listed in sample"}</dd>
              <dt className="text-muted">Satisfies</dt><dd>{satisfies.length ? satisfies.map((r) => r.label).join("; ") + " (illustrative)" : "No sample requirement"}</dd>
              <dt className="text-muted">Transfer</dt><dd>No equivalencies loaded; none assumed.</dd>
              <dt className="text-muted">Est. tuition</dt><dd className="tabular">{rate != null ? `~$${(rate * open.credits).toLocaleString()} (your rate, user-entered)` : "Add a rate in Settings"}</dd>
              <dt className="text-muted">Source</dt><dd>Illustrative sample. No official URL.</dd>
              <dt className="text-muted">Last verified</dt><dd>Never</dd>
            </dl>
            <label className="flex flex-col gap-1">Add to semester
              <select value={target || sorted[0]?.id || ""} onChange={(e) => setTarget(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3">
                {sorted.map((s) => <option key={s.id} value={s.id}>{semesterLabel(s)}</option>)}
              </select>
            </label>
            <button onClick={add} disabled={!sorted.length} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground disabled:opacity-50"><Plus size={16} /> Add to Roadmap</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
