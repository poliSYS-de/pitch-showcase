# T-AC-044 — Slide 02 CorporateOverview: Timeline-Punkte + Betrags-Boxen Layout

> Prio: P1 | Zugewiesen: PO | Datei: `CorporateOverviewSlide.tsx`

## Ist-Zustand (Bug)

1. Die drei farbigen Timeline-Punkte (gruen/lila/gold) stehen am **linken unteren Rand** der darueber liegenden Phase-Boxen — sollen **mittig unter jeder Box** stehen.
2. Die Betraege ($1–3M, $15–50M, $500M+) stehen **innerhalb** der Phase-Boxen, oberhalb der Punkte.
3. Unter den Punkten ist relativ viel ungenutzter Platz.

## Soll-Zustand

Drei-Ebenen-Layout vertikal:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  MVP /      │  │  LFM        │  │  ASI         │
│  Agentiq    │  │             │  │              │
│  Advisor    │  │             │  │              │
│             │  │             │  │              │
└─────────────┘  └─────────────┘  └─────────────┘
       ●────────────────●────────────────●
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   $1–3M     │  │  $15–50M    │  │   $500M+    │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Konkret:

1. **Punkte zentriert:** Jeder Timeline-Dot steht horizontal mittig unter seiner Phase-Box (nicht links).
2. **Betraege raus aus den Boxen:** $1–3M, $15–50M, $500M+ aus den oberen Phase-Boxen entfernen.
3. **Neue kleine Boxen unterhalb der Punkte:** Drei kleine Boxen (Cards) mit den Betraegen, mittig unter den jeweiligen Punkten. Gleiche Farbe wie der zugehoerige Punkt (gruen/lila/gold).
4. **Verbindungslinie:** Die horizontale Linie zwischen den Punkten bleibt.

## Zusatz (25.03. abends)

5. **Icons durch echte Bilder ersetzen:** Die abstrakten Icons (Kreis, Quadrat, Raute) in den drei Phase-Boxen sollen durch passende Bilder/Logos ersetzt werden (z.B. Agentiq Advisor Logo, LFM Icon, ASI Visual). Bildmaterial ggf. aus `/public/images/` oder von agentiqcapital.com beziehen.

## QA-Pruefkriterien

- [ ] Alle 3 Timeline-Punkte stehen horizontal mittig unter ihrer Phase-Box
- [ ] Betraege ($1–3M, $15–50M, $500M+) sind NICHT mehr in den oberen Phase-Boxen
- [ ] 3 neue kleine Boxen/Cards mit den Betraegen stehen UNTERHALB der Punkte
- [ ] Jede Betrags-Box ist mittig unter ihrem Punkt positioniert
- [ ] Farben stimmen: gruen ($1–3M), lila ($15–50M), gold ($500M+)
- [ ] Verbindungslinie zwischen den Punkten vorhanden
- [ ] Kein Overflow/Bleed auf der Slide (overflow-hidden beachten)
- [ ] Desktop + Mobile (< 768px) pruefen
- [ ] Abstrakte Icons (Kreis/Quadrat/Raute) durch echte Bilder/Logos ersetzt
- [ ] Bilder visuell passend und nicht verzerrt
