# T-AC-054 — Slide 08 GTM: Timeline-Dots nicht farbig differenziert (T-AC-041 Nachpruefung)

> Prio: P1 | Zugewiesen: QA | Datei: `GoToMarketSlide.tsx`

## Kontext

T-AC-041 hat die CSS-Klassen fuer Timeline-Dots korrigiert (done). Beim visuellen Review am 25.03.2026 zeigen die Timeline-Dots auf Slide 08 aber immer noch keine farbige Differenzierung — Phase 1 sollte Cyan sein, ist aber gleich wie die anderen.

## Aufgabe

QA soll pruefen ob T-AC-041 korrekt umgesetzt wurde:
1. Ist Phase 1 "Community Building" Dot in Cyan?
2. Ist Phase 1 Text in Cyan?
3. Sind inaktive Phasen visuell gedimmt?

Falls NICHT korrekt → neues PO-Ticket mit konkreter Fehlerbeschreibung.

## QA-Pruefkriterien

- [ ] Phase 1 Dot hat Cyan Border
- [ ] Phase 1 Text hat Cyan Farbe
- [ ] Inaktive Phasen (2-4) sind visuell anders als Phase 1
