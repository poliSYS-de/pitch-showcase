# QA Report: T-AC-080 — Brand Assets: Asset Editor

> **QA:** WallE-QA_AgenticCapital_AssetEditor_H_03-26
> **PO:** Bender | **Commit:** 21a011c | **Datum:** 26.03.2026
> **Dateien:** 14 geändert (+2908, -433)
> **Build:** OK (Turbopack, 7 API Routes registriert)

---

## Verdict: NICHT BESTANDEN

**3x P1, 5x P2, 4x P3, 3x P4**

Die P1-Findings sind Security-Schwachstellen (Path Traversal, fehlende Datei-Validierung) und ein Bug in der Rollback-Logik. Diese müssen vor QA-Retest gefixt werden.

---

## P1 — CRITICAL (Blocker)

### F-QA-01 (P1): Path Traversal via filename in Upload-Routes

**Dateien:** `image-processing.ts:42`, `variants/route.ts:72`
**Problem:** User-supplied `file.name` wird direkt in `path.join()` verwendet ohne Sanitization:
```typescript
const originalPath = path.join(fullDir, filename); // VULNERABLE
writeFileSync(originalPath, buffer);
```
Ein Dateiname wie `../../../etc/crontab` würde außerhalb des Zielverzeichnisses schreiben.

**Fix:** `path.basename(filename)` verwenden, BEVOR der Pfad gebaut wird. Zusätzlich den aufgelösten Pfad gegen `PUBLIC_DIR` bounds prüfen.

---

### F-QA-02 (P1): File Type Validation nur via Content-Type Header

**Dateien:** `assets/route.ts:50`, `replace/route.ts:37`, `variants/route.ts:39`
**Problem:** `file.type` ist client-kontrolliert (HTTP Content-Type Header). Ein Angreifer kann eine beliebige Datei mit `Content-Type: image/png` hochladen.

**Fix:** Buffer mit `sharp(buffer).metadata()` validieren — wenn sharp den Buffer nicht lesen kann, ist es kein valides Bild. Bei SVG: Prüfe auf `<svg` Tag im Buffer.

---

### F-QA-03 (P1): Rollback-Logik in Replace-Route berechnet Timestamp neu

**Datei:** `replace/route.ts:88-97`
**Problem:** Im catch-Block wird der Backup-Timestamp neu berechnet statt den gespeicherten Wert zu verwenden:
```typescript
// Zeile 58: const timestamp = Math.floor(Date.now() / 1000);  // Backup erstellt
// Zeile 92: const timestamp = Math.floor(Date.now() / 1000);  // ANDERER Wert!
```
Wenn sharp 1+ Sekunden braucht, findet der Rollback die Backup-Datei nicht → Datenverlust.

**Fix:** `backupPath` Variable aus dem äußeren Scope im catch-Block wiederverwenden (Variable vor dem try-Block definieren).

---

## P2 — IMPORTANT

### F-QA-04 (P2): Keine Category-Whitelist-Validierung

**Datei:** `assets/route.ts:83`
**Problem:** `category` wird gegen `categoryDirs` geprüft mit Fallback `"images/upload"`. Ein ungültiger Wert (z.B. `"admin"`) wird akzeptiert und in assets.json mit falscher Kategorie gespeichert.

**Fix:** `VALID_CATEGORIES` Array + expliziter Check vor Verarbeitung.

---

### F-QA-05 (P2): Keine Escape-Key-Handler in Dialogen

**Dateien:** `AssetLightbox.tsx`, `AssetUploadDialog.tsx`
**Problem:** Beide Dialoge schließen nicht mit Escape-Taste. Das bestehende `SlidePreviewLightbox.tsx` (Zeile 32-46) hat dieses Pattern korrekt implementiert.

**Fix:** `useEffect` mit `keydown` Listener und Escape-Check, analog zu SlidePreviewLightbox.

---

### F-QA-06 (P2): Keine User-sichtbaren Fehlermeldungen in Lightbox

**Datei:** `AssetLightbox.tsx` (alle catch-Blöcke)
**Problem:** Alle API-Fehler werden nur mit `console.error` geloggt. Der CEO sieht keine Fehlermeldung wenn Save/Replace/Status-Change fehlschlägt.

**Fix:** Error-State + Error-Banner im Lightbox-UI (analog zum Upload-Dialog, der hat bereits ein Error-Banner).

---

### F-QA-07 (P2): alert() statt In-Component Error für Dateigrößen-Fehler

**Dateien:** `AssetLightbox.tsx:76,194`
**Problem:** `alert("File too large...")` bricht den UX-Flow. Der Upload-Dialog macht es richtig (Error-State).

**Fix:** Konsistentes Error-Handling via State statt browser-alert.

---

### F-QA-08 (P2): person.name und person.position ohne Length-Validierung im PATCH

**Datei:** `[id]/route.ts:59-62`
**Problem:** `person.position` und `person.name` akzeptieren beliebig lange Strings ohne max-length Check.

**Fix:** Max 60 Zeichen (wie im Lightbox-Input).

---

## P3 — MINOR

### F-QA-09 (P3): Whitespace-only Label passiert Validierung

**Datei:** `[id]/route.ts:37`
**Problem:** `"     "` (nur Leerzeichen) hat `.length > 0` → passiert Check. Sollte `.trim().length` prüfen.

---

### F-QA-10 (P3): deprecatedReason ohne Length-Validierung

**Datei:** `[id]/route.ts:53`
**Problem:** Kein max-length Check für `deprecatedReason`. Kann beliebig langen String speichern.

---

### F-QA-11 (P3): Kein Focus-Trapping in Confirm-Dialog

**Datei:** `AssetLightbox.tsx:472-496`
**Problem:** Tab-Focus kann aus dem Confirm-Dialog zurück in die Lightbox gelangen.

---

### F-QA-12 (P3): Kein Character-Counter für Position-Feld

**Datei:** `AssetLightbox.tsx:371`
**Problem:** Label und Description haben Counter (z.B. "25/60"), Position-Feld nicht.

---

## P4 — COSMETIC

### F-QA-13 (P4): accept="image/*" statt Format-spezifisch

**Datei:** `AssetLightbox.tsx:276`
**Problem:** File-Input sollte `.png,.jpg,.jpeg,.webp,.svg` statt generisch `image/*`.

---

### F-QA-14 (P4): Kein Deprecation-Reason-Eingabefeld

**Datei:** `AssetLightbox.tsx`
**Problem:** Beim Deprecaten kann kein Grund eingegeben werden. `deprecatedReason` wird nur angezeigt wenn vorhanden, aber es gibt kein UI zum Setzen.

---

### F-QA-15 (P4): Error Message Capitalization inkonsistent

**Dateien:** API Routes
**Problem:** Manche Fehlermeldungen lowercase ("file, label, and category are required"), andere uppercase ("Invalid file type").

---

## Migration & Daten: BESTANDEN

| Prüfpunkt | Status |
|-----------|--------|
| 23 Assets korrekt migriert | PASS |
| Variants-Struktur mit isPrimary | PASS |
| assets.ts als Thin Wrapper | PASS |
| getAssetPath() v2 funktional | PASS |
| Alle 7 Helper-Funktionen erhalten | PASS |
| Keine Breaking References (asset.path/format/filename) | PASS |
| next.config.ts bodySizeLimit 6mb | PASS |
| sharp 0.34.5 installiert | PASS |
| Build grün (7 API Routes registriert) | PASS |

---

## Feature-Checkliste (aus Brief)

### Text-Editing: 5/6 PASS
- [x] Edit-Button (Pencil-Icon) sichtbar
- [x] Klick → Felder editierbar
- [x] Save → Persistenz (API call korrekt)
- [x] Cancel → keine Änderung
- [x] max-length Grenzen + Counter
- [ ] **FAIL:** Leeres Label (whitespace-only) passiert Validierung → F-QA-09

### Used in Slides: 4/4 PASS
- [x] Box IMMER sichtbar (View + Edit)
- [x] slideTag + Slide-Label angezeigt
- [x] Impact-Warnung im Edit-Modus
- [x] "Not used in any slide" für Assets ohne Slides

### Image Replace: 7/9 PASS
- [x] Replace-Button in Edit-Modus sichtbar
- [x] File-Picker öffnet sich
- [x] Preview vor dem Speichern
- [x] Confirm-Dialog bei Assets mit usedInSlides > 0
- [x] Cancel → altes Bild bleibt
- [x] Assets ohne Slide-Referenz: kein Confirm
- [x] Max 5MB Validierung
- [ ] **FAIL:** Rollback-Logik kaputt → F-QA-03
- [ ] **FAIL:** Path Traversal via filename → F-QA-01

### Auto-Convert WebP: 6/6 PASS
- [x] Upload speichert 2 Dateien (Original + WebP)
- [x] sharp generiert WebP (max 1200px, quality 80)
- [x] Beide Varianten registriert (Original = isPrimary)
- [x] WebP-Pfad korrekt generiert
- [x] getAssetPath("id") → Original, getAssetPath("id", "webp") → WebP
- [x] WebP-Upload → kein Duplikat

### Multi-Format: 7/8 PASS
- [x] Format-Tabs sichtbar
- [x] Primary-Badge auf Standard-Format
- [x] [+ Add] Tab zum Hinzufügen
- [x] "Set as Primary" Button
- [x] "Delete Variant" (nicht Primary!)
- [x] getAssetPath() ohne Format → Primary
- [x] getAssetPath() mit Format → spezifische Variante
- [x] Migration: 23 Assets → je 1 Variante mit isPrimary: true
- **Hinweis:** Delete Variant funktional korrekt, aber keine Confirm-Abfrage

### New Asset Upload: 9/10 PASS
- [x] "+ New Asset" Button sichtbar
- [x] Upload-Dialog (Drag & Drop + File-Picker)
- [x] Nur Bilder erlaubt, max 5MB
- [x] Metadaten: Label (pflicht), Description, Category (pflicht)
- [x] Team-Checkbox → Person-Felder
- [x] Asset-ID auto-generiert (kebab-case)
- [x] Collision-Check mit Suffix
- [x] Create → Bild + WebP + assets.json
- [x] Neues Asset im Grid (API fetch)
- [ ] **FAIL:** Category nicht gegen Whitelist validiert → F-QA-04

### Status-Management: 7/9 PASS
- [x] Status-Buttons in Edit-Modus sichtbar
- [x] Active → Deprecate (sofort wenn nicht in Slides)
- [x] Confirm-Dialog bei Deprecation + Slides
- [x] Deprecated: getAssetPath() liefert weiterhin Pfad
- [x] Deprecated: console.warn geloggt
- [x] Reserve → Activate: sofort
- [x] Re-activate: deprecated → active
- [ ] **FAIL:** Kein Input für deprecatedReason → F-QA-14 (P4)
- [ ] **FAIL:** KEIN Auto-Deprecation — nicht prüfbar (kein Test-Case im Code)

### Build: 2/2 PASS
- [x] npm run build fehlerfrei
- [x] sharp als Dependency installiert

---

## Zusammenfassung

| Kategorie | PASS | FAIL | Findings |
|-----------|------|------|----------|
| Security | — | 3 | F-QA-01, F-QA-02, F-QA-03 |
| Validation | — | 3 | F-QA-04, F-QA-08, F-QA-09 |
| UX/Accessibility | — | 3 | F-QA-05, F-QA-06, F-QA-07 |
| Polish | — | 3 | F-QA-10, F-QA-11, F-QA-12 |
| Cosmetic | — | 3 | F-QA-13, F-QA-14, F-QA-15 |
| Migration | 9/9 | 0 | — |
| Feature-Checkliste | 47/54 | 7 | — |
| Build | 2/2 | 0 | — |

---

## Retest-Bedingungen

Für **BESTANDEN** müssen gefixt sein:
1. **F-QA-01** — Path Traversal (path.basename Sanitization)
2. **F-QA-02** — File Type Validation (sharp metadata check)
3. **F-QA-03** — Rollback-Logik (backupPath Variable heben)

Empfohlen vor Retest (P2):
4. **F-QA-04** — Category Whitelist
5. **F-QA-05** — Escape Key Handler
6. **F-QA-06** — User-sichtbare Fehlermeldungen

---

*QA: WallE-QA_AgenticCapital_AssetEditor_H_03-26 | 26.03.2026*
