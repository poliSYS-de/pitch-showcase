# T-AC-049 — Slide 08 GTM: "Zero Cost" → "Nearly Zero" + Timeline-Text sichtbarer

> Prio: P1 | Zugewiesen: PO | Datei: `GoToMarketSlide.tsx`

## Ist-Zustand

1. Irgendwo auf der Slide steht "$0 zero cost" oder aehnlich — unrealistisch, nichts ist wirklich null.
2. Die Growth Timeline unten ist toll, aber die Schrift ist zu grau und zu klein — schwer lesbar.

## Soll-Zustand

### 1. Text-Korrektur

- Alle Stellen mit "$0", "zero cost", "0 cost" o.ae. aendern zu **"nearly zero"** oder **"near-zero cost"**
- Kein absolutes "zero" — das ist nicht glaubwuerdig

### 2. Growth Timeline sichtbarer

- Schriftfarbe der Timeline-Texte von grau (vermutlich `--color-text-muted`) auf hellere Farbe aendern (z.B. `--color-text-secondary` oder `text-white/70`)
- Schriftgroesse etwas vergroessern (z.B. `text-xs` → `text-sm`)
- Timeline-Dots und -Labels muessen auf dunklem Hintergrund gut lesbar sein

## QA-Pruefkriterien

- [ ] Kein "$0" oder "zero cost" mehr auf Slide 08 sichtbar
- [ ] Stattdessen "nearly zero" / "near-zero cost" oder aehnlich
- [ ] Growth Timeline Text ist heller als vorher (nicht mehr `text-muted` grau)
- [ ] Growth Timeline Text ist groesser als vorher
- [ ] Timeline-Text ist auf dunklem Hintergrund gut lesbar (Kontrast pruefen)
- [ ] Restlicher Slide-Content unveraendert
- [ ] Desktop + Mobile pruefen
