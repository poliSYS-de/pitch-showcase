# T-AC-030: Three Levels of Vibe Trading als eigene Slide

## Problem:
Slide 5 (VibeTradingSlide) hat aktuell ZU VIEL Content — Bullet-Timing + 3 Levels + Trademark + Vision Statement. Passt nicht in eine 100vh Slide.

## Loesung:
VibeTradingSlide aufteilen in ZWEI Slides:

### Slide 5: Vibe Trading — Bullet-Timing (existiert, nur kuerzen)
- Section: 05 / Vibe Trading
- Titel: "MVP Social Trading Platform"
- Links: Bullet-Timing Beschreibung (KUERZEN — nur 1 Absatz)
- Rechts: Bullet-Timing Animation (bereits eingebaut, T-AC-029)
- Trademark-Zeile unten
- ALLES muss in 100vh passen!

### Slide 6: Three Levels of Vibe Trading (NEUE Komponente)
- Neue Datei: src/components/slides/VibeLevelsSlide.tsx
- Section: 06 / Vibe Levels
- Titel: "Three Levels of Vibe Trading"
- 3 Level-Cards: Learn to Vibe, Feel the Vibe, Double Vibe
- Vision Statement darunter
- Standard SlideWrapper + ScrollExitWrapper Pattern

### page.tsx anpassen:
- Import VibeLevelsSlide
- slides Array: nach "vibe-trading" einfuegen: { id: "vibe-levels", label: "Vibe Levels" }
- Render: nach <VibeTradingSlide /> einfuegen: <VibeLevelsSlide />
- ALLE nachfolgenden Slide-Nummern um 1 erhoehen (LFM wird 07, GTM wird 08, etc.)
- Gesamtzahl wird 12 statt 11
