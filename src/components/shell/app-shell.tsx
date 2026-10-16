"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon, Check, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav";

function Nav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="flex flex-col gap-1 px-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = path === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={cn(
              "flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition",
              active ? "bg-soft font-medium text-primary" : "text-muted hover:bg-soft hover:text-foreground"
            )}
          >
            <Icon size={17} aria-hidden />
            {!collapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen">
      <aside className={cn("hidden shrink-0 flex-col gap-4 border-r border-border bg-surface py-4 transition-all md:flex", collapsed ? "w-16" : "w-60")}>
        <Link href="/" className="flex items-center gap-2 px-5 font-serif text-lg text-primary">
          <Sparkles size={18} aria-hidden />
          {!collapsed && "Dream Helper"}
        </Link>
        <Nav collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mx-2 mt-auto flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted hover:bg-soft"
        >
          {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          {!collapsed && "Collapse"}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64 bg-surface py-4">
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 p-1"><X size={18} /></button>
            <p className="mb-4 px-5 font-serif text-lg text-primary">Dream Helper</p>
            <Nav collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <button aria-label="Open menu" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <span className="hidden rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary sm:inline">FRCC → CU Boulder · Sample plan</span>
          <label className="relative ml-auto hidden max-w-xs flex-1 sm:block">
            <Search size={15} className="absolute left-3 top-2.5 text-muted" aria-hidden />
            <input
              type="search"
              placeholder="Search courses…"
              aria-label="Search courses"
              className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm"
            />
          </label>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted sm:ml-0"><Check size={14} aria-hidden /> Saved</span>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 hover:bg-soft"
          >
            {resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div aria-label="Profile" className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">You</div>
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
