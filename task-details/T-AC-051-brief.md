# T-AC-051 — Slide 11 AskSlide: Content unten abgeschnitten

> Prio: P0 | Zugewiesen: PO | Datei: `AskSlide.tsx`

## Ist-Zustand

Der untere Content von Slide 11 (The Ask) wird abgeschnitten — vermutlich ragt er ueber die Slide-Hoehe (100vh) hinaus und wird durch `overflow: hidden` auf `.slide` abgeschnitten.

## Soll-Zustand

- Gesamter Content muss INNERHALB der Slide sichtbar sein (100vh)
- Spacings, Font-Sizes und/oder Padding reduzieren bis alles reinpasst
- Alle Elemente pruefen: $1.5M, SAFE Terms, Use of Funds, 18-Month Milestones
- Kein Scrollbar, kein Abschneiden

### Moegliche Fixes:

1. Font-Sizes verkleinern (z.B. Ueberschriften, Betraege)
2. Spacings/Margins/Paddings reduzieren
3. Unnoetige Elemente entfernen oder zusammenfassen
4. Grid-Layout kompakter machen

## QA-Pruefkriterien

- [ ] Gesamter Slide-Content ist sichtbar — nichts abgeschnitten
- [ ] Alle Elemente lesbar: $1.5M, SAFE Terms, Use of Funds, Milestones
- [ ] Kein Overflow ueber 100vh hinaus
- [ ] `overflow: hidden` auf `.slide` darf NICHT entfernt werden (Snap-Scroll-Schutz)
- [ ] Desktop (1920x1080 und 1440x900) pruefen
- [ ] Mobile pruefen (< 768px)
- [ ] Kein Bleed in benachbarte Slides (12/Closing)
