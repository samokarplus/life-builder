import type { IconKey, ThemeKey } from "@/data/career-meta";
import { cn } from "@/lib/utils";

const art: Record<IconKey, React.ReactNode> = {
  software:<><rect x="7" y="10" width="34" height="25" rx="4" stroke="var(--t-fg)" strokeWidth="3"/><path d="m16 19 5 4-5 4m10 0h6M17 41h14m-7-6v6" stroke="var(--t-fg)" strokeWidth="3" strokeLinecap="round"/></>,
  engineer:<><circle cx="24" cy="24" r="15" stroke="var(--t-fg)" strokeWidth="3"/><path d="m18 33 6-21 6 21M14 28h20m-10-23v6m0 26v6M5 24h6m26 0h6" stroke="var(--t-fg)" strokeWidth="3" strokeLinecap="round"/></>,
  pharmacist:<><path d="m16 12 20 20a10 10 0 0 1-14 0L12 22a10 10 0 0 1 14-14l10 10a10 10 0 0 1 0 14M17 27l14-14" stroke="var(--t-fg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></>,
  plumber:<><path d="M9 9h13v14h17v13H9z" stroke="var(--t-fg)" strokeWidth="3" strokeLinejoin="round"/><path d="M5 9h21M39 19v21" stroke="var(--t-fg)" strokeWidth="4" strokeLinecap="round"/></>,
  dental:<><path d="M24 13c-7-7-15-4-15 4 0 8 4 22 8 22 3 0 1-13 7-13s4 13 7 13c4 0 8-14 8-22 0-8-8-11-15-4z" stroke="var(--t-fg)" strokeWidth="3" strokeLinejoin="round"/></>,
  vet:<><ellipse cx="24" cy="31" rx="11" ry="9" fill="var(--t-fg)"/><ellipse cx="12" cy="19" rx="4" ry="6" fill="var(--t-fg)"/><ellipse cx="22" cy="12" rx="4" ry="6" fill="var(--t-fg)"/><ellipse cx="32" cy="13" rx="4" ry="6" fill="var(--t-fg)"/><ellipse cx="39" cy="23" rx="4" ry="6" fill="var(--t-fg)"/></>,
  // Astronaut helmet with a visor and a glint
  astronaut: (<>
    <path d="M7 41c0-7 7-11 17-11s17 4 17 11z" fill="var(--t-fg)" opacity=".55" />
    <circle cx="24" cy="21" r="15" fill="var(--t-fg)" />
    <rect x="13" y="13.500" width="22" height="15" rx="7.500" fill="var(--t-bg)" />
    <path d="M30 17.500c2 .8 3.200 2.600 3.200 4.800" fill="none" stroke="var(--t-fg)" strokeWidth="1.800" strokeLinecap="round" opacity=".45" />
    <path d="M18.500 18.500l1.200-2 1.200 2-1.200 2z" fill="var(--t-fg)" opacity=".6" />
    <rect x="19" y="33" width="10" height="3.500" rx="1.750" fill="var(--t-bg)" opacity=".85" />
  </>),
  // Two speech bubbles with a heart
  counselor: (<>
    <path d="M9 11h21a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H20l-6 5v-5h-5a5 5 0 0 1-5-5v-8a5 5 0 0 1 5-5z" fill="var(--t-fg)" opacity=".4" transform="translate(-1 -1)" />
    <path d="M20 19h19a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-3v5l-6-5H20a5 5 0 0 1-5-5v-7a5 5 0 0 1 5-5z" fill="var(--t-fg)" transform="translate(-1 -2)" />
    <path d="M27.5 33.5s-6-3.7-6-7.6a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9c0 3.9-6 7.6-6 7.6z" fill="var(--t-bg)" transform="translate(-0.5 -1.5)" />
  </>),
  // Heart with a pulse line
  nurse: (<>
    <path d="M24 40S7 30.5 7 19a8.5 8.5 0 0 1 17-2 8.5 8.5 0 0 1 17 2c0 11.500-17 21-17 21z" fill="var(--t-fg)" />
    <path d="M11 24h8l3-7 4 13 3-6h8" fill="none" stroke="var(--t-bg)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </>),
  // Stethoscope
  doctor: (<>
    <path d="M13 8v13a9 9 0 0 0 18 0V8" fill="none" stroke="var(--t-fg)" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="13" cy="8" r="3" fill="var(--t-fg)" />
    <circle cx="31" cy="8" r="3" fill="var(--t-fg)" />
    <path d="M22 30v3a7 7 0 0 0 14 0v-5" fill="none" stroke="var(--t-fg)" strokeWidth="3.4" strokeLinecap="round" />
    <circle cx="36" cy="25" r="5.2" fill="var(--t-fg)" /><circle cx="36" cy="25" r="2.2" fill="var(--t-bg)" />
  </>),
  // Shield with a plus (original mark, not a certification symbol)
  ems: (<>
    <path d="M24 5l14 5v11c0 9.500-6 16-14 20-8-4-14-10.500-14-20V10z" fill="var(--t-fg)" />
    <path d="M24 15v16M16 23h16" stroke="var(--t-bg)" strokeWidth="4.2" strokeLinecap="round" />
  </>),
  // Lightning bolt in a ring
  electrician: (<>
    <circle cx="24" cy="24" r="17" fill="none" stroke="var(--t-fg)" strokeWidth="3" opacity=".55" />
    <path d="M27 7 14 26h8l-2 15 14-20h-8z" fill="var(--t-fg)" />
  </>),
  // Open book with a spark
  teacher: (<>
    <path d="M6 13c6-2.500 12-2.500 18 1.500v22c-6-4-12-4-18-1.500z" fill="var(--t-fg)" />
    <path d="M42 13c-6-2.500-12-2.500-18 1.500v22c6-4 12-4 18-1.500z" fill="var(--t-fg)" opacity=".7" />
    <path d="M24 3l1.600 3.400L29 8l-3.400 1.600L24 13l-1.600-3.400L19 8l3.400-1.600z" fill="var(--t-fg)" />
  </>),
};

/** Original career badge: a rounded tile in the career's own color. Decorative. */
export function CareerBadge({ icon, theme, size = 56, className }: { icon: IconKey; theme: ThemeKey; size?: number; className?: string }) {
  return (
    <span className={cn(`t-${theme} inline-grid shrink-0 place-items-center rounded-2xl`, className)} style={{ width: size, height: size, background: "var(--t-bg)" }} aria-hidden>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 48 48" fill="none">{art[icon]}</svg>
    </span>
  );
}
