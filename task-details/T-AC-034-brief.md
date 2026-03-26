# T-AC-034: BUG — Slide 2 CorporateOverview Bullet Points zu niedrig

## Problem:
Die Bullet Points in den Phase-Karten (z.B. "Financial Institutions", "Large Corporations",
"Government Organizations") sitzen zu weit unten im Viewport. Der gesamte Slide-Content
muss hoeher positioniert werden.

## Ursache:
Zu viel vertikaler Abstand kumuliert sich:
- Section label: `mb-6`
- Title: `mb-8`
- Icon: `text-3xl mb-3`
- Phase label: `mb-2`
- Title in card: `mb-4`
- Card padding: `p-8 md:p-6 lg:p-8`
- Investment-Bereich am unteren Rand mit `mt-auto pt-6` nimmt auch Platz

## Fix-Anweisung (MINIMAL-CHANGE!):

### Spacings reduzieren:

1. **Title margin** von `mb-8` auf `mb-4`:
   ```tsx
   className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
   ```

2. **Section label** von `mb-6` auf `mb-3`:
   ```tsx
   className="mb-3"
   ```

3. **Icon** von `text-3xl mb-3` auf `text-2xl mb-2`:
   ```tsx
   className="text-2xl mb-2 text-center font-light opacity-70"
   ```

4. **Card padding** von `p-8 md:p-6 lg:p-8` auf `p-4 md:p-4 lg:p-6`:
   ```tsx
   className="relative flex flex-col bg-[var(--color-slate)]/20 border border-[var(--color-graphite)] p-4 md:p-4 lg:p-6 hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
   ```

5. **Investment pt-6** auf `pt-3`:
   ```tsx
   className="mt-auto pt-3 border-t border-[var(--color-graphite)]"
   ```

## WICHTIG:
- NUR Spacings aendern, Content und Animationen NICHT anfassen
- Datei: `src/components/slides/CorporateOverviewSlide.tsx`
- Testen: Bullet Points muessen vertikal zentrierter im Viewport sitzen
- Kein overflow am unteren Rand!
