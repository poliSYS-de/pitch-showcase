# T-AC-080 — Brand Assets: Inline Editing + Image Replace + Multi-Format in Lightbox

> Prio: P1 | Zugewiesen: PO | Abhaengigkeit: T-AC-078 (assets.ts muss existieren)

## Anforderung (CEO-Request)

Wenn ein Asset in der Lightbox geoeffnet wird, soll der CEO:
1. **Text-Felder editieren** koennen (Label, Description) — z.B. "Visual 1" → "Product Dashboard Screenshot"
2. **Das Bild selbst austauschen** koennen — "Replace Image" Button, neues Bild hochladen, altes wird ersetzt
3. **Mehrere Formate pro Asset** verwalten koennen — ein Asset hat ein Original (PNG) plus optionale Varianten (WebP, JPG)

Alles ohne Code anzufassen. Die Asset-ID bleibt stabil — alle Slides die dieses Asset referenzieren
zeigen automatisch das neue Bild.

4. **Neue Assets hochladen** koennen — "+ New Asset" Button auf der Brand Assets Page
5. **Assets deprecaten/aktivieren** koennen — Status-Management mit Impact-Warnung

## Umsetzung

### Lightbox Edit-Modus

1. **Edit-Button** in der Lightbox (Pencil-Icon, oben rechts neben Close)
2. Klick auf Edit → Felder werden zu Input/Textarea:
   - `label` → Text-Input (max 60 Zeichen)
   - `description` → Textarea (max 200 Zeichen)
   - `person.position` → Text-Input (nur bei Team-Assets)
3. **Save-Button** → schreibt Aenderung in assets.ts (ueber API-Route)
4. **Cancel-Button** → verwirft Aenderungen, zurueck zur Ansicht

### API-Route

```
PATCH /api/assets/:assetId
Body: { label?: string, description?: string, person?: { position?: string } }
```

- Validierung: assetId muss existieren, Felder max-length
- Schreibt direkt in assets.ts (gleicher Ansatz wie deck-config.json)
- Alternativ: assets.json als Datenspeicher (einfacher zu parsen/schreiben)

### Lightbox Layout: View-Modus vs Edit-Modus

**View-Modus** (Standard beim Oeffnen):
```
┌────────────────────────────────────────────────────┐
│  [X Close]                              [✏ Edit]   │
│                                                     │
│  ┌───────────────────────────────────┐              │
│  │                                   │              │
│  │         [Image Preview]           │              │
│  │                                   │              │
│  └───────────────────────────────────┘              │
│                                                     │
│  Brian Abbott (Comic)                               │
│  Co-Founder & CTO, comic illustration               │
│  Status: ● Active    Format: PNG    45 KB           │
│                                                     │
│  ┌─ Used in Slides ─────────────────────────────┐   │
│  │  🎬 TEAM-MAIN — "The Dream Team"             │   │
│  │  (Aenderungen an diesem Asset betreffen       │   │
│  │   diese Slide!)                               │   │
│  └───────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

**Edit-Modus** (nach Klick auf ✏ Edit):
```
┌────────────────────────────────────────────────────┐
│  [Cancel]                              [💾 Save]    │
│                                                     │
│  ┌───────────────────────────────────┐              │
│  │         [Image Preview]           │              │
│  │                                   │              │
│  │      [🔄 Replace Image]          │              │
│  └───────────────────────────────────┘              │
│                                                     │
│  Label: [Brian Abbott (Comic)_______]  ← editierbar │
│  Desc:  [Co-Founder & CTO, comic____]  ← editierbar│
│  Position: [Co-Founder & CTO________]  ← editierbar│
│                                                     │
│  ⚠️ This asset is used in 1 slide:                  │
│  🎬 TEAM-MAIN — Changes will be visible instantly!  │
│                                                     │
│  Status: ● Active    Format: PNG    45 KB           │
└────────────────────────────────────────────────────┘
```

Die "Used in Slides" Box ist IMMER sichtbar (View + Edit). Im Edit-Modus wird sie zur
**Impact-Warnung**: "Changes will be visible instantly in these slides!"
Damit sieht der CEO BEVOR er speichert, welche Slides betroffen sind.

### Image Replace (WordPress Media Library Pattern)

Vorbild: WordPress Media Library — Bild anklicken, Detailansicht, "Replace Image" Button.

1. **"Replace Image" Button** in der Lightbox (unterhalb des Bildes oder als Icon-Overlay)
2. Klick → nativer File-Picker oeffnet sich (`<input type="file" accept="image/*">`)
3. Neues Bild wird hochgeladen:
   - Datei wird in den GLEICHEN Ordner gespeichert (z.B. `/images/team/comic/`)
   - Dateiname kann sich aendern (z.B. `brian-abbott-v2.png`)
   - `path` in assets.ts wird automatisch aktualisiert
   - `format` wird aus der neuen Datei gelesen (png/jpg/webp)
   - `dimensions` und `sizeKB` werden aktualisiert
   - `id` bleibt GLEICH → alle Slides zeigen sofort das neue Bild
4. **Preview** vor dem Speichern: Neues Bild wird in der Lightbox als Vorschau angezeigt
5. **Confirm-Dialog** (PFLICHT bei Assets die in Slides verwendet werden):
   ```
   ⚠️ This image is used in LIVE slides!

   Affected slides:
   🎬 TEAM-MAIN — "The Dream Team"

   Replacing this image will change how your pitch deck
   looks for investors. Are you sure?

   [Cancel]  [Yes, replace image]
   ```
   - Dialog NUR bei Assets mit `usedInSlides.length > 0`
   - Assets ohne Slide-Referenz: Direkt ersetzen (kein Dialog noetig)

### API-Route fuer Image Upload

```
POST /api/assets/:assetId/replace
Content-Type: multipart/form-data
Body: { file: File }
Response: { success: true, asset: BrandAsset (updated) }
```

- Validierung: Nur Bild-Formate (png, jpg, jpeg, webp, svg)
- Max-Groesse: 5MB
- Alte Datei wird NICHT geloescht (Backup), sondern umbenannt: `{name}.backup.{ext}`
- Neue Datei wird gespeichert + Auto-Convert WebP (siehe Pipeline oben)
- Beide Varianten (Original + WebP) werden in assets.ts registriert
- Bestehende Varianten des gleichen Formats werden ueberschrieben

### Multi-Format pro Asset (NEUE Architektur)

**Problem:** Aktuell hat jedes Asset genau 1 Format (PNG). Fuer Performance (WebP) und
Kompatibilitaet (JPG Fallback) brauchen wir mehrere Formate pro Asset.

**Loesung:** Ein Asset = eine logische Einheit mit 1 Original + N Format-Varianten.

#### BrandAsset Interface Erweiterung

```typescript
// ALT (v1 — ERSETZEN):
export interface BrandAsset {
  format: "png" | "jpg" | "jpeg" | "svg" | "webp";  // einzelnes Format
  path: string;                                        // einzelner Pfad
  // ...
}

// NEU (v2 — Multi-Format):
export interface AssetVariant {
  format: "png" | "jpg" | "jpeg" | "svg" | "webp";
  path: string;                    // z.B. "/images/team/comic/brian-abbott.webp"
  sizeKB?: number;
  dimensions?: string;             // z.B. "400x400"
  isPrimary: boolean;              // true = wird standardmaessig in Slides angezeigt
}

export interface BrandAsset {
  id: string;                      // "team-brian-comic" — bleibt stabil
  variants: AssetVariant[];        // mind. 1 (Original), beliebig viele weitere
  category: "logo" | "team" | "graphic" | "visual" | "icon" | "upload";
  label: string;
  description: string;
  status: "active" | "deprecated" | "reserve";
  person?: { name: string; position: string; active: boolean };
  usedInSlides?: string[];
  addedDate: string;
  // ...
}
```

#### getAssetPath() Erweiterung

```typescript
// Standard: gibt Primary-Format zurueck (fuer Slides)
export function getAssetPath(assetId: string): string {
  const asset = ALL_ASSETS.find(a => a.id === assetId);
  if (!asset) return "/images/placeholder.png";
  const primary = asset.variants.find(v => v.isPrimary) || asset.variants[0];
  return primary.path;
}

// NEU: bestimmtes Format anfordern (mit Fallback auf Primary)
export function getAssetPath(assetId: string, preferredFormat?: string): string {
  const asset = ALL_ASSETS.find(a => a.id === assetId);
  if (!asset) return "/images/placeholder.png";
  if (preferredFormat) {
    const variant = asset.variants.find(v => v.format === preferredFormat);
    if (variant) return variant.path;
  }
  const primary = asset.variants.find(v => v.isPrimary) || asset.variants[0];
  return primary.path;
}

// Beispiel-Aufrufe:
getAssetPath("team-brian-comic")          // → /images/team/comic/brian-abbott.png (Primary)
getAssetPath("team-brian-comic", "webp")  // → /images/team/comic/brian-abbott.webp
getAssetPath("team-brian-comic", "jpg")   // → /images/team/comic/brian-abbott.jpg
getAssetPath("team-brian-comic", "avif")  // → Fallback auf Primary (kein AVIF vorhanden)
```

#### Lightbox: Format-Tabs

In der Lightbox werden alle Varianten eines Assets angezeigt:

```
┌────────────────────────────────────────────────────┐
│  Brian Abbott (Comic)                    [✏] [X]   │
│                                                     │
│  Formats:  [PNG ✓primary]  [WebP]  [JPG]  [+ Add]  │
│            ~~~~~~~~~~~~~~~~~~~~~~~~~~               │
│  ┌───────────────────────────────────┐              │
│  │                                   │              │
│  │    [aktive Variante Preview]      │              │
│  │                                   │              │
│  └───────────────────────────────────┘              │
│  45 KB · 400×400 · PNG                              │
│                                                     │
│  ┌─ Used in Slides ─────────────────┐               │
│  │  🎬 TEAM-MAIN (uses: PNG)        │               │
│  └───────────────────────────────────┘              │
└────────────────────────────────────────────────────┘
```

- **Format-Tabs:** Klick wechselt die Vorschau auf die jeweilige Variante
- **Primary-Badge:** Ein ✓ markiert das Standardformat (das in Slides genutzt wird)
- **[+ Add]:** Oeffnet File-Picker fuer neues Format (z.B. WebP-Variante hochladen)
- **Im Edit-Modus:** "Set as Primary" Button pro Tab + "Delete Variant" (nicht fuer Primary!)

#### Migration: Bestehende Assets → Multi-Format

Bestehende 23 Assets haben jeweils 1 Format → wird zu:
```typescript
// ALT
{ id: "team-brian-comic", path: "/images/...", format: "png" }

// NEU (automatische Migration)
{ id: "team-brian-comic", variants: [
  { format: "png", path: "/images/team/comic/brian-abbott.png", isPrimary: true, sizeKB: 45 }
] }
```

Jedes bestehende Asset bekommt 1 Variante mit `isPrimary: true`. Weitere Formate
werden spaeter ueber die Lightbox hinzugefuegt.

#### Auto-Convert Pipeline (bei JEDEM Upload)

Jeder Bild-Upload (egal ob Replace oder Add Variant) durchlaeuft automatisch:

```
Upload: brian-abbott-v2.png (1.2 MB, 2400x2400)
    │
    ├── 1. Original speichern → /images/team/comic/brian-abbott-v2.png
    │   └── Variante: { format: "png", isPrimary: true, sizeKB: 1200 }
    │
    └── 2. Auto-Convert WebP → /images/team/comic/brian-abbott-v2.webp
        ├── Resize: max 1200px Breite (Aspect Ratio beibehalten)
        ├── Quality: 80
        ├── Tool: sharp (npm package)
        └── Variante: { format: "webp", isPrimary: false, sizeKB: ~180 }
```

- **Immer 2 Dateien** pro Upload (ausser Upload ist bereits WebP → nur 1)
- CEO muss nichts extra tun — WebP wird automatisch erzeugt
- Spaeter kann Primary auf WebP gewechselt werden (fuer Performance)
- Dependency: `npm install sharp`

#### API-Route fuer Format-Variante hinzufuegen

```
POST /api/assets/:assetId/variants
Content-Type: multipart/form-data
Body: { file: File, isPrimary?: boolean }
Response: { success: true, asset: BrandAsset (updated with new variant) }
```

#### API-Route fuer Primary wechseln

```
PATCH /api/assets/:assetId/variants/:format/primary
Response: { success: true }
```

→ Setzt `isPrimary: true` auf die gewaehlte Variante, alle anderen auf `false`.
→ Slides zeigen sofort das neue Primary-Format (naechster Page-Load).

### Neues Asset hinzufuegen (Upload Button auf Brand Assets Page)

Auf der `/setup/brand-assets` Page fehlt aktuell ein "Add Asset" Button.

#### UI: "+ New Asset" Button

Position: Oben rechts auf der Brand Assets Page, neben der Suchleiste.

```
┌─ Brand Assets ────────────────────────────────────┐
│  [All] [Team] [Logo] [Visual] [...]   🔍 Search   │
│                                      [+ New Asset] │
│                                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐              │
│  │ img │  │ img │  │ img │  │ img │  ...           │
│  └─────┘  └─────┘  └─────┘  └─────┘              │
└─────────────────────────────────────────────────────┘
```

#### Upload-Flow (3 Schritte)

**Schritt 1: Bild hochladen**
```
┌─ New Asset ───────────────────────────────────────┐
│                                                     │
│  ┌───────────────────────────────────┐              │
│  │                                   │              │
│  │   📁 Drop image here or click    │              │
│  │      to browse                    │              │
│  │                                   │              │
│  │   Accepted: PNG, JPG, WebP, SVG   │              │
│  │   Max: 5 MB                       │              │
│  └───────────────────────────────────┘              │
│                                                     │
│  [Cancel]                                           │
└─────────────────────────────────────────────────────┘
```

**Schritt 2: Metadaten eingeben**
```
┌─ New Asset ───────────────────────────────────────┐
│                                                     │
│  ┌──────────┐  Label: [Company Logo__________]     │
│  │ preview  │  Description: [Main brand logo_]     │
│  │          │  Category: [▼ Logo            ]      │
│  └──────────┘                                       │
│                                                     │
│  ☐ This is a team member photo                      │
│     → Name: [________________]                      │
│     → Position: [____________]                      │
│                                                     │
│  Asset-ID (auto): company-logo                      │
│  (generiert aus Label, kebab-case, editierbar)      │
│                                                     │
│  [Cancel]                            [Create Asset] │
└─────────────────────────────────────────────────────┘
```

**Schritt 3: Auto-Processing**
- Bild wird in `/public/images/{category}/` gespeichert
- WebP-Variante wird automatisch generiert (Auto-Convert Pipeline)
- Asset wird in assets.ts registriert (status: "active")
- Seite aktualisiert sich → neues Asset erscheint im Grid

#### Asset-ID Generierung

```typescript
// Aus Label automatisch generieren:
"Company Logo"        → "company-logo"
"Brian Abbott (New)"  → "brian-abbott-new"
"Visual Dashboard v2" → "visual-dashboard-v2"

// Collision-Check: wenn ID existiert → Suffix "-2", "-3" etc.
// CEO kann ID im Formular ueberschreiben (aber muss kebab-case sein)
```

#### API-Route

```
POST /api/assets
Content-Type: multipart/form-data
Body: {
  file: File,
  label: string,
  description: string,
  category: "logo" | "team" | "graphic" | "visual" | "icon" | "upload",
  person?: { name: string, position: string, active: boolean }
}
Response: { success: true, asset: BrandAsset (new, with auto-generated WebP variant) }
```

- Validierung: Label pflicht, Category pflicht, Bild pflicht
- ID wird aus Label generiert (oder custom)
- Auto-Convert WebP Pipeline laeuft
- Beide Varianten werden registriert

### Status-Management (Deprecate / Activate / Reserve)

#### Buttons in der Lightbox (Edit-Modus)

Je nach aktuellem Status werden unterschiedliche Aktionen angeboten:

| Aktueller Status | Verfuegbare Aktionen |
|------------------|---------------------|
| **Active** | → [Deprecate] [Set Reserve] |
| **Deprecated** | → [Re-activate] [Set Reserve] |
| **Reserve** | → [Activate] [Deprecate] |

#### Deprecation-Regeln

1. **Asset in 0 Slides → sofort deprecaten** (kein Confirm noetig)
2. **Asset in aktiven Slides → Confirm-Dialog PFLICHT:**
```
⚠️ This asset is used in LIVE slides!

Affected slides:
🎬 TEAM-MAIN — "The Dream Team"

Deprecating this asset will:
- Show a ⚠️ warning overlay on the asset in affected slides
- NOT remove the image (slides still render)
- Flag this asset for replacement

[Cancel]  [Yes, deprecate]
```
3. **Deprecated Assets in Slides:**
   - `getAssetPath()` liefert weiterhin den Pfad (KEIN Crash, KEIN Placeholder)
   - `console.warn("Asset deprecated: {id}")` wird geloggt
   - Brand Assets UI zeigt das Asset rot markiert mit Hinweis:
     "⚠️ Deprecated but still used in: TEAM-MAIN — consider replacing!"
4. **KEIN Auto-Deprecation:** Wenn eine Slide deprecated wird, bleiben ihre Assets aktiv
   (weil dasselbe Asset in mehreren Slides genutzt werden kann)

### NICHT editierbar (geschuetzt)

- `id` (permanent, keine Umbenennung)
- `status` (nur ueber dedizierte Buttons: Deprecate / Activate)
- `usedInSlides` (automatisch berechnet)

### Editierbar (zusammengefasst)

| Feld | Wie | Wo |
|------|-----|-----|
| `label` | Text-Input (max 60) | Lightbox Edit-Modus |
| `description` | Textarea (max 200) | Lightbox Edit-Modus |
| `person.position` | Text-Input | Lightbox Edit-Modus (nur Team) |
| **Primary-Bild ersetzen** | **File Upload (Replace)** | **Lightbox "Replace Image"** |
| **Format-Variante hinzufuegen** | **File Upload (Add)** | **Lightbox "[+ Add]" Tab** |
| **Primary wechseln** | **"Set as Primary" Button** | **Lightbox Format-Tab** |
| **Variante loeschen** | **"Delete" Button** | **Lightbox Format-Tab (nicht Primary!)** |

## QA-Kriterien

### Text-Editing
- [ ] Edit-Button (Pencil-Icon) in Lightbox sichtbar
- [ ] Klick auf Edit → Felder werden editierbar
- [ ] Save → Aenderung persistiert (Seite neu laden → neuer Wert sichtbar)
- [ ] Cancel → keine Aenderung
- [ ] Validierung: leeres Label verhindert Save
- [ ] Validierung: max-length Grenzen

### Used in Slides (Impact-Anzeige)
- [ ] "Used in Slides" Box IMMER sichtbar (View + Edit Modus)
- [ ] Zeigt slideTag + Slide-Label (z.B. "TEAM-MAIN — The Dream Team")
- [ ] Im Edit-Modus: Impact-Warnung "Changes visible instantly in these slides!"
- [ ] Assets ohne Slides: "Not used in any slide" (kein Warning noetig)

### Image Replace
- [ ] "Replace Image" Button in Lightbox sichtbar (nur im Edit-Modus)
- [ ] File-Picker oeffnet sich (nur Bilder erlaubt)
- [ ] Preview des neuen Bildes VOR dem Speichern
- [ ] Confirm-Dialog bei Assets mit usedInSlides > 0 (zeigt betroffene Slides)
- [ ] Confirm → Bild wird ersetzt, Metadaten aktualisiert
- [ ] Cancel → altes Bild bleibt
- [ ] Assets OHNE Slide-Referenz: kein Confirm-Dialog noetig
- [ ] Alte Datei wird als .backup behalten
- [ ] Alle Slides die das Asset nutzen zeigen sofort das neue Bild (getAssetPath)
- [ ] Max 5MB Validierung

### Auto-Convert bei Upload (WebP-Pipeline)
- [ ] Jeder Upload (Replace oder Add) speichert IMMER 2 Dateien:
      1. Original (whatever format uploaded: PNG, JPG, etc.)
      2. Automatisch generierte WebP-Variante (resized, optimiert)
- [ ] WebP wird mit sharp (npm) generiert: max 1200px Breite, quality 80
- [ ] Beide Varianten werden in assets.ts registriert (Original = isPrimary)
- [ ] WebP-Variante hat eigenen Pfad: `{original-name}.webp`
- [ ] getAssetPath("id") → Original, getAssetPath("id", "webp") → WebP
- [ ] Wenn Original BEREITS WebP ist: kein Duplikat, nur 1 Variante

### Multi-Format
- [ ] Format-Tabs in Lightbox sichtbar (PNG, WebP, JPG, etc.)
- [ ] Primary-Badge auf aktuellem Standard-Format
- [ ] "[+ Add]" Tab zum manuellen Hinzufuegen weiterer Formate
- [ ] "Set as Primary" Button wechselt Standard-Format
- [ ] "Delete Variant" loescht Format (nicht Primary!)
- [ ] getAssetPath() ohne Format → Primary
- [ ] getAssetPath() mit Format → spezifische Variante oder Fallback
- [ ] Migration: bestehende 23 Assets → je 1 Variante mit isPrimary: true

### New Asset Upload
- [ ] "+ New Asset" Button auf /setup/brand-assets sichtbar
- [ ] Klick oeffnet Upload-Dialog (Drag & Drop + File-Picker)
- [ ] Nur Bilder erlaubt (png, jpg, webp, svg), max 5MB
- [ ] Metadaten-Formular: Label (pflicht), Description, Category (pflicht)
- [ ] Team-Checkbox → Person-Felder erscheinen
- [ ] Asset-ID wird aus Label auto-generiert (kebab-case)
- [ ] Collision-Check: existierende ID → Suffix "-2"
- [ ] Create → Bild gespeichert + WebP generiert + assets.ts aktualisiert
- [ ] Neues Asset erscheint sofort im Grid (kein Page-Reload noetig)
- [ ] Neues Asset abrufbar via getAssetPath("neue-id")

### Status-Management (Deprecate/Activate/Reserve)
- [ ] Status-Buttons in Lightbox Edit-Modus sichtbar
- [ ] Active → Deprecate: sofort wenn nicht in Slides, Confirm wenn in Slides
- [ ] Confirm-Dialog zeigt betroffene Slides
- [ ] Deprecated Asset: getAssetPath() liefert weiterhin den Pfad (kein Crash!)
- [ ] Deprecated Asset: console.warn wird geloggt
- [ ] Deprecated Asset in Brand Assets UI: rote Markierung + "still used in..." Hinweis
- [ ] Reserve → Activate: sofort, kein Confirm
- [ ] Re-activate: deprecated → active, sofort
- [ ] KEIN Auto-Deprecation bei Slide-Deprecation

### Build
- [ ] npm run build fehlerfrei
- [ ] sharp als Dependency installiert
