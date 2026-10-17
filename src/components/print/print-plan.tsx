"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { courses, institutions } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { semesterLabel, sortSemesters, progress } from "@/lib/schedule";
import { semesterCredits } from "@/lib/credits";

export function PrintPlan() {
  const { semesters, profile, requiredCredits, onboarded } = usePlanner();
  const byId = new Map(courses.map((c) => [c.id, c]));
  const prog = progress(semesters, courses, profile.completed, requiredCredits);
  const inst = (id: string) => institutions.find((i) => i.id === id)?.shortName ?? id;
  return (
    <article className="mx-auto max-w-3xl px-6 py-10 print:px-0 print:py-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link href="/roadmap" className="text-sm text-primary underline">← Back to roadmap</Link>
        <button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground"><Printer size={15} /> Print or save as PDF</button>
      </div>
      <h1 className="font-serif text-4xl">My roadmap</h1>
      <p className="mt-1 text-sm text-muted">{inst(profile.currentInstitutionId)} → {inst(profile.destinationInstitutionId)} · {profile.major || "Major undecided"}{profile.dream ? ` · Dream: ${profile.dream}` : ""}</p>
      <p className="tabular mt-3 text-sm">{prog.completed} credits reported complete · {prog.inProgress} in progress · {prog.planned} planned</p>
      {!onboarded && <p className="mt-2 text-sm text-muted">This is the illustrative sample plan.</p>}
      <div className="mt-8 space-y-6">
        {sortSemesters(semesters).map((s) => (
          <section key={s.id} className="break-inside-avoid">
            <h2 className="flex items-baseline justify-between border-b border-border pb-1 text-sm font-semibold uppercase tracking-wider">
              <span>{semesterLabel(s)} · {inst(s.institutionId)}</span><span className="tabular font-normal text-muted">{semesterCredits(s, courses)} cr</span>
            </h2>
            <ul className="mt-2 space-y-1 text-sm">
              {s.courses.map((p) => { const c = byId.get(p.courseId); return c && (
                <li key={p.id} className="flex justify-between gap-4"><span><span className="tabular font-medium">{c.code}</span> {c.title}</span><span className="text-muted">{p.status}</span></li>
              ); })}
              {s.courses.length === 0 && <li className="text-muted">No courses yet</li>}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-10 border-t border-border pt-4 text-xs text-muted">Planning aid only. Course data mixes sourced FRCC catalog entries and illustrative records; this is not an official degree audit. Confirm every requirement and transfer equivalency with your institution.</p>
    </article>
  );
}
