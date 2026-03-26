# T-AC-067 — slideTag + deckPosition Refactoring (19 Slide-Komponenten)

> Prio: P1 | Zugewiesen: PO | Abhaengigkeit: Nach T-AC-066
> Konzept: `docs/KONZEPT-SLIDE-ADMIN.md` (v2.1, Sektion 2.2)

## Kernidee

Jede Slide bekommt eine semantische ID (slideTag) und die angezeigte Nummer wird dynamisch
aus der Deck-Position berechnet statt hardcoded zu sein.

## Aufgaben

### 1. slides.ts: slideTag Feld
- SlideConfig Interface: +`slideTag: string`
- Konvention: UPPERCASE, max 10 Zeichen, Format `{KAT}-{VARIANTE}`
- Tags gemaess Tabelle im T-AC-066-brief.md

### 2. 19 Slide-Komponenten: deckPosition Prop
- Jede Komponente: +`deckPosition?: number` Prop
- Hardcoded Nummer ersetzen: `{String(deckPosition ?? 1).padStart(2, "0")} / {LABEL}`
- Greppen nach `\d{2} / ` um alle Stellen zu finden

### 3. page.tsx: deckPosition uebergeben
- `<Component key={slide.id} deckPosition={index + 1} />`

### 4. setup/page.tsx: slideTag anzeigen
- Auf Karten: slideTag statt `#number` anzeigen

## QA-Kriterien
- [ ] Slide-Header zeigt dynamische Position (nicht feste Nummer)
- [ ] `/?slides=hero,team,ask` → Hero=01, Team=02, Ask=03
- [ ] slideTag auf jeder Setup-Karte sichtbar
- [ ] Keine Duplikat-Nummern
- [ ] SlideNav (unten links) weiterhin korrekt
