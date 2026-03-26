# T-AC-055 — Slide 06 VibeLevels: Text-Fix + Layout entzerren (Nachbesserung)

> Prio: P1 | Zugewiesen: PO | Datei: `VibeLevelsSlide.tsx`
> Vorgaenger: T-AC-047 (done, Commit 1555c55)

## Aenderung 1: Text-Fix "designators" → "classes"

In der Trademark-Zeile (1-Zeiler aus T-AC-047) steht aktuell:

```
Vibe Trading™ — USPTO review pending | 5 designators incl. streaming video & social networking
```

Aendern in:

```
Vibe Trading™ — USPTO review pending | 5 classes incl. streaming video & social networking
```

Nur das Wort "designators" durch "classes" ersetzen. Sonst nichts am Text aendern.

## Aenderung 2: Layout entzerren — Leerraum unten reduzieren

Die gesamte Slide hat zu viel leeren Raum am unteren Rand. Die 3 Level-Cards + Trademark-Zeile
sollen vertikal besser verteilt werden:

- Mehr Spacing zwischen Headline und Cards
- Mehr Spacing zwischen Cards und Trademark-Zeile
- Kein grosser Leerraum unten — Content soll den Viewport gleichmaessig fuellen
- Eventuell `justify-between` oder `gap` anpassen

## QA-Pruefkriterien

- [ ] Text zeigt "5 classes" statt "5 designators"
- [ ] Restlicher Trademark-Text unveraendert
- [ ] Kein grosser Leerraum am unteren Rand der Slide
- [ ] 3 Level-Cards weiterhin korrekt dargestellt
- [ ] Vertikale Verteilung gleichmaessig (visuell pruefen)
- [ ] Desktop + Mobile pruefen
