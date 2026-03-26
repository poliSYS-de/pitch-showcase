"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ALL_SLIDES } from "@/config/slides";
import { ALL_ASSETS } from "@/config/assets";


const tabs = [
  { label: "Overview", href: "/setup", exact: true, accent: "cyan", count: null },
  { label: "Slides", href: "/setup/slides", exact: false, accent: "blue", count: ALL_SLIDES.length },
  { label: "Brand Assets", href: "/setup/brand-assets", exact: false, accent: "emerald", count: ALL_ASSETS.length },
  { label: "Docs", href: "/setup/docs", exact: false, accent: "violet", count: null },
  { label: "Wizards", href: "/setup/wizards", exact: false, accent: "amber", count: null, comingSoon: true },
];

const accentClasses: Record<string, { active: string; hover: string }> = {
  cyan: { active: "border-cyan-400 text-cyan-400", hover: "hover:text-cyan-400/70" },
  blue: { active: "border-blue-400 text-blue-400", hover: "hover:text-blue-400/70" },
  emerald: { active: "border-emerald-400 text-emerald-400", hover: "hover:text-emerald-400/70" },
  violet: { active: "border-violet-400 text-violet-400", hover: "hover:text-violet-400/70" },
  amber: { active: "border-amber-400 text-amber-400", hover: "hover:text-amber-400/70" },
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(tab: (typeof tabs)[number]) {
    if (tab.exact) return pathname === tab.href;
    return pathname.startsWith(tab.href);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Title row */}
          <div className="flex items-center justify-between py-4">
            <div>
              <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors">
                &larr; Pitch Deck
              </Link>
              <Link href="/setup" className="block mt-1 underline decoration-slate-600 hover:decoration-cyan-400 transition-colors">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  Pitch <span className="text-cyan-400">Preparation Center</span>
                </h1>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-0 -mb-px overflow-x-auto">
            {tabs.map(tab => {
              const active = isActive(tab);
              const colors = accentClasses[tab.accent];
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? colors.active
                      : `border-transparent text-slate-500 ${colors.hover}`
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tab.label}
                    {tab.count !== null && (
                      <span className={`text-[10px] font-mono ${active ? "opacity-70" : "opacity-50"}`}>
                        ({tab.count})
                      </span>
                    )}
                    {tab.comingSoon && (
                      <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1 rounded">
                        Soon
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      {children}
    </div>
  );
}
