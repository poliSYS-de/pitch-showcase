"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function GoToMarketSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const channels = [
    {
      name: "Reddit",
      icon: "🔴",
      highlight: "Near-Zero Cost",
      description: "Where the movement originally began. Organic community growth through authentic engagement.",
      stats: [
        { label: "Cost", value: "Near $0" },
        { label: "Reach", value: "52M+" },
      ],
      accent: "var(--color-accent-burnt)",
    },
    {
      name: "SEO Strategy",
      icon: "🔍",
      highlight: "Germany's SEO Pro's",
      description: "Professional metricking, monitoring, and management for sustainable organic growth.",
      stats: [
        { label: "Approach", value: "Data-Driven" },
        { label: "Focus", value: "Long-term" },
      ],
      accent: "var(--color-accent-cyan)",
    },
  ];

  const timeline = [
    { phase: "Phase 1", action: "Community Building", status: "active" },
    { phase: "Phase 2", action: "Content Marketing", status: "upcoming" },
    { phase: "Phase 3", action: "Paid Acquisition", status: "upcoming" },
    { phase: "Phase 4", action: "Enterprise Sales", status: "upcoming" },
  ];

  return (
    <SlideWrapper id="gtm" background="dark">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
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
              Go-To-<span className="text-(--color-accent-cyan)">Market</span>
            </motion.h2>

            {/* Channel cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-4xl mb-4 block">{channel.icon}</span>
                        <h3 className="text-2xl font-bold">{channel.name}</h3>
                        <p
                          className="text-sm font-mono mt-1"
                          style={{ color: channel.accent }}
                        >
                          {channel.highlight}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-(--color-text-muted) mb-6">
                      {channel.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      {channel.stats.map((stat, j) => (
                        <div
                          key={j}
                          className="p-4 bg-(--color-slate)/30 border border-(--color-graphite)"
                        >
                          <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">
                            {stat.label}
                          </p>
                          <p
                            className="text-xl font-mono font-bold mt-1"
                            style={{ color: channel.accent }}
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
                    style={{ backgroundColor: channel.accent }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
            >
              <h4 className="text-sm text-(--color-text-muted) uppercase tracking-wider mb-8">
                Growth Timeline
              </h4>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-6 left-0 right-0 h-px bg-(--color-graphite)" />

                {/* Timeline items */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      className="relative pt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.1, ease }}
                    >
                      {/* Dot */}
                      <div
                        className={`absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${item.status === "active"
                          ? "border-[var(--color-accent-cyan)]"
                          : "border-[var(--color-obsidian)]"
                          }`}
                      >
                        {item.status === "active" && (
                          <div className="absolute inset-0 rounded-full bg-(--color-accent-cyan) animate-ping opacity-50" />
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-mono text-(--color-text-secondary)">
                          {item.phase}
                        </p>
                        <p
                          className={`text-base font-medium mt-1 ${item.status === "active"
                            ? "text-[var(--color-accent-cyan)]"
                            : "text-white/70"
                            }`}
                        >
                          {item.action}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Key message */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 1, ease }}
            >
              <p className="text-2xl text-(--color-text-secondary)">
                <span className="text-(--color-accent-burnt)">Near-zero cost</span>{" "}
                initial acquisition through authentic community engagement
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
