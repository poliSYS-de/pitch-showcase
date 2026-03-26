# T-AC-029: Slide 5 VibeTradingSlide — Animation statt Video

## Kontext:
- Kein Demo-Video verfuegbar (Meeting-Entscheidung E-03)
- Slide braucht eine visuelle Animation die das Vibe Trading Konzept zeigt
- Technologie im Projekt: Framer Motion + GSAP 3 (bereits als Dependencies)

## Konzept "Bullet-Timing" Animation:
Vibe Trading basiert auf dem Bullet-Timing-Konzept (Matrix-Style Zeitlupe fuer Trading).
Die Animation soll dieses Konzept visuell vermitteln.

## Animations-Ideen (PO waehlt beste Loesung):

### Option A: Trading-Signal-Pulse
- Zentraler Punkt (Trade Signal) sendet konzentrische Ringe aus
- Ringe verlangsamen sich (Bullet-Timing-Effekt)
- Datenpunkte erscheinen entlang der Ringe (Buy/Sell/Hold)
- Farben: Cyan + Gold auf Dark Background
- Endlos-Loop, rein CSS/Framer Motion

### Option B: Data-Stream Matrix
- Vertikale Datenströme (wie Matrix rain aber mit Ticker-Symbolen und Preisen)
- In der Mitte verlangsamt sich alles (Bullet-Time-Zone)
- Trading-Signale leuchten auf wenn sie die Zone durchqueren
- GSAP ScrollTrigger oder Framer Motion

### Option C: 3-Level Vibe Visualisierung
- 3 animierte Ebenen die sich aufbauen:
  1. Level 1: Einzelner Datenstrom (basic)
  2. Level 2: Mehrere vernetzte Streams (social)
  3. Level 3: Komplexes Netzwerk mit AI-Overlay (full vibe)
- Passend zu den 3 Vibe Trading Levels auf der Slide

## Technische Anforderungen:
- Framer Motion ODER GSAP (beides verfuegbar)
- KEIN Canvas/WebGL — zu heavy, muss performant sein
- Endlos-Loop Animation (kein User-Trigger noetig)
- Responsive (mobile + desktop)
- Passt zum bestehenden Dark-UI Design (oklch Farben)
- KEIN useScroll/scrollYProgress (Lenis-Konflikt, wurde aber entfernt — trotzdem CSS-snap beachten)
