# T-AC-058 — Slide 11 AskSlide: Betrag aktualisieren auf "$1.5M up to 3M"

> Prio: P1 | Zugewiesen: PO | Datei: `AskSlide.tsx`

## Ist-Zustand

Der Betrag auf der AskSlide zeigt aktuell einen anderen Wert (ggf. nur $1.5M oder einen festen Betrag).

## Soll-Zustand

- Der Haupt-Ask-Betrag soll lauten: **"$1.5M up to $3M"**
- Der Betrag soll klar als Range dargestellt werden, nicht als fester Wert
- Pruefen ob der Text im Hero-Bereich der Slide oder in einer Sub-Section steht und entsprechend anpassen

## QA-Pruefkriterien

- [ ] AskSlide zeigt "$1.5M up to $3M" als Betrag (oder aequivalente Formulierung mit Range)
- [ ] Kein alter Betrag mehr sichtbar
- [ ] Text passt ins Layout (kein Overflow, kein Umbruch an falscher Stelle)
- [ ] Desktop + Mobile pruefen
- [ ] Betrag stimmt mit Pitch-Script V2 ueberein (pitch-script-10min-v2.md pruefen und ggf. dort auch aktualisieren)
