# T-AC-031: Slide 5 VibeTradingSlide — Bullet Points + Verbesserung

## Neue Bullet Points unter "Bullet-Timing" Beschreibung hinzufuegen:

Nach dem bestehenden Absatz ("Freeze a moment in a trade...") folgende Bullet Points einfuegen:

- Continuous Intelligent Capture via Agentic UI
- Per Social Context Generated Trade Videos

## Umsetzung:
In VibeTradingSlide.tsx nach dem `<p>` Block mit der Bullet-Timing Beschreibung (Zeile ~61-65)
eine `<ul>` mit den zwei Punkten einfuegen. Styling:

```tsx
<ul className="mt-4 space-y-2">
  <li className="flex items-start gap-2 text-[var(--color-text-secondary)]">
    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)] mt-2 shrink-0" />
    Continuous Intelligent Capture via Agentic UI
  </li>
  <li className="flex items-start gap-2 text-[var(--color-text-secondary)]">
    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)] mt-2 shrink-0" />
    Per Social Context Generated Trade Videos
  </li>
</ul>
```

## Gesamtlayout Slide 5 soll in 100vh passen:
- Section Label: 05 / Vibe Trading
- Titel: MVP Social Trading Platform
- Untertitel: The Social Trading Growth Engine
- 2-Spalten: Links Bullet-Timing Text + neue Bullet Points | Rechts Animation
- Trademark-Zeile ganz unten
- KEIN overflow — alles muss sichtbar sein bei snap-scroll!
