# T-AC-084 — Documentation Hub: User Guides (CEO-Facing)

> **Prio:** P2 | **Zugewiesen:** PO (Bender)
> **Konzept:** `docs/KONZEPT-DOCUMENTATION-HUB.md` v1.1 (Section 5)
> **Dep:** T-AC-082 (Hub Page muss existieren)
> **Parallel zu:** T-AC-083 (Tech Content, KEIN Dep aufeinander)

---

## Scope

2 neue CEO-facing User Guides als Markdown erstellen. Diese erscheinen in Card 3 (User Guides) neben den bestehenden Dokumenten (ANLEITUNG-BRAND-ASSETS.md, Pitch-Preparation-Center-Summary.pdf).

## Dokumente

### 1. `docs/ANLEITUNG-SLIDE-CONFIGURATOR.md`

CEO-Anleitung fuer den Slide Configurator (/setup/slides):
- Was ist der Slide Configurator? (1 Absatz)
- Slides ein-/ausblenden (Schritt-fuer-Schritt mit Screenshots-Beschreibung)
- Reihenfolge aendern (Drag & Drop oder Numbering)
- Presets verwenden (Built-in vs. Custom)
- Custom Preset speichern
- Lightbox-Vorschau nutzen
- Aenderungen live sehen (→ Pitch Deck)

**Ton:** Einfach, direkt, keine technischen Details. CEO = Taban, nutzt Mac/Chrome.
**Referenz:** ANLEITUNG-BRAND-ASSETS.md als Stilvorlage

### 2. `docs/ANLEITUNG-DOCUMENTATION.md`

CEO-Anleitung fuer den Documentation Hub (/setup/docs):
- Was ist der Documentation Hub? (1 Absatz)
- Task Log durchsuchen (Filter, Suche, Lightbox)
- Technische Doku finden (README, Specs)
- PDF herunterladen (CEO Summary)
- QA-Reports einsehen

**Ton:** Gleich wie oben — CEO-facing, keine Dev-Sprache.

## Akzeptanzkriterien

- [ ] Beide Dokumente existieren und sind valides Markdown
- [ ] Kein technischer Jargon (kein "API", "Route", "Component")
- [ ] Schritt-fuer-Schritt Anleitungen mit nummerierten Schritten
- [ ] Konsistenter Stil mit ANLEITUNG-BRAND-ASSETS.md
- [ ] In DocLightbox lesbar (nach T-AC-082 Deploy)

---

*Brief: PM Robocop | 26.03.2026 | Konzept v1.1*
