"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, ExternalLink, GraduationCap, HelpCircle, MapPin, PiggyBank, School, Sparkles, Briefcase, BookOpen, Sprout, Rocket } from "lucide-react";
import { pathways, stageLabels, stageOrder, type PathwayStep, type Stage } from "@/data/pathways";
import { coloradoCounselingPrograms, cuDenverCmhc, specialties } from "@/data/programs";
import { nextOccurrence } from "@/data/funding";
import { bioastronauticsCourses, bioastronauticsFacilities, bioastronauticsFaculty } from "@/data/people";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CareerBadge } from "@/components/brand/career-badge";
import { CareerPicker, type PickerState } from "./career-picker";
import { Challenges, IdealPath, People, WaysIn } from "./path-extras";
import { glossary } from "@/data/glossary";
import { careerMeta } from "@/data/career-meta";
import { sourceById } from "@/data/sample";
import { describeDatedEvent } from "@/lib/dated-event";
import { parseDreamParams, routeProgress } from "@/lib/dream-params";
import { usePlanner } from "@/store/planner";
import { cuTransferDeadlines, describeDeadline, nextFallEntry, type EntryTerm } from "@/lib/deadlines";
import { cn } from "@/lib/utils";

const kindLabel: Record<PathwayStep["kind"], string> = {
  degree: "Degree", transfer: "Transfer", application: "Application", exam: "Exam", experience: "Experience", license: "License", selection: "Selection", requirement: "Requirement",
};

const stageIcon: Record<Stage, React.ElementType> = { "high-school": Sprout, "community-college": School, university: BookOpen, graduate: GraduationCap, career: Briefcase };
const stageBlurb: Record<Stage, string> = {
  "high-school": "Dreaming ahead. We'll start from the beginning.",
  "community-college": "A smart, affordable start. Let's line up your transfer.",
  university: "Building your bachelor's. Let's look at what's next.",
  graduate: "Grad school time. Programs, exams and registration.",
  career: "Logging hours and heading for the finish line.",
};

function CuDenverCard() {
  const today = new Date();
  const d = cuDenverCmhc;
  const upcoming = d.applicationWindows.map((w) => ({ ...w, date: nextOccurrence(w.due.month, w.due.day, today) })).sort((a, b) => a.date.getTime() - b.date.getTime());
  const days = (date: Date) => Math.round((date.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86_400_000);
  return (
    <div className="mt-3 rounded-xl border border-gold bg-gold-soft p-4 text-sm">
      <p className="font-medium">{d.institution}: {d.program}</p>
      <p className="mt-1 text-xs text-muted">{d.format} · {d.credits} credits · {d.recommendedTime} · {d.accreditation}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {upcoming.map((w) => (
          <li key={w.term} className="rounded-lg bg-surface p-3">
            <p className="font-medium">{w.term} applications</p>
            <p className="tabular text-xs text-muted">Opens {w.opens.month}/{w.opens.day} · due {w.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
            <p className={cn("tabular text-xs", days(w.date) <= 60 ? "font-medium text-amber-800 dark:text-amber-300" : "text-primary")}>in {days(w.date)} days</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">Application needs</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5">{d.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
      <p className="mt-3"><span className="font-medium">Required interview.</span> <span className="text-muted">{d.interviewNote} Listed dates: {d.interviews.map((i) => `${i.cycle}: ${new Date(`${i.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`).join("; ")}.</span></p>
      <p className="mt-2 text-xs text-muted">{d.advice} Contact: {d.contact.office}, {d.contact.phone}, {d.contact.email}.</p>
      <a href={d.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline">Official program page <ExternalLink size={11} aria-hidden /></a>
    </div>
  );
}

function CounselingFinder() {
  const [spec, setSpec] = useState("Clinical Mental Health Counseling");
  const rows = coloradoCounselingPrograms.filter((p) => p.specialty === spec);
  return (
    <div className="mt-4 rounded-xl bg-soft p-4">
      <p className="flex items-center gap-2 text-sm font-medium"><MapPin size={15} className="text-primary" aria-hidden /> Colorado programs in the CACREP directory</p>
      <label className="mt-3 flex flex-col gap-1 text-xs text-muted">Specialty
        <select value={spec} onChange={(e) => setSpec(e.target.value)} className="h-9 rounded-full border border-border bg-surface px-3 text-sm text-foreground">{specialties.map((x) => <option key={x}>{x}</option>)}</select>
      </label>
      {spec === "Clinical Mental Health Counseling" && <CuDenverCard />}
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {rows.map((p) => (
          <li key={p.institution + p.specialty + p.degree} className="lift rounded-xl border border-border bg-surface p-3 text-sm">
            <p className="font-medium">{p.institution}</p>
            <p className="text-xs text-muted">{p.city}, CO · {p.degree}</p>
            <p className="mt-1 text-xs"><span className="text-primary">{p.status}</span> · cycle ends {p.cycleEnd}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">{spec === "Clinical Mental Health Counseling" ? "This is the specialty most closely tied to clinical counseling. " : ""}A listing is not an endorsement or an admission guarantee. Check each school&apos;s own admissions page, costs and deadlines, and confirm with DORA that the degree meets licensing rules. <a href="https://www.cacrep.org/directory/" target="_blank" rel="noreferrer" className="text-primary underline">Open the CACREP directory</a></p>
    </div>
  );
}

function BioFinder() {
  const [tab, setTab] = useState<"people" | "courses" | "labs">("people");
  const [showEmeritus, setShowEmeritus] = useState(false);
  const people = bioastronauticsFaculty.filter((p) => showEmeritus || p.status === "active");
  const tabBtn = (id: typeof tab, label: string) => <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id} className={cn("rounded-full border px-4 py-1.5 text-sm", tab === id ? "border-primary bg-surface text-primary" : "border-border")}>{label}</button>;
  return (
    <div className="mt-4 rounded-xl bg-soft p-4">
      <p className="flex items-center gap-2 text-sm font-medium"><Rocket size={15} className="text-primary" aria-hidden /> CU Boulder Bioastronautics: who, what and where</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Bioastronautics sections">{tabBtn("people", "Professors")}{tabBtn("courses", "Courses")}{tabBtn("labs", "Labs and centers")}</div>
      {tab === "people" && (
        <>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {people.map((p) => (
              <li key={p.id} className="lift rounded-xl border border-border bg-surface p-3 text-sm">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.title}</p>
                <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs">{p.interests.slice(0, 4).map((i) => <li key={i}>{i}</li>)}</ul>
                {p.highlights && <ul className="mt-2 space-y-0.5 text-xs text-muted">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>}
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline">Official profile <ExternalLink size={11} aria-hidden /></a>
              </li>
            ))}
          </ul>
          <label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" checked={showEmeritus} onChange={(e) => setShowEmeritus(e.target.checked)} className="accent-[var(--primary)]" /> Also show emeritus and retired scholars</label>
          <p className="mt-2 text-xs text-muted">From the program&apos;s Faculty page, checked 2026-10-16. A name here is a place to start reading, not a promise that someone is taking students. Email the group through its official pages.</p>
        </>
      )}
      {tab === "courses" && (
        <ul className="mt-3 space-y-2">
          {bioastronauticsCourses.map((c) => (
            <li key={c.code} className="rounded-xl border border-border bg-surface p-3 text-sm"><p><span className="tabular font-medium text-primary">{c.code}</span> {c.title} <span className="text-xs text-muted">· {c.offered}</span></p><p className="mt-1 text-xs text-muted">{c.summary}</p></li>
          ))}
          <li className="text-xs text-muted">From the Bioastronautics curriculum page. Degree requirements for the focus area are on the department&apos;s page, linked below.</li>
        </ul>
      )}
      {tab === "labs" && (
        <ul className="mt-3 space-y-2">
          {bioastronauticsFacilities.map((f) => <li key={f.name} className="rounded-xl border border-border bg-surface p-3 text-sm"><p className="font-medium">{f.name}</p><p className="mt-1 text-xs text-muted">{f.detail}</p><a href={f.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-primary underline">Official page <ExternalLink size={11} aria-hidden /></a></li>)}
          <li className="text-xs text-muted">Equipment listings do not confirm student access or current availability. Ask the research groups directly.</li>
        </ul>
      )}
    </div>
  );
}

function Confidence({ sourceId }: { sourceId: string }) {
  const src = sourceById(sourceId);
  if (src?.status === "verified")
    return <a href={src.url ?? undefined} target="_blank" rel="noreferrer" title={src.note} className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-0.5 text-xs font-medium text-primary"><BadgeCheck size={12} aria-hidden /> Official source, checked {src.lastVerified}</a>;
  return <span title={src?.note} className="inline-flex items-center gap-1 rounded-full bg-warm px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300"><HelpCircle size={12} aria-hidden /> Confirm with the official source</span>;
}

export function DreamPaths() {
  const { profile, setProfile } = usePlanner();
  const today = useMemo(() => new Date(), []);
  const params = useSearchParams();
  const initial = parseDreamParams(params, profile);
  const [pathId, setPathId] = useState(initial.pathId);
  const [stage, setStage] = useState<Stage>(initial.stage);
  const [picker, setPicker] = useState<PickerState>({ query: initial.query, category: "all", noDegree: false, highSchool: false });
  const [term, setTerm] = useState<EntryTerm>("fall");
  const [year, setYear] = useState(nextFallEntry(today));
  const path = pathways.find((p) => p.id === pathId)!;
  const key = `path:${path.id}`;
  const done = routeProgress(path.id, profile.careerStageProgress?.[key]);
  const toggle = (id: string) => setProfile({ careerStageProgress: { ...profile.careerStageProgress, [key]: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] } });
  const deadlines = cuTransferDeadlines(term, year);
  const pct = Math.round((done.length / path.steps.length) * 100);
  const sel = "h-9 rounded-full border border-border bg-surface px-3 text-sm";

  const stageIdx = stageOrder.indexOf(stage);
  const next = path.steps.find((st) => stageOrder.indexOf(st.stage) >= stageIdx && !done.includes(st.id)) ?? path.steps.find((st) => !done.includes(st.id));
  return (
    <div>
      <CareerPicker state={picker} onState={setPicker} selected={pathId} onSelect={id => {
        setPathId(id);
        requestAnimationFrame(() => document.getElementById("route-details")?.focus());
      }} />
      <section className="hero-glow mt-8 rounded-[24px] border border-border bg-surface p-6 shadow-card sm:p-8">
        <p className="eyebrow flex items-center gap-2"><Sparkles size={13} aria-hidden /> Colorado Dreams</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Where are you now, and where do you want to go?</h2>
        <p className="mt-2 max-w-2xl text-muted">Pick your stage and your dream. We&apos;ll show your next step, the dates that matter, and the Colorado schools and rules along the way.</p>
        <div role="group" aria-label="Your stage" className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {stageOrder.map((st) => { const Icon = stageIcon[st]; return (
            <button key={st} onClick={() => setStage(st)} aria-pressed={stage === st} className={cn("lift rounded-2xl border p-3 text-left", stage === st ? "border-primary bg-soft" : "border-border bg-background")}>
              <Icon size={18} className="text-primary" aria-hidden />
              <span className="mt-2 block text-sm font-medium">{stageLabels[st]}</span>
              <span className="mt-0.5 block text-xs text-muted">{stageBlurb[st]}</span>
            </button>); })}
        </div>
        {next && (
          <div className="mt-6 rounded-2xl bg-primary p-5 text-primary-foreground" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Your next step</p>
            <p className="mt-1 font-serif text-2xl">{next.title}</p>
            <p className="mt-1 max-w-2xl text-sm opacity-90">{next.detail.length > 180 ? `${next.detail.slice(0, 177)}…` : next.detail}</p>
          </div>
        )}
      </section>


      <div className="mt-10">
      <section className="min-w-0">
        <div className="flex items-start gap-4">
          {careerMeta[path.id] && <CareerBadge icon={careerMeta[path.id].icon} theme={careerMeta[path.id].theme} size={72} />}
          <div>
            <p className="eyebrow">{careerMeta[path.id]?.category ?? "Route"}</p>
            <h2 id="route-details" tabIndex={-1} className="scroll-mt-24 font-serif text-3xl">{path.title}</h2>
            <p className="mt-2 text-muted">{path.summary}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3" role="img" aria-label={`${done.length} of ${path.steps.length} steps marked done by you`}>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-warm"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
          <span className="tabular text-xs text-muted">{done.length}/{path.steps.length} done (self-reported)</span>
        </div>
        <p className="mt-3 rounded-xl border border-border bg-surface p-3 text-xs text-muted">{path.caution}</p>
        <Link href="/funding" className="lift mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary"><PiggyBank size={15} aria-hidden /> FAFSA, scholarships and deadlines for this path</Link>

        <ol className="mt-8 space-y-0">
          {path.steps.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <li key={s.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={cn("tabular grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold", isDone ? "bg-primary text-primary-foreground" : "bg-soft text-primary")}>{i + 1}</span>
                  {i < path.steps.length - 1 && <span className="w-px flex-1 bg-sage" aria-hidden />}
                </div>
                <article className={cn("mb-5 min-w-0 flex-1 rounded-2xl border border-border bg-surface p-5 shadow-card")}>
                  <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{kindLabel[s.kind]}</span><span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted">{stageLabels[s.stage]}</span><Confidence sourceId={s.sourceId} />{s.additionalSourceIds?.map(id => <Confidence key={id} sourceId={id} />)}</div>
                  <h3 className={cn("mt-2 font-medium", isDone && "text-muted line-through")}>{s.title}</h3>
                  <p className="mt-1 text-sm text-muted">{s.detail}</p>
                  {s.datedEvents && <ul className="mt-3 space-y-2 text-sm">{s.datedEvents.map(event => <li key={event.label}>{event.label}: {event.date} — {describeDatedEvent(event.date, today)}. <Confidence sourceId={event.sourceId} /></li>)}</ul>}
                  {s.facts && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{s.facts.map((f) => <li key={f}>{f}</li>)}</ul>}

                  {s.deadlines === "cu-transfer" && (
                    <div className="mt-4 rounded-xl bg-soft p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <CalendarClock size={15} className="text-primary" aria-hidden />
                        <label className="sr-only" htmlFor={`term-${s.id}`}>Entry term</label>
                        <select id={`term-${s.id}`} value={term} onChange={(e) => setTerm(e.target.value as EntryTerm)} className={sel}><option value="fall">Fall</option><option value="spring">Spring</option><option value="summer">Summer</option></select>
                        <label className="sr-only" htmlFor={`year-${s.id}`}>Entry year</label>
                        <select id={`year-${s.id}`} value={year} onChange={(e) => setYear(Number(e.target.value))} className={sel}>{[0, 1, 2, 3].map((n) => <option key={n} value={today.getFullYear() + n}>{today.getFullYear() + n}</option>)}</select>
                        <span className="text-xs text-muted">entry at CU Boulder</span>
                      </div>
                      <ul className="mt-3 space-y-2">
                        {deadlines.map((d) => {
                          const info = describeDeadline(d, today);
                          return (
                            <li key={d.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                              <span><span className="font-medium">{d.label}</span>{d.note && <span className="block text-xs text-muted">{d.note}</span>}</span>
                              <span className="tabular text-right"><span className="block">{new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                <span className={cn("text-xs", info.state === "passed" ? "text-muted" : info.state === "soon" || info.state === "today" ? "font-medium text-amber-700 dark:text-amber-400" : "text-primary")}>
                                  {info.state === "passed" ? `passed ${-info.days} days ago` : info.state === "today" ? "due today" : `in ${info.days} days`}
                                </span></span>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-3 text-xs text-muted">Month and day come from CU Boulder&apos;s Transfer Timeline page; the selected year is a planning assumption. Confirm the dates for your application cycle.</p>
                    </div>
                  )}

                  {s.funding?.map((f) => (
                    <p key={f.label} className="mt-3 flex items-start gap-2 text-sm"><PiggyBank size={15} className="mt-0.5 shrink-0 text-primary" aria-hidden /><span><span className="font-medium">{f.label}.</span> <span className="text-muted">{f.note}</span></span></p>
                  ))}
                  {s.links && <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">{s.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">{l.label}<ExternalLink size={12} aria-hidden /></a>)}</p>}

                  {s.programFinder === "co-counseling" && <CounselingFinder />}
                  {s.programFinder === "cu-bioastronautics" && <BioFinder />}

                  <label className="mt-4 flex items-center gap-2 text-xs"><input type="checkbox" checked={isDone} onChange={() => toggle(s.id)} className="accent-[var(--primary)]" /> I&apos;ve completed this (self-reported)</label>
                </article>
              </li>
            );
          })}
        </ol>
        {careerMeta[path.id] && <><IdealPath meta={careerMeta[path.id]} /><People meta={careerMeta[path.id]} /><Challenges meta={careerMeta[path.id]} /></>}
      </section>
      </div>
      <details className="mt-8 rounded-2xl border border-border bg-surface p-5">
        <summary className="cursor-pointer font-medium">What do these abbreviations mean?</summary>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">{glossary.map(item => <div key={item.term}><dt className="font-medium">{item.term}</dt><dd className="mt-1 text-sm text-muted">{item.meaning} <Confidence sourceId={item.sourceId} /></dd></div>)}</dl>
      </details>
      <WaysIn />
    </div>
  );
}
