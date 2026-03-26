# T-AC-068 — Preview-Thumbnails + Lightbox fuer Setup-Page

> Prio: P0 | Zugewiesen: PO | Abhaengigkeit: Nach T-AC-066 (T-AC-067 NICHT noetig)
> Konzept: `docs/KONZEPT-SLIDE-ADMIN.md` (v2.1, Sektion 2.6)

## Kernidee

Setup-Karten zeigen Thumbnail-Screenshots der Slides fuer visuelle Unterscheidung.
Klick auf Thumbnail oeffnet Lightbox mit Live-Slide-Rendering inklusive Animationen.

---

## Aufgaben

### Phase 1: Thumbnails auf Karten

**1.1 Screenshots erstellen (19 Slides):**
- Dev-Server starten, jede Slide einzeln rendern via `/?slides={id}`
- Screenshot 400x225px (16:9), als JPEG (~30-50KB)
- Speichern: `public/images/slide-previews/{id}.jpg`

**1.2 slides.ts: previewImage Feld:**
- SlideConfig Interface: +`previewImage?: string`
- Pfade eintragen: `/images/slide-previews/{id}.jpg`

**1.3 setup/page.tsx: Thumbnails auf Karten:**
- Bild oberhalb der Karten-Info anzeigen (volle Kartenbreite, 16:9 Ratio)
- Fallback: Gradient-Placeholder mit slide.label (slideTag erst ab T-AC-067)
- Cursor: pointer auf dem Thumbnail (signalisiert Klickbarkeit)

Commit: `feat(setup): Phase 1 — Preview-Thumbnails auf Setup-Karten`

### Phase 2: Lightbox mit Live-Slide-Rendering

**2.1 SlidePreviewLightbox Komponente (`src/components/setup/SlidePreviewLightbox.tsx`):**
- Modal/Overlay: `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`
- Klick auf Backdrop oder ESC-Taste schliesst Lightbox
- Framer Motion: `AnimatePresence` + fade-in/scale-up Animation fuer Lightbox selbst

**2.2 Live-Slide-Rendering (NICHT nur groesseres Bild!):**
- Die tatsaechliche Slide-Komponente wird im Lightbox gerendert
- Skalierung: `transform: scale()` so dass Slide ~90vw / ~85vh ausfuellt
- Wrapper: `overflow: hidden` + zentriert via Flexbox
- Slide-Animationen (Framer Motion) laufen normal ab beim Oeffnen
- SLIDE_COMPONENTS Map aus page.tsx/PitchDeckClient wiederverwenden

**2.3 Lightbox-Header:**
- Slide-Label + Nummer oben links (z.B. "03 / OPPORTUNITY")
- Close-Button (X) oben rechts
- Optional: Pfeil-Navigation links/rechts zum naechsten/vorherigen Slide in der Auswahl

**2.4 Integration in setup/page.tsx:**
- State: `previewSlideId: string | null` (null = geschlossen)
- Klick auf Thumbnail → `setPreviewSlideId(slide.id)`
- `<SlidePreviewLightbox slideId={previewSlideId} onClose={() => setPreviewSlideId(null)} />`
- Lightbox bekommt `allSlides` Prop fuer optionale Pfeil-Navigation

Commit: `feat(setup): Phase 2 — Lightbox mit Live-Slide-Rendering + Animationen`

---

## Technische Hinweise

- SLIDE_COMPONENTS Map muss aus PitchDeckClient extrahiert/geshared werden (eigenes Modul?)
- Lightbox-Slide braucht KEINEN SlideNav (nur die einzelne Slide isoliert)
- Body-Scroll sperren wenn Lightbox offen (`overflow: hidden` auf body)
- Responsive: Auf Mobile Lightbox = fast fullscreen

## NICHT in diesem Ticket

- slideTag / deckPosition Refactoring → T-AC-067
- Slide-Inhalte aendern
- Setup-Auth

## QA-Kriterien

- [ ] Jede Setup-Karte zeigt Thumbnail (oder Placeholder)
- [ ] Bilder < 50KB pro Thumbnail
- [ ] Deprecated Slides haben Previews (ausgegraut)
- [ ] Kein Layout-Bruch bei fehlenden Bildern
- [ ] Klick auf Thumbnail oeffnet Lightbox
- [ ] Lightbox zeigt LIVE Slide-Komponente (nicht nur groesseres Bild)
- [ ] Slide-Animationen laufen in Lightbox ab
- [ ] ESC-Taste schliesst Lightbox
- [ ] Backdrop-Klick schliesst Lightbox
- [ ] Body-Scroll ist gesperrt bei offener Lightbox
- [ ] Lightbox skaliert korrekt auf verschiedenen Bildschirmgroessen
- [ ] Close-Button sichtbar und funktional
- [ ] Slide-Label/Nummer im Lightbox-Header korrekt
