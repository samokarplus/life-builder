"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./nav";
import { AssistantPanel } from "./assistant-panel";
import { CommandPalette } from "./command-palette";
import { Modal } from "@/components/ui/modal";
import { Logo, LogoMark } from "@/components/brand/logo";
import { SaveStatus } from "./save-status";
import { institutions } from "@/data/sample";
import { usePlanner } from "@/store/planner";

function Nav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="flex flex-col gap-4 px-2">
      {navGroups.map((group) => (
        <div key={group.label} role="group" aria-label={group.label} className="flex flex-col gap-0.5">
          {!collapsed && <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[.18em] text-muted">{group.label}</p>}
          {group.items.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
                className={cn(
                  "relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition",
                  active ? "bg-soft font-medium text-primary" : "text-muted hover:bg-soft hover:text-foreground"
                )}
              >
                {active && <span className="absolute left-0 top-2 h-5 w-[3px] rounded-full bg-gold" aria-hidden />}
                <Icon size={17} aria-hidden />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const onboarded = usePlanner((s) => s.onboarded);
  const profile = usePlanner((s)=>s.profile);
  const institutionName = (id:string) => institutions.find(i=>i.id===id)?.shortName ?? "Unknown institution";

  return (
    <div className="flex min-h-screen"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-surface focus:p-3">Skip to content</a>
      <aside className={cn("hidden shrink-0 flex-col gap-4 border-r border-border bg-surface py-4 transition-all lg:flex", collapsed ? "w-16" : "w-60")}>
        <Link href="/" aria-label="Dream Helper Colorado, home" className="px-4"><Logo compact={collapsed} size={32} /></Link>
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

      <Modal open={mobileOpen} drawer onClose={() => setMobileOpen(false)} title="Navigation"><Nav collapsed={false} onNavigate={() => setMobileOpen(false)} /></Modal>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <button aria-label="Open menu" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <Link href="/" aria-label="Dream Helper Colorado, home" className="lg:hidden"><LogoMark size={26} /></Link>
          <span className="hidden rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary sm:inline">{institutionName(profile.currentInstitutionId)} → {institutionName(profile.destinationInstitutionId)} · {onboarded ? "Your plan" : "Sample plan"}</span>
          <form onSubmit={(e)=>{e.preventDefault();router.push(`/explorer?q=${encodeURIComponent(search)}`);}} className="relative ml-auto hidden max-w-xs flex-1 sm:block">
            <Search size={15} className="absolute left-3 top-2.5 text-muted" aria-hidden />
            <input
              value={search} onChange={(e)=>setSearch(e.target.value)}
              type="search"
              placeholder="Search courses…"
              aria-label="Search courses"
              className="h-9 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm"
            />
          </form>
          <Link href="/roadmap" className="mr-auto whitespace-nowrap text-xs font-medium text-primary sm:hidden">My roadmap</Link>
          <SaveStatus />
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 hover:bg-soft"
          >
            {resolvedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link href="/profile" aria-label="Profile" className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">You</Link>
        </header>
        <main id="main-content" className="min-w-0 flex-1 p-4 pb-24 sm:p-6 md:p-8 lg:p-10">{children}</main>
        <AssistantPanel />
        <CommandPalette />
      </div>
    </div>
  );
}
