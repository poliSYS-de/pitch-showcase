"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AskSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const useOfFunds = [
    { category: "Product Development", percentage: 50, color: "var(--color-accent-cyan)" },
    { category: "Engineering Team", percentage: 25, color: "var(--color-accent-violet)" },
    { category: "Marketing & Growth", percentage: 15, color: "var(--color-accent-burnt)" },
    { category: "Operations", percentage: 10, color: "var(--color-accent-gold)" },
  ];

  const termHighlights = [
    { label: "Round", value: "Seed" },
    { label: "Instrument", value: "SAFE" },
    { label: "Target", value: "$1.5–3M" },
    { label: "Valuation Cap", value: "$240M" },
  ];

  return (
    <SlideWrapper id="ask" background="dark">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {/* Section label */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-xs font-mono text-(--color-accent-cyan) tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Main ask */}
            <div className="text-center mb-6">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 50 }}
                animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                <span className="text-(--color-accent-cyan)">$1.5M</span>{" "}
                <span className="text-(--color-text-secondary) text-2xl md:text-3xl lg:text-4xl">up to</span>{" "}
                <span className="text-(--color-accent-cyan)">$3M</span>
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-(--color-text-secondary) mt-4"
                initial={{ opacity: 0 }}
                animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                Seed Round
              </motion.p>
            </div>

            {/* Term highlights */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
            >
              {termHighlights.map((term, i) => (
                <div
                  key={i}
                  className="bg-(--color-obsidian) border border-(--color-graphite) p-3 text-center"
                >
                  <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
                    {term.label}
                  </p>
                  <p className="text-2xl font-mono font-bold text-(--color-text-primary) mt-2">
                    {term.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Use of funds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart */}
              <motion.div
                className="bg-(--color-obsidian) border border-(--color-graphite) p-5"
                initial={{ opacity: 0, x: -40 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: 0.6, ease }}
              >
                <h3 className="text-lg font-semibold mb-4">Use of Funds</h3>

                {/* Horizontal bar chart */}
                <div className="space-y-3">
                  {useOfFunds.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1, ease }}
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-(--color-text-secondary)">
                          {item.category}
                        </span>
                        <span className="font-mono" style={{ color: item.color }}>
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="h-3 bg-(--color-slate)/30 rounded-sm overflow-hidden">
                        <motion.div
                          className="h-full rounded-sm"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={effectiveInView ? { width: `${item.percentage}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-(--color-graphite) flex justify-between">
                  <span className="text-(--color-text-muted)">Total Raise</span>
                  <span className="text-2xl font-mono font-bold text-(--color-accent-cyan)">
                    $1.5M – $3M
                  </span>
                </div>
              </motion.div>

              {/* Milestones */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: 40 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                transition={{ duration: 0.8, delay: 0.7, ease }}
              >
                <h3 className="text-lg font-semibold">18-Month Milestones</h3>

                <div className="space-y-2">
                  {[
                    { milestone: "MVP 1.0 Launch", timeline: "Q2 2026" },
                    { milestone: "1,000,000 Active Users", timeline: "Q3 2026" },
                    { milestone: "Vibe Trading™ Launch", timeline: "Q4 2026" },
                    { milestone: "Revenue: $60M ARR", timeline: "Q1 2027" },
                    { milestone: "Series A Ready", timeline: "Q2 2027" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-(--color-obsidian) border border-(--color-graphite)"
                      initial={{ opacity: 0, y: 20 }}
                      animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease }}
                    >
                      <div className="w-3 h-3 rounded-full bg-(--color-accent-cyan)" />
                      <div className="flex-1">
                        <p className="text-(--color-text-primary)">{item.milestone}</p>
                      </div>
                      <span className="text-sm font-mono text-(--color-text-muted)">
                        {item.timeline}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  className="mt-4 p-4 bg-linear-to-r from-(--color-accent-cyan)/10 to-transparent border border-(--color-accent-cyan)/30"
                  initial={{ opacity: 0 }}
                  animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 1.2, ease }}
                >
                  <p className="text-lg text-(--color-text-primary)">
                    Join us in building the future of{" "}
                    <span className="text-(--color-accent-cyan)">
                      financial intelligence
                    </span>
                  </p>
                  <p className="text-sm text-(--color-text-muted) mt-2">
                    contact@agentiqcapital.com
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
