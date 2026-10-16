"use client";

import { AlertTriangle, GripVertical, ShieldQuestion, X } from "lucide-react";
import type { Course, CourseStatus, PlannedCourse } from "@/lib/types";
import { institutions } from "@/data/sample";
import { cn } from "@/lib/utils";

const statusLabel: Record<CourseStatus, string> = { planned: "Planned", "in-progress": "In progress", completed: "Completed" };

export interface CardProps {
  planned: PlannedCourse;
  course: Course;
  missing?: string[]; // unmet prerequisite course codes
  onStatus: (s: CourseStatus) => void;
  onRemove: () => void;
  dragHandle?: React.HTMLAttributes<HTMLButtonElement>;
  dragging?: boolean;
}

export function CourseCard({ planned, course, missing, onStatus, onRemove, dragHandle, dragging }: CardProps) {
  const inst = institutions.find((i) => i.id === course.institutionId);
  return (
    <div className={cn("rounded-xl border bg-surface p-3 shadow-card transition", dragging ? "opacity-40" : "hover:border-sage", missing?.length ? "border-amber-500/60" : "border-border")}>
      <div className="flex items-start gap-2">
        <button {...dragHandle} aria-label={`Drag ${course.code}`} className="mt-0.5 cursor-grab touch-none text-muted hover:text-foreground">
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="tabular text-xs font-semibold text-primary">{course.code}</span>
            <span className="tabular text-xs text-muted">{course.credits} cr</span>
          </div>
          <p className={cn("text-sm", planned.status === "completed" && "text-muted line-through")}>{course.title}</p>
          <p className="mt-1 text-xs text-muted">{inst?.shortName} · {course.category}</p>
        </div>
        <button onClick={onRemove} aria-label={`Remove ${course.code}`} className="rounded p-1 text-muted hover:bg-soft hover:text-foreground"><X size={14} /></button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 pl-6">
        <label className="sr-only" htmlFor={`st-${planned.id}`}>Status for {course.code}</label>
        <select
          id={`st-${planned.id}`}
          value={planned.status}
          onChange={(e) => onStatus(e.target.value as CourseStatus)}
          className={cn("rounded-full border border-border px-2 py-0.5 text-xs", planned.status !== "planned" && "bg-soft text-primary")}
        >
          {(Object.keys(statusLabel) as CourseStatus[]).map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
        <span className="inline-flex items-center gap-1 text-xs text-muted" title="Sample entry; not verified against an official catalog">
          <ShieldQuestion size={12} aria-hidden /> Unverified
        </span>
        {missing?.length ? (
          <span className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400" title={`Needs ${missing.join(", ")} first`}>
            <AlertTriangle size={12} aria-hidden /> Needs {missing.join(", ")} first
          </span>
        ) : course.prerequisiteIds.length ? (
          <span className="text-xs text-muted">Prereqs met</span>
        ) : null}
      </div>
    </div>
  );
}
