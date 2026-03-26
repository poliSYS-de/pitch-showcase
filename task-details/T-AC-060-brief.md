# T-AC-060 — Slide 10 TeamSlide: Alle Fotos auf Comic-Style umstellen

> Prio: P1 | Zugewiesen: PO | Datei: `TeamSlide.tsx`

## Auftrag

Alle Team-Fotos auf der TeamSlide sollen die **Comic-Illustrationen** von agentiqcapital.com/about verwenden, NICHT die LinkedIn-Fotos.

## Vorhandene Comic-Bilder

Pfad: `public/images/team/comic/`

| Person | Datei | Vorhanden? |
|--------|-------|-----------|
| Brian Abbott | `brian-abbott.png` | JA |
| Maximilian Muhr | `maximilian-muhr.png` | JA |
| Paul Capano | `paul-capano.png` | JA |
| Sujit Kapur | `sujit-kapur.png` | JA |
| Johnson Zhu | `johnson-zhu.png` | JA |
| Taban Cosmos | — | NEIN (kein Comic vorhanden) |

## Aenderungen in TeamSlide.tsx

Fuer jeden Eintrag in `teamMembers[]` das `photo`-Feld aendern:

```
Brian Abbott:    "/images/team/comic/brian-abbott.png"
Taban Cosmos:    KEINE Aenderung (bleibt Initialen "TC" bis Comic vorliegt)
Maximilian Muhr: "/images/team/comic/maximilian-muhr.png"
Paul Capano:     "/images/team/comic/paul-capano.png"
Sujit Kapur:     "/images/team/comic/sujit-kapur.png"
Johnson Zhu:     "/images/team/comic/johnson-zhu.png"
```

## QA-Pruefkriterien

- [ ] Alle 5 Fotos zeigen Comic-Illustrationen (NICHT LinkedIn-Fotos)
- [ ] Taban Cosmos zeigt weiterhin Initialen "TC" (kein Foto)
- [ ] Bilder laden korrekt (HTTP 200, kein 404)
- [ ] Bilder sind rund zugeschnitten (border-radius)
- [ ] Kein Bild verzerrt oder zu klein
- [ ] Reihenfolge: CEO (Brian), CTO (Taban), CMO (Max), Paul, Sujit, Johnson
- [ ] Direkt auf main committen
