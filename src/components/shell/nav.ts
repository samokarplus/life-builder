import { LayoutDashboard, Map, BookOpen, GitCompare, Compass, PiggyBank, User, Settings } from "lucide-react";

export const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/roadmap", label: "My Roadmap", icon: Map },
  { href: "/explorer", label: "Course Explorer", icon: BookOpen },
  { href: "/compare", label: "Compare Paths", icon: GitCompare },
  { href: "/careers", label: "Career Explorer", icon: Compass },
  { href: "/costs", label: "Costs & Savings", icon: PiggyBank },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];
