# T-AC-066 — Slide Configurator v2: Persistente Defaults + Custom Presets

> Prio: P0 | Zugewiesen: PO | Baut auf T-AC-065 auf (Commit 5a0452a)
> Konzept: `docs/KONZEPT-SLIDE-ADMIN.md` (v2.1)
> Peer Review: Runde 1 FREIGABE MIT AUFLAGEN → Auflagen A-1 bis A-4 eingearbeitet
> Hosting: AWS (eigener Server) — fs.readFile/writeFile funktioniert
> Scope: NUR Persistenz + Presets. slideTag/deckPosition = T-AC-067, Previews = T-AC-068

## Kernidee

Der Standard-Pitch (URL OHNE Parameter) muss ueber die Setup-Page konfigurierbar sein.
Investoren sehen genau die Slides, die im Setup als "Default" markiert sind.
Custom Presets fuer Sonder-Pitches, aufrufbar via `/?preset=name`.

---

## Architektur-Entscheidungen

### page.tsx: Server Component (Auflage A-2)
- page.tsx wird von Client zu **Server Component** umgebaut
- Liest deck-config.json direkt via `fs.readFile` (kein fetch, kein Flackern)
- Bestehende Client-Logik (Slides rendern, SlideNav) wird in `PitchDeckClient` extrahiert

### setup/page.tsx: Bleibt Client Component
- Interaktiv (Checkboxen, Presets, Set as Default)
- Fetcht Config via GET /api/config, schreibt via POST /api/config

---

## Aufgaben

### Phase 1: deck-config.json + API-Route

**1.1 deck-config.json im Projekt-Root erstellen:**
```json
{
  "version": 1,
  "defaultSlideIds": ["hero", "overview", "opportunity", "product", "vibe", "levels", "lfm", "gtm", "marketing", "scale", "finance", "team", "ask", "closing"],
  "customPresets": []
}
```

**1.2 API-Route `src/app/api/config/route.ts`:**

```ts
import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { ALL_SLIDES, DEFAULT_SLIDE_IDS } from '@/config/slides';

const CONFIG_PATH = path.join(process.cwd(), 'deck-config.json');
const BUILT_IN_IDS = ['default', 'quick', 'investor', 'mkt-focus']; // reserviert

function readConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return { version: 1, defaultSlideIds: DEFAULT_SLIDE_IDS, customPresets: [] };
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

// GET /api/config
export async function GET() {
  return NextResponse.json(readConfig());
}

// POST /api/config
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = readConfig();
    const validIds = ALL_SLIDES.map(s => s.id);

    // Update defaultSlideIds
    if (body.defaultSlideIds) {
      const filtered = body.defaultSlideIds.filter((id: string) => validIds.includes(id));
      if (filtered.length === 0) return NextResponse.json({ error: 'No valid slide IDs' }, { status: 400 });
      config.defaultSlideIds = filtered;
    }

    // Update customPresets
    if (body.customPresets) {
      if (body.customPresets.length > 10) {
        return NextResponse.json({ error: 'Max 10 custom presets' }, { status: 400 });
      }
      // Auflage A-4: Keine Kollision mit Built-in IDs
      for (const preset of body.customPresets) {
        if (BUILT_IN_IDS.includes(preset.id)) {
          return NextResponse.json({ error: `Preset ID "${preset.id}" is reserved` }, { status: 400 });
        }
        preset.slideIds = preset.slideIds.filter((id: string) => validIds.includes(id));
      }
      config.customPresets = body.customPresets;
    }

    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
```

**1.3 slides.ts: PRESETS → BUILT_IN_PRESETS**
- Rename: `export const PRESETS` → `export const BUILT_IN_PRESETS`
- Typ bleibt gleich, Werte bleiben gleich

Commit: `feat(configurator): Phase 1 — deck-config.json + API-Route + BUILT_IN_PRESETS`

### Phase 2: page.tsx → Server Component

**2.1 page.tsx komplett umbauen:**
- Entferne `"use client"` Directive
- `useSearchParams()` → `searchParams` prop (Next.js App Router Server Component)
- Config direkt via `readFileSync` laden (kein fetch)
- URL-Aufloesung:
  1. `?slides=a,b,c` → direkte IDs (backward-kompatibel)
  2. `?preset=name` → Lookup in config.customPresets ODER BUILT_IN_PRESETS
  3. Kein Parameter → config.defaultSlideIds
- Bestehende Client-Logik in `PitchDeckClient` extrahieren:

```tsx
// page.tsx (Server Component)
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { ALL_SLIDES, DEFAULT_SLIDE_IDS, BUILT_IN_PRESETS } from '@/config/slides';
import PitchDeckClient from './PitchDeckClient';

function getConfig() {
  const configPath = path.join(process.cwd(), 'deck-config.json');
  if (!existsSync(configPath)) {
    return { version: 1, defaultSlideIds: [...DEFAULT_SLIDE_IDS], customPresets: [] };
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function resolveSlides(slidesParam?: string, presetParam?: string) {
  const config = getConfig();
  const validIds = ALL_SLIDES.map(s => s.id);

  if (slidesParam) {
    if (slidesParam === 'all') return ALL_SLIDES.map(s => s.id);
    return slidesParam.split(',').map(s => s.trim()).filter(id => validIds.includes(id));
  }
  if (presetParam) {
    // Erst Custom Presets pruefen, dann Built-in
    const custom = config.customPresets.find((p: any) => p.id === presetParam);
    if (custom) return custom.slideIds.filter((id: string) => validIds.includes(id));
    const builtin = BUILT_IN_PRESETS.find(p => p.id === presetParam);
    if (builtin) return builtin.slideIds;
  }
  return config.defaultSlideIds;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ slides?: string; preset?: string }> }) {
  const params = await searchParams;
  const slideIds = resolveSlides(params.slides, params.preset);
  const slides = slideIds
    .map(id => ALL_SLIDES.find(s => s.id === id))
    .filter(Boolean);
  return <PitchDeckClient slides={slides} />;
}
```

**2.2 PitchDeckClient.tsx erstellen (aus bisherigem page.tsx Client-Code):**
- `"use client"` Directive
- Bekommt `slides` als Prop (bereits aufgeloest)
- Rendert SmoothScrollProvider, AnimationsEnabledProvider, SlideNav + Slides

Commit: `feat(configurator): Phase 2 — page.tsx Server Component + PitchDeckClient`

### Phase 3: Setup-Page erweitern

**3.1 Config laden + Default-State:**
- Beim Mount: `fetch('/api/config')` → `defaultSlideIds` + `customPresets`
- `savedDefault` State: speichert den Server-Default (fuer Vergleich)

**3.2 Default-Rahmen auf Slide-Karten:**
- Slides im gespeicherten Default bekommen: `border-2 border-cyan-400/40`
- Kleines "DEFAULT" Badge (cyan) oben-rechts auf der Karte
- Logik: `savedDefault.includes(slide.id)`

**3.3 "Set as Default" Button im Sticky Footer:**
- Position: zwischen "Copy Link" und "Launch Presentation"
- Nur aktiv (nicht ausgegraut) wenn: `JSON.stringify(selectedIds) !== JSON.stringify(savedDefault)`
- Klick: POST /api/config mit `{ defaultSlideIds: selectedIds }`
- Erfolg: Button kurz "Saved!" (gruen), `savedDefault` aktualisieren
- Fehler: Roter Toast "Failed to save" (Auflage A-6)

**3.4 Preset-Management:**

- **"Default (Online)" Preset — ERSTER Button in der Preset-Leiste:**
  - Dynamischer Preset der IMMER die aktuell gespeicherten `defaultSlideIds` repraesentiert
  - Visuell hervorgehoben: Cyan-Border + Globe-Icon/Label "Online Default"
  - Klick → laedt die gespeicherten Default-Slides in die Auswahl
  - Zeigt Anzahl: "Default (Online) (12)" — Zahl aus config.defaultSlideIds.length
  - NICHT editierbar/loeschbar (kein Delete-Icon)
  - Wenn aktuelle Auswahl = savedDefault → dieser Button ist aktiv/highlighted
  - URL: `https://domain.com/` (clean, kein Parameter)

- **Built-in Presets:** BUILT_IN_PRESETS aus slides.ts. Nicht editierbar. Kleines "Built-in" Label.
- **Custom Presets:** Aus config.customPresets. Klick → laedt Auswahl.
- **"+ Save as Preset" Button:** Inline-Input fuer Name → Slug generieren → POST
- **Delete-Icon** auf Custom Presets: Klick → Confirm → POST ohne dieses Preset
- Custom Presets generieren URL: `/?preset={slug}`

**Preset-Leiste Reihenfolge:**
```
[ Default (Online) (12) ] [ 10min Final Pitch (14) ] [ Quick Demo (6) ] [ Investor Deep (19) ] [ + Save as Preset ]
```

**3.5 URL-Anzeige adaptiv:**
- Auswahl = savedDefault → `https://domain.com/` (clean, kein Parameter)
- Auswahl = Custom Preset → `https://domain.com/?preset=slug`
- Auswahl = Built-in Preset → `https://domain.com/?preset=slug`
- Auswahl = manuell → `https://domain.com/?slides=a,b,c`

**3.6 Bestehende `?slides=` Kompatibilitaet:**
- `resolveSlideIds()` in slides.ts kann entfernt/vereinfacht werden (page.tsx nutzt eigene Logik)
- Setup-Page nutzt weiterhin Client-seitige URL-Generierung

Commit: `feat(configurator): Phase 3 — Setup-Page Default-Badge + Set as Default + Presets`

---

## Technische Constraints
- Next.js App Router (src/app/)
- Framer Motion (installiert)
- Dark Theme: --color-charcoal, --color-primary, --color-accent-cyan etc.
- KEIN localStorage — alles ueber deck-config.json + API
- Branch: direkt auf master

## NICHT in diesem Ticket
- slideTag / deckPosition Refactoring → T-AC-067
- Preview-Thumbnails → T-AC-068
- Slide-Inhalte aendern
- Deployment / Push
- /setup Auth

## QA-Kriterien
- [ ] `/` ohne Param zeigt die in deck-config.json gespeicherten Default-Slides
- [ ] Kein Flackern/Loading-State beim Pitch-Laden (Server Component)
- [ ] "Set as Default" Button speichert persistent (Server-Neustart ueberlebt)
- [ ] Default-Slides haben visuellen Rahmen + "DEFAULT" Badge auf Setup-Page
- [ ] "Default (Online)" Preset-Button ist ERSTER Button in Preset-Leiste
- [ ] "Default (Online)" zeigt korrekte Anzahl und laedt gespeicherten Default
- [ ] "Default (Online)" aktualisiert sich nach "Set as Default" Klick
- [ ] "Set as Default" nur aktiv wenn Auswahl ≠ Default
- [ ] POST-Fehler zeigt Fehlermeldung in UI (kein stilles Scheitern)
- [ ] Custom Preset erstellen + benennen funktioniert
- [ ] Custom Preset-ID kollidiert NICHT mit Built-in IDs (API gibt 400)
- [ ] `/?preset=name` laedt korrektes Slide-Set
- [ ] `/?slides=a,b,c` funktioniert weiterhin (backward-kompatibel)
- [ ] Built-in Presets nicht editierbar, mit "Built-in" Label
- [ ] Custom Presets loeschbar
- [ ] URL im Footer passt sich korrekt an (clean/preset/slides)
- [ ] Max 10 Custom Presets enforced
- [ ] Fallback wenn deck-config.json fehlt: DEFAULT_SLIDE_IDS aus slides.ts
- [ ] `"version": 1` in deck-config.json vorhanden
- [ ] Reihenfolge in defaultSlideIds bestimmt Render-Reihenfolge
