"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { courses } from "@/data/sample";
import type { Course } from "@/lib/types";

export function CourseSearch({ exclude = [], onPick, autoFocus }: { exclude?: string[]; onPick: (c: Course) => void; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = courses.filter(
    (c) => !exclude.includes(c.id) && (!query || c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query))
  );
  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search courses by code or title</span>
        <Search size={15} className="absolute left-3 top-3 text-muted" aria-hidden />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by code or title, e.g. PHI 1014"
          className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm"
        />
      </label>
      <ul className="mt-3 max-h-64 overflow-y-auto">
        {results.map((c) => (
          <li key={c.id}>
            <button onClick={() => onPick(c)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-soft">
              <span><span className="tabular font-medium text-primary">{c.code}</span> <span>{c.title}</span></span>
              <span className="tabular text-xs text-muted">{c.credits} cr</span>
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matching courses in the sample catalog.</li>}
      </ul>
    </div>
  );
}
