"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { courses } from "@/data/sample";
import { usePlanner, type CostInputs } from "@/store/planner";
import { costBreakdown } from "@/lib/costs";

const usd = (n: number | null) => (n == null ? "—" : `$${Math.round(n).toLocaleString()}`);

function NumField({ label, value, onChange, max = 1_000_000, hint }: { label: string; value: number; onChange: (n: number) => void; max?: number; hint?: string }) {
  const bad = !Number.isFinite(value) || value < 0 || value > max;
  return (
    <label className="flex flex-col gap-1 text-sm">{label}
      <input type="number" min={0} value={value} onChange={(e) => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= 0 && n <= max) onChange(n); }} aria-invalid={bad} className="h-10 rounded-xl border border-border bg-background px-3" />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Costs() {
  const { semesters, profile, tuitionPerCredit, costInputs: x, setCostInputs, setTuition } = usePlanner();
  const r = costBreakdown(semesters, courses, tuitionPerCredit, { current: profile.currentInstitutionId, dest: profile.destinationInstitutionId }, x);
  const set = (k: keyof CostInputs) => (n: number) => setCostInputs({ [k]: n });
  const chart = [
    { name: "FRCC", Tuition: r.frcc.tuition ?? 0, Fees: r.frcc.fees, Books: r.frcc.books },
    { name: "CU Boulder", Tuition: r.dest.tuition ?? 0, Fees: r.dest.fees, Books: r.dest.books },
  ];
  const missing = r.frcc.tuition == null || r.dest.tuition == null;
  const card = "rounded-[14px] border border-border bg-surface p-5 shadow-card";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <section className={card}>
        <h2 className="font-medium">Your assumptions</h2>
        <p className="mb-4 mt-1 text-xs text-muted">Every figure below is <strong>user-entered</strong>. No verified tuition data is loaded, so nothing is pre-filled.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumField label="FRCC tuition per credit ($)" value={tuitionPerCredit.frcc ?? 0} onChange={(n) => setTuition("frcc", n || null)} max={5000} hint={tuitionPerCredit.frcc == null ? "Not set" : undefined} />
          <NumField label="CU Boulder tuition per credit ($)" value={tuitionPerCredit.cub ?? 0} onChange={(n) => setTuition("cub", n || null)} max={5000} hint={tuitionPerCredit.cub == null ? "Not set" : undefined} />
          <label className="flex flex-col gap-1 text-sm">Residency
            <select value={x.residency} onChange={(e) => setCostInputs({ residency: e.target.value as CostInputs["residency"] })} className="h-10 rounded-xl border border-border bg-background px-3"><option value="in-state">In-state</option><option value="out-of-state">Out-of-state</option></select>
            <span className="text-xs text-muted">A label only; enter the matching rates above.</span>
          </label>
          <NumField label="Semesters at CU Boulder" value={x.destSemesters} onChange={set("destSemesters")} max={12} />
          <NumField label="Credits per CU semester" value={x.destCreditsPerSemester} onChange={set("destCreditsPerSemester")} max={24} />
          <NumField label="Fees per semester ($)" value={x.feesPerSemester} onChange={set("feesPerSemester")} />
          <NumField label="Books & supplies per semester ($)" value={x.booksPerSemester} onChange={set("booksPerSemester")} />
          <NumField label="Housing per semester ($, optional)" value={x.housingPerSemester} onChange={set("housingPerSemester")} />
          <NumField label="Other living expenses per semester ($)" value={x.livingPerSemester} onChange={set("livingPerSemester")} />
          <NumField label="Total financial aid ($)" value={x.aid} onChange={set("aid")} />
        </div>
      </section>

      <div className="space-y-6">
        <section className={card} aria-live="polite">
          <h2 className="font-medium">Total remaining cost</h2>
          <p className="tabular mt-2 font-serif text-5xl">{usd(r.total)}</p>
          {missing && <p className="mt-2 text-sm text-muted">Enter tuition per credit for {r.frcc.tuition == null ? "FRCC" : ""}{r.frcc.tuition == null && r.dest.tuition == null ? " and " : ""}{r.dest.tuition == null ? "CU Boulder" : ""} to see a total. We don&apos;t guess. <Link href="/settings" className="text-primary underline">Settings</Link></p>}
          <dl className="tabular mt-4 grid grid-cols-[1fr_auto] gap-y-1.5 text-sm">
            <dt className="text-muted">FRCC tuition ({r.frcc.credits} cr)</dt><dd>{usd(r.frcc.tuition)}</dd>
            <dt className="text-muted">CU Boulder tuition ({r.dest.credits} cr)</dt><dd>{usd(r.dest.tuition)}</dd>
            <dt className="text-muted">Fees</dt><dd>{usd(r.frcc.fees + r.dest.fees)}</dd>
            <dt className="text-muted">Books & supplies</dt><dd>{usd(r.frcc.books + r.dest.books)}</dd>
            <dt className="text-muted">Housing + living</dt><dd>{usd(r.housing + r.living)}</dd>
            <dt className="text-muted">Financial aid</dt><dd>−{usd(r.aid)}</dd>
          </dl>
          <p className="mt-3 text-xs text-muted">Source: user-entered · Academic year: not specified · Assumes {r.frcc.semesters} FRCC and {r.dest.semesters} CU semesters.</p>
        </section>

        <section className={card}>
          <h2 className="font-medium">Savings from starting at FRCC</h2>
          {r.transferSavings == null ? <p className="mt-2 text-sm text-muted">Enter both tuition rates to estimate savings.</p> : (
            <>
              <p className="tabular mt-2 font-serif text-3xl">{usd(r.transferSavings)}</p>
              <p className="mt-1 text-sm text-muted">{r.frcc.credits} FRCC credits priced at your FRCC rate instead of your CU rate.</p>
              <p className="mt-2 text-xs text-muted">Assumes every one of those credits transfers. Transfer equivalencies aren&apos;t verified, so treat this as an upper bound.</p>
            </>
          )}
        </section>

        <section className={card}>
          <div className="h-56" role="img" aria-label="Stacked bar chart of tuition, fees and books at FRCC and CU Boulder">
            <ResponsiveContainer>
              <BarChart data={chart}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="Tuition" stackId="a" fill="var(--primary)" />
                <Bar dataKey="Fees" stackId="a" fill="var(--sage)" />
                <Bar dataKey="Books" stackId="a" fill="#b8a98a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
