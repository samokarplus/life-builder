"use client";
import { useConfirm } from "@/components/ui/confirmation";

import { useRef, useState } from "react";
import { PublishedRate } from "@/components/ui/published-rate";
import { Download, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { institutions } from "@/data/sample";
import { usePlanner } from "@/store/planner";

export function SettingsPanel() {
  const confirm = useConfirm();
  const s = usePlanner();
  const { theme, setTheme } = useTheme();
  const file = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setRate = (id: string, raw: string) => {
    if (raw === "") { s.setTuition(id, null); setErrors((e) => ({ ...e, [id]: "" })); return; }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > 5000) return setErrors((e) => ({ ...e, [id]: "Enter a per-credit amount between 0 and 5000." }));
    setErrors((e) => ({ ...e, [id]: "" }));
    s.setTuition(id, n);
  };

  const exportFile = () => {
    const url = URL.createObjectURL(new Blob([s.exportJson()], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "dream-helper-plan.json" });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Plan exported");
  };
  const importFile = async (f: File) => {
    if (!await confirm({ title: "Import this plan?", description: "Import replaces your saved profile, roadmap, scenarios and cost inputs. Export a backup first.", action: "Import plan" })) return;
    const r = s.importJson(await f.text());
    if (r.ok) toast.success("Plan imported"); else toast.error(r.error);
  };

  const box = "rounded-[14px] border border-border bg-surface p-5 shadow-card";
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <section className={box}>
        <h2 className="font-medium">Appearance</h2>
        <div className="mt-3 flex gap-2">
          {["light", "dark"].map((t) => (
            <button key={t} onClick={() => setTheme(t)} aria-pressed={theme === t} className={`h-9 rounded-full border px-4 text-sm capitalize ${theme === t ? "border-primary bg-soft text-primary" : "border-border"}`}>{t}</button>
          ))}
        </div>
      </section>

      <section className={box}>
        <h2 className="font-medium">Planning assumptions</h2>
        <p className="mt-1 text-sm text-muted">Published FRCC rates are available below. Estimates use only the rates you choose or enter; confirm fees and COF eligibility separately.</p>
        <label className="mt-4 flex flex-col gap-1 text-sm">Credits required for your degree (FRCC Associate of Arts: 60, 2026-27 catalog)
          <input type="number" min={1} max={200} value={s.requiredCredits} onChange={(e) => Number(e.target.value) > 0 && s.setRequiredCredits(Number(e.target.value))} className="h-10 rounded-xl border border-border bg-background px-3" />
        </label>
        {institutions.map((i) => (
          <div key={i.id} className="mt-4 space-y-2"><PublishedRate institutionId={i.id} />
          <label className="flex flex-col gap-1 text-sm">{i.shortName} tuition per credit ($)
            <input key={String(s.tuitionPerCredit[i.id] ?? "none")} type="number" inputMode="decimal" defaultValue={s.tuitionPerCredit[i.id] ?? ""} onChange={(e) => setRate(i.id, e.target.value)} placeholder="Not set" className="h-10 rounded-xl border border-border bg-background px-3" />
            {errors[i.id] && <span role="alert" className="text-amber-700 dark:text-amber-400">{errors[i.id]}</span>}
          </label></div>
        ))}
      </section>

      <section className={box}>
        <h2 className="font-medium">Your data</h2>
        <p className="mt-1 text-sm text-muted">Stored only in this browser. Export a JSON backup any time.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={exportFile} className="flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-soft"><Download size={15} /> Export</button>
          <button onClick={() => file.current?.click()} className="flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-soft"><Upload size={15} /> Import</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
          <button
            onClick={async () => { if (await confirm({ title: "Reset your plan?", description: "This replaces your profile, courses and scenarios with the illustrative sample. Export first if you want a backup.", action: "Reset to sample" })) { s.resetToSample(); toast("Reset to sample plan"); } }}
            className="flex h-9 items-center gap-2 rounded-full border border-border px-4 text-sm text-amber-700 hover:bg-soft dark:text-amber-400"
          ><RotateCcw size={15} /> Reset</button>
        </div>
      </section>
    </div>
  );
}
