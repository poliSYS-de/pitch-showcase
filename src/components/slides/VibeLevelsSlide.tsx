"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function VibeLevelsSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const vibeLevels = [
    {
      level: "Learn to Vibe",
      emoji: "📚",
      description:
        "Like Twitch TV for trading. Great traders auction off access to watch them work.",
      accentColor: "var(--color-accent-cyan)",
      delayOffset: 0.3,
    },
    {
      level: "Feel the Vibe",
      emoji: "🎯",
      description:
        "You follow a great trader. Their trades are proportionally copied to your account.",
      accentColor: "var(--color-accent-violet)",
      delayOffset: 0.4,
    },
    {
      level: "Double Vibe",
      emoji: "⚡",
      description:
        "You become a top performer. You inform our model. When others copy your trades, you earn royalties.",
      accentColor: "var(--color-accent-gold)",
      delayOffset: 0.5,
    },
  ];

  return (
    <SlideWrapper id="vibe-levels" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col h-full justify-center">
            {/* Section label */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-xs font-mono text-[var(--color-accent-cyan)] tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              Three Levels of{" "}
              <span className="text-[var(--color-accent-cyan)]">Vibe Trading</span>
            </motion.h2>

            {/* Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {vibeLevels.map((vibe, idx) => (
                <motion.div
                  key={idx}
                  className="relative bg-[var(--color-slate)]/20 border border-[var(--color-graphite)] p-8 hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={
                    effectiveInView
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 40, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + vibe.delayOffset,
                    ease,
                  }}
                >
                  {/* Accent bar at top */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ backgroundColor: vibe.accentColor, transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.35 + vibe.delayOffset,
                      ease,
                    }}
                  />

                  {/* Emoji */}
                  <motion.div
                    className="text-5xl mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={effectiveInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.38 + vibe.delayOffset,
                      ease: "easeOut",
                    }}
                  >
                    {vibe.emoji}
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.36 + vibe.delayOffset,
                      ease,
                    }}
                  >
                    <h4
                      className="text-xl font-bold mb-3"
                      style={{ color: vibe.accentColor }}
                    >
                      {vibe.level}
                    </h4>
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                      {vibe.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Trademark notice — compact footer */}
            <motion.div
              className="text-center pt-4 border-t border-[var(--color-graphite)]"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
            >
              <p className="text-sm text-[var(--color-text-secondary)]">
                Vibe Trading™ — USPTO review pending | 5 classes incl. streaming video &amp; social networking
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
