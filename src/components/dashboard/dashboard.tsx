"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CalendarDays, CircleDollarSign, Flag, GraduationCap, Info } from "lucide-react";
import { courses, institutions } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { prereqIssues, progress, semesterLabel, sortSemesters } from "@/lib/schedule";
import { semesterCredits } from "@/lib/credits";
import { cn } from "@/lib/utils";

function Card({ title, icon: Icon, children, className }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[14px] border border-border bg-surface p-5 shadow-card", className)}>
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
  const cur = institutions.find((i) => i.id === profile.currentInstitutionId)!;
  const dest = institutions.find((i) => i.id === profile.destinationInstitutionId)!;

  const rate = tuitionPerCredit[profile.currentInstitutionId];
  const remainingCr = prog.inProgress + prog.planned;
  const unverified = semesters.flatMap((s) => s.courses).length;

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

      <ol className="mt-8 flex flex-wrap items-center gap-2" aria-label="Pathway">
        {milestones.map((m, i) => (
          <li key={m.label} className="flex items-center gap-2">
            <Link href={m.href} className="block rounded-xl border border-border bg-surface px-4 py-2 shadow-card transition hover:border-sage">
              <span className="block text-sm font-medium">{m.label}</span>
              <span className="block text-xs text-muted">{m.sub}</span>
            </Link>
            {i < milestones.length - 1 && <ArrowRight size={16} className="text-muted" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card title="Degree progress" icon={GraduationCap}>
          <div className="flex items-end justify-between">
            <p className="tabular font-serif text-5xl">{prog.percent}<span className="text-2xl text-muted">%</span></p>
            <p className="tabular text-right text-sm text-muted">{prog.completed} of {requiredCredits} credits complete</p>
          </div>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-warm" role="img" aria-label={`${prog.completed} completed, ${prog.inProgress} in progress of ${requiredCredits} credits`}>
            <div className="bg-primary" style={{ width: `${(prog.completed / requiredCredits) * 100}%` }} />
            <div className="bg-sage" style={{ width: `${(prog.inProgress / requiredCredits) * 100}%` }} />
          </div>
          <dl className="tabular mt-4 grid grid-cols-3 text-sm">
            <div><dt className="text-xs text-muted">Completed</dt><dd>{prog.completed}</dd></div>
            <div><dt className="text-xs text-muted">In progress</dt><dd>{prog.inProgress}</dd></div>
            <div><dt className="text-xs text-muted">Remaining</dt><dd>{prog.remaining}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-muted">Total of {requiredCredits} credits is a sample assumption (edit in Settings). Credit totals alone don&apos;t confirm degree completion.</p>
        </Card>

        <Card title="Next milestone" icon={Flag}>
          <p className="font-serif text-2xl">{lastTransferSem ? `Finish your ${cur.shortName} coursework — ${semesterLabel(lastTransferSem)}` : "Add courses to your roadmap"}</p>
          <p className="tabular mt-3 text-sm text-muted">{remainingCr} credits still planned or in progress.</p>
          <p className="mt-2 text-xs text-muted">Projected from your current plan, not an official degree audit.</p>
          <Link href="/roadmap" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">Open roadmap <ArrowRight size={14} /></Link>
        </Card>

        <Card title="Estimated cost" icon={CircleDollarSign}>
          {rate != null ? (
            <>
              <p className="tabular font-serif text-4xl">~${(remainingCr * rate).toLocaleString()}</p>
              <p className="mt-2 text-sm text-muted">{remainingCr} credits × ${rate}/credit at {cur.shortName}. Tuition only.</p>
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
    </div>
  );
}
