# T-AC-045 — Slide 03 MarketOpportunity: Linke Seite Grafik ersetzen + Layout entzerren

> Prio: P1 | Zugewiesen: PO | Datei: `MarketOpportunitySlide.tsx`

## Ist-Zustand

1. Linke Seite zeigt ein Venn-Diagramm (Trading / Information / AI) — soll ersetzt werden.
2. Unten auf der Slide ist eine grosse leere Flaeche — Content nutzt den verfuegbaren Platz nicht aus.

## Soll-Zustand

### 1. Linke Seite: Neue Grafik-Komposition

Das Venn-Diagramm wird ersetzt durch eine Komposition aus drei Elementen (wie im Screenshot-Mockup):

- **Robinhood Logo** (neon-gruen auf gelbem Hintergrund) — steht unter **"Information"** (NICHT unter "Trading"!)
- **Vertikale gruene Trennlinie** — Mitte
- **Radial Sunburst Chart** (wie auf Slide 04 / ProductDemo) — steht unter **"Trading"**

**ACHTUNG Zuordnung laut Maximilian (25.03. abends):**
- "Trading" → Radial Sunburst Chart (rechts im Duo)
- "Information" → Robinhood Logo (links im Duo)

Die beiden Bilder stehen nebeneinander, getrennt durch die gruene Linie.

**Mockup-Referenz:** `/public/images/upload/Bildschirmfoto 2026-03-25 um 20.04.28.png`
**Robinhood Logo:** Aus vorhandenen Assets oder von agentiqcapital.com beziehen.

Ueberschrift darueber bleibt: "Missing Information Channel".
Labels "Trading" und "Information" bleiben oberhalb der Bilder positioniert — aber Zuordnung wie oben beschrieben.

### 2. Layout entzerren — ganzen Platz nutzen

- Die gesamte Slide soll den vertikalen Platz besser ausnutzen
- Kein grosser Leerraum unten
- Content (linke Grafik + rechte Feature-Liste) gleichmaessig verteilt
- Spacings zwischen Elementen vergroessern statt alles oben zu quetschen

## QA-Pruefkriterien

- [ ] Venn-Diagramm ist NICHT mehr sichtbar auf Slide 03
- [ ] Linke Seite zeigt: RH-Logo + Trennlinie + Radial-Chart nebeneinander
- [ ] RH-Logo steht unter "Information", Radial-Chart unter "Trading" (NICHT umgekehrt!)
- [ ] Labels "Trading" und "Information" ueber den jeweiligen Bildern
- [ ] Rechte Seite (Social Trading Platform Features) unveraendert
- [ ] Kein grosser Leerraum unten — Content fuellt die Slide vertikal aus
- [ ] Kein Overflow/Bleed (overflow-hidden pruefen)
- [ ] Desktop + Mobile pruefen
- [ ] Bilder laden korrekt (HTTP 200, kein 404)
