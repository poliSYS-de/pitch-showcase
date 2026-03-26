# T-AC-069 — Git Branch Cleanup

> Prio: P0 | Zugewiesen: DevOps (T800) | Abhaengigkeit: SOFORT (vor PO-Arbeit)
> Repo: `Agentic Capital/Dev-pitch-site/` → github.com/AgentiqCapital/Dev-pitch-site.git

## Ziel

Nach Abschluss aller PO-Arbeit: Branches aufraeumen.
Am Ende sollen NUR diese 3 Branches existieren (lokal + remote):

### Behalten

| Branch | Zweck |
|--------|-------|
| `main` | Neuer Haupt-Branch mit T-AC-066/067/068 |
| `master` | Alter Stand, NICHT loeschen — CEO entscheidet spaeter |
| `final-pitch` | Backup-Branch von 25.03. (Commit e3b1a61) |

### Loeschen (lokal + remote) — ERST NACH SLIDE-AUDIT!

| Branch | Unique Commits | Risiko | Typ |
|--------|---------------|--------|-----|
| `feature/10min-pitch-2026` | 5 (Merges+Fixes, 22 Slide-Diffs) | PRUEFEN | lokal + remote |
| `seo-update` | 0 | Sicher | lokal + remote |
| `feb-03-rainierclub` | 0 | Sicher | nur remote |
| `maximillian-muhr-marketing` | 1 (slide-previews, alle Slides) | PRUEFEN | nur remote |

## Aufgaben

### 1. SLIDE-AUDIT (PFLICHT vor jeder Loeschung!)

**Ziel:** Sicherstellen dass KEIN Slide-Content verloren geht. Slides die nur auf
diesen Branches existieren muessen in `main` integriert werden — ggf. als `deprecated`.

**1.1 feature/10min-pitch-2026:**
```bash
git diff main..feature/10min-pitch-2026 -- 'src/components/slides/' --stat
```
- Pro Slide-Datei: Inhaltlich vergleichen mit main-Version
- Enthaelt der Branch Slide-Varianten die in main FEHLEN?
- JA → In main als deprecated Slide uebernehmen (slides.ts: `status: 'deprecated'`)
- NEIN (nur aeltere Versionen) → Sicher loeschbar

**1.2 maximillian-muhr-marketing:**
```bash
git diff main..origin/maximillian-muhr-marketing -- 'src/components/slides/' --stat
git diff main..origin/maximillian-muhr-marketing -- 'public/images/' --stat
```
- Dieser Branch enthaelt slide-previews/, team-images, PitchDeckClient.tsx, api/config/route.ts
- Pruefen ob das PO-Arbeit ist die bereits in main enthalten ist (wahrscheinlich ja)
- Pruefen ob unique Assets (Bilder, Scripts) existieren die in main fehlen
- JA → Cherry-pick oder manuell uebernehmen
- NEIN → Sicher loeschbar

**1.3 Audit-Report schreiben:**
- Ergebnis in task-liste.md Notiz dokumentieren (max 80 Zeichen)
- Falls Slides uebernommen: Commit `chore: integrate slides from legacy branches before cleanup`

### 2. Sicherheits-Check VOR Loeschung
- `git log main..feature/10min-pitch-2026 --oneline` — ungemergte Commits?
- `git log main..origin/maximillian-muhr-marketing --oneline` — ungemergte Commits?
- Falls relevanter Code NICHT in main: STOPP → PM informieren!

### 3. Lokale Branches loeschen
```bash
git checkout main
git branch -d feature/10min-pitch-2026
git branch -d seo-update
```
(`-d` nicht `-D` — schlaegt fehl wenn nicht gemergt → Sicherheit!)

### 4. Remote Branches loeschen
```bash
git push origin --delete feature/10min-pitch-2026
git push origin --delete seo-update
git push origin --delete feb-03-rainierclub
git push origin --delete maximillian-muhr-marketing
```

### 5. Remote Default-Branch Hinweis
- GitHub Default-Branch ist aktuell `master`
- NICHT aendern — CEO entscheidet ob main Default wird
- Hinweis in task-liste.md dokumentieren

### 6. Verifizierung
```bash
git branch -a
```
Erwartetes Ergebnis:
```
* main
  master
  final-pitch
  remotes/origin/main
  remotes/origin/master
  remotes/origin/final-pitch
  remotes/origin/HEAD -> origin/master
```

## QA-Kriterien
- [ ] Slide-Audit durchgefuehrt fuer feature/10min-pitch-2026
- [ ] Slide-Audit durchgefuehrt fuer maximillian-muhr-marketing
- [ ] Kein Slide-Content verloren (integriert oder bewusst verworfen)
- [ ] Nur 3 Branches lokal: main, master, final-pitch
- [ ] Nur 3 Branches remote: main, master, final-pitch (+ HEAD)
- [ ] master unangetastet (gleicher HEAD wie vorher)
- [ ] final-pitch unangetastet (Commit e3b1a61)
