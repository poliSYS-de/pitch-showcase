# T-AC-047 — Slide 06 VibeLevels: Trademark-Text in Info-Kasten oder kuerzen

> Prio: P1 | Zugewiesen: PO | Datei: `VibeLevelsSlide.tsx`

## Ist-Zustand

Unten auf Slide 06 steht folgender Trademark-Text in grauer Schrift, wirkt verloren:

```
That trademark alone is an enormously valuable asset that supports the
viral distribution of our product. Five provisions. Nobody else can use
the term Vibe Trading in these markets.
Vibe Trading™ currently under review at USPTO — 5 designators incl.
streaming video & social networking
```

Der Text ist zu lang, zu grau, und hat kein visuelles Gewicht.

## Soll-Zustand — zwei Optionen (PO waehlt)

### Option A: Weniger Text (bevorzugt)

Nur die Kernaussage behalten, z.B.:

```
Vibe Trading™ — USPTO review pending | 5 designators incl. streaming video & social networking
```

Einzeilig, kompakt, als dezente Fusszeile.

### Option B: Info-Kasten volle Breite

Den gesamten Text in einen visuell abgegrenzten Kasten packen:
- Volle Breite der Slide (max-w-7xl)
- Dezenter Border oder Hintergrund (z.B. `bg-white/5 border border-white/10 rounded-lg p-4`)
- Kleines TM- oder Shield-Icon links
- Text links-ausgerichtet, kompakt

### In beiden Faellen:

- Kein loses graues Text-Fragment mehr ohne visuellen Container
- Muss sich in das Gesamtlayout der Slide einfuegen (3 Level-Cards darueber)

## Zusatz (25.03. abends): Layout entzerren

Unabhaengig von der Trademark-Loesung: **Die gesamte Slide hat zu viel leeren Raum unten.**
Alle Elemente (Headline, 3 Level-Cards, Trademark-Bereich) sollen vertikal besser verteilt werden,
sodass der verfuegbare Platz gleichmaessig genutzt wird. Mehr Spacing zwischen den Elementen statt
alles oben zu quetschen und unten Leerraum zu lassen.

## QA-Pruefkriterien

- [ ] Trademark-Text ist NICHT mehr als loses graues Fragment sichtbar
- [ ] Entweder: Text ist gekuerzt auf max 1 Zeile ODER in einem Info-Kasten mit Border/BG
- [ ] Info-Kasten (falls Option B) hat volle Breite und ist visuell abgegrenzt
- [ ] Text ist lesbar (nicht zu klein, nicht zu grau)
- [ ] Slide-Layout bleibt stimmig — kein Overflow, 3 Level-Cards weiterhin sichtbar
- [ ] Kein grosser Leerraum unten — Content fuellt die Slide vertikal aus
- [ ] Desktop + Mobile pruefen
