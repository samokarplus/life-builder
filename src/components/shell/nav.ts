import { ListChecks, LayoutDashboard, Map, BookOpen, GitCompare, Compass, Rocket, HandCoins, PiggyBank, User, Settings } from "lucide-react";

export const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/next-steps", label: "Next Steps", icon: ListChecks },
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

/** One journey first (where you are and what to do), then opportunities, exploring and tools. */
export const navGroups = [
  { label: "My Journey", hrefs: ["/overview", "/next-steps", "/roadmap"] },
  { label: "Opportunities", hrefs: ["/funding"] },
  { label: "Explore", hrefs: ["/paths", "/explorer", "/careers"] },
  { label: "Tools", hrefs: ["/compare", "/costs"] },
  { label: "Account", hrefs: ["/profile", "/settings"] },
].map((g) => ({ label: g.label, items: g.hrefs.map((h) => navItems.find((n) => n.href === h)!) }));
