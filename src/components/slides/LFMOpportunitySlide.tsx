"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const disciplines = [
  "Trade-Books",
  "Finance",
  "Financial Eng.",
  "Global Macro Economics",
];

const modalities = ["Text", "Numbers", "Video", "Spreadsheets"];

/* One Integrated System graph: single source of truth for alignment */
const FLOW_SEG_W = 70;
const FLOW_SEG_W_LAST = 98; /* wider so box fully covers "Global Macro Economics" */
const FLOW_SEG_H = 16;
const FLOW_SEG_GAP = 25;
const FLOW_START_X = 30;
const FLOW_ROW_Y = 32;
const FLOW_ROW_CENTER_Y = FLOW_ROW_Y + FLOW_SEG_H / 2; /* 40 */
const FLOW_DOTS_Y = 58; /* dots on a row below labels to avoid overlap */
function flowSegmentX(i: number) {
  return FLOW_START_X + i * (FLOW_SEG_W + FLOW_SEG_GAP);
}
function flowSegmentW(i: number, total: number) {
  return i === total - 1 ? FLOW_SEG_W_LAST : FLOW_SEG_W;
}
function flowDotCx(i: number, total: number) {
  return flowSegmentX(i) + flowSegmentW(i, total) / 2;
}

export default function LFMOpportunitySlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const flowRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!flowRef.current) return;
    const segments = flowRef.current.querySelectorAll(".flow-segment");
    const dots = flowRef.current.querySelectorAll(".flow-dot");
    if (effectiveInView) {
      gsap.fromTo(segments, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 });
      gsap.fromTo(dots, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.5 });
    } else {
      gsap.set(segments, { opacity: 0 });
      gsap.set(dots, { opacity: 0, scale: 0 });
    }
  }, [effectiveInView]);

  return (
    <SlideWrapper id="lfm-opportunity" background="darker">
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

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
               <span className="text-(--color-accent-burnt)">LFM: </span>The Opportunity
            </motion.h2>

            <motion.p
              className="text-lg text-(--color-text-muted) max-w-3xl mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.4, ease }}
            >
              Present and integrate multi-disciplinary financial projections, pictures, and forward scenarios —
              from Trade-Books to Finance to Financial Engineering to Global Macro Economics, all in one system.
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Discipline flow + Multi-modal */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                <div className="lfm-opportunity-card bg-(--color-obsidian) border border-(--color-graphite) p-8 rounded-sm overflow-hidden">
                  <h3 className="text-lg font-semibold mb-6">One Integrated System</h3>
                  <svg ref={flowRef} viewBox="0 0 430 80" className="w-full h-auto" aria-hidden>
                    {disciplines.map((d, i) => {
                      const x = flowSegmentX(i);
                      const w = flowSegmentW(i, disciplines.length);
                      const isLast = i === disciplines.length - 1;
                      return (
                        <g key={d}>
                          <rect
                            className="flow-segment"
                            x={x}
                            y={FLOW_ROW_Y}
                            width={w}
                            height={FLOW_SEG_H}
                            rx="4"
                            fill="var(--color-slate)"
                            stroke="var(--color-accent-cyan)"
                            strokeWidth="1"
                          />
                          <text x={x + w / 2} y={FLOW_ROW_Y + 11} fill="var(--color-accent-cyan)" fontSize="8" textAnchor="middle" fontWeight="600">
                            {d}
                          </text>
                          {!isLast && (
                            <line
                              x1={x + w}
                              y1={FLOW_ROW_CENTER_Y}
                              x2={flowSegmentX(i + 1)}
                              y2={FLOW_ROW_CENTER_Y}
                              stroke="var(--color-graphite)"
                              strokeWidth="1"
                              strokeDasharray="4,2"
                            />
                          )}
                        </g>
                      );
                    })}
                    {disciplines.map((_, i) => (
                      <g key={`dot-${i}`}>
                        <line
                          x1={flowDotCx(i, disciplines.length)}
                          y1={FLOW_ROW_CENTER_Y}
                          x2={flowDotCx(i, disciplines.length)}
                          y2={FLOW_DOTS_Y}
                          stroke="var(--color-graphite)"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                        <circle
                          className="flow-dot"
                          cx={flowDotCx(i, disciplines.length)}
                          cy={FLOW_DOTS_Y}
                          r="4"
                          fill="var(--color-accent-cyan)"
                          opacity="0.85"
                        />
                      </g>
                    ))}
                  </svg>

                </div>

                <div className="lfm-opportunity-card bg-(--color-obsidian) border border-(--color-graphite) p-6 rounded-sm">
                  <h4 className="text-sm font-semibold mb-4 text-(--color-accent-violet)">Multi-Modal Content</h4>
                  <p className="text-sm text-(--color-text-muted) mb-4">
                    Integrate and present financial content across text, numbers, video, and spreadsheets —
                    from executive narratives to analyst workflows.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {modalities.map((m, i) => (
                      <motion.span
                        key={m}
                        className="lfm-opportunity-pill px-3 py-1.5 text-xs font-mono rounded border border-(--color-graphite) text-(--color-text-secondary) cursor-default"
                        initial={{ opacity: 0, y: 10 }}
                        animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease }}
                      >
                        {m}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Audience & product */}
              <div className="space-y-6">
                <motion.div
                  className="lfm-opportunity-card relative p-8 bg-(--color-obsidian) border border-(--color-graphite) rounded-sm overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.8, delay: 0.55, ease }}
                >
                  <div className="lfm-opportunity-card__accent absolute top-0 left-0 w-full h-1 bg-(--color-accent-gold) rounded-t opacity-90" />
                  <h3 className="text-lg font-semibold mb-4">Unique Product Readiness</h3>
                  <p className="text-sm text-(--color-text-muted) mb-6">
                    Readies us for a unique forward product offering to both our{" "}
                    <strong className="text-(--color-text-secondary)">First-Time Retail Investor Market</strong>{" "}
                    and <strong className="text-(--color-text-secondary)">Major Financial Institutions</strong>.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="lfm-opportunity-badge px-4 py-2 bg-(--color-slate)/50 border border-(--color-graphite) text-sm text-(--color-accent-cyan) rounded cursor-default">
                      Retail
                    </span>
                    <span className="lfm-opportunity-badge px-4 py-2 bg-(--color-slate)/50 border border-(--color-graphite) text-sm text-(--color-accent-burnt) rounded cursor-default">
                      Institutions
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  className="lfm-opportunity-card relative p-8 bg-(--color-obsidian) border border-(--color-graphite) rounded-sm overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.8, delay: 0.7, ease }}
                >
                  <div className="lfm-opportunity-card__accent absolute top-0 left-0 w-full h-1 bg-(--color-accent-cyan) rounded-t opacity-90" />
                  <h3 className="text-lg font-semibold mb-4">Integration at Every Level</h3>
                  <p className="text-sm text-(--color-text-muted)">
                    Unique integrations with existing systems — present financial information at{" "}
                    <strong className="text-(--color-text-secondary)">Customer and Executive</strong> high-levels,
                    as well as <strong className="text-(--color-text-secondary)">Accountant, Analyst, and Book-keeper</strong>{" "}
                    spreadsheets and workflows.
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">High-level</p>
                      <p className="text-sm font-semibold text-(--color-accent-cyan)">Executive / Customer</p>
                    </div>
                    <span className="text-(--color-graphite)">↔</span>
                    <div className="text-center">
                      <p className="text-xs text-(--color-text-muted) uppercase tracking-wider">Workflows</p>
                      <p className="text-sm font-semibold text-(--color-accent-burnt)">Analyst / Book-keeper</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
