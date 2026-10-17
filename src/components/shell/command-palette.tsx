"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { CornerDownLeft, Search } from "lucide-react";
import { courses } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { filterPalette, type PaletteItem } from "@/lib/palette";
import { navItems } from "./nav";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => { setOpen(false); setQ(""); setActive(0); };
  const go = (fn: () => void) => () => { close(); fn(); };

  const items: PaletteItem[] = useMemo(() => [
    ...navItems.map((n) => ({ id: n.href, label: n.label, group: "Pages" as const, hint: "go to", run: go(() => router.push(n.href)) })),
    { id: "undo", label: "Undo last roadmap change", group: "Actions" as const, run: go(() => usePlanner.getState().undo()) },
    { id: "redo", label: "Redo roadmap change", group: "Actions" as const, run: go(() => usePlanner.getState().redo()) },
    { id: "theme", label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`, group: "Actions" as const, run: go(() => setTheme(resolvedTheme === "dark" ? "light" : "dark")) },
    { id: "onboard", label: "Rebuild my roadmap (onboarding)", group: "Actions" as const, run: go(() => router.push("/onboarding")) },
    { id: "print", label: "Print my plan", group: "Actions" as const, run: go(() => router.push("/print")) },
    ...courses.map((c) => ({ id: c.id, label: c.code, hint: c.title, group: "Courses" as const, run: go(() => router.push(`/explorer?q=${encodeURIComponent(c.code)}`)) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [resolvedTheme, router, setTheme]);

  const results = filterPalette(items, q);
  const idx = Math.min(active, Math.max(0, results.length - 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((idx + 1) % Math.max(1, results.length)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((idx - 1 + results.length) % Math.max(1, results.length)); }
    else if (e.key === "Enter") { e.preventDefault(); results[idx]?.run(); }
  };

  return (
    <dialog ref={dialog} onClose={close} onClick={(e) => e.target === dialog.current && close()} aria-label="Command palette"
      className="m-auto mt-[15vh] w-[min(92vw,34rem)] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-foreground/30">
      {open && (
        <div onKeyDown={onKeyDown}>
          <label className="flex items-center gap-3 border-b border-border px-4">
            <Search size={16} className="text-muted" aria-hidden />
            <span className="sr-only">Search pages, actions and courses</span>
            <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} placeholder="Search pages, actions, courses…" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[idx] ? `pal-${results[idx].id}` : undefined} className="h-12 w-full bg-transparent text-sm outline-none focus-visible:outline-none" />
            <kbd className="rounded border border-border px-1.5 text-[10px] text-muted">Esc</kbd>
          </label>
          <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <li key={r.id} id={`pal-${r.id}`} role="option" aria-selected={i === idx}>
                <button onClick={r.run} onMouseEnter={() => setActive(i)} className={cn("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm", i === idx && "bg-soft")}>
                  <span><span className="font-medium">{r.label}</span>{r.hint && r.group === "Courses" && <span className="ml-2 text-muted">{r.hint}</span>}</span>
                  <span className="flex items-center gap-2 text-xs text-muted">{r.group}{i === idx && <CornerDownLeft size={12} aria-hidden />}</span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">Nothing matches “{q}”.</li>}
          </ul>
        </div>
      )}
    </dialog>
  );
}
