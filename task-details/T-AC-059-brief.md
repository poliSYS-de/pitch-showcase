# T-AC-059 — Slide 03 MarketOpportunity: Robinhood-Logo einbauen (V3 Komplett-Fix)

> Prio: P0 | Zugewiesen: PO | Datei: `MarketOpportunitySlide.tsx`

## Problem

Die linke Seite von Slide 03 zeigt ZWEI aehnliche Radial-Charts nebeneinander.
Das ist FALSCH. Es fehlt das **Robinhood Feder-Logo**.

Der visuelle Kontrast soll zeigen:
- Robinhood = NUR Trading (kein Information-Kanal)
- Agentiq = Trading UND Information (Radial-Chart mit Daten)

## Mockup-Referenz (PFLICHT — genau so umsetzen!)

Datei: `/public/images/upload/Bildschirmfoto 2026-03-25 um 20.04.28.png`

```
┌──────────────────────────┐  ┌──────────────────────────┐
│  Missing Information     │  │  Social Trading Platform  │
│  Channel                 │  │                          │
│                          │  │  [Reddit] [Roaring Kitty] │
│  Trading    Information  │  │  [Halted Trading]         │
│  ┌────────┐┃┌──────────┐ │  │                          │
│  │ RH     │┃│ Radial   │ │  │  ▶ Bullet-Timing Video   │
│  │ Feder  │┃│ Sunburst │ │  │  ◉ Dynamic Broadcast     │
│  │ Logo   │┃│ Chart    │ │  │  ✦ Vibe Trading          │
│  │(gelb/  │┃│(bunt)    │ │  │                          │
│  │ gruen) │┃│          │ │  │                          │
│  └────────┘┃└──────────┘ │  │                          │
│            ┃             │  │                          │
└──────────────────────────┘  └──────────────────────────┘
             ^
        gruene Trennlinie
```

## Exakte Anforderungen

### Links: "Trading" Label
- Darunter: **Robinhood Feder-Logo** (die stilisierte Feder)
- Logo-Quelle: Entweder aus vorhandenem Asset ODER ein SVG/PNG des RH-Logos erstellen
- Hintergrund: neon-gelb/gruen (#CCFF00 oder aehnlich) als Quadrat/Box hinter dem Logo
- Das Logo muss DEUTLICH als Robinhood erkennbar sein — schwarze Feder auf hellem Hintergrund

### Mitte: Gruene vertikale Trennlinie
- Farbe: `var(--color-accent-green)` oder #00ff88
- Hoehe: gleich hoch wie die beiden Bilder

### Rechts: "Information" Label
- Darunter: **Radial Sunburst Chart** (der bereits vorhandene bunte Chart)
- NUR EINER der beiden aktuellen Charts bleibt — der andere wird durch das RH-Logo ersetzt

### Layout
- Den gesamten vertikalen Platz nutzen — kein grosser Leerraum unten
- Die Bilder sollen groesser sein als aktuell
- Rechte Seite (Social Trading Platform) bleibt unveraendert

## NICHT machen

- KEINE zwei Radial-Charts nebeneinander (das ist der aktuelle Bug!)
- KEIN Venn-Diagramm
- KEINE abstrakten Placeholder-Grafiken

## QA-Pruefkriterien

- [ ] Linke Bildhaelfte zeigt ROBINHOOD FEDER-LOGO (nicht einen Radial-Chart!)
- [ ] RH-Logo auf gelbem/gruenem Hintergrund, gut erkennbar
- [ ] Label "Trading" steht ueber dem RH-Logo
- [ ] Rechte Bildhaelfte zeigt Radial Sunburst Chart
- [ ] Label "Information" steht ueber dem Radial Chart
- [ ] Gruene vertikale Trennlinie zwischen den beiden Bildern
- [ ] Kein grosser Leerraum unten auf der Slide
- [ ] Bilder sind gross genug (mindestens 200px Hoehe)
- [ ] Rechte Seite (Social Trading Platform) unveraendert
- [ ] Visueller Vergleich mit Mockup: `/public/images/upload/Bildschirmfoto 2026-03-25 um 20.04.28.png`
