import { LayoutDashboard, Map, BookOpen, GitCompare, Compass, Rocket, HandCoins, PiggyBank, User, Settings } from "lucide-react";

export const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/roadmap", label: "My Roadmap", icon: Map },
  { href: "/explorer", label: "Course Explorer", icon: BookOpen },
  { href: "/compare", label: "Compare Paths", icon: GitCompare },
  { href: "/paths", label: "Colorado Dreams", icon: Rocket },
  { href: "/careers", label: "Career Explorer", icon: Compass },
  { href: "/funding", label: "Funding & FAFSA", icon: HandCoins },
  { href: "/costs", label: "Costs & Savings", icon: PiggyBank },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Grouped for the sidebar: dream first, then planning, then exploring. */
export const navGroups = [
  { label: "Dream", hrefs: ["/paths", "/funding"] },
  { label: "Plan", hrefs: ["/overview", "/roadmap", "/compare", "/costs"] },
  { label: "Explore", hrefs: ["/explorer", "/careers"] },
  { label: "You", hrefs: ["/profile", "/settings"] },
].map((g) => ({ label: g.label, items: g.hrefs.map((h) => navItems.find((n) => n.href === h)!) }));
