# T-AC-040: Slide 6 VibeLevelsSlide — Trademark-Info + exaktes Wording

## Anforderung:
Slide 6 (VibeLevelsSlide) muss die Trademark-Information zu Vibe Trading enthalten.

## Exaktes Wording aus Pitch-Script + Meeting (25.03.2026):

### Trademark-Hinweis (PFLICHT am unteren Rand):
"Vibe Trading™ currently under review at USPTO — 5 designators incl. streaming video & social networking"

### Kontext (fuer Content-Bereich der Slide):
Brian Abbott woertlich (Pitch-Script):
- "And we own that trademark. Not just for software — for streaming video and social media too."
- "Five provisions. Nobody else can use the term Vibe Trading in these markets."
- "That trademark alone is an enormously valuable asset that supports the viral distribution of our product."

### Drei Stufen (muessen auf Slide 6 stehen):
1. **Learn to Vibe** — "Like Twitch TV for trading. Great traders auction off access to watch them work."
2. **Feel the Vibe** — "You follow a great trader. Their trades are proportionally copied to your account."
3. **Double Vibe** — "You become a top performer. You inform our model. When others copy your trades, you earn royalties."

### Referenz:
- Pitch-Script: `Agentic Capital/pitch-script-10min-v1.md` Zeilen 42-54
- Anforderungen: `Agentic Capital/slides-anforderungen-25-03.md` S5-08 bis S5-10

## Fix-Anweisung:
1. Pruefe aktuelle VibeLevelsSlide.tsx — hat sie die 3 Stufen?
2. Trademark-Hinweis am unteren Rand einfuegen (wie Slide 5)
3. Wording EXAKT aus dem Pitch-Script uebernehmen, NICHT umformulieren
4. "5 designators" und "streaming video & social networking" muessen drin sein
5. Datei: `src/components/slides/VibeLevelsSlide.tsx`
