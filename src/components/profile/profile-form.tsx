"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { usePlanner } from "@/store/planner";

export function ProfileForm() {
  const { profile, setProfile } = usePlanner();
  const [dream, setDream] = useState(profile.dream);
  const [major, setMajor] = useState(profile.major);
  const [max, setMax] = useState(profile.maxCreditsPerSemester);
  const [error, setError] = useState("");
  const input = "h-11 rounded-xl border border-border bg-background px-3 text-sm";

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isInteger(max) || max < 3 || max > 24) return setError("Credits per semester must be a whole number from 3 to 24.");
    if (!major.trim()) return setError("Enter an intended major (or “Undecided”).");
    setError("");
    setProfile({ dream: dream.trim(), major: major.trim(), maxCreditsPerSemester: max });
    toast.success("Profile saved");
  };

  return (
    <form onSubmit={save} className="mx-auto flex max-w-xl flex-col gap-4 rounded-[14px] border border-border bg-surface p-6 shadow-card text-sm">
      <label className="flex flex-col gap-1">Dream career<input className={input} value={dream} onChange={(e) => setDream(e.target.value)} placeholder="e.g. Licensed Professional Counselor" /></label>
      <label className="flex flex-col gap-1">Intended major<input className={input} value={major} onChange={(e) => setMajor(e.target.value)} /></label>
      <label className="flex flex-col gap-1">Max credits per semester<input type="number" className={input} value={max} onChange={(e) => setMax(Number(e.target.value))} /></label>
      <p className="text-muted">Priorities: {profile.priorities.length ? profile.priorities.join(", ") : "none selected"} · <Link href="/onboarding" className="text-primary underline">Redo onboarding</Link></p>
      {error && <p role="alert" className="text-amber-700 dark:text-amber-400">{error}</p>}
      <button className="h-11 rounded-full bg-primary font-medium text-primary-foreground">Save</button>
    </form>
  );
}
