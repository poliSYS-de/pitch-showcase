# T-AC-082 — Documentation Hub: Page + Task Log + DocLightbox

> **Prio:** P1 | **Zugewiesen:** PO (Bender)
> **Konzept:** `docs/KONZEPT-DOCUMENTATION-HUB.md` v1.1 (Sections 2–12, 14, 17)
> **Peer Review:** `docs/PEER-FEEDBACK-DocumentationHub-03-26.md` (FREIGABE MIT AUFLAGEN)
> **Dep:** T-AC-078 (Brand Assets, DONE), T-AC-079 (Hub, DONE)

---

## Scope

Komplette `/setup/docs` Page mit 7 Category Cards, Task Log Parser, DocLightbox, und API Routes.

## Sub-tasks

| # | Task | Referenz |
|---|------|----------|
| 0 | `npm install react-markdown@9 remark-gfm@4` + `docs-registry.json` erstellen + API Routes (task parser + doc reader) + dynamic import setup | Konzept S2, S12, F-PR-01 |
| 1 | `DocLightbox.tsx` — react-markdown Rendering, `next/dynamic` mit `ssr: false`, Arrow-Nav, Escape, Tab-Toggle (Brief/QA) | Konzept S11 |
| 2 | `TaskLogView.tsx` — Parser fuer task-liste.md (4 Sektionen, dynamisches Spalten-Mapping), Filter (All/Completed/Open/QA Failed), Search, Sortierung | Konzept S3, S12, F-PR-02 |
| 3 | `DocCard.tsx` + Docs Hub Page (7 Category Cards, Sub-Views per Card-Type) | Konzept S10 |
| 4 | Hub page + layout update: `comingSoon: true` entfernen fuer Docs Tab | Konzept S13 |

## Kritische Hinweise (aus Peer Review)

1. **F-PR-01 (P1):** DocLightbox MUSS via `next/dynamic({ ssr: false })` geladen werden — react-markdown v9 ist ESM-only
2. **F-PR-02 (P2):** Task-Log Parser: task-liste.md hat 4 Tabellen mit UNTERSCHIEDLICHEN Spalten. Parser muss Header-Zeile lesen und Spalten dynamisch mappen. Bei Fehler: leeres Array + console.warn, KEIN 500
3. **F-PR-03 (P2):** API Route `/api/docs/[filename]`: Extension-Whitelist `.md` und `.pdf` ONLY. Path traversal check: `path.resolve().startsWith(allowedDir)`
4. **F-PR-04 (P2):** docs-registry.json: `single-doc` Kategorien brauchen `defaultDoc` Feld
5. **F-PR-05 (P3):** Status-Normalisierung: "pausiert" → offen, "ERLEDIGT" → bestanden, "QA: BESTANDEN MIT AUFLAGEN" → bestanden-mit-auflagen (Mapping-Tabelle im Konzept S12.1)

## Neue Dateien

| Datei | Typ |
|-------|-----|
| `docs-registry.json` | Config (7 categories) |
| `src/app/api/docs/tasks/route.ts` | API (GET) |
| `src/app/api/docs/[filename]/route.ts` | API (GET) |
| `src/app/setup/docs/page.tsx` | Page (REWRITE) |
| `src/components/setup/DocLightbox.tsx` | Component |
| `src/components/setup/TaskLogView.tsx` | Component |
| `src/components/setup/DocCard.tsx` | Component |

## Modifizierte Dateien

| Datei | Aenderung |
|-------|-----------|
| `package.json` | + react-markdown@9, remark-gfm@4 |
| `src/app/setup/layout.tsx` | `comingSoon: true` entfernen bei Docs |
| `src/app/setup/page.tsx` | Docs Card: "Coming Soon" → Live + Stats |

## Patterns (EINHALTEN)

- JSON-as-Source-of-Truth: docs-registry.json analog zu deck-config.json, assets.json
- Lightbox: DocLightbox analog zu AssetLightbox (Framer Motion AnimatePresence, backdrop blur, ESC)
- API Security: path.basename() + path.resolve().startsWith() + Extension-Whitelist (Pattern aus T-AC-080 V2)
- Dark Theme: slate-900 Background, slate-300 Text, cyan-400 Accents (bestehend)

## Akzeptanzkriterien

→ Konzept Section 17 (QA Criteria) vollstaendig

---

*Brief: PM Robocop | 26.03.2026 | Konzept v1.1*
