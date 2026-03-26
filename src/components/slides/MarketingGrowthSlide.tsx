"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function MarketingGrowthSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const strategies = [
    {
      name: "Content Marketing",
      icon: "📝",
      highlight: "Thought Leadership",
      description: "Educational content establishing Agentiq as the authority in AI-powered financial intelligence.",
      stats: [
        { label: "Focus", value: "Authority" },
        { label: "Channels", value: "Blog, Social" },
      ],
      accent: "var(--color-accent-cyan)",
    },
    {
      name: "Community Building",
      icon: "👥",
      highlight: "User Advocates",
      description: "Convert early users into advocates. Build Discord/Reddit communities for organic word-of-mouth growth.",
      stats: [
        { label: "Goal", value: "Advocates" },
        { label: "Cost", value: "Low" },
      ],
      accent: "var(--color-accent-violet)",
    },
    {
      name: "Targeted Testing",
      icon: "🎯",
      highlight: "Data-Driven",
      description: "Small-budget ad experiments to identify winning channels and optimize CAC before scaling.",
      stats: [
        { label: "Budget", value: "Limited" },
        { label: "Focus", value: "Learn CAC" },
      ],
      accent: "var(--color-accent-burnt)",
    },
  ];

  const metrics = [
    { label: "Target Users", value: "10K", sublabel: "Active monthly" },
    { label: "CAC Goal", value: "<$25", sublabel: "Blended average" },
    { label: "Budget", value: "$50K", sublabel: "6-month runway" },
  ];

  return (
    <SlideWrapper id="marketing-growth" background="darker">
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
              <span className="text-xs font-mono text-(--color-accent-violet) tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              Small Budget, Big <span className="text-(--color-accent-violet)">Learnings</span>
            </motion.h2>
            <motion.p
              className="text-2xl text-(--color-text-primary) mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
            >
              More Marketing, More Users, Data-Driven Product Evolution
            </motion.p>
            <motion.p
              className="text-lg text-(--color-text-muted) mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
            >
              Seed Investment Unlocks Growth Experiments with real users
            </motion.p>

            {/* Strategy cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {strategies.map((strategy, i) => (
                <motion.div
                  key={i}
                  className="relative bg-(--color-obsidian) border border-(--color-graphite) overflow-hidden group"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease }}
                >
                  {/* Accent bar */}
                  <div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: strategy.accent }}
                  />

                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <span className="text-3xl mb-3 block">{strategy.icon}</span>
                      <h3 className="text-xl font-bold">{strategy.name}</h3>
                      <p
                        className="text-xs font-mono mt-1"
                        style={{ color: strategy.accent }}
                      >
                        {strategy.highlight}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-(--color-text-muted) mb-4">
                      {strategy.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      {strategy.stats.map((stat, j) => (
                        <div
                          key={j}
                          className="p-3 bg-(--color-slate)/30 border border-(--color-graphite)"
                        >
                          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <p
                            className="text-sm font-mono font-bold mt-1"
                            style={{ color: strategy.accent }}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{ backgroundColor: strategy.accent }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Metrics bar */}
            <motion.div
              className="grid grid-cols-3 gap-4 p-6 bg-(--color-obsidian) border border-(--color-graphite)"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              {metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-mono font-bold text-(--color-accent-violet) mt-2">
                    {metric.value}
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    {metric.sublabel}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Key message */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
            >
              <p className="text-2xl text-(--color-text-secondary)">
                <span className="text-(--color-accent-violet)">Find what works</span>{" "}
                before scaling spend
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
