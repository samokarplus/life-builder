import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "bg-surface border border-border hover:bg-soft",
  ghost: "hover:bg-soft",
};

export function ButtonLink({
  href, variant = "primary", className, children,
}: { href: string; variant?: keyof typeof styles; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium transition", styles[variant], className)}
    >
      {children}
    </Link>
  );
}
