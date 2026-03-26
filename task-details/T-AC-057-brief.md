# T-AC-057 — Slide 10 TeamSlide: Echte Fotos + Rollen-Fix + Reihenfolge

> Prio: P1 | Zugewiesen: PO | Datei: `TeamSlide.tsx`

## Ist-Zustand

1. Keine echten Fotos — nur farbige Initialen-Kreise (BA, MM, PC, SK, JZ, T)
2. Rollen teilweise falsch:
   - Maximilian steht als "CTO & Co-Founder" → ist CMO
   - "Tobin" steht als "Advisor" → heisst "Taban Cosmos", Rolle = CTO
3. Reihenfolge stimmt nicht — soll CEO, CTO, CMO zuerst

## Soll-Zustand

### 1. Team-Daten korrigieren

```ts
const teamMembers = [
  { name: "Brian Abbott",     role: "CEO & Co-Founder",  photo: "/images/team/linkedin/brian-abbott.jpg" },
  { name: "Taban Cosmos",     role: "CTO",               photo: null /* kein Foto vorhanden */ },
  { name: "Maximilian Muhr",  role: "CMO & Co-Founder",  photo: "/images/team/linkedin/maximilian-muhr.png" },
  { name: "Paul Capano",      role: "Operations",        photo: "/images/team/comic/paul-capano.png" },
  { name: "Sujit Kapur",      role: "Financial Analyst",  photo: "/images/team/linkedin/sujit-kapur.jpg" },
  { name: "Johnson Zhu",      role: "ML Engineer",       photo: "/images/team/linkedin/johnson-zhu.jpg" },
];
```

### 2. Fotos einbauen

- LinkedIn-Fotos liegen in `/public/images/team/linkedin/`
- Comic-Fotos als Fallback in `/public/images/team/comic/`
- Fuer Taban Cosmos: Initialen-Kreis als Placeholder (bis Foto kommt)
- Fotos rund zuschneiden (CSS `rounded-full object-cover`)
- Groesse: min 80x80px, max 120x120px je nach Layout

### 3. Reihenfolge

Top-Reihe (gross, prominent): **Brian, Taban, Maximilian**
Bottom-Reihe (kleiner): Paul, Sujit, Johnson

## Verfuegbare Foto-Dateien

| Person | LinkedIn | Comic |
|--------|----------|-------|
| Brian Abbott | brian-abbott.jpg (400x400) | brian-abbott.png |
| Maximilian Muhr | maximilian-muhr.png (400x400) | maximilian-muhr.png |
| Sujit Kapur | sujit-kapur.jpg (118x118) | sujit-kapur.png |
| Paul Capano | — | paul-capano.png |
| Johnson Zhu | johnson-zhu.jpg | johnson-zhu.png |
| Taban Cosmos | — | — |

## QA-Pruefkriterien

- [ ] Alle 6 Team-Mitglieder sichtbar mit korrektem Namen
- [ ] Rollen korrekt: Brian=CEO, Taban=CTO, Maximilian=CMO, Paul=Operations, Sujit=Financial Analyst, Johnson=ML Engineer
- [ ] Reihenfolge: CEO → CTO → CMO → Rest
- [ ] Fotos werden angezeigt (kein 404) fuer alle ausser Taban
- [ ] Taban hat Initialen-Placeholder
- [ ] Fotos rund zugeschnitten, nicht verzerrt
- [ ] Kein Overflow auf der Slide
- [ ] Desktop + Mobile pruefen
