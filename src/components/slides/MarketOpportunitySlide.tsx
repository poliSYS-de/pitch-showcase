"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/* Robinhood feather logo — black on neon-green */
const RobinhoodFeather = () => (
  <div className="w-full max-w-[220px] aspect-square rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#CCFF00" }}>
    <svg viewBox="0 0 100 100" className="w-3/4 h-3/4" fill="none">
      {/* Stylized feather / quill */}
      <path
        d="M65 15C55 25 42 42 38 58C36 66 36 74 38 82C40 74 44 66 50 58C54 52 60 46 66 42C60 50 54 60 52 70C50 76 50 80 52 86C56 78 62 68 70 60C76 54 80 50 84 48C78 54 72 62 68 72C66 78 66 82 68 88C74 76 78 64 82 52C86 40 86 28 82 18C78 22 72 20 65 15Z"
        fill="#1a1a1a"
      />
    </svg>
  </div>
);

/* Radial sunburst chart — multi-ring visualization */
const RadialSunburst = () => {
  const rings = [
    { radius: 38, segments: 12, colors: ["#00C853","#2E7D32","#43A047","#66BB6A","#81C784","#A5D6A7","#C8E6C9","#00C853","#2E7D32","#43A047","#66BB6A","#81C784"] },
    { radius: 30, segments: 8, colors: ["#FF9800","#F57C00","#FB8C00","#FFA726","#FFB74D","#FF9800","#F57C00","#FB8C00"] },
    { radius: 22, segments: 6, colors: ["#00BCD4","#0097A7","#00ACC1","#26C6DA","#4DD0E1","#00BCD4"] },
  ];

  return (
    <div className="w-full max-w-[220px] aspect-square rounded-lg overflow-hidden border border-[var(--color-graphite)] bg-[#1a1a1a] flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {rings.map((ring, ri) =>
          ring.segments > 0 && Array.from({ length: ring.segments }).map((_, si) => {
            const angle = (360 / ring.segments) * si - 90;
            const angleEnd = (360 / ring.segments) * (si + 1) - 90;
            const r = ring.radius;
            const innerR = ri < rings.length - 1 ? rings[ri + 1].radius : 14;
            const rad1 = (angle * Math.PI) / 180;
            const rad2 = (angleEnd * Math.PI) / 180;
            const x1 = 50 + r * Math.cos(rad1);
            const y1 = 50 + r * Math.sin(rad1);
            const x2 = 50 + r * Math.cos(rad2);
            const y2 = 50 + r * Math.sin(rad2);
            const x3 = 50 + innerR * Math.cos(rad2);
            const y3 = 50 + innerR * Math.sin(rad2);
            const x4 = 50 + innerR * Math.cos(rad1);
            const y4 = 50 + innerR * Math.sin(rad1);
            const largeArc = 360 / ring.segments > 180 ? 1 : 0;
            return (
              <path
                key={`${ri}-${si}`}
                d={`M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${x3},${y3} A${innerR},${innerR} 0 ${largeArc},0 ${x4},${y4} Z`}
                fill={ring.colors[si % ring.colors.length]}
                stroke="#1a1a1a"
                strokeWidth="0.5"
              />
            );
          })
        )}
        {/* Center circle with price */}
        <circle cx="50" cy="50" r="14" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
        <text x="50" y="48" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold">$238.12</text>
        <text x="50" y="54" textAnchor="middle" fill="#999" fontSize="3.5">AAPL</text>
      </svg>
    </div>
  );
};

export default function MarketOpportunitySlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  const socialTradingFeatures = [
    {
      title: "Bullet-Timing Trade & Analytics Video",
      description: "Shareable by channel",
      icon: "▶",
    },
    {
      title: "Dynamic Broadcast",
      description: "Topics, Trade Styles, Stocks, Video Attributes",
      icon: "◉",
    },
    {
      title: "Vibe Trading",
      description: "The next evolution in social trading",
      icon: "✦",
    },
  ];

  return (
    <SlideWrapper id="market-opportunity" background="dark">
      <div ref={ref} className="relative z-10 h-full w-full overflow-hidden">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {/* Section label */}
            <motion.div
              className="mb-3"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              MVP Market <span className="text-[var(--color-accent-cyan)]">Opportunity</span>
            </motion.h2>

            {/* Two-column layout — fills vertical space */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
              {/* LEFT COLUMN: Missing Information Channel */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -60 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                <div className="h-full flex flex-col items-center justify-center">
                  {/* Column header */}
                  <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-[var(--color-text-primary)] self-start">
                    Missing Information Channel
                  </h3>

                  {/* Visualization: RH Feather Logo + Divider + Radial Sunburst */}
                  <motion.div
                    className="flex items-stretch justify-center gap-0 w-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={effectiveInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.45, ease }}
                  >
                    {/* Left: Trading — Robinhood Feather Logo */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <span className="text-sm font-mono text-[#CCFF00] tracking-wider uppercase font-semibold">
                        Trading
                      </span>
                      <RobinhoodFeather />
                    </div>

                    {/* Center: Green divider line */}
                    <div className="w-1 self-stretch rounded-full bg-[#00ff88] flex-shrink-0 mx-2" />

                    {/* Right: Information — Radial Sunburst Chart */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <span className="text-sm font-mono text-[var(--color-accent-cyan)] tracking-wider uppercase font-semibold">
                        Information
                      </span>
                      <RadialSunburst />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* RIGHT COLUMN: Social Trading Platform */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 60 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                <div className="h-full flex flex-col">
                  {/* Column header */}
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[var(--color-text-primary)]">
                    Social Trading Platform
                  </h3>

                  {/* Reference points */}
                  <motion.div
                    className="mb-5 flex flex-wrap gap-2"
                    initial="hidden"
                    animate={effectiveInView ? "visible" : "hidden"}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.08,
                          delayChildren: 0.45,
                        },
                      },
                    }}
                  >
                    {["Reddit", "Roaring Kitty", "Halted Trading"].map(
                      (ref, idx) => (
                        <motion.span
                          key={idx}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 },
                          }}
                          transition={{ duration: 0.5, ease }}
                          className="text-xs font-mono px-3 py-1 bg-[var(--color-slate)]/40 border border-[var(--color-graphite)] text-[var(--color-text-muted)]"
                        >
                          {ref}
                        </motion.span>
                      )
                    )}
                  </motion.div>

                  {/* Features list */}
                  <motion.div
                    className="space-y-3"
                    initial="hidden"
                    animate={effectiveInView ? "visible" : "hidden"}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.5,
                        },
                      },
                    }}
                  >
                    {socialTradingFeatures.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.6, ease }}
                        className="p-3 bg-[var(--color-slate)]/20 border border-[var(--color-graphite)] hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg text-[var(--color-accent-cyan)] flex-shrink-0 mt-0.5">
                            {feature.icon}
                          </span>
                          <div>
                            <h4 className="font-semibold text-[var(--color-text-primary)] text-sm mb-0.5">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
