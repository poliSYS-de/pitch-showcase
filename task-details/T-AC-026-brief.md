# T-AC-026: ProductDemo — Radial-Charts aus master uebernehmen

## WICHTIG: NICHTS NEU BAUEN!
Der master Branch hat bereits alles. Einfach die bestehenden Komponenten uebernehmen.

## Vorgehen:
```bash
# 1. Schauen was auf master liegt:
git show master:src/components/slides/ProductDemoSlide.tsx > /tmp/master-product.tsx
# Oder die Visualisierungen direkt:
git ls-tree master:src/components/visualizations/

# 2. Relevante Dateien aus master holen:
git checkout master -- src/components/visualizations/
git checkout master -- src/components/slides/ProductDemoSlide.tsx
# ODER nur die Teile die gebraucht werden cherry-picken

# 3. Slide-Titel + Section-Label an feature-Branch anpassen:
# Titel: "MVP Information Channel —" (Zeile 1) + "Agentiq Advisor" (Zeile 2)
# Section-Label: "04 / PRODUCT" (nicht 03 oder 05)
```

## Was auf master existiert (deployed auf Amplify):
- 3 Radial-Chart-Visualisierungen nebeneinander (horizontal scroll)
- Balance Sheet Visualization ($238.12 AAPL)
- Advanced Market Analysis ($150.25 AXYZ)
- Financial Performance
- Interaktive D3.js Radial-Charts

## NICHT machen:
- Keine neuen Komponenten schreiben
- Keine eigenen Chart-Implementierungen
- Snap-Scroll-Aenderungen (CSS) NICHT ueberschreiben
