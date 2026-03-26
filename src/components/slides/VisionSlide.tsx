"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function VisionSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const visionPoints = [
    {
      title: "Gauge Theory",
      description: "Mathematical frameworks for understanding market symmetries",
      icon: "◇",
    },
    {
      title: "Operator Theory",
      description: "Advanced computational models for financial analysis",
      icon: "△",
    },
    {
      title: "Measure Theory",
      description: "Probabilistic foundations for market predictions",
      icon: "○",
    },
  ];

  return (
    <SlideWrapper id="vision" background="dark">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full">
            {/* Section label */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, x: -50 }}
              animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-xs font-mono text-(--color-accent-cyan) tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Main vision statement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                >
                  Building Towards{" "}
                  <span className="text-(--color-accent-cyan)">
                    Artificial Super Intelligence
                  </span>
                </motion.h2>

                <motion.p
                  className="mt-8 text-lg text-(--color-text-muted) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                >
                  Our long-term vision combines advanced mathematical theories with
                  multi-agentic AI systems to achieve unprecedented financial intelligence
                  capabilities.
                </motion.p>

                {/* Mission statement */}
                <motion.div
                  className="mt-12 p-6 border-l-2 border-(--color-accent-burnt) bg-(--color-obsidian)"
                  initial={{ opacity: 0, x: -40 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                >
                  <p className="text-sm text-(--color-accent-burnt) uppercase tracking-wider mb-2">
                    Mission
                  </p>
                  <p className="text-xl text-(--color-text-primary)">
                    Democratize sophisticated market intelligence through innovative
                    visualization and AI-powered analytics.
                  </p>
                </motion.div>
              </div>

              {/* Vision points */}
              <div className="space-y-8">
                {visionPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    className="group relative pl-16 py-6 border-b border-(--color-graphite) hover:border-(--color-accent-cyan) transition-colors duration-300"
                    initial={{ opacity: 0, x: 50 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease }}
                  >
                    {/* Icon */}
                    <div className="absolute left-0 top-6 w-10 h-10 flex items-center justify-center text-2xl text-(--color-accent-cyan) group-hover:scale-110 transition-transform duration-300">
                      {point.icon}
                    </div>

                    <h3 className="text-xl font-semibold text-(--color-text-primary) group-hover:text-(--color-accent-cyan) transition-colors duration-300">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-(--color-text-muted)">
                      {point.description}
                    </p>
                  </motion.div>
                ))}

                {/* Future indicator */}
                <motion.div
                  className="flex items-center gap-4 pt-8"
                  initial={{ opacity: 0 }}
                  animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease }}
                >
                  <div className="flex-1 h-px bg-linear-to-r from-transparent via-(--color-graphite) to-transparent" />
                  <span className="text-xs font-mono text-(--color-text-muted) uppercase tracking-wider">
                    Multi-Agentic Systems
                  </span>
                  <div className="w-2 h-2 rounded-full bg-(--color-accent-violet) animate-pulse" />
                </motion.div>
              </div>
            </div>

            {/* Bottom decorative grid */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 0.3 } : { opacity: 0 }}
              transition={{ duration: 1, delay: 0.8, ease }}
            >
              <div className="absolute inset-0 grid grid-cols-12 gap-px">
                {[35, 55, 42, 68, 30, 75, 48, 62, 38, 58, 45, 70].map((height, i) => (
                  <div
                    key={i}
                    className="bg-(--color-graphite)"
                    style={{
                      height: `${height}%`,
                      alignSelf: "end",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
