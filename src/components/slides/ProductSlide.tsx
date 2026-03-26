"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import RadialChart from "@/components/visualizations/RadialChart";
import DataSphere from "@/components/visualizations/DataSphere";
import GradientSunburst from "@/components/visualizations/GradientSunburst";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function ProductSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;
  const chartSize =
    typeof window !== "undefined"
      ? window.innerWidth < 380
        ? 260
        : window.innerWidth < 480
          ? 290
          : 320
      : 320;

  // Methodology layers data - matches the visual-engine implementation
  const methodologyLayers = [
    { name: "Market", value: 85, color: "oklch(95.5% 0.035 200)" },
    { name: "Fundamentals", value: 72, color: "oklch(95.5% 0.040 145)" },
    { name: "Technicals", value: 90, color: "oklch(95.5% 0.042 60)" },
    { name: "Quantitative", value: 68, color: "oklch(95.5% 0.038 270)" },
    { name: "Dynamic", value: 78, color: "oklch(95.5% 0.036 340)" },
  ];

  const products = [
    {
      name: "agentiqcapital.com",
      description: "Main website with company info, product descriptions, and educational finance resources",
      highlights: ["Company story", "Product vision", "Market education"],
    },
    {
      name: "app.agentiqcapital.com",
      description: "Agentiq Advisor platform with portfolio command and insight workflows",
      highlights: ["Portfolio command", "Signal intelligence", "Scenario views"],
    },
  ];

  return (
    <SlideWrapper id="product" background="darker">
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
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              Visualization{" "}
              <span className="text-(--color-accent-cyan)">Engine</span>
            </motion.h2>

            {/* Main content - Visualization demos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
              {/* Methodology Stack Demo */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                <div className="bg-(--color-slate)/30 border border-(--color-graphite) p-4 md:p-8 rounded-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Methodology Stack</h3>
                    <span className="text-xs font-mono text-(--color-text-muted)">
                      5-Layer Analysis
                    </span>
                  </div>
                  <div className="flex justify-center grow items-center">
                    <RadialChart layers={methodologyLayers} size={chartSize} />
                  </div>
                  <p className="mt-6 text-sm text-(--color-text-muted) text-center">
                    Interactive stacked circles with lower-arc labels. Click to bring any layer to top.
                  </p>
                </div>
              </motion.div>

              {/* Gradient Sunburst Demo */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                <div className="bg-(--color-slate)/30 border border-(--color-graphite) p-4 md:p-8 rounded-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Gradient Sunburst</h3>
                    <span className="text-xs font-mono text-(--color-text-muted)">
                      Time-Series Signals
                    </span>
                  </div>
                  <div className="flex justify-center grow items-center">
                    <GradientSunburst size={chartSize} />
                  </div>
                  <p className="mt-6 text-sm text-(--color-text-muted) text-center">
                    Radial gradients show indicator signals over time: green (bullish) → yellow (neutral) → red (bearish)
                  </p>
                </div>
              </motion.div>

              {/* Market Sphere Demo */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.6, ease }}
              >
                <div className="bg-(--color-slate)/30 border border-(--color-graphite) p-4 md:p-8 rounded-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Market Sphere</h3>
                    <span className="text-xs font-mono text-(--color-text-muted)">
                      3D Visualization
                    </span>
                  </div>
                  <div className="flex justify-center grow items-center">
                    <DataSphere size={chartSize} pointCount={150} />
                  </div>
                  <p className="mt-6 text-sm text-(--color-text-muted) text-center">
                    Stocks positioned on sphere surface with smooth animations
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={i}
                  className="group relative bg-(--color-obsidian) border border-(--color-graphite) p-6 hover:border-(--color-accent-cyan) transition-colors duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.7 + i * 0.12, ease }}
                >
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-(--color-accent-cyan) to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <h4 className="font-mono text-(--color-accent-cyan) mb-3">
                    {product.name}
                  </h4>
                  <p className="text-(--color-text-secondary) text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.highlights.map((t, j) => (
                      <span
                        key={j}
                        className="text-xs font-mono px-2 py-1 bg-(--color-slate)/50 text-(--color-text-muted)"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key innovation callout */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
            >
              <p className="text-sm text-(--color-text-muted) uppercase tracking-wider mb-4">
                Key Innovation
              </p>
              <p className="text-2xl md:text-3xl text-(--color-text-primary) max-w-3xl mx-auto">
                Unprecedented way to read finance and market data with layered signals,
                spatial context, and narrative clarity.
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
