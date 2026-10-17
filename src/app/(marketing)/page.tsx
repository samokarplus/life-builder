import { ArrowRight, HandCoins, Heart, ListChecks, Map, GitCompare, GraduationCap, Lock, Mountain, Rocket, ScanSearch, Stethoscope, WifiOff } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Ridge } from "@/components/brand/ridge";
import { coloradoCounselingPrograms } from "@/data/programs";
import { bioastronauticsFaculty } from "@/data/people";
import { fundingItems } from "@/data/funding";
import Link from "next/link";
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

const promises = [
  { icon: Lock, title: "Private by default", body: "No account. Your plan lives in your browser." },
  { icon: ScanSearch, title: "Every number has a source", body: "Verified, illustrative, or user-entered, always labeled." },
  { icon: WifiOff, title: "Never guesses", body: "If we don't have official data, we say so instead of inventing it." },
];

export default function Landing() {
  return (
    <div className="relative w-full overflow-x-clip">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[34rem]" aria-hidden />
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <header className="sticky top-0 z-20 -mx-6 flex h-16 items-center justify-between bg-background/75 px-6 backdrop-blur">
          <Logo size={34} />
          <nav aria-label="Page" className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a href="#colorado" className="hover:text-foreground">Colorado dreams</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#try" className="hover:text-foreground">Try it</a>
            <a href="#promise" className="hover:text-foreground">Our promise</a>
          </nav>
          <ButtonLink href="/overview" variant="secondary" className="h-9 px-4">Open app</ButtonLink>
        </header>

        <section className="py-16 text-center md:py-24">
          <p className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 normal-case tracking-normal">
            <Mountain size={13} className="text-gold" aria-hidden /> Built for Colorado students · FRCC → CU Boulder and beyond
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-8xl">Your future,<br className="hidden md:block" /> mapped out.</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            From your first college class to your dream career. Build a smarter, more affordable path to where you want to go.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/onboarding" className="h-12 px-8 shadow-card">Build My Roadmap <ArrowRight size={16} aria-hidden /></ButtonLink>
            <ButtonLink href="/roadmap" variant="secondary" className="h-12 px-8">Explore a Demo</ButtonLink>
          </div>
        </section>

        <Reveal><RoadmapPreview /></Reveal>
        <div id="try" className="scroll-mt-20"><PlannerDemo /></div>

        <section id="colorado" className="scroll-mt-20 py-16" aria-labelledby="co-h">
          <p className="eyebrow">Colorado dreams</p>
          <h2 id="co-h" className="mt-2 font-serif text-3xl md:text-5xl">Your school dream and your job dream, in one route.</h2>
          <p className="mt-3 max-w-2xl text-muted">Pick where you are and what you want to become. We line up the degrees, transfer dates, exams, schools, professors and funding, each with its source.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal><Link href="/paths" className="lift block h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft text-primary"><Stethoscope size={20} aria-hidden /></span>
              <h3 className="mt-4 font-serif text-xl">Become a Colorado counselor</h3>
              <p className="mt-2 text-sm text-muted">The official LPC route, from the state&apos;s own rules, plus {coloradoCounselingPrograms.length} CACREP-listed counseling programs in Colorado.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">See the route <ArrowRight size={14} aria-hidden /></span>
            </Link></Reveal>
            <Reveal><Link href="/paths" className="lift block h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft text-primary"><Rocket size={20} aria-hidden /></span>
              <h3 className="mt-4 font-serif text-xl">Become an astronaut at CU Boulder</h3>
              <p className="mt-2 text-sm text-muted">NASA&apos;s stated requirements, CU Boulder&apos;s bioastronautics program, and {bioastronauticsFaculty.filter((p) => p.status === "active").length} faculty profiles to start reading.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">See the route <ArrowRight size={14} aria-hidden /></span>
            </Link></Reveal>
            <Reveal><Link href="/funding" className="lift block h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft text-primary"><HandCoins size={20} aria-hidden /></span>
              <h3 className="mt-4 font-serif text-xl">Pay for it, with dates</h3>
              <p className="mt-2 text-sm text-muted">FAFSA, CU Boulder&apos;s scholarship timeline and {fundingItems.length} sourced funding items, with countdowns to each deadline.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">See funding <ArrowRight size={14} aria-hidden /></span>
            </Link></Reveal>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 py-20" aria-labelledby="how-h">
          <p className="eyebrow">How it works</p>
          <h2 id="how-h" className="mt-2 font-serif text-3xl md:text-5xl">Five steps from dream to diploma</h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title}><Reveal>
                <article className="lift h-full rounded-[16px] border border-border bg-surface p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-soft text-primary"><Icon size={19} aria-hidden /></span>
                    <span className="tabular font-serif text-3xl text-primary/70">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{body}</p>
                </article>
              </Reveal></li>
            ))}
          </ol>
        </section>

        <section id="promise" className="scroll-mt-20 pb-20" aria-labelledby="promise-h">
          <h2 id="promise-h" className="sr-only">Our promise</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {promises.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4 rounded-[16px] bg-soft p-6">
                <Icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                <div><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm text-muted">{body}</p></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-20 rounded-[24px] bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="font-serif text-3xl md:text-5xl">Ready to see your path?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">It takes about two minutes. No sign-up.</p>
          <ButtonLink href="/onboarding" className="mt-8 h-12 bg-background px-8 text-foreground hover:bg-surface">Build My Roadmap <ArrowRight size={16} aria-hidden /></ButtonLink>
        </section>

        <Ridge className="-mx-6 h-20 w-[calc(100%+3rem)]" />
        <footer className="border-t border-border py-8 text-xs text-muted">
          Dream Helper is a planning aid, not an official advising or licensing service. Always confirm requirements with your institution.
        </footer>
      </div>
    </div>
  );
}
