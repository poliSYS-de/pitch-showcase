export interface SlideConfig {
  id: string;
  number: string;
  label: string;
  component: string;
  category: "core" | "product" | "market" | "finance" | "team" | "extra";
  defaultEnabled: boolean;
  version: string;
  lastUpdated: string;
  status: "active" | "deprecated" | "draft";
  slideTag: string;
  changelog?: string;
  previewImage?: string;
}

export const ALL_SLIDES: SlideConfig[] = [
  // === ACTIVE SLIDES (default ON) ===
  { id: "hero",        number: "01", label: "Hero",                component: "HeroSlide",              category: "core",    defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", slideTag: "CORE-HERO",    changelog: "Initial pitch version",     previewImage: "/images/slide-previews/hero.jpg" },
  { id: "overview",    number: "02", label: "Corporate Overview",  component: "CorporateOverviewSlide", category: "core",    defaultEnabled: true,  version: "v3.0", lastUpdated: "2026-03-26", status: "active", slideTag: "CORE-OVER",    changelog: "Real images, text enlarged",  previewImage: "/images/slide-previews/overview.jpg" },
  { id: "opportunity", number: "03", label: "Market Opportunity",  component: "MarketOpportunitySlide", category: "market",  defaultEnabled: true,  version: "v3.1", lastUpdated: "2026-03-26", status: "active", slideTag: "MKT-OPP",      changelog: "RH Logo + Radial Sunburst",   previewImage: "/images/slide-previews/opportunity.jpg" },
  { id: "product",     number: "04", label: "Product Demo",        component: "ProductDemoSlide",       category: "product", defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-DEMO",    changelog: "Title single-line, spacings",  previewImage: "/images/slide-previews/product.jpg" },
  { id: "vibe",        number: "05", label: "Vibe Trading",        component: "VibeTradingSlide",       category: "product", defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-VIBE",    changelog: "Initial version",              previewImage: "/images/slide-previews/vibe.jpg" },
  { id: "levels",      number: "06", label: "Vibe Levels",         component: "VibeLevelsSlide",        category: "product", defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LVL",     changelog: "Classes rename, layout fix",   previewImage: "/images/slide-previews/levels.jpg" },
  { id: "lfm",         number: "07", label: "LFM",                 component: "LFMSlide",               category: "product", defaultEnabled: true,  version: "v1.1", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFM",     changelog: "Removed $15M text",            previewImage: "/images/slide-previews/lfm.jpg" },
  { id: "gtm",         number: "08", label: "Go To Market",        component: "GoToMarketSlide",        category: "market",  defaultEnabled: true,  version: "v1.1", lastUpdated: "2026-03-25", status: "active", slideTag: "MKT-GTM",      changelog: "Near-zero cost, timeline",    previewImage: "/images/slide-previews/gtm.jpg" },
  { id: "marketing",   number: "09", label: "Marketing Growth",    component: "MarketingGrowthSlide",   category: "market",  defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "MKT-GROW",     changelog: "Marketing growth strategy",   previewImage: "/images/slide-previews/marketing.jpg" },
  { id: "scale",       number: "10", label: "Full Scale Growth",   component: "FullScaleGrowthSlide",   category: "market",  defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "MKT-SCALE",    changelog: "Full scale growth plan",      previewImage: "/images/slide-previews/scale.jpg" },
  { id: "finance",     number: "11", label: "Finance",             component: "FinanceSlide",           category: "finance", defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", slideTag: "FIN-VAL",      changelog: "Revenue chart animation",     previewImage: "/images/slide-previews/finance.jpg" },
  { id: "team",        number: "12", label: "Team",                component: "TeamSlide",              category: "team",    defaultEnabled: true,  version: "v3.0", lastUpdated: "2026-03-26", status: "active", slideTag: "TEAM-MAIN",    changelog: "Comic photos, Taban added",   previewImage: "/images/slide-previews/team.jpg" },
  { id: "ask",         number: "13", label: "The Ask",             component: "AskSlide",               category: "finance", defaultEnabled: true,  version: "v2.1", lastUpdated: "2026-03-26", status: "active", slideTag: "FIN-ASK",      changelog: "1M users, $60M ARR",          previewImage: "/images/slide-previews/ask.jpg" },
  { id: "closing",     number: "14", label: "Closing",             component: "ClosingSlide",           category: "core",    defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "CORE-CLOSE",   changelog: "Initial version",              previewImage: "/images/slide-previews/closing.jpg" },
  // === LFM DEEP DIVE SLIDES (active, default OFF) ===
  { id: "lfm-construction", number: "B1", label: "LFM Construction",  component: "LFMConstructionSlide",  category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMC", changelog: "LFM deep dive — construction", previewImage: "/images/slide-previews/lfm-construction.jpg" },
  { id: "lfm-design",       number: "B2", label: "LFM Design",        component: "LFMDesignSlide",        category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMD", changelog: "LFM deep dive — design",        previewImage: "/images/slide-previews/lfm-design.jpg" },
  { id: "lfm-opportunity",  number: "B3", label: "LFM Opportunity",   component: "LFMOpportunitySlide",   category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMO", changelog: "LFM deep dive — opportunity",   previewImage: "/images/slide-previews/lfm-opportunity.jpg" },
  // === DEPRECATED SLIDES (default OFF) ===
  { id: "company",     number: "A1", label: "Company",             component: "CompanySlide",           category: "extra",   defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", slideTag: "EX-COMP",  changelog: "Replaced by CorporateOverview", previewImage: "/images/slide-previews/company.jpg" },
  { id: "features",    number: "A2", label: "Features",            component: "FeaturesSlide",          category: "extra",   defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", slideTag: "EX-FEAT",  changelog: "Replaced by ProductDemo",       previewImage: "/images/slide-previews/features.jpg" },
  { id: "product-alt", number: "A3", label: "Product (Alt)",       component: "ProductSlide",           category: "extra",   defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", slideTag: "EX-PROD",  changelog: "Old product layout",            previewImage: "/images/slide-previews/product-alt.jpg" },
  { id: "vision",      number: "A4", label: "Vision",              component: "VisionSlide",            category: "extra",   defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", slideTag: "EX-VIS",   changelog: "Not in current pitch",          previewImage: "/images/slide-previews/vision.jpg" },
  { id: "visuals",     number: "A5", label: "Visuals",             component: "VisualsSlide",           category: "extra",   defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", slideTag: "EX-VIZZ",  changelog: "Asset showcase, not needed",    previewImage: "/images/slide-previews/visuals.jpg" },
];

export const DEFAULT_SLIDE_IDS = ALL_SLIDES.filter(s => s.defaultEnabled).map(s => s.id);

export interface SlidePreset {
  id: string;
  name: string;
  slideIds: string[];
}

export const BUILT_IN_PRESETS: SlidePreset[] = [
  { id: "default",      name: "10min Final Pitch",              slideIds: ["hero", "overview", "opportunity", "product", "vibe", "levels", "lfm", "gtm", "marketing", "scale", "finance", "team", "ask", "closing"] },
  { id: "quick",        name: "Quick Demo",                     slideIds: ["hero", "product", "vibe", "levels", "team", "closing"] },
  { id: "all",          name: "All Slides (incl. Deprecated)",  slideIds: ALL_SLIDES.map(s => s.id) },
  { id: "mkt-focus",    name: "Marketing Focus",                slideIds: ["hero", "overview", "opportunity", "gtm", "marketing", "scale", "team", "ask", "closing"] },
];

export const CATEGORIES = ["core", "product", "market", "finance", "team", "extra"] as const;

export function getSlideById(id: string): SlideConfig | undefined {
  return ALL_SLIDES.find(s => s.id === id);
}

export function resolveSlideIds(param: string | null): string[] {
  if (!param) return DEFAULT_SLIDE_IDS;
  if (param === "all") return ALL_SLIDES.map(s => s.id);
  const ids = param.split(",").map(s => s.trim()).filter(Boolean);
  return ids.filter(id => ALL_SLIDES.some(s => s.id === id));
}
