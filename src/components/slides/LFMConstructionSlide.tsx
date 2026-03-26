"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import DataNumber from "@/components/ui/DataNumber";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const experts = [
  { label: "Coder", color: "var(--color-accent-cyan)", desc: "Code & structure" },
  { label: "Prover", color: "var(--color-accent-violet)", desc: "Proof & logic" },
  { label: "Math", color: "var(--color-accent-burnt)", desc: "Numerics" },
];

// Diagram geometry: expert boxes bottom center y = 44, ellipse top y = 78, ellipse bottom y = 142, data-plane top y = 175
const EXPERT_Y_TOP = 16;
const EXPERT_Y_BOTTOM = 44;
const EXPERT_CENTERS = [80, 160, 240];
const CORE_CX = 160;
const CORE_TOP = 78;
const CORE_BOTTOM = 142;
const DATA_PLANE_TOP = 175;
const DASH_LENGTH = 100;

export default function LFMConstructionSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!diagramRef.current) return;
    const lines = diagramRef.current.querySelectorAll(".moe-line");
    const nodes = diagramRef.current.querySelectorAll(".moe-node");
    if (effectiveInView) {
      gsap.fromTo(
        lines,
        { strokeDashoffset: DASH_LENGTH },
        { strokeDashoffset: 0, duration: 1, stagger: 0.1, ease: "power2.out", delay: 0.3 }
      );
      gsap.fromTo(
        nodes,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );
    } else {
      gsap.set(lines, { strokeDashoffset: DASH_LENGTH });
      gsap.set(nodes, { opacity: 0, scale: 0.85 });
    }
  }, [effectiveInView]);

  return (
    <SlideWrapper id="lfm-construction" background="darker">
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
                   <span className="text-(--color-accent-burnt)">LFM: </span>The Construction
                </motion.h2>

                <motion.p
                  className="mt-6 text-(--color-text-muted) leading-relaxed"
                  initial={{ opacity: 0, y: 50 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                >
                  Architected with <strong className="text-(--color-accent-cyan)">Mixture of Experts</strong>,
                  leveraging DeepSeek sub-systems for financial numerics.
                </motion.p>

                <ul className="mt-10 space-y-6">
                  {[
                    {
                      title: "MoE Architecture",
                      text: "Coder, Prover, and Math experts derive special handling and understanding of financial numerics.",
                      accent: "var(--color-accent-cyan)",
                    },
                    {
                      title: "Minimized Training Costs",
                      text: "DeepSeek MoE has achieved the greatest capabilities at the lowest training costs. Trained on the Agentiq Capital Data-Plane.",
                      accent: "var(--color-accent-violet)",
                    },
                    {
                      title: "Traits Inherited",
                      text: "5x Numerical Fidelity and Continuity of Disparate Financial Disciplines and Systems.",
                      accent: "var(--color-accent-burnt)",
                    },
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease }}
                    >
                      <div
                        className="w-1 shrink-0 rounded-full mt-1.5 h-8"
                        style={{ backgroundColor: item.accent }}
                      />
                      <div>
                        <h4 className="font-semibold text-(--color-text-primary)" style={{ color: item.accent }}>
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm text-(--color-text-muted)">{item.text}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                >
                  <div className="bg-(--color-obsidian) border border-(--color-graphite) p-8">
                    <h3 className="text-lg font-semibold mb-6">Mixture of Experts</h3>
                    <svg
                      ref={diagramRef}
                      viewBox="0 0 320 220"
                      className="w-full h-auto"
                    >
                      <defs>
                        <linearGradient id="moe-core-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-accent-cyan)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity="0.04" />
                        </linearGradient>
                        <filter id="moe-core-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feFlood floodColor="var(--color-accent-cyan)" floodOpacity="0.25" />
                          <feComposite in2="blur" operator="in" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="moe-node-shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="var(--color-charcoal)" floodOpacity="0.6" />
                        </filter>
                      </defs>

                      {/* Lines: expert bottom center → ellipse top (all meet at CORE_CX, CORE_TOP) */}
                      <line className="moe-line" x1={EXPERT_CENTERS[0]} y1={EXPERT_Y_BOTTOM} x2={CORE_CX} y2={CORE_TOP} stroke="var(--color-accent-cyan)" strokeWidth="2" strokeDasharray={DASH_LENGTH} strokeDashoffset={DASH_LENGTH} fill="none" strokeLinecap="round" />
                      <line className="moe-line" x1={EXPERT_CENTERS[1]} y1={EXPERT_Y_BOTTOM} x2={CORE_CX} y2={CORE_TOP} stroke="var(--color-accent-violet)" strokeWidth="2" strokeDasharray={DASH_LENGTH} strokeDashoffset={DASH_LENGTH} fill="none" strokeLinecap="round" />
                      <line className="moe-line" x1={EXPERT_CENTERS[2]} y1={EXPERT_Y_BOTTOM} x2={CORE_CX} y2={CORE_TOP} stroke="var(--color-accent-burnt)" strokeWidth="2" strokeDasharray={DASH_LENGTH} strokeDashoffset={DASH_LENGTH} fill="none" strokeLinecap="round" />
                      {/* Trunk: ellipse bottom → Data-Plane top */}
                      <line className="moe-line" x1={CORE_CX} y1={CORE_BOTTOM} x2={CORE_CX} y2={DATA_PLANE_TOP} stroke="var(--color-accent-violet)" strokeWidth="2" strokeDasharray={DASH_LENGTH} strokeDashoffset={DASH_LENGTH} fill="none" strokeLinecap="round" />

                      {/* Expert nodes */}
                      {experts.map((ex, i) => {
                        const x = EXPERT_CENTERS[i];
                        const boxW = 56;
                        const boxH = 28;
                        return (
                          <g key={ex.label} className="moe-node" filter="url(#moe-node-shadow)">
                            <rect x={x - boxW / 2} y={EXPERT_Y_TOP} width={boxW} height={boxH} rx="6" fill="var(--color-obsidian)" stroke={ex.color} strokeWidth="1.5" />
                            <text x={x} y={EXPERT_Y_TOP + 18} fill={ex.color} fontSize="10" fontWeight="600" textAnchor="middle">{ex.label}</text>
                          </g>
                        );
                      })}

                      {/* Center: LFM MoE Core (ellipse with glow) */}
                      <g filter="url(#moe-core-glow)">
                        <motion.ellipse
                          cx={CORE_CX}
                          cy="110"
                          rx="52"
                          ry="32"
                          fill="url(#moe-core-fill)"
                          stroke="var(--color-accent-cyan)"
                          strokeWidth="2"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: 0.2, ease }}
                        />
                      </g>
                      <motion.text
                        x={CORE_CX}
                        y="108"
                        fill="var(--color-accent-cyan)"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.35, ease }}
                      >
                        LFM
                      </motion.text>
                      <motion.text
                        x={CORE_CX}
                        y="122"
                        fill="var(--color-text-muted)"
                        fontSize="9"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.4, ease }}
                      >
                        MoE Core
                      </motion.text>

                      {/* Data-Plane badge */}
                      <motion.rect
                        x="100"
                        y={DATA_PLANE_TOP}
                        width="120"
                        height="24"
                        rx="6"
                        fill="var(--color-graphite)"
                        stroke="var(--color-accent-violet)"
                        strokeWidth="1.5"
                        initial={{ opacity: 0 }}
                        animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.9, ease }}
                      />
                      <motion.text
                        x="160"
                        y={DATA_PLANE_TOP + 16}
                        fill="var(--color-text-muted)"
                        fontSize="9"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 1, ease }}
                      >
                        Agentiq Data-Plane
                      </motion.text>
                    </svg>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-6">
                  <motion.div
                    className="p-6 bg-(--color-slate)/30 border-l-2 border-(--color-accent-burnt)"
                    initial={{ opacity: 0, x: -20 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, delay: 0.6, ease }}
                  >
                    <DataNumber value={5} suffix="x" className="text-4xl font-bold" label="Numerical Fidelity" />
                    <p className="mt-2 text-sm text-(--color-text-muted)">Net increase in density</p>
                  </motion.div>
                  <motion.div
                    className="p-6 bg-(--color-slate)/30 border-l-2 border-(--color-accent-cyan)"
                    initial={{ opacity: 0, x: 20 }}
                    animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.8, delay: 0.7, ease }}
                  >
                    <p className="text-4xl font-bold text-(--color-accent-cyan)">∞</p>
                    <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mt-2">Continuity</p>
                    <p className="mt-2 text-sm text-(--color-text-muted)">Disparate disciplines, one system</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
