"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, CircleDollarSign, Flag, GraduationCap, HeartPulse, Info, MapPin, TriangleAlert } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ProgressRing } from "@/components/ui/progress-ring";
import { planHealth } from "@/lib/health";
import { routeStops } from "@/lib/route";
import { RouteMap } from "./route-map";
import { courses, institutions } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { prereqIssues, progress, semesterLabel, sortSemesters } from "@/lib/schedule";
import { pathMetrics } from "@/lib/compare";
import { semesterCredits } from "@/lib/credits";
import { RequirementsPanel } from "@/components/roadmap/requirements-panel";
import { cn } from "@/lib/utils";

function Card({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("lift rounded-[14px] border border-border bg-surface p-5 shadow-card", className)}>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted"><Icon size={15} aria-hidden /> {title}</h2>
      {children}
    </section>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function Dashboard() {
  const { onboarded, profile, semesters, requiredCredits, tuitionPerCredit } = usePlanner();
  const sorted = sortSemesters(semesters);
  const prog = progress(semesters, courses, profile.completed, requiredCredits);
  const issues = prereqIssues(semesters, courses, profile.completed);
  const byId = new Map(courses.map((c) => [c.id, c]));
  const upcoming = sorted.find((s) => s.courses.some((c) => c.status === "planned")) ?? sorted[0];
  const lastTransferSem = [...sorted].reverse().find((s) => s.institutionId === profile.currentInstitutionId && s.courses.length);
  const firstDest = sorted.find((s) => s.institutionId === profile.destinationInstitutionId);
  const cur = institutions.find((i) => i.id === profile.currentInstitutionId) ?? { shortName: "Current institution" };
  const dest = institutions.find((i) => i.id === profile.destinationInstitutionId) ?? { shortName: "Destination institution" };

  const tuition = pathMetrics(semesters,courses,profile.completed,tuitionPerCredit).tuition;
  const remainingCr = prog.inProgress + prog.planned;
  const unverified = semesters.flatMap((s) => s.courses).length;

  const chartData = sorted.filter((s) => s.courses.length).map((s) => ({ name: `${s.term.slice(0, 2).toUpperCase()} ${String(s.year).slice(2)}`, credits: semesterCredits(s, courses) }));
  const health = planHealth(semesters, courses, profile.completed, profile.maxCreditsPerSemester);

  const milestones = [
    { label: cur.shortName, sub: lastTransferSem ? `through ${semesterLabel(lastTransferSem)}` : "current", href: "/roadmap" },
    { label: dest.shortName, sub: firstDest ? `from ${semesterLabel(firstDest)}` : "transfer", href: "/roadmap" },
    { label: "Graduate school", sub: "optional", href: "/careers" },
    { label: profile.dream || "Your career", sub: "dream", href: "/careers" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-4xl md:text-5xl">{greeting()}. Your future is taking shape.</h1>
      {!onboarded && (
        <p className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-soft px-4 py-3 text-sm">
          <Info size={15} aria-hidden /> You&apos;re viewing an illustrative sample plan.
          <Link href="/onboarding" className="font-medium text-primary underline">Build your own roadmap</Link>
        </p>
      )}

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Pathway">
        {milestones.map((m, i) => (
          <li key={`${i}-${m.label}`} className="relative">
            <Link href={m.href} className="lift block rounded-2xl border border-border bg-surface p-4 shadow-card">
              <span className="flex items-center gap-2">
                <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-semibold", i === 0 ? "bg-primary text-primary-foreground" : "bg-soft text-primary")}>{i === 0 ? <MapPin size={14} aria-hidden /> : i + 1}</span>
                <span className="eyebrow">{i === 0 ? "You are here" : i === 3 ? "Destination" : "Next stop"}</span>
              </span>
              <span className="mt-3 block font-medium">{m.label}</span>
              <span className="block text-xs text-muted">{m.sub}</span>
            </Link>
            {i < milestones.length - 1 && <ArrowRight size={16} className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background text-muted lg:block" aria-hidden />}
          </li>
        ))}
      </ol>

      <RouteMap stops={routeStops(semesters, courses)} destination={profile.dream || "Your career"} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card title="Degree progress" icon={GraduationCap}>
          <div className="flex items-center gap-6">
            <div className="relative grid place-items-center">
              <ProgressRing done={(prog.completed / requiredCredits) * 100} inProgress={(prog.inProgress / requiredCredits) * 100} label={`${prog.completed} completed and ${prog.inProgress} in progress of ${requiredCredits} credits`} />
              <p className="tabular absolute font-serif text-3xl">{prog.percent}<span className="text-base text-muted">%</span></p>
            </div>
            <dl className="tabular grid flex-1 gap-2 text-sm">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden />Reported complete</dt><dd>{prog.completed}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full bg-sage" aria-hidden />In progress</dt><dd>{prog.inProgress}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><span className="h-2.5 w-2.5 rounded-full bg-warm ring-1 ring-border" aria-hidden />Remaining</dt><dd>{prog.remaining}</dd></div>
            </dl>
          </div>
          <p className="mt-4 text-xs text-muted">{prog.verifiedCompleted} credits marked verified; {prog.unverifiedCompleted} reported-completed credits need verification. Total of {requiredCredits} credits matches the FRCC Associate of Arts in the 2026-27 catalog (editable in Settings). Credit totals alone don&apos;t confirm degree completion.</p>
        </Card>

        <Card title="Next milestone" icon={Flag}>
          <p className="font-serif text-2xl">{lastTransferSem ? `Finish your ${cur.shortName} coursework — ${semesterLabel(lastTransferSem)}` : "Add courses to your roadmap"}</p>
          <p className="tabular mt-3 text-sm text-muted">{remainingCr} credits still planned or in progress.</p>
          <p className="mt-2 text-xs text-muted">Projected from your current plan, not an official degree audit.</p>
          <Link href="/roadmap" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open roadmap <ArrowRight size={14} /></Link>
        </Card>

        <Card title="Estimated cost" icon={CircleDollarSign}>
          {tuition != null ? (
            <>
              <p className="tabular font-serif text-4xl">~${tuition.toLocaleString()}</p>
              <p className="mt-2 text-sm text-muted">Remaining coursework priced by its planned institution, using your entered rates. Tuition only.</p>
              <p className="mt-2 text-xs text-muted">User-entered rate. Not verified; excludes fees, books and aid.</p>
            </>
          ) : (
            <>
              <p className="text-sm">No verified tuition data is loaded yet, so we don&apos;t show a made-up number.</p>
              <Link href="/settings" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">Enter your tuition rate <ArrowRight size={14} /></Link>
            </>
          )}
        </Card>

        <Card title="Academic timeline" icon={CalendarDays}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Semesters planned</dt><dd className="tabular">{sorted.length}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Last {cur.shortName} term</dt><dd>{lastTransferSem ? semesterLabel(lastTransferSem) : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Transfer to {dest.shortName}</dt><dd>{firstDest ? semesterLabel(firstDest) : "—"}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-muted">Projected dates, based only on the semesters in your plan.</p>
        </Card>

        <Card title="Upcoming courses" icon={CalendarDays}>
          {upcoming ? (
            <>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{semesterLabel(upcoming)} · <span className="tabular">{semesterCredits(upcoming, courses)} cr</span></p>
              <ul className="space-y-1.5 text-sm">
                {upcoming.courses.map((p) => <li key={p.id}><span className="tabular font-medium text-primary">{byId.get(p.courseId)?.code}</span> {byId.get(p.courseId)?.title}</li>)}
                {upcoming.courses.length === 0 && <li className="text-muted">Nothing planned yet.</li>}
              </ul>
            </>
          ) : <p className="text-sm text-muted">No semesters yet.</p>}
        </Card>

        <Card title="Credits by semester" icon={CalendarDays}>
          <div className="h-44" role="img" aria-label={`Credits per semester: ${chartData.map((d) => `${d.name} ${d.credits}`).join(", ")}`}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ left: -20, right: 4, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "var(--soft)" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="credits" radius={[6, 6, 0, 0]}>
                  {chartData.map((d) => <Cell key={d.name} fill={d.credits > profile.maxCreditsPerSemester ? "#c27a1a" : "var(--primary)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted">Amber bars are above your {profile.maxCreditsPerSemester}-credit limit.</p>
        </Card>

        <Card title="Plan health" icon={HeartPulse}>
          <ul className="space-y-2.5 text-sm">
            {health.map((h) => (
              <li key={h.id} className="flex items-start gap-2.5">
                {h.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" aria-label="OK" /> : <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400" aria-label="Needs a look" />}
                <span><span className="font-medium">{h.label}</span><span className="block text-xs text-muted">{h.detail}</span></span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Checks run on your plan only. They are not a degree audit.</p>
        </Card>

        <Card title="Planning notes" icon={AlertCircle}>
          <ul className="space-y-2 text-sm">
            {issues.map((i) => (
              <li key={i.plannedId}>
                <span className="font-medium">{byId.get(i.courseId)?.code}</span> is planned before {i.missing.map((m) => byId.get(m)?.code).join(", ")}. <Link href="/roadmap" className="text-primary underline">Take a look</Link>
              </li>
            ))}
            {unverified > 0 && <li>{unverified} course{unverified > 1 ? "s are" : " is"} from the sample catalog and haven&apos;t been verified. Confirm with your institution.</li>}
            <li className="text-muted">Transfer equivalencies to {dest.shortName} aren&apos;t loaded yet, so none are assumed.</li>
            <li className="text-muted">Course availability by term is unknown.</li>
          </ul>
        </Card>
      </div>
      <RequirementsPanel />
    </div>
  );
}
