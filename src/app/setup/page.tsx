"use client";

import Link from "next/link";
import { ALL_SLIDES } from "@/config/slides";
import { ALL_ASSETS } from "@/config/assets";

const activeSlides = ALL_SLIDES.filter(s => s.status === "active").length;
const activeAssets = ALL_ASSETS.filter(s => s.status === "active").length;
const reserveAssets = ALL_ASSETS.filter(s => s.status === "reserve").length;

const modules = [
  {
    title: "Slide Configurator",
    description: "Build custom pitch decks, manage presets, and configure slide order.",
    href: "/setup/slides",
    accent: "blue",
    accentClass: "text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50",
    iconPath: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    stats: `${ALL_SLIDES.length} slides (${activeSlides} active)`,
    badge: "LIVE",
    badgeClass: "bg-emerald-500/20 text-emerald-400",
  },
  {
    title: "Brand Assets",
    description: "Central registry for all images, logos, and team photos used in slides.",
    href: "/setup/brand-assets",
    accent: "emerald",
    accentClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50",
    iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    stats: `${ALL_ASSETS.length} assets (${activeAssets} active, ${reserveAssets} reserve)`,
    badge: "NEW",
    badgeClass: "bg-emerald-500/20 text-emerald-400",
  },
  {
    title: "Documentation",
    description: "Task log, specs, QA reviews, user guides, and agent system docs.",
    href: "/setup/docs",
    accent: "violet",
    accentClass: "text-violet-400 border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/50",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    stats: "7 categories \u00B7 20+ documents",
    badge: "LIVE",
    badgeClass: "bg-emerald-500/20 text-emerald-400",
  },
  {
    title: "Wizards",
    description: "Guided workflows for creating slides and generating pitch scripts.",
    href: "/setup/wizards",
    accent: "amber",
    accentClass: "text-amber-400 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/50",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    stats: "Slide creation & script generation",
    badge: "SOON",
    badgeClass: "bg-amber-500/20 text-amber-400",
  },
];

export default function SetupHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Slides" value={ALL_SLIDES.length} accent="blue" />
        <StatCard label="Active Slides" value={activeSlides} accent="emerald" />
        <StatCard label="Brand Assets" value={ALL_ASSETS.length} accent="emerald" />
        <StatCard
          label="Default Deck"
          value={ALL_SLIDES.filter(s => s.defaultEnabled).length}
          accent="cyan"
        />
      </section>

      {/* Module Cards */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(mod => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`relative block border rounded-xl p-6 transition-all ${mod.accentClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <svg className={`w-5 h-5 ${mod.accentClass.split(" ")[0]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={mod.iconPath} />
                  </svg>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${mod.badgeClass}`}>
                  {mod.badge}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">{mod.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{mod.description}</p>
              <p className="text-xs font-mono text-slate-500">{mod.stats}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-cyan-400 font-mono text-xs">1. Configure</p>
            <p className="text-slate-400">Select slides and arrange your pitch deck in the Slide Configurator.</p>
          </div>
          <div className="space-y-1">
            <p className="text-emerald-400 font-mono text-xs">2. Assets</p>
            <p className="text-slate-400">Review and manage brand images in the Brand Assets manager.</p>
          </div>
          <div className="space-y-1">
            <p className="text-blue-400 font-mono text-xs">3. Present</p>
            <p className="text-slate-400">Generate a shareable URL and launch your presentation.</p>
          </div>
        </div>
      </section>

      {/* CEO Warning Banner */}
      <section className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
        <span className="text-amber-400 text-lg leading-none mt-0.5">&#9888;</span>
        <div>
          <p className="text-sm text-amber-300 font-semibold">
            Important: Never modify images or config files directly!
          </p>
          <p className="text-xs text-amber-400/70 mt-0.5">
            Use the Brand Assets manager for image changes and the Slide Configurator for deck configuration.
            Direct file modifications may break slide references.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <p className="text-xs font-mono text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[accent] || "text-slate-200"}`}>{value}</p>
    </div>
  );
}
