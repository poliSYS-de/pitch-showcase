# T-AC-053 — Globaler Kontrast-Fix: text-muted zu hell fuer Beamer-Praesentation

> Prio: P2 | Zugewiesen: PO | Datei: `globals.css` oder Theme-Variablen

## Ist-Zustand

`--color-text-muted` (#71717a) hat ~4.2:1 Kontrast auf dunklem Hintergrund. Auf einem Beamer bei Tageslicht wird das kaum lesbar sein.

### Betroffene Stellen (aus QA-Report F-04):

- VibeLevels Card-Beschreibungen (Slide 06)
- Team-Rollen (Slide 10: "CEO & Co-Founder", "CTO & Co-Founder" etc.)
- Finance-Labels (Slide 09)
- Closing-Kontakt-Labels (Slide 12: "WEBSITE", "PLATFORM" etc.)
- Subtitle-Texte auf mehreren Slides

## Soll-Zustand

- `--color-text-muted` auf helleren Wert aendern (z.B. #9ca3af oder #a1a1aa)
- Oder: betroffene Stellen gezielt mit `text-white/60` statt `text-muted` stylen
- Ziel: WCAG AA Kontrast (>= 4.5:1) auf dunklem Hintergrund

## QA-Pruefkriterien

- [ ] Alle text-muted Stellen haben Kontrast >= 4.5:1 auf dunklem BG
- [ ] Team-Rollen auf Slide 10 lesbar
- [ ] Card-Beschreibungen auf Slide 06 lesbar
- [ ] Finance-Labels auf Slide 09 lesbar
- [ ] Kontakt-Labels auf Slide 12 lesbar
- [ ] Kein Element ist zu hell/zu dominant geworden
