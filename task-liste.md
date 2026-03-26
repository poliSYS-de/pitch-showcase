# Task-Liste — Agentic Capital

> Letztes Update: 26.03.2026 | PM: Robocop-PM_AgenticCapital_Configurator_D_03-26
> Status: Phase 3.0 Documentation Hub. Konzept v1.1 APPROVED. T-AC-082/083/084 erstellt. T-AC-082 (Hub) ist naechster PO-Task.
> QA-Workflow: PO setzt Task auf "ready for QA" → QA zieht selbststaendig aus dieser Liste.

## Offen

| # | Task | Prio | Zugewiesen | Status | V# | Notiz |
|---|------|------|-----------|--------|-----|-------|
| T-AC-001 | Admin: Offene Fragen F-AC-01–F-AC-09 beantworten | P0 | Admin | offen | 0 | → claude.md#offene-fragen |
| T-AC-014 | Slides Content Update: 10min-Pitch auf Dev-pitch-site | P0 | PM | pausiert | 1 | Ab jetzt direkt auf main |
| T-AC-066 | Configurator v2: Persistente Defaults + Custom Presets | P0 | Bender | QA: BESTANDEN MIT AUFLAGEN | 3 | 1P2 Lightbox deckPosition, 2P3 |
| T-AC-067 | slideTag + deckPosition Refactoring (19 Slides) | P0 | Bender | QA: BESTANDEN MIT AUFLAGEN | 1 | P2 betrifft Lightbox aus T-AC-068 |
| T-AC-068 | Preview-Thumbnails + Lightbox (Live-Slide) | P0 | Bender | QA: BESTANDEN MIT AUFLAGEN | 2 | 1P2: Lightbox ohne deckPosition |
| T-AC-002 | Pitch-PDF inhaltlich mit Slides abgleichen | P1 | frei | offen | 0 | Welche Slides fehlen/veraltet? |
| T-AC-004 | Alle 13 Slides auf Vollstaendigkeit pruefen | P1 | frei | offen | 0 | Content vs. Pitch-PDF vergleichen |
| T-AC-005 | HeroSlide: Content + Animation-Review | P2 | frei | offen | 0 | Erster Eindruck entscheidend |
| T-AC-006 | FinanceSlide: Valuation/Projections eintragen | P2 | frei | offen | 0 | Zahlen aus PDF uebernehmen |
| T-AC-007 | AskSlide: Term-Sheet-Inhalte aktualisieren | P2 | frei | offen | 0 | Konkrete Investment-Anfrage |
| T-AC-008 | Mobile-Responsiveness aller Slides testen | P2 | frei | offen | 0 | < 768px Breakpoint |
| T-AC-009 | Hosting/Deploy-Setup (Vercel o.ae.) aufsetzen | P2 | frei | offen | 0 | Abhaengig von F-AC-03 |
| T-AC-010 | PPTX-Inhalte mit Dev-pitch-site Slides synchen | P3 | frei | offen | 0 | old-Presentation.pptx als Referenz |
| T-AC-011 | Status.md + peer-log.md anlegen | P3 | frei | offen | 0 | V3-Dateien vervollstaendigen |
| T-AC-012 | de/ Konzepte (CLevel Dashboard, Tracking) einordnen | P3 | frei | offen | 0 | Separates Projekt? Scope klaeren |
| T-AC-013 | PROJEKT-UEBERSICHT.md: Agentic Capital eintragen | P3 | PM | offen | 0 | Nach Admin-Feedback |
| T-AC-069 | Git Branch Cleanup: nur main+master+final-pitch | P1 | DevOps (T800) | ERLEDIGT 26.03. | 1 | 4 del, origin/bca = CEO VS Code, später löschen |
| T-AC-078 | Brand Assets Registry + /setup/brand-assets Page | P1 | Bender | QA: BESTANDEN MIT AUFLAGEN | 1 | 1P2 (23/25 Assets), 1P3 (LinkedIn-Foto) |
| T-AC-079 | Pitch Prep Center: Hub Page + Tab Nav + Route Migration | P1 | Bender | QA: BESTANDEN MIT AUFLAGEN | 1 | 1P2 (Mobile Dropdown), 2P3 (TabNav, Redirect) |
| T-AC-080 | Brand Assets: Edit + Replace + Multi-Format + Auto-WebP | P1 | Bender | QA: BESTANDEN MIT AUFLAGEN | 2 | V2: 2P2 (Auth+Race), 2P3 (sizeKB+Wizard) |
| T-AC-081 | Image Duplication Check + Auto-Dedup | P2 | PO | offen | 0 | → task-details/T-AC-081-brief.md, Dep: T-AC-080 |
| T-AC-082 | Docs Hub: Page + Task Log + DocLightbox + API | P1 | Bender | ready for QA | 1 | Commit 45bfd00, 7 Cards + TaskLog + Lightbox + 2 APIs |
| T-AC-083 | Docs Content: README + QA Strategy + Agent System | P2 | Bender | offen | 0 | → task-details/T-AC-083-brief.md, Dep: T-AC-082 |
| T-AC-084 | Docs Content: User Guides (CEO-Facing) | P2 | Bender | offen | 0 | → task-details/T-AC-084-brief.md, Dep: T-AC-082 |
| T-AC-085 | Deploy: Full Demo http://23.88.59.57:3010 | P1 | T800 | ERLEDIGT 26.03. | 1 | 6/6 Routes OK, Phase 2: HTTPS+Subdomain |

## In Arbeit

| # | Task | PO-ID | Begonnen | V# | Notiz |
|---|------|-------|----------|-----|-------|
| — | — | — | — | — | — |

## Ready for QA

| # | Task | PO-ID | Datum | Notiz |
|---|------|-------|-------|-------|
| T-AC-082 | Docs Hub: Page + Task Log + DocLightbox + API | Bender | 26.03.2026 | Commit 45bfd00, 11 Files, Build OK |
| T-AC-080 | Brand Assets: Edit+Replace+Multi-Format+WebP | Bender | 26.03.2026 | V2 QA: BESTANDEN MIT AUFLAGEN (2P2, 2P3) |
| T-AC-079 | Pitch Prep Center: Hub + Tab Nav + Migration | Bender | 26.03.2026 | QA: BESTANDEN MIT AUFLAGEN (1P2, 2P3) |
| T-AC-078 | Brand Assets Registry + /setup/brand-assets | Bender | 26.03.2026 | QA: BESTANDEN MIT AUFLAGEN (1P2, 1P3) |
| T-AC-066 | Configurator v2 | Bender | 26.03.2026 | BESTANDEN MIT AUFLAGEN (1P2, 2P3) |
| T-AC-067 | slideTag + deckPosition | Bender | 26.03.2026 | BESTANDEN MIT AUFLAGEN (P2 in Lightbox) |
| T-AC-068 | Thumbnails + Lightbox | Bender | 26.03.2026 | BESTANDEN MIT AUFLAGEN (1P2, 2P3) |

## Erledigt (letzte 15)

| # | Task | PO-ID | Datum | Notiz |
|---|------|-------|-------|-------|
| T-AC-077 | Preview-Screenshots Update (22 Slides) | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-076 | 3 LFM-Deep-Dive-Slides registriert | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-075 | Slide-Header: slideTag + Label statt Nummer | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-074 | Bugfix: Lightbox slideTag Props | Bender | 26.03.2026 | QA BESTANDEN (in T-AC-075) |
| T-AC-073 | Deprecated-Label rot auf Karten | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-072 | Hide Deprecated Default OFF | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-071 | Card-Layout Changelog/Version getauscht | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-070 | Setup-Page UI: Preset-Layout + Card-Redesign | Bender | 26.03.2026 | QA BESTANDEN |
| T-AC-065 | Slide Configurator: Setup-Page + URL-Params | Bender | 26.03.2026 | Commit 5a0452a |
| T-AC-064 | Slide 11: Users 1M + Revenue $60M ARR | Brian | 26.03.2026 | Commit 3ee6ee9 |
| T-AC-063 | Slide 03: Sunburst inline SVG verifiziert | Bender | 26.03.2026 | Via T-AC-059, Commit a88cd36 |
| T-AC-062 | Slide 10: Taban Cosmos Comic eingebunden | Brian | 26.03.2026 | Commit e3b1a61 |
| T-AC-061 | Slide 02: Text groesser + Images Update | Brian | 26.03.2026 | Commit e3b1a61 |
| T-AC-039 | DevOps: Branch-Reset + final-pitch | Bender | 26.03.2026 | Branch final-pitch auf e3b1a61 |
| T-AC-059 | Slide 03: RH Feder-Logo + Sunburst V3 | Bender | 25.03.2026 | Commit a88cd36 |

> Aeltere erledigte Tasks: → task-liste-archiv.md

---

## Kompakt-Regeln (Hard-Limits!)

| Regel | Limit |
|-------|-------|
| Max Zeilen Hauptliste | **400** (bei Ueberschreitung: SOFORT archivieren!) |
| Max Zeichen Notiz-Spalte | **80** (mehr → `task-details/T-AC-brief.md`) |
| Max Tasks in "Erledigt" | **15** (aeltere → `task-liste-archiv.md`) |

---

*Template-Version: v4.0 | PM: Robocop (24.03.2026)*
