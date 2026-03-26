"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/* Simple SVG icons per phase */
const PhaseIcon = ({ phase, color }: { phase: string; color: string }) => {
  if (phase === "Phase 1") {
    // Rocket / MVP
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M24 6c-4 8-6 16-6 22h12c0-6-2-14-6-22z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15" />
        <path d="M18 28l-4 6h20l-4-6" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1" />
        <circle cx="24" cy="20" r="3" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3" />
        <path d="M20 34v6M28 34v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (phase === "Phase 2") {
    // Network / LFM
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="14" r="5" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
        <circle cx="12" cy="34" r="5" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
        <circle cx="36" cy="34" r="5" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
        <line x1="24" y1="19" x2="12" y2="29" stroke={color} strokeWidth="1.5" />
        <line x1="24" y1="19" x2="36" y2="29" stroke={color} strokeWidth="1.5" />
        <line x1="12" y1="34" x2="36" y2="34" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    );
  }
  // Phase 3 — Sunburst / ASI
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
      <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" strokeDasharray="4 3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={24 + Math.cos(rad) * 10}
            y1={24 + Math.sin(rad) * 10}
            x2={24 + Math.cos(rad) * 20}
            y2={24 + Math.sin(rad) * 20}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default function CorporateOverviewSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const phases = [
    {
      phase: "Phase 1",
      title: "MVP / Agentiq Advisor",
      features: ["First-Time Retail"],
      investment: "$1–3M",
      accentColor: "var(--color-accent-cyan)",
      delayOffset: 0.3,
    },
    {
      phase: "Phase 2",
      title: "LFM",
      features: [
        "Financial Institutions",
        "Large Corporations",
        "Government Organizations",
      ],
      investment: "$15–50M",
      accentColor: "var(--color-accent-violet)",
      delayOffset: 0.4,
    },
    {
      phase: "Phase 3",
      title: "ASI",
      features: [
        "New Financial Instruments",
        "Exchanges",
        "Hedge Funds",
        "New Trading Aggregations",
      ],
      investment: "$500M+",
      accentColor: "var(--color-accent-gold)",
      delayOffset: 0.5,
    },
  ];

  return (
    <SlideWrapper id="corporate-overview" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full flex items-center">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {/* Section label */}
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, x: -50 }}
              animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-sm font-mono text-[var(--color-accent-cyan)] tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              Corporate{" "}
              <span className="text-[var(--color-accent-cyan)]">Overview</span>
            </motion.h2>

            {/* Phase cards container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 mb-4">
              {phases.map((phaseData, idx) => (
                <motion.div
                  key={idx}
                  className="relative flex flex-col bg-[var(--color-slate)]/20 border border-[var(--color-graphite)] p-8 md:p-7 lg:p-8 hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={effectiveInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + phaseData.delayOffset,
                    ease,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 w-full h-[2px]"
                    style={{ backgroundColor: phaseData.accentColor }}
                  />

                  {/* Phase icon (SVG drawing) */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={effectiveInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + phaseData.delayOffset,
                      ease: "easeOut",
                    }}
                  >
                    <PhaseIcon phase={phaseData.phase} color={phaseData.accentColor} />
                  </motion.div>

                  {/* Phase label */}
                  <motion.div
                    className="mb-2"
                    initial={{ opacity: 0 }}
                    animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.35 + phaseData.delayOffset,
                      ease,
                    }}
                  >
                    <span
                      className="text-sm md:text-base font-mono tracking-widest uppercase"
                      style={{ color: phaseData.accentColor }}
                    >
                      {phaseData.phase}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl md:text-2xl lg:text-3xl font-semibold mb-5 text-[var(--color-text-primary)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.38 + phaseData.delayOffset,
                      ease,
                    }}
                  >
                    {phaseData.title}
                  </motion.h3>

                  {/* Features list */}
                  <motion.ul
                    className="space-y-2.5 mb-5"
                    initial="hidden"
                    animate={effectiveInView ? "visible" : "hidden"}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.42 + phaseData.delayOffset,
                        },
                      },
                    }}
                  >
                    {phaseData.features.map((feature, fIdx) => (
                      <motion.li
                        key={fIdx}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.5, ease }}
                        className="text-base md:text-lg text-[var(--color-text-secondary)] flex items-start gap-2"
                      >
                        <span className="text-[var(--color-accent-cyan)] mt-0.5 flex-shrink-0">
                          ▸
                        </span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Spacer to push bottom of card even */}
                  <div className="mt-auto" />
                </motion.div>
              ))}
            </div>

            {/* Timeline connector — dots centered under each card */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 mb-2"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease }}
            >
              {phases.map((phaseData, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3">
                  {/* Dot + connecting lines */}
                  <div className="flex items-center w-full justify-center">
                    {idx > 0 && (
                      <motion.div
                        className="flex-1 h-px bg-[var(--color-graphite)]"
                        initial={{ scaleX: 0 }}
                        animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, delay: 0.75 + idx * 0.1, ease }}
                        style={{ transformOrigin: "right" }}
                      />
                    )}
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: phaseData.accentColor }}
                    />
                    {idx < 2 && (
                      <motion.div
                        className="flex-1 h-px bg-[var(--color-graphite)]"
                        initial={{ scaleX: 0 }}
                        animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, delay: 0.75 + idx * 0.1, ease }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </div>
                  {/* Investment amount box */}
                  <motion.div
                    className="px-6 py-3 border rounded text-center"
                    style={{ borderColor: phaseData.accentColor }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, delay: 0.9 + idx * 0.1, ease }}
                  >
                    <p
                      className="text-xl md:text-2xl font-bold font-mono"
                      style={{ color: phaseData.accentColor }}
                    >
                      {phaseData.investment}
                    </p>
                  </motion.div>
                </div>
              ))}
            </motion.div>

          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
