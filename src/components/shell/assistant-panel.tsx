"use client";

import { useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { courses, requirements } from "@/data/sample";
import { usePlanner } from "@/store/planner";
import { evaluateRequirements } from "@/lib/requirements";
import { planContext } from "@/lib/plan-context";
import { pathMetrics } from "@/lib/compare";
import { prereqIssues } from "@/lib/schedule";
import { deterministicProvider } from "@/lib/assistant/deterministic";
import type { AssistantProvider } from "@/lib/assistant/provider";

const provider: AssistantProvider = deterministicProvider; // swap for an API-backed provider later
const suggestions = ["Can I graduate by summer 2027?", "Which requirements haven't I completed?", "Would taking this class at FRCC save money?", "What happens if I switch to psychology?"];

export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ role: "you" | "bot"; text: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  const ask = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true); setQ("");
    setLog((l) => [...l, { role: "you", text: t }]);
    const s = usePlanner.getState();
    const pc = planContext(s.semesters, s.profile.completed);
    const reply = await provider.answer(t, {
      profile: s.profile, semesters: s.semesters, courses,
      requirements: evaluateRequirements(requirements, { courses, ...pc }),
      metrics: pathMetrics(s.semesters, courses, s.profile.completed, s.tuitionPerCredit),
      tuitionPerCredit: s.tuitionPerCredit,
      prereqIssueCount: prereqIssues(s.semesters, courses, s.profile.completed).length,
    });
    setLog((l) => [...l, { role: "bot", text: reply }]);
    setBusy(false);
    setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 0);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open Dream Helper assistant" className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-card"><MessageCircle size={20} /></button>
      {open && (
        <aside role="dialog" aria-label="Dream Helper assistant" className="fixed bottom-0 right-0 z-40 flex h-[min(34rem,100dvh)] w-full flex-col rounded-t-[16px] border border-border bg-surface shadow-card sm:bottom-5 sm:right-5 sm:w-96 sm:rounded-[16px]">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div><h2 className="text-sm font-medium">Assistant</h2><p className="text-[11px] text-muted">{provider.name}</p></div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" aria-live="polite">
            {log.length === 0 && (
              <div className="space-y-2">
                <p className="text-muted">Ask about your plan. I only use your saved roadmap and the sample data, and I&apos;ll say when I don&apos;t know.</p>
                {suggestions.map((s) => <button key={s} onClick={() => ask(s)} className="block w-full rounded-xl border border-border px-3 py-2 text-left hover:bg-soft">{s}</button>)}
              </div>
            )}
            {log.map((m, i) => <p key={i} className={m.role === "you" ? "ml-8 rounded-xl bg-soft px-3 py-2" : "mr-8 rounded-xl border border-border px-3 py-2"}>{m.text}</p>)}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2 border-t border-border p-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask a question" placeholder="Ask about your plan…" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm" />
            <button aria-label="Send" disabled={busy || !q.trim()} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"><Send size={15} /></button>
          </form>
        </aside>
      )}
    </>
  );
}
