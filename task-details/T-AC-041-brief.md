# T-AC-041 — BUG: GoToMarketSlide Timeline CSS-Klassen kaputt

> Prio: P1 | Quelle: QA-Report T-AC-038, Finding F-03
> Muss vor Praesentation gefixt werden!

## Problem

In `GoToMarketSlide.tsx` werden CSS-Variable-Namen direkt als Klassen verwendet statt als Tailwind-Werte.

### Betroffene Stellen

**Zeile 169-172:** Timeline-Dot border-color
```jsx
// FALSCH:
className={`... ${item.status === "active" ? "--color-accent-cyan" : "--color-obsidian"}`}

// RICHTIG:
className={`... ${item.status === "active" ? "border-[var(--color-accent-cyan)]" : "border-[var(--color-obsidian)]"}`}
```

**Zeile 184-187:** Timeline-Action text-color
```jsx
// FALSCH:
className={`... ${item.status === "active" ? "--color-accent-cyan" : "--color-obsidian"}`}

// RICHTIG:
className={`... ${item.status === "active" ? "text-[var(--color-accent-cyan)]" : "text-[var(--color-obsidian)]"}`}
```

## Auswirkung

Timeline-Dots und -Text werden in Standardfarbe (weiss) statt farbig differenziert angezeigt. Phase 1 nicht als "aktiv" erkennbar.

## Fertig-Kriterien

- [ ] Beide Stellen (border + text) korrigiert
- [ ] Aktive Phase visuell in Cyan sichtbar
- [ ] Inaktive Phasen in Obsidian/gedimmt
