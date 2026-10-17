import { cn } from "@/lib/utils";

/**
 * Dream Helper mark: the Colorado flag's "C" and gold disc, with Rocky Mountain
 * peaks rising out of the letter. Decorative; the wordmark carries the name.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path d="M38.8 12.6A19.5 19.5 0 1 0 38.8 35.4" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24.5" cy="21.5" r="9" fill="var(--gold)" />
      <path d="M9.5 35 17 25l4.2 4.3L27.5 18.5l4 7.2 3-3L41 35z" fill="var(--primary)" />
    </svg>
  );
}

export function Logo({ size = 32, className, compact = false }: { size?: number; className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {!compact && (
        <span className="leading-none">
          <span className="block font-serif text-lg tracking-tight text-primary">Dream Helper</span>
          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-muted">Colorado</span>
        </span>
      )}
    </span>
  );
}
