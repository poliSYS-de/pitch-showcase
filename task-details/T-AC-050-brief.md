# T-AC-050 — Slide 09 Finance: Revenue-Chart Animation (einmaliger Aufbau)

> Prio: P2 | Zugewiesen: PO | Datei: `FinanceSlide.tsx`

## Ist-Zustand

Revenue Projection Chart (5-Year Forecast) wird sofort komplett sichtbar angezeigt — statisch, keine Animation.

## Soll-Zustand

Einmaliger Aufbau der Chart-Linie + Punkte + Zahlen (wie Slide 05 VibeTradingSlide):

### Ablauf der Animation:

1. Chart startet leer
2. **Y1-Punkt** erscheint → Linie waechst von links bis Y1 → Punkt blendet ein → unten blendet "$1.5M / 25K users" ein
3. **Y2-Punkt** erscheint → Linie waechst weiter bis Y2 → Punkt blendet ein → "$5M / 100K users" blendet ein
4. **Y3-Punkt** → Linie → Punkt → "$15M / 250K users"
5. **Y4-Punkt** → Linie → Punkt → "$35M / 600K users"
6. **Y5-Punkt** → Linie → Punkt → "$60M / 1M users"

### Technische Vorgaben:

- **Kein Loop** — einmaliger Aufbau, danach bleibt alles sichtbar
- Trigger: `useInView` mit `amount: 0.2` (wie alle anderen Slides)
- Geschwindigkeit: ~500-800ms pro Punkt (gesamt ~3-4s)
- Linie waechst smooth (SVG stroke-dashoffset Animation oder aehnlich)
- Punkte: fade-in + scale-up
- Zahlen unten: fade-in synchron mit dem jeweiligen Punkt
- Gold-Gradient unter der Linie (Area Fill) kann optional mitlaufen

### Referenz:

Slide 05 VibeTradingSlide hat eine aehnliche Animation (GrowthChart Komponente mit phase-basiertem Aufbau). Kann als Pattern-Vorlage dienen.

## QA-Pruefkriterien

- [ ] Chart ist NICHT sofort komplett sichtbar beim Laden
- [ ] Linie baut sich schrittweise von Y1 bis Y5 auf
- [ ] Jeder Punkt (Y1-Y5) erscheint nacheinander mit Animation
- [ ] Zahlen unterhalb ($1.5M–$60M + User-Counts) blenden synchron mit Punkten ein
- [ ] Animation laeuft nur EINMAL (kein Loop)
- [ ] Animation triggert bei Scroll-in-View (useInView)
- [ ] Nach Animation: alle 5 Punkte + Linie + Zahlen dauerhaft sichtbar
- [ ] Restlicher Slide-Content (Projections-Tabelle, TAM etc.) unveraendert
- [ ] Kein Overflow/Bleed
