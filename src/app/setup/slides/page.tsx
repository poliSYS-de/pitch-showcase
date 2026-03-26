"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_SLIDES, BUILT_IN_PRESETS, CATEGORIES, DEFAULT_SLIDE_IDS, type SlideConfig, type SlidePreset } from "@/config/slides";
import SlidePreviewLightbox from "@/components/setup/SlidePreviewLightbox";

const categoryColors: Record<string, string> = {
  core: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  product: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  market: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  finance: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  team: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  extra: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-500/20 text-emerald-400" },
  deprecated: { label: "Deprecated", className: "bg-zinc-600/30 text-zinc-500" },
  draft: { label: "Draft", className: "bg-amber-500/20 text-amber-400" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
}

interface DeckConfig {
  version: number;
  defaultSlideIds: string[];
  customPresets: SlidePreset[];
}

export default function SetupPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([...DEFAULT_SLIDE_IDS]);
  const [savedDefault, setSavedDefault] = useState<string[]>([...DEFAULT_SLIDE_IDS]);
  const [customPresets, setCustomPresets] = useState<SlidePreset[]>([]);
  const [hideDeprecated, setHideDeprecated] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [newPresetName, setNewPresetName] = useState("");
  const [showPresetInput, setShowPresetInput] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [previewSlideId, setPreviewSlideId] = useState<string | null>(null);

  // Load config on mount
  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then((config: DeckConfig) => {
        setSavedDefault(config.defaultSlideIds);
        setSelectedIds(config.defaultSlideIds);
        setCustomPresets(config.customPresets || []);
        setConfigLoaded(true);
      })
      .catch(() => setConfigLoaded(true));
  }, []);

  const filteredSlides = useMemo(() => {
    let slides = [...ALL_SLIDES];
    if (hideDeprecated) slides = slides.filter(s => s.status !== "deprecated");
    if (activeCategory) slides = slides.filter(s => s.category === activeCategory);
    return slides;
  }, [hideDeprecated, activeCategory]);

  const toggleSlide = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const applyPreset = (slideIds: string[]) => {
    setSelectedIds([...slideIds]);
  };

  const isDefaultChanged = useMemo(() => {
    return JSON.stringify(selectedIds) !== JSON.stringify(savedDefault);
  }, [selectedIds, savedDefault]);

  // Detect active preset
  const activePresetId = useMemo(() => {
    if (!isDefaultChanged && JSON.stringify(selectedIds) === JSON.stringify(savedDefault)) {
      return "__online_default__";
    }
    for (const p of BUILT_IN_PRESETS) {
      if (p.slideIds.length === selectedIds.length && p.slideIds.every((id, i) => selectedIds[i] === id)) return p.id;
    }
    for (const p of customPresets) {
      if (p.slideIds.length === selectedIds.length && p.slideIds.every((id, i) => selectedIds[i] === id)) return p.id;
    }
    return null;
  }, [selectedIds, savedDefault, customPresets, isDefaultChanged]);

  // Adaptive URL
  const generatedUrl = useMemo(() => {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3010";
    // If matches saved default → clean URL
    if (!isDefaultChanged) return base + "/";
    // If matches a custom preset → ?preset=slug
    const customMatch = customPresets.find(p =>
      p.slideIds.length === selectedIds.length && p.slideIds.every((id, i) => selectedIds[i] === id)
    );
    if (customMatch) return base + "/?preset=" + customMatch.id;
    // If matches a built-in preset → ?preset=slug
    const builtinMatch = BUILT_IN_PRESETS.find(p =>
      p.slideIds.length === selectedIds.length && p.slideIds.every((id, i) => selectedIds[i] === id)
    );
    if (builtinMatch) return base + "/?preset=" + builtinMatch.id;
    // Otherwise → ?slides=a,b,c
    return base + "/?slides=" + selectedIds.join(",");
  }, [selectedIds, savedDefault, customPresets, isDefaultChanged]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAsDefault = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultSlideIds: selectedIds }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setSavedDefault([...selectedIds]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save config");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }, [selectedIds]);

  const saveCustomPreset = useCallback(async () => {
    const name = newPresetName.trim();
    if (!name) return;
    const id = slugify(name);
    if (!id) return;

    const updated = [...customPresets, { id, name, slideIds: [...selectedIds] }];
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPresets: updated }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setCustomPresets(updated);
      setNewPresetName("");
      setShowPresetInput(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save preset");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }, [newPresetName, selectedIds, customPresets]);

  const deleteCustomPreset = useCallback(async (presetId: string) => {
    const updated = customPresets.filter(p => p.id !== presetId);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPresets: updated }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCustomPresets(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete preset");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }, [customPresets]);

  if (!configLoaded) {
    return (
      <div className="min-h-screen bg-[var(--color-charcoal)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)] font-mono text-sm">Loading config...</div>
      </div>
    );
  }

  return (
    <div className="text-[var(--color-text-primary)]">
      {/* Error Toast */}
      <AnimatePresence>
        {saveStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm font-mono backdrop-blur-sm"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Sub-header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Slide Configurator</h2>
            <p className="text-sm text-[var(--color-text-muted)] font-mono">Build your custom pitch deck</p>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)]">
            {selectedIds.length} / {ALL_SLIDES.length} slides
          </div>
        </div>
        {/* Presets */}
        <section className="space-y-4">
          {/* Row 1: Default (Online) — standalone */}
          <div>
            <button
              onClick={() => applyPreset(savedDefault)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${
                activePresetId === "__online_default__"
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-400/50 ring-1 ring-cyan-400/20"
                  : "bg-[var(--color-obsidian)] text-cyan-400/70 border-cyan-400/20 hover:border-cyan-400/40 hover:text-cyan-400"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Default (Online)
              <span className="text-xs opacity-60">({savedDefault.length})</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-b border-white/10" />

          {/* Row 2: Built-in + Custom + Save */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
              Presets
            </h2>
            <div className="flex flex-wrap gap-2">
              {/* Built-in Presets */}
              {BUILT_IN_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.slideIds)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    activePresetId === preset.id
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-[var(--color-obsidian)] text-[var(--color-text-secondary)] border-[var(--color-graphite)] hover:border-[var(--color-steel)] hover:text-white"
                  }`}
                >
                  {preset.name}
                  <span className="ml-2 text-xs opacity-60">({preset.slideIds.length})</span>
                  <span className="ml-1 text-[10px] opacity-40 font-mono">Built-in</span>
                </button>
              ))}

              {/* Custom Presets */}
              {customPresets.map(preset => (
                <div key={preset.id} className="relative group">
                  <button
                    onClick={() => applyPreset(preset.slideIds)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border pr-8 ${
                      activePresetId === preset.id
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-[var(--color-obsidian)] text-[var(--color-text-secondary)] border-[var(--color-graphite)] hover:border-[var(--color-steel)] hover:text-white"
                    }`}
                  >
                    {preset.name}
                    <span className="ml-2 text-xs opacity-60">({preset.slideIds.length})</span>
                  </button>
                  <button
                    onClick={() => deleteCustomPreset(preset.id)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete preset"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* + Save as Preset */}
              {showPresetInput ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={e => setNewPresetName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveCustomPreset(); if (e.key === "Escape") setShowPresetInput(false); }}
                    placeholder="Preset name..."
                    className="px-3 py-2 rounded-lg text-sm bg-[var(--color-obsidian)] border border-[var(--color-steel)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] w-40"
                    autoFocus
                  />
                  <button
                    onClick={saveCustomPreset}
                    disabled={!newPresetName.trim()}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white disabled:opacity-30 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setShowPresetInput(false); setNewPresetName(""); }}
                    className="px-2 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPresetInput(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-dashed border-[var(--color-steel)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-white transition-all"
                >
                  + Save as Preset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                !activeCategory ? "bg-white/10 text-white" : "text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                  activeCategory === cat ? "bg-white/10 text-white" : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setHideDeprecated(!hideDeprecated)}
            className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-white transition-colors ml-auto"
          >
            <div className={`w-8 h-4 rounded-full relative transition-colors ${hideDeprecated ? "bg-[var(--color-primary)]" : "bg-[var(--color-steel)]"}`}>
              <motion.div
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
                animate={{ left: hideDeprecated ? 17 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            Hide Deprecated
          </button>
        </section>

        {/* Slide Cards Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredSlides.map((slide) => (
                <SlideCard
                  key={slide.id}
                  slide={slide}
                  selected={selectedIds.includes(slide.id)}
                  isDefault={savedDefault.includes(slide.id)}
                  onToggle={() => toggleSlide(slide.id)}
                  onPreview={() => setPreviewSlideId(slide.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Sticky Footer */}
        <section className="sticky bottom-0 bg-[var(--color-charcoal)]/95 backdrop-blur-sm border-t border-[var(--color-graphite)] -mx-6 md:-mx-12 px-6 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 bg-[var(--color-obsidian)] border border-[var(--color-graphite)] rounded-lg px-4 py-2.5 font-mono text-sm text-[var(--color-text-muted)] truncate">
              {generatedUrl}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={copyLink}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[var(--color-obsidian)] border border-[var(--color-graphite)] text-white hover:bg-[var(--color-slate)] transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={saveAsDefault}
                disabled={!isDefaultChanged || saveStatus === "saving"}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                  saveStatus === "saved"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : isDefaultChanged
                      ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-400 hover:bg-cyan-500/20"
                      : "bg-[var(--color-obsidian)] border-[var(--color-graphite)] text-[var(--color-text-muted)] opacity-40 cursor-not-allowed"
                }`}
              >
                {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Set as Default"}
              </button>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors text-center"
              >
                Launch Presentation
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <SlidePreviewLightbox
        slideId={previewSlideId}
        allSlides={filteredSlides}
        onClose={() => setPreviewSlideId(null)}
        onNavigate={(id) => setPreviewSlideId(id)}
      />
    </div>
  );
}

const gradientMap: Record<string, string> = {
  core: "from-blue-900/60 to-slate-900/80",
  product: "from-emerald-900/60 to-slate-900/80",
  market: "from-amber-900/60 to-slate-900/80",
  finance: "from-purple-900/60 to-slate-900/80",
  team: "from-pink-900/60 to-slate-900/80",
  extra: "from-zinc-800/60 to-slate-900/80",
};

function SlideCard({ slide, selected, isDefault, onToggle, onPreview }: { slide: SlideConfig; selected: boolean; isDefault: boolean; onToggle: () => void; onPreview: () => void }) {
  const isDeprecated = slide.status === "deprecated";
  const status = statusConfig[slide.status];
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-full rounded-xl border overflow-hidden transition-all relative ${
          isDeprecated
            ? "opacity-50 border-[var(--color-graphite)] bg-[var(--color-obsidian)]/50"
            : isDefault && selected
              ? "border-2 border-cyan-400/40 bg-[var(--color-primary)]/5 ring-1 ring-cyan-400/20"
              : selected
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/30"
                : "border-[var(--color-graphite)] bg-[var(--color-obsidian)] hover:border-[var(--color-steel)]"
        }`}
      >
        {/* Thumbnail Preview — click opens Lightbox */}
        <div
          role="button"
          tabIndex={0}
          onClick={onPreview}
          onKeyDown={(e) => { if (e.key === "Enter") onPreview(); }}
          className="relative w-full aspect-video bg-[var(--color-obsidian)] cursor-zoom-in group"
        >
          {slide.previewImage && !imgError ? (
            <Image
              src={slide.previewImage}
              alt={slide.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover transition-all group-hover:brightness-110 ${isDeprecated ? "grayscale" : ""}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[slide.category] || gradientMap.extra} flex items-center justify-center transition-all group-hover:brightness-110 ${isDeprecated ? "grayscale" : ""}`}>
              <span className="text-white/40 font-mono text-sm tracking-wider">{slide.label}</span>
            </div>
          )}
          {/* Zoom hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </div>
          </div>
          {/* Status Badges on thumbnail */}
          <div className="absolute top-1.5 right-1.5 flex gap-1">
            {isDefault && (
              <span className="text-[9px] font-mono font-bold text-cyan-400 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                DEFAULT
              </span>
            )}
            {isDeprecated && (
              <span className="text-[9px] font-mono font-bold text-red-400 bg-red-500/20 border border-red-500/30 backdrop-blur-sm px-1.5 py-0.5 rounded">
                DEPRECATED
              </span>
            )}
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3">
          {/* slideTag + Label */}
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{slide.slideTag}</span>
            <h3 className={`text-sm font-semibold truncate ${isDeprecated ? "line-through text-[var(--color-text-muted)]" : "text-white"}`}>
              {slide.label}
            </h3>
          </div>

          {/* Badges + Checkbox row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase border ${categoryColors[slide.category]}`}>
                {slide.category}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${status.className}`}>
                {status.label}
              </span>
            </div>
            <button
              onClick={onToggle}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                selected
                  ? "bg-cyan-500 border-cyan-500"
                  : "border-[var(--color-steel)] bg-[var(--color-obsidian)] hover:border-[var(--color-text-secondary)]"
              }`}
              aria-label={selected ? `Deselect ${slide.label}` : `Select ${slide.label}`}
            >
              {selected && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Changelog */}
          {slide.changelog && (
            <p className="text-[10px] text-[var(--color-text-muted)] mb-1 leading-snug truncate">
              {slide.changelog}
            </p>
          )}

          {/* Version + Date */}
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
            <span>{slide.version}</span>
            <span>{formatDate(slide.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
