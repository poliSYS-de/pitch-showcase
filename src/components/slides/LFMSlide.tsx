"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import DataNumber from "@/components/ui/DataNumber";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function LFMSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!graphRef.current) return;
    const bars = graphRef.current.querySelectorAll(".density-bar");
    const lines = graphRef.current.querySelectorAll(".connection-line");

    if (effectiveInView) {
      gsap.fromTo(
        bars,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        lines,
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    } else {
      gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(lines, { strokeDashoffset: 100 });
    }
  }, [effectiveInView]);

  const densityData = [
    { label: "Traditional", value: 20, color: "var(--color-steel)" },
    { label: "Enhanced", value: 45, color: "var(--color-accent-violet)" },
    { label: "Advanced", value: 70, color: "var(--color-accent-cyan)" },
    { label: "LFM", value: 100, color: "var(--color-accent-burnt)" },
  ];

  return (
    <SlideWrapper id="lfm" background="darker">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left - Content */}
              <div>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                >
                  Large Financial{" "}
                  <span className="text-(--color-accent-burnt)">Model</span>
                </motion.h2>

                <motion.p
                  className="mt-8 text-lg text-(--color-text-muted) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                >
                  Phase 2: A proprietary Large Financial Model built on DeepSeek — numeric-first, integrating global macro, institutional, and trading data. The $15M opportunity.
                </motion.p>

                {/* Key metrics */}
                <div className="mt-12 grid grid-cols-2 gap-8">
                  <motion.div
                    className="p-6 bg-(--color-slate)/30 border-l-2 border-(--color-accent-burnt)"
                    initial={{ opacity: 0, x: -20 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, delay: 0.5, ease }}
                  >
                    <DataNumber
                      value={5}
                      suffix="x"
                      className="text-5xl font-bold"
                      label="Net Increase"
                    />
                    <p className="mt-2 text-sm text-(--color-text-muted)">
                      Overall Numerical Density (Fidelity)
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-(--color-slate)/30 border-l-2 border-(--color-accent-cyan)"
                    initial={{ opacity: 0, x: -20 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, delay: 0.6, ease }}
                  >
                    <p className="text-5xl font-bold text-(--color-accent-cyan)">
                      ∞
                    </p>
                    <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-2">
                      Continuity
                    </p>
                    <p className="mt-2 text-sm text-(--color-text-muted)">
                      Yields Continuity of Disparities
                    </p>
                  </motion.div>
                </div>

              </div>

              {/* Right - Visualization */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                <div className="bg-(--color-obsidian) border border-(--color-graphite) p-8 h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-semibold">Numerical Density Comparison</h3>
                    <span className="text-xs font-mono text-(--color-text-muted)">
                      Fidelity Index
                    </span>
                  </div>

                  {/* Bar chart */}
                  <svg
                    ref={graphRef}
                    viewBox="0 0 400 300"
                    className="w-full h-auto"
                  >
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y, i) => (
                      <g key={i}>
                        <line
                          x1="60"
                          y1={250 - y * 2}
                          x2="380"
                          y2={250 - y * 2}
                          stroke="var(--color-graphite)"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                        <text
                          x="50"
                          y={255 - y * 2}
                          fill="var(--color-text-muted)"
                          fontSize="10"
                          textAnchor="end"
                        >
                          {y}%
                        </text>
                      </g>
                    ))}

                    {/* Bars */}
                    {densityData.map((item, i) => {
                      const x = 80 + i * 80;
                      const height = item.value * 2;
                      return (
                        <g key={i}>
                          <rect
                            className="density-bar"
                            x={x}
                            y={250 - height}
                            width="50"
                            height={height}
                            fill={item.color}
                            rx="2"
                          />
                          <text
                            x={x + 25}
                            y="270"
                            fill="var(--color-text-secondary)"
                            fontSize="10"
                            textAnchor="middle"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Connection lines showing progression */}
                    {densityData.slice(0, -1).map((item, i) => {
                      const x1 = 105 + i * 80 + 25;
                      const x2 = 105 + (i + 1) * 80 + 25;
                      const y1 = 250 - item.value * 2;
                      const y2 = 250 - densityData[i + 1].value * 2;
                      return (
                        <line
                          key={i}
                          className="connection-line"
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="var(--color-accent-cyan)"
                          strokeWidth="2"
                          strokeDasharray="100"
                          strokeDashoffset="100"
                        />
                      );
                    })}

                    {/* LFM highlight */}
                    <circle
                      cx="345"
                      cy="50"
                      r="8"
                      fill="var(--color-accent-burnt)"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Legend */}
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {densityData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-(--color-text-muted)">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
