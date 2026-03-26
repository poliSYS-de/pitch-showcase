# T-AC-038 — Visual Review aller 12 Slides

> **QA:** WallE-QA_AgenticCapital_SlidesQA_03-25
> **Datum:** 25.03.2026
> **Branch:** feature/10min-pitch-2026
> **Server:** localhost:3010 (Next.js 16.1.4, Turbopack)
> **Build:** Kompiliert fehlerfrei (TypeScript OK, Static Generation OK)

---

## Slide-by-Slide Review

| # | Slide | Status | Findings |
|---|-------|--------|----------|
| — | HeroSlide | PASS | Logo AGENTIQ/CAPITAL, Tagline, Scroll-Indikator, ParticleField, Bellevue WA Badge |
| 02 | CorporateOverview | PASS | 3 Phase-Karten (MVP/$1-3M, LFM/$15-50M, ASI/$500M+), Timeline-Dots, kein Overlap |
| 03 | MarketOpportunity | PASS | Venn-Diagramm (Trading/Intelligence/AI), Feature-Liste rechts, Bottom-Callout |
| 04 | ProductDemo (Visuals) | PASS* | 3 Bilder (visual1/2/3.jpg, alle HTTP 200), Labels vorhanden. *Siehe F-01 |
| 05 | VibeTradingSlide | PASS | Bullet-Timing-Chart-Animation, 2 Bullet Points, Trademark-Notice |
| 06 | VibeLevelsSlide | PASS | 3 Level-Cards (Learn/Feel/Double Vibe), Vision-Statement |
| 07 | LFMSlide | PASS* | Bar-Chart, 5x Density, Continuity-Metrik. *Siehe F-02 |
| 08 | GoToMarketSlide | **FAIL** | **P1 BUG:** Timeline-Dots + Text-Farben kaputt. Siehe F-03 |
| 09 | FinanceSlide | PASS* | Revenue-Chart, Projections-Tabelle, GTM-Goals, TAM. *Siehe F-02 |
| 10 | TeamSlide | PASS | 6 Members: Brian, Maximilian, Paul, Sujit, Johnson, Tobin |
| 11 | AskSlide | PASS* | $1.5M, SAFE Terms, Use of Funds, Milestones. *Siehe F-02 |
| 12 | ClosingSlide | PASS | Logo, Tagline, 4 Kontakt-Karten, ParticleField |

---

## Findings

### F-03 — P1: GoToMarketSlide Timeline CSS-Klassen KAPUTT

**Datei:** `GoToMarketSlide.tsx:169-172, 184-187`
**Problem:** Dynamische Klassen nutzen CSS-Variable-Namen statt Tailwind-Klassen:
```jsx
// FALSCH (generiert Klasse "--color-accent-cyan"):
className={`... ${item.status === "active" ? "--color-accent-cyan" : "--color-obsidian"}`}

// RICHTIG waere:
className={`... ${item.status === "active" ? "border-[var(--color-accent-cyan)]" : "border-[var(--color-obsidian)]"}`}
```
**Betrifft:**
- Zeile 169-172: Timeline-Dot border-color (aktiver Dot hat keine cyan Border)
- Zeile 184-187: Timeline-Action text-color (aktiver Text hat keine cyan Farbe)
**Auswirkung:** Timeline-Dots und -Text werden in Standardfarbe (weiss) angezeigt statt farbig differenziert. Visuell: Phase 1 nicht als "aktiv" erkennbar.

### F-02 — P2: Fehlende px-4 Padding auf 5 Slides (Mobile)

**Betrifft:** ProductDemoSlide, LFMSlide, GoToMarketSlide, FinanceSlide, AskSlide
**Problem:** `max-w-7xl mx-auto w-full` OHNE `px-4 md:px-8` — Content kann auf Mobile am Bildschirmrand kleben.
**Vergleich:** CorporateOverview, MarketOpportunity, VibeTradingSlide, TeamSlide, VibeLevelsSlide haben `px-4 md:px-8`.
**Auswirkung:** Auf Geraeten < 768px: Content ohne seitlichen Abstand. Auf Desktop: kein Problem wegen max-w-7xl.

### F-01 — P3: ProductDemo Labels weichen von Aufgabenstellung ab

**Aufgabe:** "Fundamentals/Market/Technicals" Labels gross darunter
**Tatsaechlich:** "Balance Sheet Visualization", "Advanced Market Analysis", "Financial Performance Metrics"
**Hinweis:** Moeglicherweise bewusste Aenderung durch PM/PO. Kein Code-Bug, nur Abweichung von Spec.

### F-04 — P3: text-muted Kontrast grenzwertig

**Problem:** `--color-text-muted` (#71717a) hat ~4.2:1 Kontrast auf dunklem Hintergrund.
**Stellen:** VibeLevels Card-Beschreibungen, Team-Rollen, Finance-Labels, Closing-Kontakt-Labels.
**WCAG:** Besteht AA knapp, verfehlt AAA. Fuer Pitch-Praesentation auf Beamer ggf. schwer lesbar.

### F-05 — P3: Slide-Nummern korrekt (02-12)

Alle 12 Slides korrekt nummeriert: Hero (unnummeriert), 02/Overview, 03/Opportunity, 04/Visuals, 05/Vibe Trading, 06/Vibe Levels, 07/LFM, 08/GTM, 09/Finance, 10/Team, 11/The Ask, 12/Close.

### F-06 — P3: Lockfile-Warning (Doppelte Lockfiles)

Next.js warnt ueber package-lock.json + pnpm-lock.yaml. Empfehlung: eines entfernen.

---

## Zusammenfassung

| Prio | Anzahl | Details |
|------|--------|---------|
| P0 | 0 | — |
| P1 | 1 | F-03: GTM Timeline CSS-Klassen |
| P2 | 1 | F-02: 5 Slides ohne Mobile-Padding |
| P3 | 3 | F-01: Labels, F-04: Kontrast, F-06: Lockfiles |

**Ergebnis: BESTANDEN MIT AUFLAGEN**
- P1 (F-03) muss vor Praesentation gefixt werden
- P2 (F-02) sollte vor Mobile-Nutzung gefixt werden

---

## Technische Details

- `amount: 0.2` auf allen 12 Slides (T-AC-035 bestaetigt)
- `.slide` hat `overflow: hidden` (T-AC-036 bestaetigt)
- `scroll-snap-type: y mandatory` auf html
- `scroll-snap-align: start` + `scroll-snap-stop: always` auf .slide
- SlideWrapper: `once: true, amount: 0` (Section-Level-Animation)
- Build: 0 TypeScript-Errors, 0 Compile-Warnings
