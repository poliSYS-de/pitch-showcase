# T-AC-076 — 3 fehlende LFM-Deep-Dive-Slides in slides.ts als ACTIVE registrieren

> Prio: P1 | Zugewiesen: PO | Abhaengigkeit: Keine
> Hintergrund: Branch-Audit vor T-AC-069 Cleanup. 22 Slide-Dateien auf master, nur 19 in slides.ts.

## Finding

3 LFM-Deep-Dive-Slides existieren als Dateien in `src/components/slides/` aber sind NICHT in slides.ts registriert:

| Datei | Komponente | Titel auf Slide | Inhalt |
|-------|-----------|----------------|--------|
| LFMConstructionSlide.tsx | LFMConstructionSlide | "LFM: The Construction" | MoE Architecture, Training Costs, Traits Inherited |
| LFMDesignSlide.tsx | LFMDesignSlide | "LFM: The Design" | Financial Modality Pipeline, multimodales Design |
| LFMOpportunitySlide.tsx | LFMOpportunitySlide | "LFM: The Opportunity" | One Integrated System, Product Readiness, Integration |

**NICHT deprecated!** Das sind eigenstaendige Deep-Dive-Slides fuer technische Investoren.
Die bestehende LFMSlide (PROD-LFM) ist der Ueberblick — diese 3 ergaenzen sie mit Details.

Alle 3 haben Framer Motion + GSAP Animationen, deckPosition Prop bereits vorhanden.

## Aufgabe

In `src/config/slides.ts` → `ALL_SLIDES` Array, im ACTIVE Block nach LFMSlide einfuegen:

```ts
// === LFM DEEP-DIVE SLIDES (default OFF — fuer technische Pitches) ===
{ id: "lfm-construction", number: "15", label: "LFM: The Construction", component: "LFMConstructionSlide", category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMC", changelog: "MoE architecture deep-dive" },
{ id: "lfm-design",       number: "16", label: "LFM: The Design",       component: "LFMDesignSlide",       category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMD", changelog: "Financial modality pipeline" },
{ id: "lfm-opportunity",  number: "17", label: "LFM: The Opportunity",  component: "LFMOpportunitySlide",  category: "product", defaultEnabled: false, version: "v1.0", lastUpdated: "2026-03-25", status: "active", slideTag: "PROD-LFMO", changelog: "Integrated system + product readiness" },
```

Wichtig:
- **status: "active"** (nicht deprecated!)
- **category: "product"** (nicht extra!)
- **defaultEnabled: false** — nicht im Default-Pitch, aber ueber Presets/Setup wahlbar
- slideTags: PROD-LFMC, PROD-LFMD, PROD-LFMO (product-Kategorie, nicht EX-)

Ausserdem in `slideComponents.ts` (oder wo SLIDE_COMPONENTS Map definiert ist):
- Imports + Map-Eintraege fuer alle 3 Komponenten hinzufuegen

## Preset-Vorschlag

Optional ein neues Built-in Preset fuer technische Pitches:
```ts
{ id: "tech-deep", name: "Tech Deep Dive", slideIds: ["hero", "overview", "product", "lfm", "lfm-construction", "lfm-design", "lfm-opportunity", "finance", "team", "ask", "closing"] }
```

## Branch-Audit Ergebnis (Referenz fuer T-AC-069)

| Branch | Slides | Unique? |
|--------|--------|---------|
| master | 22 Dateien, 19 in slides.ts | 3 unregistriert (diese hier) |
| feature/10min-pitch-2026 | 22 | KEINE unique — Subset von master |
| origin/maximillian-muhr-marketing | 14 | KEINE unique — Subset von master |
| origin/feb-03-rainierclub | 17 | KEINE unique — Subset von master |
| origin/seo-update | 16 | KEINE unique — Subset von master |
| final-pitch | 17 | KEINE unique — Subset von master |

**Ergebnis: KEIN Branch hat Slides die master nicht hat. Alle Branches sicher loeschbar nach diesem Ticket.**

## QA-Kriterien
- [ ] slides.ts enthaelt 22 Eintraege (17 active + 5 deprecated)
- [ ] `/?preset=all` zeigt 22 Slides
- [ ] Setup-Page zeigt alle 22 Slides (Hide Deprecated OFF)
- [ ] LFM Construction, LFM Design, LFM Opportunity rendern korrekt
- [ ] Slides sind als "active" + "product" kategorisiert (nicht deprecated/extra)
- [ ] slideTag PROD-LFMC, PROD-LFMD, PROD-LFMO auf Karten sichtbar
- [ ] Default-Pitch (ohne Parameter) zeigt weiterhin 14 Slides (LFM Deep-Dives sind defaultEnabled: false)
- [ ] Kein Build-Fehler
