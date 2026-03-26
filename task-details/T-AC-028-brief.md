# T-AC-028: Slide 4 — Neue Bilder aus upload/ einsetzen

## Neue Bilder liegen in: public/images/upload/

Umbenennen und in public/images/ verschieben:

```bash
cp public/images/upload/PHOTO-2026-03-25-19-40-54b.jpg public/images/visual3.jpg
cp public/images/upload/PHOTO-2026-03-25-19-40-55a.jpg public/images/visual1.jpg
cp public/images/upload/PHOTO-2026-03-25-19-40-55.jpg public/images/visual2.jpg
```

## Zuordnung:
- visual1 = Advanced Market Analysis ($150.25 AXYZ) — PHOTO-55a.jpg
- visual2 = Financial Performance ($238.12 AAPL) — PHOTO-55.jpg
- visual3 = Balance Sheet ($238.12 AAPL) — PHOTO-54b.jpg

## In ProductDemoSlide.tsx:
- Image src Pfade anpassen falls noetig (.jpg statt .png)
- Pruefen ob Next.js Image Komponente .jpg korrekt laedt
- Alt-Texte muessen zu den neuen Bildern passen
