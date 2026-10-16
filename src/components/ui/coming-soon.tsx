import { Hammer } from "lucide-react";

export function ComingSoon({ title, phase, blurb }: { title: string; phase: string; blurb: string }) {
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="font-serif text-4xl">{title}</h1>
      <div className="mt-8 rounded-[14px] border border-border bg-surface p-8 shadow-card">
        <Hammer className="text-primary" aria-hidden />
        <p className="mt-4 text-muted">{blurb}</p>
        <p className="mt-4 text-sm font-medium text-primary">Planned for {phase}</p>
      </div>
    </div>
  );
}
