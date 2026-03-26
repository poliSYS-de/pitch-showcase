# T-AC-046 — Slide 04 ProductDemo: Titel einzeilig + Spacings vergroessern

> Prio: P1 | Zugewiesen: PO | Datei: `ProductDemoSlide.tsx`

## Ist-Zustand

1. Hauptueberschrift "Agentiq Advisor" steht auf zwei Zeilen (mit `<br />`-Tag aus T-AC-025).
2. Slide hat zu wenig Abstaende — Content sitzt zu kompakt, unten bleibt leerer Platz.

## Soll-Zustand

### 1. Titel einzeilig

- "Agentiq Advisor" auf EINER Zeile (kein Zeilenumbruch)
- Das `<br />` Tag zwischen "Agentiq" und "Advisor" entfernen
- Font-Size ggf. anpassen damit es einzeilig passt

### 2. Spacings vergroessern

- Mehr Abstand zwischen Titel und Bildern
- Mehr Abstand zwischen Bildern und Labels (Fundamentals/Market/Technicals)
- Mehr Abstand zwischen Section-Label (04 / Product) und Titel
- Ziel: Content fuellt die gesamte Slide gleichmaessig aus, kein grosser Leerraum unten
- Restlicher Content bleibt wie er ist ("sonst ist alles super")

## QA-Pruefkriterien

- [ ] "Agentiq Advisor" steht auf EINER Zeile (kein Umbruch)
- [ ] Kein `<br />` oder `\n` im Titel-String
- [ ] Spacings zwischen Elementen sind groesser als vorher
- [ ] Content fuellt die Slide vertikal aus — kein grosser Leerraum unten
- [ ] Bilder und Labels sind weiterhin sichtbar und korrekt
- [ ] Kein Overflow/Bleed
- [ ] Desktop + Mobile pruefen
