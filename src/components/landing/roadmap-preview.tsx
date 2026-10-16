"use client";

import { useState } from "react";
import { Check, Circle, Loader } from "lucide-react";
import { courses, sampleSemesters } from "@/data/sample";
import { semesterCredits } from "@/lib/credits";
import type { CourseStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const next: Record<CourseStatus, CourseStatus> = { planned: "in-progress", "in-progress": "completed", completed: "planned" };
const label: Record<CourseStatus, string> = { planned: "Planned", "in-progress": "In progress", completed: "Completed" };

export function RoadmapPreview() {
  const [semesters, setSemesters] = useState(sampleSemesters);
  const cmap = new Map(courses.map((c) => [c.id, c]));

  const cycle = (sid: string, pid: string) =>
    setSemesters((ss) =>
      ss.map((s) => s.id !== sid ? s : { ...s, courses: s.courses.map((p) => p.id === pid ? { ...p, status: next[p.status] } : p) })
    );

  return (
    <div className="rounded-[16px] border border-border bg-surface p-4 shadow-card md:p-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {semesters.map((s) => (
          <section key={s.id} className="w-64 shrink-0 rounded-[14px] bg-background p-3" aria-label={`${s.term} ${s.year}`}>
            <header className="mb-3 flex items-baseline justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{s.term} {s.year}</h3>
              <span className="tabular text-xs text-muted">{semesterCredits(s, courses)} cr</span>
            </header>
            <ul className="flex flex-col gap-2">
              {s.courses.map((p) => {
                const c = cmap.get(p.courseId)!;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => cycle(s.id, p.id)}
                      aria-label={`${c.code} ${c.title}, ${label[p.status]}. Click to change status.`}
                      className="flex w-full items-start gap-2 rounded-xl border border-border bg-surface p-3 text-left transition hover:border-sage"
                    >
                      {p.status === "completed" ? <Check size={15} className="mt-0.5 text-primary" /> : p.status === "in-progress" ? <Loader size={15} className="mt-0.5 text-primary" /> : <Circle size={15} className="mt-0.5 text-muted" />}
                      <span className={cn("min-w-0 flex-1", p.status === "completed" && "text-muted")}>
                        <span className="tabular block text-xs font-medium text-primary">{c.code}</span>
                        <span className="block truncate text-sm">{c.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {s.courses.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
                  {s.institutionId === "cub" ? "CU Boulder coursework" : "Remaining courses for your degree"}
                </li>
              )}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Illustrative sample. Click a course to change its status. Nothing here is verified against an official catalog.</p>
    </div>
  );
}
