"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, PanelLeftClose, PanelLeftOpen, Search, Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav";
import { AssistantPanel } from "./assistant-panel";
import { Modal } from "@/components/ui/modal";
import { SaveStatus } from "./save-status";
import { usePlanner } from "@/store/planner";

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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const onboarded = usePlanner((s) => s.onboarded);

  return (
    <div className="flex min-h-screen"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-surface focus:p-3">Skip to content</a>
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

      <Modal open={mobileOpen} drawer onClose={() => setMobileOpen(false)} title="Navigation"><Nav collapsed={false} onNavigate={() => setMobileOpen(false)} /></Modal>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <button aria-label="Open menu" className="md:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <span className="hidden rounded-full bg-soft px-3 py-1 text-xs font-medium text-primary sm:inline">FRCC → CU Boulder · {onboarded ? "Your plan" : "Sample plan"}</span>
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
          <Link href="/roadmap" className="mr-auto text-xs font-medium text-primary sm:hidden">My roadmap</Link>
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
      </div>
    </div>
  );
}
