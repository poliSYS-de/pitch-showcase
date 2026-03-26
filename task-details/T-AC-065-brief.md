# T-AC-065 — Slide Configurator: Setup-Page + URL-Parameter-Steuerung

> Prio: P1 | Zugewiesen: PO | Dateien: `src/app/setup/page.tsx` (NEU), `src/app/page.tsx` (ANPASSEN)

## Konzept

Ein Slide Configurator der es erlaubt, verschiedene Pitch-Varianten ueber URL-Parameter zu steuern.
Statt separate Branches pro Pitch-Version → EIN Codebase, config-gesteuert.

## Architektur

### 1. Slide Registry (`src/config/slides.ts` — NEU)

Zentrale Definition ALLER verfuegbaren Slides:

```ts
export interface SlideConfig {
  id: string;           // z.B. "hero", "overview", "opportunity"
  number: string;       // z.B. "01", "02", "03"
  label: string;        // z.B. "Hero", "Corporate Overview"
  component: string;    // Component-Name fuer dynamic import
  category: "MVP" | "LFM" | "ASI" | "Go To Market" | "Finance" | "Team" | "The Ask" | "General";
  defaultEnabled: boolean;  // Im Default-Modus aktiv?
  version: string;      // z.B. "v3.1" — aktuelle Version der Slide
  lastUpdated: string;  // z.B. "2026-03-25" — letztes Update
  status: "active" | "deprecated" | "draft";  // deprecated = default ausgeblendet, grau in Setup
  changelog?: string;   // Kurze Aenderungsnotiz, z.B. "Comic photos, role fix"
}

export const ALL_SLIDES: SlideConfig[] = [
  // === ACTIVE SLIDES (default ON) ===
  { id: "hero",        number: "01", label: "Hero",                component: "HeroSlide",              category: "General",      defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", changelog: "Initial pitch version" },
  { id: "overview",    number: "02", label: "Corporate Overview",  component: "CorporateOverviewSlide", category: "MVP",          defaultEnabled: true,  version: "v3.0", lastUpdated: "2026-03-26", status: "active", changelog: "Real images, text enlarged" },
  { id: "opportunity", number: "03", label: "Market Opportunity",  component: "MarketOpportunitySlide", category: "MVP",          defaultEnabled: true,  version: "v3.1", lastUpdated: "2026-03-26", status: "active", changelog: "RH Logo + Radial Sunburst" },
  { id: "product",     number: "04", label: "Product Demo",        component: "ProductDemoSlide",       category: "MVP",          defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", changelog: "Title single-line, spacings" },
  { id: "vibe",        number: "05", label: "Vibe Trading",        component: "VibeTradingSlide",       category: "MVP",          defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", changelog: "Initial version" },
  { id: "levels",      number: "06", label: "Vibe Levels",         component: "VibeLevelsSlide",        category: "MVP",          defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", changelog: "Classes rename, layout fix" },
  { id: "lfm",         number: "07", label: "LFM",                 component: "LFMSlide",               category: "LFM",          defaultEnabled: true,  version: "v1.1", lastUpdated: "2026-03-25", status: "active", changelog: "Removed $15M text" },
  { id: "gtm",         number: "08", label: "Go To Market",        component: "GoToMarketSlide",        category: "Go To Market", defaultEnabled: true,  version: "v1.1", lastUpdated: "2026-03-25", status: "active", changelog: "Near-zero cost, timeline" },
  { id: "finance",     number: "09", label: "Finance",             component: "FinanceSlide",           category: "Finance",      defaultEnabled: true,  version: "v2.0", lastUpdated: "2026-03-25", status: "active", changelog: "Revenue chart animation" },
  { id: "team",        number: "10", label: "Team",                component: "TeamSlide",              category: "Team",         defaultEnabled: true,  version: "v3.0", lastUpdated: "2026-03-26", status: "active", changelog: "Comic photos, Taban added" },
  { id: "ask",         number: "11", label: "The Ask",             component: "AskSlide",               category: "The Ask",      defaultEnabled: true,  version: "v2.1", lastUpdated: "2026-03-26", status: "active", changelog: "1M users, $60M ARR" },
  { id: "closing",     number: "12", label: "Closing",             component: "ClosingSlide",           category: "General",      defaultEnabled: true,  version: "v1.0", lastUpdated: "2026-03-25", status: "active", changelog: "Initial version" },
  // === DEPRECATED SLIDES (default OFF, shown grayed out in setup) ===
  { id: "company",     number: "A1", label: "Company",             component: "CompanySlide",           category: "General",      defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", changelog: "Replaced by CorporateOverview" },
  { id: "features",    number: "A2", label: "Features",            component: "FeaturesSlide",          category: "MVP",          defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", changelog: "Replaced by ProductDemo" },
  { id: "product-alt", number: "A3", label: "Product (Alt)",       component: "ProductSlide",           category: "MVP",          defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", changelog: "Old product layout" },
  { id: "vision",      number: "A4", label: "Vision",              component: "VisionSlide",            category: "ASI",          defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", changelog: "Not in current pitch" },
  { id: "visuals",     number: "A5", label: "Visuals",             component: "VisualsSlide",           category: "General",      defaultEnabled: false, version: "v1.0", lastUpdated: "2026-02-03", status: "deprecated", changelog: "Asset showcase, not needed" },
];
```

### 2. Setup-Page (`src/app/setup/page.tsx` — NEU)

Route: `/setup`

UI-Elemente:
- **Alle 17 Slides als Karten** mit:
  - Checkbox (toggle on/off)
  - Slide-Nummer + Label
  - **Version Badge** (z.B. "v3.1")
  - **Last Updated** Datum (z.B. "Mar 25, 2026")
  - **Status Badge**: active (gruen), deprecated (grau/durchgestrichen), draft (gelb)
  - Kategorie-Badge (core/product/market/finance/team/extra)
  - Changelog-Einzeiler als Tooltip oder Subtext
- **Deprecated Slides**: Grau dargestellt, default unchecked, aber trotzdem anklickbar falls benoetigt
- **Kategorien als Filter-Tabs**: MVP, LFM, ASI, Go To Market, Finance, Team, The Ask, General
- In der Setup-Page werden Slides **nach Kategorie gruppiert** angezeigt — jede Kategorie hat eine eigene Section mit Header

### Kategorie-Logik: Eine Slide pro Kategorie (default)

**Wichtig:** Pro Kategorie koennen MEHRERE Slide-Varianten existieren (z.B. "Corporate Overview v3" und "Company v1" sind beide Kategorie "MVP"). Aber in einem finalen Pitch-Deck waehlt man in der Regel **nur eine Slide pro Kategorie** aus.

**UI-Verhalten:**
- Slides innerhalb einer Kategorie verhalten sich wie **Radio-Buttons** (default): Aktiviert man eine, wird die andere in derselben Kategorie deaktiviert
- **"Allow multiple per category" Toggle** (default OFF): Wenn aktiviert, werden alle Slides zu normalen Checkboxen — fuer Sonderfaelle wo man 2+ Slides einer Kategorie zeigen will
- Kategorien mit nur 1 Slide (z.B. "Team", "The Ask") haben keinen Radio-Effekt
- **Visueller Hinweis** wenn mehrere derselben Kategorie aktiv sind: gelber Warn-Badge "2 slides in same category"
- **Filter: "Hide Deprecated"** Toggle (default ON — deprecated ausgeblendet)
- **Drag & Drop** fuer Reihenfolge (optional, nice-to-have)
- **Preset-Buttons**: "10min Pitch" (12 Standard), "Quick Demo" (6 Slides), "Investor Deep" (alle 17), "Custom"
- **Generierter Link** unten: `https://localhost:3010/?slides=hero,overview,opportunity,product,team,ask`
- **Copy-to-Clipboard Button** fuer den Link
- **"Launch Presentation" Button** → oeffnet den Link in neuem Tab
- **Design**: Gleiches Dark-Theme wie die Slides (DARK_BG, accent-cyan, etc.)

### 3. page.tsx anpassen

`src/app/page.tsx` liest den URL-Parameter `?slides=hero,overview,team,ask` und rendert NUR die angegebenen Slides in der angegebenen Reihenfolge.

```
/?slides=hero,overview,opportunity,product,vibe,levels,lfm,gtm,finance,team,ask,closing
```

- Kein Parameter = alle defaultEnabled Slides (aktuelles Verhalten)
- `?slides=all` = alle 17 Slides
- `?slides=hero,team,ask` = nur 3 Slides

### 4. SlideNav anpassen

Die Navigation (Dots/Labels) muss sich dynamisch an die aktiven Slides anpassen.

## Presets (vordefiniert)

| Preset | Name | Slides |
|--------|------|--------|
| default | 10min Final Pitch | hero,overview,opportunity,product,vibe,levels,lfm,gtm,finance,team,ask,closing |
| quick | Quick Demo | hero,product,vibe,levels,team,closing |
| investor | Investor Deep Dive | alle 17 |
| marketing | Marketing Focus | hero,overview,opportunity,gtm,team,ask,closing |

## QA-Kriterien

- [ ] `/setup` zeigt alle 17 Slides als Karten mit Version + Last Updated
- [ ] Deprecated Slides sind grau und default ausgeblendet (Toggle "Hide Deprecated")
- [ ] Version-Badge und Datum sind auf jeder Slide-Karte sichtbar
- [ ] Slides nach Kategorie gruppiert (MVP, LFM, ASI, Go To Market, etc.)
- [ ] Radio-Button-Logik: nur 1 Slide pro Kategorie im Default-Modus
- [ ] "Allow multiple per category" Toggle funktioniert
- [ ] Warn-Badge wenn mehrere Slides derselben Kategorie aktiv
- [ ] Checkboxen togglen Slides korrekt
- [ ] Generierter Link ist korrekt und kopierbar
- [ ] Preset-Buttons laden richtige Slide-Kombination
- [ ] `/?slides=hero,team,ask` zeigt NUR diese 3 Slides
- [ ] Kein Parameter = Standard 12 Slides (wie bisher)
- [ ] SlideNav passt sich dynamisch an
- [ ] Design konsistent mit Pitch-Slides (Dark Theme)
- [ ] Keine Scroll-/Layout-Probleme bei verschiedenen Slide-Anzahlen
