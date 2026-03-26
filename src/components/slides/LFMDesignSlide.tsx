"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const modalities = [
  { label: "Text", sub: "Data · Reports", color: "var(--color-accent-cyan)" },
  { label: "Audio", sub: "Calls · Briefings", color: "var(--color-accent-violet)" },
  { label: "Video", sub: "Presentations", color: "var(--color-accent-burnt)" },
];

const BOX_W = 88;
const BOX_H = 52;
const GAP = 14;
const COLUMN_X = 268;
const BOX_Y = [18, 18 + BOX_H + GAP, 18 + (BOX_H + GAP) * 2];
const MERGE_X = 200;
const MERGE_Y = 100;
const NUMERIC_X = 48;
const NUMERIC_W = 128;
const NUMERIC_RIGHT = NUMERIC_X + NUMERIC_W;

export default function LFMDesignSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!pipelineRef.current) return;
    const paths = pipelineRef.current.querySelectorAll(".modality-path");
    const nodes = pipelineRef.current.querySelectorAll(".modality-node");
    const numericGlow = pipelineRef.current.querySelector(".numeric-glow");
    const numericDots = pipelineRef.current.querySelectorAll(".numeric-dot");
    const flowLabel = pipelineRef.current.querySelectorAll(".flow-label");

    if (effectiveInView) {
      if (numericGlow) {
        gsap.fromTo(numericGlow, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" });
      }
      gsap.fromTo(
        numericDots,
        { opacity: 0, scale: 0 },
        { opacity: 0.5, scale: 1, duration: 0.4, stagger: { each: 0.02, from: "start" }, delay: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        paths,
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: "power2.inOut", delay: 0.4 }
      );
      gsap.fromTo(
        nodes,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.85 }
      );
      gsap.fromTo(
        flowLabel,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.06, delay: 1.2 }
      );
    } else {
      gsap.set(paths, { strokeDashoffset: 200 });
      gsap.set(nodes, { opacity: 0, x: 20 });
      gsap.set(flowLabel, { opacity: 0 });
      if (numericGlow) gsap.set(numericGlow, { opacity: 0, scale: 0.92 });
      gsap.set(numericDots, { opacity: 0, scale: 0 });
    }
  }, [effectiveInView]);

  return (
    <SlideWrapper id="lfm-design" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full">
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
              <div>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                >
                  <span className="text-(--color-accent-burnt)">LFM: </span>The Design
                </motion.h2>

                <motion.p
                  className="mt-8 text-lg text-(--color-text-muted) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                >
                  A GPT with <strong className="text-(--color-accent-cyan)">Financial Numerics</strong> as the first modality —
                  P&L, balances, flows, and market data reason first; then Text, Audio, and Video.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-wrap gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                >
                  {["P&L · Balances", "Flows · Ratios", "Market Data"].map((term, i) => (
                    <span
                      key={term}
                      className="px-3 py-1.5 text-xs font-mono border border-(--color-graphite) text-(--color-text-muted) bg-(--color-slate)/40"
                    >
                      {term}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  className="mt-8 p-6 bg-(--color-slate)/30 border-l-2 border-(--color-accent-burnt)"
                  initial={{ opacity: 0, x: -20 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, delay: 0.55, ease }}
                >
                  <p className="text-sm text-(--color-text-secondary)">
                    <strong className="text-(--color-accent-burnt)">Numeric-first reasoning</strong> over financial data
                    before generating reports, calls, or presentations — aligned with how institutions actually work.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                <div className="relative bg-(--color-obsidian) border border-(--color-graphite) p-8 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Financial Modality Pipeline</h3>
                    <span className="text-[10px] font-mono text-(--color-text-muted) uppercase tracking-wider">
                      Data → Reason → Output
                    </span>
                  </div>

                  {/* Background grid - finance terminal feel */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm" aria-hidden>
                    <div className="absolute left-8 right-8 top-24 bottom-8 border border-(--color-graphite)/50 rounded" />
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute left-8 right-8 border-t border-(--color-graphite)/30"
                        style={{ top: `calc(6rem + ${(i + 1) * 22}%)` }}
                      />
                    ))}
                  </div>

                  <svg
                    ref={pipelineRef}
                    viewBox="0 0 480 208"
                    className="w-full h-auto relative z-10"
                  >
                    <defs>
                      <linearGradient id="numeric-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-accent-burnt)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--color-accent-burnt)" stopOpacity="0.08" />
                      </linearGradient>
                      <filter id="numeric-glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feFlood floodColor="var(--color-accent-burnt)" floodOpacity="0.4" />
                        <feComposite in2="blur" operator="in" />
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-accent-burnt)" />
                        <stop offset="50%" stopColor="var(--color-accent-cyan)" />
                        <stop offset="100%" stopColor="var(--color-accent-cyan)" />
                      </linearGradient>
                    </defs>

                    {/* Vertical centerline hint */}
                    <line x1="200" y1="0" x2="200" y2="200" stroke="var(--color-graphite)" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.4" />

                    {/* Numeric block - primary modality */}
                    <g className="numeric-glow" filter="url(#numeric-glow)">
                      <rect
                        x={NUMERIC_X}
                        y="44"
                        width={NUMERIC_W}
                        height="112"
                        rx="8"
                        fill="url(#numeric-fill)"
                        stroke="var(--color-accent-burnt)"
                        strokeWidth="2"
                      />
                    </g>
                    <rect
                      x={NUMERIC_X}
                      y="44"
                      width={NUMERIC_W}
                      height="112"
                      rx="8"
                      fill="url(#numeric-fill)"
                      stroke="var(--color-accent-burnt)"
                      strokeWidth="2"
                    />
                    {/* Dense grid dots - financial data feel */}
                    {[12, 28, 44, 60, 76, 92].map((dx, i) =>
                      [62, 78, 94, 110, 126, 142].map((py, j) => (
                        <circle
                          key={`${i}-${j}`}
                          className="numeric-dot"
                          cx={NUMERIC_X + dx}
                          cy={py}
                          r="1.5"
                          fill="var(--color-accent-burnt)"
                          opacity="0.5"
                        />
                      ))
                    )}
                    <text x={NUMERIC_X + NUMERIC_W / 2} y="88" fill="var(--color-accent-burnt)" fontSize="11" fontWeight="bold" textAnchor="middle">Financial</text>
                    <text x={NUMERIC_X + NUMERIC_W / 2} y="102" fill="var(--color-accent-burnt)" fontSize="11" fontWeight="bold" textAnchor="middle">Numerics</text>
                    <text x={NUMERIC_X + NUMERIC_W / 2} y="120" fill="var(--color-text-muted)" fontSize="9" textAnchor="middle">Primary</text>
                    <text x={NUMERIC_X + NUMERIC_W / 2} y="132" fill="var(--color-text-muted)" fontSize="9" textAnchor="middle">Modality</text>
                    {/* Small finance glyphs */}
                    <text x={NUMERIC_X + NUMERIC_W - 17} y="72" fill="var(--color-accent-burnt)" fontSize="8" opacity="0.7">Σ %</text>
                    <text x={NUMERIC_X + NUMERIC_W - 17} y="148" fill="var(--color-accent-burnt)" fontSize="8" opacity="0.7">1st</text>

                    {/* Three branches: from each modality node to merge point */}
                    {[0, 1, 2].map((i) => {
                      const cy = BOX_Y[i] + BOX_H / 2;
                      return (
                        <path
                          key={i}
                          className="modality-path"
                          d={`M ${COLUMN_X} ${cy} L ${MERGE_X} ${MERGE_Y}`}
                          fill="none"
                          stroke={i === 1 ? "var(--color-accent-cyan)" : "url(#path-gradient)"}
                          strokeWidth="1.5"
                          strokeDasharray="200"
                          strokeDashoffset="200"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {/* Trunk: merge point to Financial Numerics */}
                    <path
                      className="modality-path"
                      d={`M ${MERGE_X} ${MERGE_Y} L ${NUMERIC_RIGHT} ${MERGE_Y}`}
                      fill="none"
                      stroke="url(#path-gradient)"
                      strokeWidth="1.5"
                      strokeDasharray="200"
                      strokeDashoffset="200"
                      strokeLinecap="round"
                    />

                    {/* Secondary modality blocks - vertical column, lines merge then to Numerics */}
                    {modalities.map((mod, i) => (
                      <g key={mod.label} className="modality-node">
                        <rect
                          x={COLUMN_X}
                          y={BOX_Y[i]}
                          width={BOX_W}
                          height={BOX_H}
                          rx="8"
                          fill="var(--color-obsidian)"
                          stroke={mod.color}
                          strokeWidth="1.5"
                        />
                        <text x={COLUMN_X + BOX_W / 2} y={BOX_Y[i] + 22} fill={mod.color} fontSize="13" fontWeight="700" textAnchor="middle">{mod.label}</text>
                        <text className="flow-label" x={COLUMN_X + BOX_W / 2} y={BOX_Y[i] + 38} fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">{mod.sub}</text>
                      </g>
                    ))}
                  </svg>

                  <p className="mt-6 text-xs text-(--color-text-muted) text-center font-mono">
                    Numeric-first → Text · Audio · Video
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
