/** Two-segment ring: completed (primary) then in-progress (sage). Values are percents of the total. */
export function ProgressRing({ done, inProgress, label, size = 132 }: { done: number; inProgress: number; label: string; size?: number }) {
  const stroke = 11, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const d = Math.min(100, Math.max(0, done)), p = Math.min(100 - d, Math.max(0, inProgress));
  const seg = (pct: number) => (pct / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--warm)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--sage)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${seg(p)} ${c}`} strokeDashoffset={-seg(d)} style={{ transition: "stroke-dasharray 600ms ease" }} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${seg(d)} ${c}`} style={{ transition: "stroke-dasharray 600ms ease" }} />
    </svg>
  );
}
