/** Soft Rocky Mountain skyline used as a section divider. Decorative. */
export function Ridge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden className={className}>
      <path d="M0 140V92l90-34 70 26 110-62 90 58 80-30 120 70 100-48 90 36 110-76 80 52 100-40 90 44 70-34V140z" fill="var(--soft)" />
      <path d="M0 140V112l110-28 90 30 100-46 120 52 90-26 110 40 100-56 120 64 90-30 110 22 90-24 70 20V140z" fill="var(--sage)" opacity=".45" />
    </svg>
  );
}
