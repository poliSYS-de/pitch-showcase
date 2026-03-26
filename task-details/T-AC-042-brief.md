# T-AC-042 — Mobile Padding px-4 auf 5 Slides nachruesten

> Prio: P2 | Quelle: QA-Report T-AC-038, Finding F-02
> Sollte vor Mobile-Nutzung gefixt werden

## Problem

5 Slides haben `max-w-7xl mx-auto w-full` OHNE `px-4 md:px-8`. Content klebt auf Mobile am Bildschirmrand.

## Betroffene Slides

1. `ProductDemoSlide.tsx`
2. `LFMSlide.tsx`
3. `GoToMarketSlide.tsx`
4. `FinanceSlide.tsx`
5. `AskSlide.tsx`

## Referenz (korrekt)

Diese Slides haben bereits `px-4 md:px-8`:
- CorporateOverviewSlide
- MarketOpportunitySlide
- VibeTradingSlide
- TeamSlide
- VibeLevelsSlide

## Fix

Auf dem aeusseren Content-Container (`max-w-7xl mx-auto w-full`) jeweils `px-4 md:px-8` ergaenzen.

## Fertig-Kriterien

- [ ] Alle 5 Slides haben px-4 md:px-8
- [ ] Kein Content-Clipping auf < 768px
- [ ] Desktop-Layout unveraendert
