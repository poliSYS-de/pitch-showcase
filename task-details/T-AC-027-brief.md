# T-AC-027: Slide 4 ProductDemo KOMPLETT ERSETZEN

## Problem:
T-AC-026 wurde FALSCH umgesetzt. PO hat D3-Komponenten gebaut (RadialChart, DataSphere, GradientSunburst).
Der master Branch nutzt aber STATISCHE BILDER — keine D3-Charts!

## Loesung:
1. Hole die Bilder aus master: `git checkout master -- public/images/visual1.png public/images/visual2.png public/images/visual3.png`
2. ProductDemoSlide.tsx KOMPLETT ersetzen mit dem Code von master (unten)
3. Die D3-Komponenten die in T-AC-026 erstellt wurden LOESCHEN (RadialChart, DataSphere, GradientSunburst)
4. `import Image from "next/image"` hinzufuegen

## EXAKTER Code fuer ProductDemoSlide.tsx (SlideWrapper-Inhalt):

```tsx
<SlideWrapper id="visuals" background="darker">
  <div ref={ref} className="relative z-10 h-full w-full">
    <ScrollExitWrapper className="w-full relative" yOffset={-80}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Section label */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -50 }}
          animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <span className="text-xs font-mono text-(--color-accent-cyan) tracking-widest uppercase">
            04 / Visuals
          </span>
        </motion.div>
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          Visual <span className="text-(--color-accent-cyan)">Demonstration</span>
        </motion.h2>
        {/* Visuals Grid: visual3 left, visual1 center, visual2 right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Visual 3 - Left */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          >
            <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-cyan) to-(--color-accent-violet) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
              <Image
                src="/images/visual3.png"
                alt="Balance Sheet Visualization"
                width={800}
                height={800}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
              Balance Sheet Visualization
            </p>
          </motion.div>
          {/* Visual 1 - Center */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-cyan) to-(--color-accent-violet) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
              <Image
                src="/images/visual1.png"
                alt="Visual Demonstration 1"
                width={800}
                height={800}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
              Advanced Market Analysis
            </p>
          </motion.div>
          {/* Visual 2 - Right */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
          >
            <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-violet) to-(--color-accent-cyan) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
              <Image
                src="/images/visual2.png"
                alt="Visual Demonstration 2"
                width={800}
                height={800}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
              Financial Performance Metrics
            </p>
          </motion.div>
        </div>
      </div>
    </ScrollExitWrapper>
  </div>
</SlideWrapper>
```

## Auch anpassen in page.tsx:
- Slide-ID in der slides-Liste: `{ id: "visuals", label: "Product" }` (war "product-demo")

## LOESCHEN (falls von T-AC-026 erstellt):
- src/components/visualizations/RadialChart.tsx
- src/components/visualizations/DataSphere.tsx
- src/components/visualizations/GradientSunburst.tsx
