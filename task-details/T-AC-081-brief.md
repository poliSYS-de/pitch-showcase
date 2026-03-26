# T-AC-081 — Image Duplication Check + Auto-Dedup

> Erstellt: 26.03.2026 | PM: Robocop | Prio: P2
> Abhängigkeit: T-AC-080 (Multi-Format Architektur)

---

## Problem

Dasselbe Motiv existiert mehrfach als separate Assets mit unterschiedlichen Formaten/Auflösungen.
Aktuell betroffen: Visual 1/2/3 jeweils als PNG + JPG — 6 Registry-Einträge für 3 logische Bilder.
Beide Varianten werden in verschiedenen Slides referenziert, ohne dass sie als "gleiches Asset" erkannt werden.

### Ist-Zustand (Audit 26.03.2026)

| Logisches Asset | Asset-ID (PNG) | Asset-ID (JPG) | PNG Size | JPG Size | Slide (PNG) | Slide (JPG) |
|----------------|---------------|---------------|----------|----------|-------------|-------------|
| Visual 1 | visual-1-png | visual-1-jpg | 1748 KB | 395 KB | EX-VIZZ | PROD-DEMO |
| Visual 2 | visual-2-png | visual-2-jpg | 814 KB | 226 KB | EX-VIZZ | PROD-DEMO |
| Visual 3 | visual-3-png | visual-3-jpg | 831 KB | 238 KB | EX-VIZZ | PROD-DEMO |

**Verschwendeter Speicher:** ~2534 KB redundante Dateien (JPGs sind herunterskalierte Kopien der PNGs)

---

## Ziel

1. **Sofort (mit T-AC-080):** Visual 1/2/3 zu je einem Multi-Format-Asset konsolidieren
2. **Tooling:** Automatischer Duplikat-Check bei jedem Asset-Upload und als Audit-Funktion

---

## Teil 1: Konsolidierung Visual 1/2/3 (in T-AC-080 Scope)

Bei Migration zu `assets.json` Multi-Format:

```
VORHER (6 Einträge):
  visual-1-jpg  → /images/visual1.jpg  → PROD-DEMO
  visual-1-png  → /images/visual1.png  → EX-VIZZ

NACHHER (1 Eintrag, 2 Varianten):
  visual-1:
    variants:
      - { format: "png", path: "/images/visual1.png", isPrimary: true, sizeKB: 1748 }
      - { format: "jpg", path: "/images/visual1.jpg", isPrimary: false, sizeKB: 395 }
    usedInSlides: ["PROD-DEMO", "EX-VIZZ"]
```

Slides werden aktualisiert:
- `ProductDemoSlide.tsx`: `getAssetPath("visual-1", "jpg")` — bevorzugt JPG (kleiner)
- `VisualsSlide.tsx`: `getAssetPath("visual-1", "png")` — bevorzugt PNG (Qualität)

**Fallback:** `getAssetPath("visual-1")` → gibt Primary (PNG) zurück

---

## Teil 2: Automatischer Duplikat-Check (neues Feature)

### Duplikat-Erkennung — Algorithmus

```
Candidate Detection (schnell, kein Pixel-Vergleich):
┌─────────────────────────────────────────────────┐
│ 1. Filename-Stem Match                          │
│    visual1.jpg ↔ visual1.png → MATCH (Stem)     │
│                                                  │
│ 2. Filesize-Ratio Check                         │
│    Wenn Datei A und B selbe Kategorie:          │
│    ratio = min(sizeA, sizeB) / max(sizeA, sizeB)│
│    if ratio > 0.7 → CANDIDATE                   │
│                                                  │
│ 3. Dimensions Match                             │
│    Wenn Breite/Höhe-Verhältnis < 5% Abweichung  │
│    UND beide > 500px → CANDIDATE                │
└─────────────────────────────────────────────────┘
```

### Trigger-Punkte

| Wann | Was |
|------|-----|
| **Upload** | Neues Asset wird hochgeladen → sofort gegen alle existierenden Assets prüfen |
| **Audit** | Manuell auslösbar über `/setup/brand-assets` → "Check Duplicates" Button |
| **Build** | Optional: als Build-Warning (nicht blockierend) |

### UI-Integration

```
┌─────────────────────────────────────────────┐
│ ⚠️ Possible Duplicate Detected              │
│                                              │
│ "visual-upload-new.png" looks similar to:    │
│                                              │
│ ┌──────┐  visual-1 (PNG)                    │
│ │ IMG  │  1748 KB · 1740×1652               │
│ └──────┘  Used in: EX-VIZZ                  │
│                                              │
│ Match reason: Same filename stem + similar   │
│ dimensions (±3%)                             │
│                                              │
│ [ Merge as Variant ] [ Keep Separate ] [ Cancel ] │
└─────────────────────────────────────────────┘
```

**Aktionen:**
- **Merge as Variant** → Fügt als neue Variante zum bestehenden Asset hinzu
- **Keep Separate** → Registriert als eigenes Asset, markiert als "reviewed" (kein erneuter Alert)
- **Cancel** → Upload abbrechen

### API Route

```
GET /api/assets/check-duplicates
  → Prüft alle Assets gegeneinander
  → Returns: { duplicateGroups: [{ primary: AssetID, candidates: AssetID[], reason: string }] }

POST /api/assets/merge
  Body: { primaryId: string, mergeIds: string[] }
  → Konsolidiert zu Multi-Format Asset, aktualisiert Slide-Referenzen
```

### Vergleichs-Indikatoren (Default)

| Indikator | Gewicht | Beschreibung |
|-----------|---------|--------------|
| Filename-Stem | hoch | `visual1.jpg` ↔ `visual1.png` → selber Stem |
| Dateigröße | mittel | Ratio-Vergleich innerhalb selber Kategorie |
| Dimensions | mittel | Aspect-Ratio + Auflösungs-Nähe |
| Kategorie | filter | Nur innerhalb gleicher Kategorie vergleichen |

### Nicht im Scope (Phase 2.5)

- Pixel-Level-Vergleich (perceptual hashing) → Phase 3+
- KI-basierte Ähnlichkeitserkennung → Phase 3+
- Cross-Category Duplikate (z.B. Upload vs. Visual) → manuell

---

## Dateien

| Datei | Aktion |
|-------|--------|
| `src/lib/duplicate-check.ts` | NEU — Duplikat-Algorithmus |
| `src/app/api/assets/check-duplicates/route.ts` | NEU — API Route |
| `src/app/api/assets/merge/route.ts` | NEU — Merge-Endpoint |
| `src/app/setup/brand-assets/page.tsx` | ERWEITERT — "Check Duplicates" Button + Dialog |
| `src/components/DuplicateWarningDialog.tsx` | NEU — Warning-UI bei Upload |

---

## QA-Kriterien

### Konsolidierung (Teil 1)
- [ ] Visual 1/2/3 sind je 1 Asset mit 2 Varianten (PNG primary, JPG secondary)
- [ ] `getAssetPath("visual-1")` → PNG
- [ ] `getAssetPath("visual-1", "jpg")` → JPG
- [ ] PROD-DEMO und EX-VIZZ rendern korrekt
- [ ] Keine verwaisten Asset-IDs in Slides

### Duplikat-Check (Teil 2)
- [ ] Filename-Stem-Match erkennt `visual1.jpg` ↔ `visual1.png`
- [ ] Filesize-Ratio ignoriert drastisch unterschiedliche Größen (z.B. 5KB ↔ 1700KB)
- [ ] Dimensions-Match: ±5% Tolerance funktioniert
- [ ] Upload-Dialog zeigt Duplikat-Warnung
- [ ] "Merge as Variant" erzeugt korrekten Multi-Format-Eintrag
- [ ] "Keep Separate" markiert als reviewed (kein erneuter Alert)
- [ ] Audit-Button findet alle 3 bekannten Duplikat-Paare
- [ ] Build läuft ohne Fehler nach Merge

---

*Ticket-Version: v1.0 | PM: Robocop (26.03.2026)*
