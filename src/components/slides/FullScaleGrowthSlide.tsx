"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FullScaleGrowthSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const channels = [
    {
      name: "Paid Acquisition",
      icon: "📈",
      highlight: "Scale Proven Channels",
      description: "Aggressive spend on validated acquisition channels. Multiply what works.",
      budget: "60%",
      accent: "var(--color-accent-gold)",
    },
    {
      name: "Strategic Partnerships",
      icon: "🤝",
      highlight: "Financial Influencers & Media",
      description: "Partner with financial content creators, news outlets, and industry platforms.",
      budget: "25%",
      accent: "var(--color-accent-cyan)",
    },
    {
      name: "Enterprise Sales",
      icon: "🏢",
      highlight: "B2B & Institutional",
      description: "Direct outreach to trading floors, hedge funds, and institutional investors.",
      budget: "15%",
      accent: "var(--color-accent-violet)",
    },
  ];

  const projections = [
    { label: "Target Users", value: "1M+", sublabel: "Year 2 goal" },
    { label: "Marketing Budget", value: "$2M+", sublabel: "Annual spend" },
    { label: "Revenue Target", value: "$60M", sublabel: "ARR goal" },
  ];

  return (
    <SlideWrapper id="full-scale-growth" background="dark">
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
              <span className="text-xs font-mono text-(--color-accent-gold) tracking-widest uppercase">
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
              Full Scale <span className="text-(--color-accent-gold)">Growth</span>
            </motion.h2>
            <motion.p
              className="text-xl text-(--color-text-muted) mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
            >
              Maximum Investment: Pour Fuel on the Fire
            </motion.p>

            {/* Channel cards with budget allocation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {channels.map((channel, i) => (
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
                    style={{ backgroundColor: channel.accent }}
                  />

                  <div className="p-6">
                    {/* Header with budget badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-3xl mb-3 block">{channel.icon}</span>
                        <h3 className="text-xl font-bold">{channel.name}</h3>
                        <p
                          className="text-xs font-mono mt-1"
                          style={{ color: channel.accent }}
                        >
                          {channel.highlight}
                        </p>
                      </div>
                      <div
                        className="text-2xl font-mono font-bold"
                        style={{ color: channel.accent }}
                      >
                        {channel.budget}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-(--color-text-muted)">
                      {channel.description}
                    </p>

                    {/* Budget bar */}
                    <div className="mt-4 h-2 bg-(--color-graphite) rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: channel.accent }}
                        initial={{ width: 0 }}
                        animate={effectiveInView ? { width: channel.budget } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.6 + i * 0.1, ease }}
                      />
                    </div>
                  </div>

                  {/* Hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{ backgroundColor: channel.accent }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Projections bar */}
            <motion.div
              className="grid grid-cols-3 gap-4 p-6 bg-(--color-obsidian) border border-(--color-graphite)"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
            >
              {projections.map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-3xl font-mono font-bold text-(--color-accent-gold) mt-2">
                    {item.value}
                  </p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    {item.sublabel}
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
                <span className="text-(--color-accent-gold)">Proven playbook</span>{" "}
                → Aggressive scaling with your investment
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
