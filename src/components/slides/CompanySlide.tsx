"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import AnimatedText from "@/components/ui/AnimatedText";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CompanySlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const stats = [
    { label: "Founded", value: "2025", suffix: "" },
    { label: "Focus", value: "FinTech", suffix: "" },
    { label: "Vision", value: "ASI", suffix: "" },
  ];

  return (
    <SlideWrapper id="company" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          {/* Company Side Indicator - Bigger & Nice Cooperation */}
          <motion.div
            className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center gap-12 mix-blend-screen z-20"
            initial={{ opacity: 0, x: -60 }}
            animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ delay: 0.3, duration: 1, ease }}
          >
            {/* Top Line */}
            <motion.div
              className="w-px h-48 bg-linear-to-b from-transparent to-(--color-primary)"
              initial={{ scaleY: 0 }}
              animate={effectiveInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease }}
              style={{ transformOrigin: "bottom" }}
            />

            {/* Label */}
            <div className="relative py-6">
              <span
                className="block text-(--color-primary) font-mono text-4xl tracking-[0.5em] uppercase whitespace-nowrap"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  textShadow: "0 0 15px var(--color-primary)",
                }}
              >
                Company
              </span>
            </div>

            {/* Bottom Line */}
            <motion.div
              className="w-px h-48 bg-linear-to-b from-(--color-primary) to-transparent"
              initial={{ scaleY: 0 }}
              animate={effectiveInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease }}
              style={{ transformOrigin: "top" }}
            />
          </motion.div>

          <div className="max-w-7xl mx-auto w-full lg:pl-32">
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

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
              {/* Left column - Title */}
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -60 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                <AnimatedText
                  key={effectiveInView ? "in" : "out"}
                  text="The Company"
                  tag="h2"
                  type="words"
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                />

                <motion.div
                  className="mt-8 w-24 h-1 bg-(--color-accent-cyan)"
                  initial={{ scaleX: 0 }}
                  animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.div>

              {/* Right column - Description */}
              <motion.div
                className="lg:col-span-7 lg:pt-4"
                initial={{ opacity: 0, x: 60 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                <motion.p
                  className="text-xl md:text-2xl text-(--color-text-secondary) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                >
                  Agentiq Capital is a{" "}
                  <span className="text-(--color-text-primary)">
                    computationally informed financial intelligence
                  </span>{" "}
                  company based in Bellevue, WA.
                </motion.p>

                <motion.p
                  className="mt-6 text-lg text-(--color-text-muted) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                >
                  We are building the future of financial analytics through advanced
                  visualization engines and AI-powered insights. Our mission is to
                  democratize sophisticated market intelligence.
                </motion.p>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              className="mt-24 grid grid-cols-3 gap-8 border-t border-(--color-graphite) pt-12"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-(--color-text-primary)">
                    {stat.value}
                    <span className="text-(--color-accent-cyan)">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-(--color-text-muted) uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Tech stack badges */}
            <motion.div
              className="mt-16 flex flex-wrap gap-3"
              initial="hidden"
              animate={effectiveInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.65 },
                },
              }}
            >
              {[
                "Market Intelligence",
                "Portfolio Command",
                "Signal Discovery",
                "Research Library",
                "Risk Context",
                "Investor Narrative",
              ].map((tech, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6, ease }}
                  className="px-4 py-2 text-xs font-mono text-(--color-text-secondary) border border-(--color-graphite) bg-(--color-slate)/30"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* Decorative element */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-[60%] bg-linear-to-b from-transparent via-(--color-graphite) to-transparent hidden lg:block" />
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
