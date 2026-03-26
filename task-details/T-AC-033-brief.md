# T-AC-033: BUG — Slide 3 MarketOpportunity Venn-Diagramm unlesbar

## Problem:
Die "Missing Information Channel" Grafik (Venn-Diagramm mit Trading + Intelligence Kreisen)
ist kaputt und nicht lesbar. Labels werden abgeschnitten ("TI...", "gence"),
Kreise überlappen zu stark.

## Ursache:
- Container ist nur `w-40 h-40` (160px)
- Jeder Kreis ist `w-32 h-32` (128px) — viel zu gross fuer den Container
- `absolute left-0` und `absolute right-0` positioniert beide Kreise uebereinander
- Text-Labels werden durch Overlap verdeckt

## Fix-Anweisung (MINIMAL-CHANGE!):

### Option A — Container vergroessern + Kreise auseinander:
```tsx
{/* Visualization: Split circle concept */}
<motion.div
  className="flex justify-center items-center mb-8 h-48"
  ...
>
  <div className="relative w-72 h-40">
    {/* Left circle: Trading */}
    <motion.div
      className="absolute left-0 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[var(--color-accent-cyan)] flex items-center justify-center"
      ...
    >
      <span className="text-sm font-mono text-[var(--color-accent-cyan)] text-center px-2">
        Trading
      </span>
    </motion.div>

    {/* Right circle: Intelligence */}
    <motion.div
      className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-[var(--color-accent-violet)] flex items-center justify-center"
      ...
    >
      <span className="text-sm font-mono text-[var(--color-accent-violet)] text-center px-2">
        Intelligence
      </span>
    </motion.div>

    {/* Center bridge: AI */}
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[var(--color-accent-gold)] flex items-center justify-center z-10"
      ...
    >
      <span className="text-xs font-bold text-[var(--color-obsidian)]">AI</span>
    </motion.div>
  </div>
</motion.div>
```

### Kernpunkte:
1. Container von `w-40` auf `w-72` (288px) vergroessern — Kreise brauchen Platz
2. Kreise von `w-32 h-32` auf `w-28 h-28` leicht verkleinern
3. Gold-Kreis AI bekommt `z-10` damit er ueber beiden Kreisen liegt
4. mb-12 auf mb-8 reduzieren (Slide muss in 100vh passen!)
5. Labels "Trading" und "Intelligence" muessen KOMPLETT sichtbar sein

## WICHTIG:
- NUR die Venn-Grafik aendern, Rest der Slide NICHT anfassen
- Datei: `src/components/slides/MarketOpportunitySlide.tsx` Zeilen 78-131
- Kein overflow — alles muss bei snap-scroll sichtbar bleiben
