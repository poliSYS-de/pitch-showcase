# T-AC-056 — QA: Visual Review aller Bender-PO Commits (Session B, 25.03.)

> Prio: P1 | Zugewiesen: QA (WallE) | Typ: QA-Batch

## Auftrag

Visuelle QA-Pruefung aller erledigten PO-Tasks aus Session B.
Jede Slide einzeln in Chrome oeffnen (http://localhost:3010/), 2-3s warten bis
inView-Animation triggert, dann gegen die QA-Kriterien pruefen.

## Zu pruefende Tasks + Commits

| # | Slide | Beschreibung | Commit | Brief |
|---|-------|-------------|--------|-------|
| T-AC-045 | 03 | RH Logo + Radial Chart statt Venn | 15a4d15 | T-AC-045-brief.md |
| T-AC-046 | 04 | Titel einzeilig + Spacings | 7d1b1ac | T-AC-046-brief.md |
| T-AC-047 | 06 | Trademark 1-Zeiler | 1555c55 | T-AC-047-brief.md |
| T-AC-048 | 07 | Bottom-Text entfernt | 0a14e83 | T-AC-048-brief.md |
| T-AC-049 | 08 | "Nearly Zero" + Timeline heller | 383501e | T-AC-049-brief.md |
| T-AC-050 | 09 | Revenue Chart Animation | b8e38fd | T-AC-050-brief.md |
| T-AC-052 | 09 | Pricing Cutoff Fix | a7f1423 | T-AC-052-brief.md |
| T-AC-053 | Global | Kontrast-Fix text-muted | 34c686e | T-AC-053-brief.md |

## Pruef-Methodik

1. `cd Agentic\ Capital/Dev-pitch-site && pnpm dev` (Port 3010)
2. Fuer jede Slide: Screenshot nehmen, gegen Brief-Kriterien pruefen
3. Ergebnis pro Task: BESTANDEN / NICHT BESTANDEN + Begruendung
4. Globaler Kontrast-Check: Stichprobe 3 beliebige Slides, text-muted Farbe muss >= #a1a1aa sein
5. Snap-Scroll zwischen allen 12 Slides testen — kein Bleed, kein Sprung

## Besondere Achtung

- **T-AC-045:** RH-Logo muss unter "Information" stehen (NICHT unter "Trading"!)
  Falls falsch zugeordnet: NICHT BESTANDEN + neuen PO-Task fordern
- **T-AC-049:** Drei Stellen mit "Nearly Zero" pruefen (Heading, Subtext, Timeline)
- **T-AC-053:** Globaler Effekt — hat Aenderung ggf. andere Farben beeinflusst?

## Output

QA-Report als Markdown:
```
## QA-Report T-AC-056 — [Datum]
| Task | Slide | Ergebnis | Anmerkung |
|------|-------|----------|-----------|
| T-AC-045 | 03 | BESTANDEN/NICHT BESTANDEN | ... |
...
```

Bei NICHT BESTANDEN: Neuen PO-Task vorschlagen mit konkreter Beschreibung.
