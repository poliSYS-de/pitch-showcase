# T-AC-070 — Setup-Page UI: Preset-Layout + Card-Redesign

> Prio: P0 | Zugewiesen: PO | Abhaengigkeit: Keine (kann sofort starten)

## Aufgaben

### 1. Neues Built-in Preset in slides.ts

BEREITS ERLEDIGT — `"all"` Preset existiert in slides.ts (Zeile 51).
Das alte `investor` Preset wurde durch `all` ersetzt.

### 2. Preset-Leiste Layout: Zwei Reihen

**Reihe 1 (volle Breite, visuell hervorgehoben):**
```
[ Default (Online) (14) ]
```
- Allein stehend, volle Breite oder zentriert
- Cyan-Border wie bisher
- Klarer visueller Abstand zur zweiten Reihe (z.B. `mb-4` + duenne Linie)

**Reihe 2 (alle anderen Presets nebeneinander):**
```
[ 10min Final Pitch (14) ] [ Quick Demo (6) ] [ All Slides (19) ] [ Marketing Focus (9) ] [ + Save as Preset ]
```
- Standard-Styling (kein Cyan)
- Flex-Wrap falls noetig
- Custom Presets erscheinen hier ebenfalls

### 3. Optische Trennung Preset-Reihen

- Zwischen Reihe 1 und Reihe 2: `border-b border-white/10` oder `gap-6` oder beides
- Optional: Kleines Label "Presets" ueber Reihe 2 in `text-xs text-muted uppercase`

### 4. Card-UI Redesign: Preview-Image + Checkbox + Lightbox

**4.1 Preview-Image komplett klickbar → Lightbox:**
- Das GESAMTE Preview-Image auf der Karte ist klickbar (nicht nur ein kleiner Button)
- Klick oeffnet Lightbox mit Live-Slide-Rendering (wie in T-AC-068 implementiert)
- Den separaten Augen-Button/Preview-Icon ENTFERNEN — das Image selbst ist der Trigger
- Cursor: `cursor-zoom-in` auf dem Image-Bereich
- Hover-Effekt auf Image: leichte Aufhellung (`hover:brightness-110`) oder Overlay-Icon (Lupe)

**4.2 Checkbox doppelt so gross + Position unten rechts:**
- Checkbox-Groesse: `w-6 h-6` (statt aktuell ~`w-3 h-3` oder `w-4 h-4`)
- Position: unten rechts auf der Karte, ueber dem Datum
- Visuell klar sichtbar — die Checkbox ist das primaere Interaktionselement zum Slide-Toggle
- Checked-State: ausgefuellter Cyan-Hintergrund mit weissem Checkmark

**4.3 Klickzonen klar trennen:**
- Image-Bereich → Lightbox oeffnen (preview)
- Checkbox → Slide an/aus (selection toggle)
- Rest der Karte (Label, Status etc.) → KEIN Toggle — nur informativ
- WICHTIG: Klick auf Image darf NICHT die Checkbox togglen!

## QA-Kriterien

### Preset-Layout
- [ ] "Default (Online)" steht allein in erster Reihe
- [ ] Alle anderen Presets (Built-in + Custom) in zweiter Reihe
- [ ] Optische Trennung zwischen Reihe 1 und 2 sichtbar
- [ ] "All Slides (incl. Deprecated)" Preset zeigt alle 19 Slides
- [ ] `/?preset=all` funktioniert und laedt alle 19 Slides
- [ ] Custom Presets erscheinen in Reihe 2

### Card-UI
- [ ] Preview-Image ist KOMPLETT klickbar → oeffnet Lightbox
- [ ] Kein separater Preview-Button/Augen-Icon mehr sichtbar
- [ ] Lightbox zeigt Live-Slide-Rendering mit Animationen
- [ ] Checkbox ist deutlich groesser (~24x24px)
- [ ] Checkbox Position: unten rechts ueber Datum
- [ ] Klick auf Image togglet NICHT die Checkbox
- [ ] Klick auf Checkbox oeffnet NICHT die Lightbox
- [ ] Cursor auf Image: zoom-in | Cursor auf Checkbox: pointer
