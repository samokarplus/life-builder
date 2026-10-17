import { Heart, ListChecks, Map, GitCompare, GraduationCap, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { RoadmapPreview } from "@/components/landing/roadmap-preview";
import { Reveal } from "@/components/landing/reveal";

import { PlannerDemo } from "@/components/landing/planner-demo";

const steps = [
  { icon: Heart, title: "Start with your dream", body: "Tell us what you'd love to do someday, not just what degree you're chasing." },
  { icon: ListChecks, title: "Add your completed classes", body: "Search by code or title. Transfer, AP and IB credits are flagged until reviewed." },
  { icon: Map, title: "Explore your academic roadmap", body: "Drag courses between semesters and see credits and costs update instantly." },
  { icon: GitCompare, title: "Compare different pathways", body: "Duplicate your plan and try a different major, pace, or summer schedule." },
  { icon: GraduationCap, title: "Graduate with a plan", body: "Know what's done, what's left, and what still needs an official check." },
];

export default function Landing() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <header className="flex h-16 items-center justify-between">
        <span className="flex items-center gap-2 font-serif text-lg text-primary"><Sparkles size={18} aria-hidden /> Dream Helper</span>
        <ButtonLink href="/overview" variant="ghost" className="h-9 px-4">Open app</ButtonLink>
      </header>

      <section className="py-20 text-center md:py-28">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[.22em] text-primary">A clearer path. A future that feels like you.</p>
        <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">Your future, mapped out.</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          From your first college class to your dream career. Build a smarter, more affordable path to where you want to go.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/onboarding">Build My Roadmap</ButtonLink>
          <ButtonLink href="/roadmap" variant="secondary">Explore a Demo</ButtonLink>
        </div>
      </section>

      <Reveal><RoadmapPreview /></Reveal>
      <PlannerDemo />

      <section className="py-24" aria-labelledby="how">
        <h2 id="how" className="font-serif text-3xl md:text-4xl">Five steps from dream to diploma</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li key={title}><Reveal>
              <article className="h-full rounded-[14px] border border-border bg-surface p-6 shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-soft text-primary"><Icon size={18} aria-hidden /></span>
                <p className="tabular mt-4 text-xs text-muted">0{i + 1}</p>
                <h3 className="mt-1 font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </article>
            </Reveal></li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-border py-8 text-xs text-muted">
        Dream Helper is a planning aid, not an official advising or licensing service. Always confirm requirements with your institution.
      </footer>
    </div>
  );
}
