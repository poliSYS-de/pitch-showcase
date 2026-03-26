# T-AC-048 — Slide 07 LFM: Bottom-Text "$15 Million Opportunity" entfernen

> Prio: P1 | Zugewiesen: PO | Datei: `LFMSlide.tsx`

## Ist-Zustand

Unten auf Slide 07 steht ein redundanter Textblock:

```
The $15 Million Opportunity
The LFM represents our Phase 2 — a purpose-built financial AI that goes
beyond sentiment analysis into true numerical reasoning about markets.
```

Dieser Text wiederholt, was bereits oben auf der Slide steht. Wirkt redundant.

## Soll-Zustand

- Den gesamten Block ("The $15 Million Opportunity" + Beschreibungstext) entfernen
- Frei gewordenen Platz fuer bessere Verteilung des restlichen Contents nutzen (Spacings anpassen)
- Restlicher Slide-Content bleibt unveraendert

## QA-Pruefkriterien

- [ ] Text "The $15 Million Opportunity" ist NICHT mehr sichtbar auf Slide 07
- [ ] Begleittext "The LFM represents our Phase 2..." ist NICHT mehr sichtbar
- [ ] Restlicher Content (Bar-Chart, Density-Vergleich, Metriken) weiterhin vorhanden
- [ ] Kein grosser Leerraum unten — Spacings angepasst
- [ ] Kein Overflow/Bleed
