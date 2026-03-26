"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FeaturesSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const featureCategories = [
    {
      title: "Standard FinApp Controls",
      features: ["Watch Lists", "Portfolios"],
      accent: "var(--color-accent-cyan)",
    },
    {
      title: "Visualizations Beyond",
      features: [
        "Equilibriums - Market Position",
        "Jukebox Methodologies Selector",
        "Methodology Radials",
      ],
      accent: "var(--color-accent-violet)",
    },
    {
      title: "LFM - Large Financial Model",
      features: [
        "5x Net Increase in Numerical Density",
        "Yields Continuity of Disparities",
      ],
      accent: "var(--color-accent-burnt)",
    },
    {
      title: "Social Trading Platform",
      features: [
        "Bullet Time Ultra Compression",
        "Vibe Trading (Learn, Feel, Double)",
        "Certification & Social Learning",
      ],
      accent: "var(--color-accent-gold)",
    },
  ];

  return (
    <SlideWrapper id="features" background="dark">
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
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 50 }}
                animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                MVP 1.0 & 1.1
              </motion.h2>
              <motion.p
                className="text-(--color-text-muted) mt-4 md:mt-0"
                initial={{ opacity: 0 }}
                animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                Phase 1 Feature Set
              </motion.p>
            </div>

            {/* Features grid - Tetris-like layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featureCategories.map((category, i) => (
                <motion.div
                  key={i}
                  className={`relative bg-(--color-obsidian) border border-(--color-graphite) p-6 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""
                    }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: category.accent }}
                  />

                  {/* Category number */}
                  <span
                    className="text-6xl font-bold opacity-10 absolute top-4 right-4"
                    style={{ color: category.accent }}
                  >
                    0{i + 1}
                  </span>

                  <h3
                    className="text-lg font-semibold mb-6"
                    style={{ color: category.accent }}
                  >
                    {category.title}
                  </h3>

                  <ul className="space-y-3">
                    {category.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        className="flex items-start gap-3 text-sm text-(--color-text-secondary)"
                        initial={{ opacity: 0, x: -10 }}
                        animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 + j * 0.05, ease }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: category.accent }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Vibe Trading highlight */}
            <motion.div
              className="mt-12 p-8 bg-linear-to-r from-(--color-obsidian) to-(--color-slate)/30 border border-(--color-graphite)"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h4 className="text-2xl font-bold text-(--color-accent-gold)">
                    Vibe Trading
                  </h4>
                  <p className="mt-2 text-sm text-(--color-text-muted)">
                    Revolutionary social trading experience
                  </p>
                </div>
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  {["Learn to Vibe", "Feel the Vibe", "The Double Vibe"].map(
                    (vibe, i) => (
                      <motion.div
                        key={i}
                        className="text-center p-4 bg-(--color-charcoal) border border-(--color-graphite)"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease }}
                      >
                        <div className="text-3xl mb-2">
                          {i === 0 ? "📚" : i === 1 ? "🎯" : "⚡"}
                        </div>
                        <p className="text-xs text-(--color-text-secondary)">
                          {vibe}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bottom stats */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-12"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
            >
              <div className="text-center">
                <p className="text-4xl font-mono font-bold text-(--color-accent-cyan)">
                  5x
                </p>
                <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-1">
                  Numerical Density
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-mono font-bold text-(--color-accent-violet)">
                  5
                </p>
                <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-1">
                  Methodology Layers
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-mono font-bold text-(--color-accent-burnt)">
                  3D
                </p>
                <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-1">
                  Visualizations
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
