# T-AC-078 — Brand Assets Registry + Asset-ID Referenzsystem + /setup/brand-assets

> Prio: P1 | Zugewiesen: PO | Abhaengigkeit: Keine
> Kernproblem: Bilder sind hardcoded in Slide-Komponenten. Beim Austausch eines Fotos
> gehen Slides kaputt. Loesung: Slides referenzieren Asset-IDs statt Dateipfade.

## Kernidee

**Single Source of Truth fuer alle Brand-Assets.**

Aktuell: Slides haben hardcoded Pfade wie `src="/images/team/comic/brian-abbott.png"`.
Beim Bildtausch muss jede Slide manuell angepasst werden → fehleranfaellig, gestern kaputt gegangen.

Neu: Slides referenzieren eine Asset-ID → `getAssetPath("team-brian-comic")`.
Beim Bildtausch wird NUR der Pfad in der Registry geaendert → alle Slides zeigen sofort das neue Bild.

## Aktueller Zustand: 12 hardcoded Image-Referenzen

| Slide | Komponente | Images | Pfade |
|-------|-----------|--------|-------|
| TEAM-MAIN | TeamSlide.tsx | 6x Team-Comic | `/images/team/comic/{name}.png` |
| PROD-DEMO | ProductDemoSlide.tsx | 3x Visuals | `/images/visual1-3.jpg` |
| EX-VIZZ | VisualsSlide.tsx | 3x Visuals | `/images/visual1-3.png` |

## Aufgaben

### Phase 1: Asset-Registry (assets.ts)

**1.1 Interface:**
```ts
export interface BrandAsset {
  id: string;                    // unique kebab-case z.B. "team-brian-comic"
  path: string;                  // relativer Pfad ab public/ z.B. "/images/team/comic/brian-abbott.png"
  filename: string;              // Dateiname
  category: "logo" | "team" | "graphic" | "visual" | "icon";
  label: string;                 // Anzeigename z.B. "Brian Abbott (Comic)"
  description: string;           // Kurzbeschreibung z.B. "Co-Founder, comic illustration"
  status: "active" | "deprecated";
  person?: {
    name: string;                // z.B. "Brian Abbott"
    position: string;            // z.B. "Co-Founder & CTO"
    active: boolean;             // false = ehemaliger Mitarbeiter
  };
  format: "png" | "jpg" | "jpeg" | "svg" | "webp";
  dimensions?: string;
  sizeKB?: number;
  addedDate: string;
  deprecatedDate?: string;
  deprecatedReason?: string;
  usedInSlides?: string[];       // slideTag-Referenzen z.B. ["TEAM-MAIN"]
}

// Helper-Funktion: Asset-Pfad ueber ID auflösen
export function getAssetPath(assetId: string): string {
  const asset = ALL_ASSETS.find(a => a.id === assetId);
  if (!asset) {
    console.warn(`Asset not found: ${assetId}`);
    return "/images/placeholder.png"; // Fallback statt Crash
  }
  return asset.path;
}

// Helper: Alle Assets einer Person (comic + linkedin + ...)
export function getPersonAssets(personName: string): BrandAsset[] {
  return ALL_ASSETS.filter(a => a.person?.name === personName);
}
```

**1.2 Alle bestehenden Assets registrieren:**

```ts
export const ALL_ASSETS: BrandAsset[] = [
  // === TEAM: Comic ===
  { id: "team-brian-comic",      path: "/images/team/comic/brian-abbott.png",      filename: "brian-abbott.png",      category: "team", label: "Brian Abbott (Comic)",      description: "Co-Founder & CTO, comic illustration",      status: "active", person: { name: "Brian Abbott",      position: "Co-Founder & CTO",      active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  { id: "team-maximilian-comic", path: "/images/team/comic/maximilian-muhr.png",   filename: "maximilian-muhr.png",  category: "team", label: "Maximilian Muhr (Comic)",   description: "CEO & Co-Founder, comic illustration",   status: "active", person: { name: "Maximilian Muhr",   position: "CEO & Co-Founder",   active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  { id: "team-taban-comic",      path: "/images/team/comic/taban-cosmos.png",      filename: "taban-cosmos.png",     category: "team", label: "Taban Cosmos (Comic)",      description: "Team member, comic illustration",        status: "active", person: { name: "Taban Cosmos",      position: "Team",               active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  { id: "team-paul-comic",       path: "/images/team/comic/paul-capano.png",       filename: "paul-capano.png",      category: "team", label: "Paul Capano (Comic)",       description: "Team member, comic illustration",        status: "active", person: { name: "Paul Capano",       position: "Team",               active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  { id: "team-sujit-comic",      path: "/images/team/comic/sujit-kapur.png",       filename: "sujit-kapur.png",      category: "team", label: "Sujit Kapur (Comic)",       description: "Team member, comic illustration",        status: "active", person: { name: "Sujit Kapur",       position: "Team",               active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  { id: "team-johnson-comic",    path: "/images/team/comic/johnson-zhu.png",       filename: "johnson-zhu.png",      category: "team", label: "Johnson Zhu (Comic)",       description: "Team member, comic illustration",        status: "active", person: { name: "Johnson Zhu",       position: "Team",               active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: ["TEAM-MAIN"] },
  // === TEAM: LinkedIn ===
  { id: "team-brian-linkedin",      path: "/images/team/linkedin/brian-abbott.jpg",    filename: "brian-abbott.jpg",    category: "team", label: "Brian Abbott (LinkedIn)",    description: "Professional photo", status: "active", person: { name: "Brian Abbott",      position: "Co-Founder & CTO",   active: true }, format: "jpg", addedDate: "2026-03-25", usedInSlides: [] },
  { id: "team-maximilian-linkedin", path: "/images/team/linkedin/maximilian-muhr.png", filename: "maximilian-muhr.png", category: "team", label: "Maximilian Muhr (LinkedIn)", description: "Professional photo", status: "active", person: { name: "Maximilian Muhr",   position: "CEO & Co-Founder",   active: true }, format: "png", addedDate: "2026-03-25", usedInSlides: [] },
  { id: "team-taban-linkedin",      path: "/images/team/linkedin/taban-cosmos.jpg",    filename: "taban-cosmos.jpg",    category: "team", label: "Taban Cosmos (LinkedIn)",    description: "Professional photo", status: "active", person: { name: "Taban Cosmos",      position: "Team",               active: true }, format: "jpg", addedDate: "2026-03-25", usedInSlides: [] },
  { id: "team-sujit-linkedin",      path: "/images/team/linkedin/sujit-kapur.jpg",     filename: "sujit-kapur.jpg",    category: "team", label: "Sujit Kapur (LinkedIn)",     description: "Professional photo", status: "active", person: { name: "Sujit Kapur",       position: "Team",               active: true }, format: "jpg", addedDate: "2026-03-25", usedInSlides: [] },
  { id: "team-johnson-linkedin",    path: "/images/team/linkedin/johnson-zhu.jpg",     filename: "johnson-zhu.jpg",    category: "team", label: "Johnson Zhu (LinkedIn)",     description: "Professional photo", status: "active", person: { name: "Johnson Zhu",       position: "Team",               active: true }, format: "jpg", addedDate: "2026-03-25", usedInSlides: [] },
  // HINWEIS: paul-capano LinkedIn-Foto FEHLT!
  // === VISUALS ===
  { id: "visual-1-jpg", path: "/images/visual1.jpg", filename: "visual1.jpg", category: "visual", label: "Visual 1", description: "Product screenshot / mockup", status: "active", format: "jpg", addedDate: "2026-03-25", usedInSlides: ["PROD-DEMO"] },
  { id: "visual-2-jpg", path: "/images/visual2.jpg", filename: "visual2.jpg", category: "visual", label: "Visual 2", description: "Product screenshot / mockup", status: "active", format: "jpg", addedDate: "2026-03-25", usedInSlides: ["PROD-DEMO"] },
  { id: "visual-3-jpg", path: "/images/visual3.jpg", filename: "visual3.jpg", category: "visual", label: "Visual 3", description: "Product screenshot / mockup", status: "active", format: "jpg", addedDate: "2026-03-25", usedInSlides: ["PROD-DEMO"] },
  { id: "visual-1-png", path: "/images/visual1.png", filename: "visual1.png", category: "visual", label: "Visual 1 (PNG)", description: "Product screenshot / mockup (PNG variant)", status: "active", format: "png", addedDate: "2026-03-25", usedInSlides: ["EX-VIZZ"] },
  { id: "visual-2-png", path: "/images/visual2.png", filename: "visual2.png", category: "visual", label: "Visual 2 (PNG)", description: "Product screenshot / mockup (PNG variant)", status: "active", format: "png", addedDate: "2026-03-25", usedInSlides: ["EX-VIZZ"] },
  { id: "visual-3-png", path: "/images/visual3.png", filename: "visual3.png", category: "visual", label: "Visual 3 (PNG)", description: "Product screenshot / mockup (PNG variant)", status: "active", format: "png", addedDate: "2026-03-25", usedInSlides: ["EX-VIZZ"] },
];
```

### Phase 2: Slides umstellen — Asset-IDs statt hardcoded Pfade

**DAS ist der kritische Schritt: Slides zeigen NICHT kaputt wenn ein Bild getauscht wird.**

**2.1 TeamSlide.tsx refactoren:**

VORHER (hardcoded, fragil):
```tsx
const team = [
  { name: "Brian Abbott", role: "Co-Founder & CTO", photo: "/images/team/comic/brian-abbott.png" },
  ...
];
```

NACHHER (Asset-ID basiert, robust):
```tsx
import { getAssetPath } from "@/config/assets";

const team = [
  { name: "Brian Abbott", role: "Co-Founder & CTO", photo: getAssetPath("team-brian-comic") },
  ...
];
```

**2.2 ProductDemoSlide.tsx refactoren:**

VORHER: `src="/images/visual1.jpg"`
NACHHER: `src={getAssetPath("visual-1-jpg")}`

**2.3 VisualsSlide.tsx refactoren:**

VORHER: `src="/images/visual1.png"`
NACHHER: `src={getAssetPath("visual-1-png")}`

**2.4 Workflow beim Bildtausch (fuer zukuenftige Aenderungen):**
1. Neues Bild in den richtigen Ordner legen
2. In assets.ts: `path` des betreffenden Assets aktualisieren
3. FERTIG — alle Slides die diese Asset-ID nutzen zeigen sofort das neue Bild
4. Kein Slide-Code muss angefasst werden!

### Phase 3: /setup/brand-assets Page

**3.1 Route: `src/app/setup/brand-assets/page.tsx`**
- Client Component (interaktiv)
- Liest ALL_ASSETS direkt (kein API noetig fuer v1)

**3.2 Layout:**
- Kategorie-Filter (Logo, Team, Graphic, Visual, Icon)
- Toggle: "Show Deprecated"
- Grid mit Asset-Karten

**3.3 Asset-Karte:**
```
┌─────────────────────────┐
│  [Image Preview]        │
│                         │
├─────────────────────────┤
│  TEAM  Active           │  ← Kategorie + Status Badges
│  Brian Abbott            │  ← Person.name
│  Co-Founder & CTO       │  ← Person.position
│  Comic-Illustration     │  ← description
│  Used in: TEAM-MAIN     │  ← slideTag-Referenzen
│  400x400 · 45KB · PNG   │  ← Technische Metadaten
└─────────────────────────┘
```

- Deprecated Assets: Roter "DEPRECATED" Badge + Grund
- Ehemalige Mitarbeiter: `person.active=false` → visuell markiert (ausgegraut + "Former" Label)
- Klick auf Karte → Lightbox mit grosser Vorschau

**3.4 "Replace Image" Button auf Karte (Phase 3b, optional):**
- Oeffnet File-Picker
- Ersetzt die Datei, aktualisiert path in assets.ts
- Alle Slides aktualisieren sich automatisch (weil Asset-ID gleich bleibt)

### Phase 4: Navigation

- Tab-Navigation auf /setup: `Slides | Brand Assets`
- Breadcrumb: Setup > Brand Assets

## NICHT in diesem Ticket
- CDN-Integration
- Automatische Image-Optimierung (WebP)
- Drag & Drop Upload

## QA-Kriterien
- [ ] assets.ts enthaelt alle bestehenden Images (mindestens 17 Assets)
- [ ] getAssetPath() gibt korrekten Pfad zurueck
- [ ] getAssetPath() mit unbekannter ID gibt Placeholder zurueck (kein Crash!)
- [ ] TeamSlide nutzt getAssetPath() statt hardcoded Pfade
- [ ] ProductDemoSlide nutzt getAssetPath() statt hardcoded Pfade
- [ ] VisualsSlide nutzt getAssetPath() statt hardcoded Pfade
- [ ] Alle 3 Slides rendern korrekt nach Refactoring (kein visueller Unterschied)
- [ ] Bildtausch-Test: path in assets.ts aendern → Slide zeigt neues Bild
- [ ] /setup/brand-assets zeigt alle Assets als Karten-Grid
- [ ] Kategorie-Filter funktioniert
- [ ] Team-Assets zeigen Name + Position
- [ ] Deprecated-Assets mit rotem Badge
- [ ] usedInSlides zeigt korrekte slideTag-Referenzen
- [ ] paul-capano LinkedIn-Foto als fehlend dokumentiert
- [ ] Kein Build-Fehler
