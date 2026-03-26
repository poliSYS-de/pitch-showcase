# T-AC-075 — Slide-Header: slideTag + Label statt Nummer

> Prio: P0 | Zugewiesen: PO | Abhaengigkeit: Nach T-AC-067 (slideTag existiert bereits)

## Kernidee

Auf JEDER Slide steht oben links ein Header. Aktuell: `03 / OPPORTUNITY` (Nummer + Kurzname).
Neu: `MKT-OPP / Market Opportunity` (slideTag + voller Label aus slides.ts).

Die slideTag-ID dient als universeller Identifier — Agents, Setup-Karten und Slides nutzen
dieselbe ID. Wenn Aenderungen gewuenscht werden, wird immer die slideTag-Kombi genannt.

## Format

```
{slideTag} / {label}
```

### Beispiele (alle 19 Slides)

| slideTag | Label | Header oben links |
|----------|-------|-------------------|
| CORE-HERO | Hero | CORE-HERO / Hero |
| CORE-OVER | Corporate Overview | CORE-OVER / Corporate Overview |
| MKT-OPP | Market Opportunity | MKT-OPP / Market Opportunity |
| PROD-DEMO | Product Demo | PROD-DEMO / Product Demo |
| PROD-VIBE | Vibe Trading | PROD-VIBE / Vibe Trading |
| PROD-LVL | Vibe Levels | PROD-LVL / Vibe Levels |
| PROD-LFM | LFM | PROD-LFM / LFM |
| MKT-GTM | Go To Market | MKT-GTM / Go To Market |
| MKT-GROW | Marketing Growth | MKT-GROW / Marketing Growth |
| MKT-SCALE | Full Scale Growth | MKT-SCALE / Full Scale Growth |
| FIN-VAL | Finance | FIN-VAL / Finance |
| TEAM-MAIN | Team | TEAM-MAIN / Team |
| FIN-ASK | The Ask | FIN-ASK / The Ask |
| CORE-CLOSE | Closing | CORE-CLOSE / Closing |
| EX-COMP | Company | EX-COMP / Company |
| EX-FEAT | Features | EX-FEAT / Features |
| EX-PROD | Product (Alt) | EX-PROD / Product (Alt) |
| EX-VIS | Vision | EX-VIS / Vision |
| EX-VIZZ | Visuals | EX-VIZZ / Visuals |

## Aufgaben

### 1. Slide-Komponenten: Header-Text aendern (19 Dateien)

Jede Slide-Komponente hat einen Header oben links (z.B. `<span>03 / OPPORTUNITY</span>`).

- Ersetze die hardcoded Nummer+Kurzname durch Props: `slideTag` + `label`
- Oder: Direkt aus slides.ts Config lesen (wenn Komponente Zugriff hat)
- Format: `{slideTag} / {label}` in Monospace oder bestehender Schrift

Greppen nach Pattern: `\d{2}\s*/\s*` um alle Header-Stellen zu finden.

### 2. Props-Uebergabe

Falls slideTag und label als Props kommen:
- page.tsx / PitchDeckClient: `<Component slideTag={slide.slideTag} label={slide.label} />`
- Lightbox: Gleiche Props durchreichen

### 3. Lightbox-Header synchronisieren

Die Lightbox (T-AC-068) zeigt ebenfalls einen Header. Dieser muss dasselbe Format nutzen:
`{slideTag} / {label}` — nicht die alte Nummer.

### 4. SlideNav (unten links) pruefen

SlideNav zeigt aktuell die dynamische Position (1, 2, 3...). Das kann bleiben —
die Position ist fuer Navigation sinnvoll. Aber der Tooltip oder Hover koennte
den slideTag zeigen.

## NICHT in diesem Ticket
- slideTag-Werte aendern (bleiben wie in slides.ts definiert)
- Setup-Karten aendern (zeigen bereits slideTag)
- SlideNav komplett umbauen

## QA-Kriterien
- [ ] Alle 19 Slides zeigen slideTag + Label oben links
- [ ] Format konsistent: `{TAG} / {Label}` auf jeder Slide
- [ ] Keine hardcoded Nummern mehr in Slide-Headern
- [ ] Lightbox-Header nutzt gleiches Format
- [ ] Setup-Karte und Slide-Header zeigen identische slideTag-ID
- [ ] SlideNav (unten links) funktioniert weiterhin
