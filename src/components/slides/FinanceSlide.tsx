"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

export default function FinanceSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!chartRef.current) return;
    const path = chartRef.current.querySelector(".projection-line");
    const dots = chartRef.current.querySelectorAll(".projection-dot");
    const areaFill = chartRef.current.querySelector(".area-fill");
    const labels = labelsRef.current?.querySelectorAll(".projection-label");

    if (effectiveInView) {
      if (path) {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 3, ease: "power2.out" }
        );
      }
      if (areaFill) {
        gsap.fromTo(
          areaFill,
          { opacity: 0 },
          { opacity: 0.2, duration: 2, delay: 0.5, ease: "power2.out" }
        );
      }
      gsap.fromTo(
        dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.4,
          delay: 0.5,
          ease: "back.out(1.7)",
        }
      );
      if (labels) {
        gsap.fromTo(
          labels,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.4,
            delay: 0.7,
            ease: "power2.out",
          }
        );
      }
    } else {
      if (path) {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }
      if (areaFill) gsap.set(areaFill, { opacity: 0 });
      gsap.set(dots, { scale: 0, opacity: 0 });
      if (labels) gsap.set(labels, { opacity: 0, y: 10 });
    }
  }, [effectiveInView]);

  const projections = [
    { year: "Y1", revenue: 1.5, users: "25K" },
    { year: "Y2", revenue: 5, users: "100K" },
    { year: "Y3", revenue: 15, users: "250K" },
    { year: "Y4", revenue: 35, users: "600K" },
    { year: "Y5", revenue: 60, users: "1M" },
  ];

  return (
    <SlideWrapper id="finance" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {/* Section label */}
            <motion.div
              className="mb-4"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              Valuation &{" "}
              <span className="text-(--color-accent-gold)">Projections</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left - Projection chart */}
              <motion.div
                className="bg-(--color-obsidian) border border-(--color-graphite) p-5"
                initial={{ opacity: 0, x: -40 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Revenue Projection</h3>
                  <span className="text-xs font-mono text-(--color-text-muted)">
                    5-Year Forecast
                  </span>
                </div>

                <svg
                  ref={chartRef}
                  viewBox="0 0 400 250"
                  className="w-full h-auto"
                >
                  {/* Grid */}
                  {[0, 15, 30, 45, 60, 75].map((y, i) => (
                    <g key={i}>
                      <line
                        x1="50"
                        y1={220 - y * 2.6}
                        x2="380"
                        y2={220 - y * 2.6}
                        stroke="var(--color-graphite)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="40"
                        y={225 - y * 2.6}
                        fill="var(--color-text-muted)"
                        fontSize="10"
                        textAnchor="end"
                      >
                        ${y}M
                      </text>
                    </g>
                  ))}

                  {/* X-axis labels */}
                  {projections.map((p, i) => (
                    <text
                      key={i}
                      x={70 + i * 75}
                      y="245"
                      fill="var(--color-text-secondary)"
                      fontSize="11"
                      textAnchor="middle"
                    >
                      {p.year}
                    </text>
                  ))}

                  {/* Projection line */}
                  <path
                    className="projection-line"
                    d={`M 70 ${220 - 1.5 * 2.6} 
                    L 145 ${220 - 5 * 2.6} 
                    L 220 ${220 - 15 * 2.6} 
                    L 295 ${220 - 35 * 2.6} 
                    L 370 ${220 - 60 * 2.6}`}
                    fill="none"
                    stroke="var(--color-accent-gold)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {projections.map((p, i) => (
                    <g key={i}>
                      <circle
                        className="projection-dot"
                        cx={70 + i * 75}
                        cy={220 - p.revenue * 2.6}
                        r="6"
                        fill="var(--color-accent-gold)"
                      />
                      <circle
                        cx={70 + i * 75}
                        cy={220 - p.revenue * 2.6}
                        r="10"
                        fill="var(--color-accent-gold)"
                        opacity="0.2"
                      />
                    </g>
                  ))}

                  {/* Area fill */}
                  <path
                    className="area-fill"
                    d={`M 70 220
                    L 70 ${220 - 1.5 * 2.6}
                    L 145 ${220 - 5 * 2.6}
                    L 220 ${220 - 15 * 2.6}
                    L 295 ${220 - 35 * 2.6}
                    L 370 ${220 - 60 * 2.6}
                    L 370 220 Z`}
                    fill="url(#goldGradient)"
                    opacity="0"
                  />


                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent-gold)" />
                      <stop offset="100%" stopColor="var(--color-accent-gold)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Projection table */}
                <div ref={labelsRef} className="mt-6 grid grid-cols-5 gap-2">
                  {projections.map((p, i) => (
                    <div key={i} className="projection-label text-center" style={{ opacity: 0 }}>
                      <p className="text-lg font-mono font-bold text-(--color-accent-gold)">
                        ${p.revenue}M
                      </p>
                      <p className="text-xs text-(--color-text-muted)">
                        {p.users} users
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Metrics & Valuation */}
              <div className="space-y-4">

                {/* GTM Goals Box */}
                <motion.div
                  className="bg-(--color-obsidian) border border-(--color-graphite) p-5 relative overflow-hidden group"
                  initial={{ opacity: 0, x: 40 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                  transition={{ duration: 0.8, delay: 0.5, ease }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-(--color-accent-gold)" />
                  <h3 className="text-sm text-(--color-accent-gold) uppercase tracking-wider mb-4 font-bold">
                    Go-To-Market Goals
                  </h3>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase tracking-wide mb-1">Users</p>
                      <p className="text-3xl font-mono font-bold text-white">1,000,000</p>
                      <p className="text-xs text-(--color-text-muted) mt-1">@ $5.00 / month</p>
                    </div>
                    <div>
                      <p className="text-xs text-(--color-text-muted) uppercase tracking-wide mb-1">ARR</p>
                      <p className="text-3xl font-mono font-bold text-(--color-accent-cyan)">$60M</p>
                      <p className="text-xs text-(--color-text-muted) mt-1">Annual Recurring</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-(--color-graphite)">
                    <p className="text-xs text-(--color-text-muted) uppercase tracking-wide mb-1">Implied Valuation</p>
                    <p className="text-4xl md:text-5xl font-mono font-bold text-(--color-accent-gold)">
                      $240,000,000
                    </p>
                  </div>
                </motion.div>

                {/* TAM Box */}
                <motion.div
                  className="bg-(--color-slate)/10 border border-(--color-graphite) p-5 relative overflow-hidden"
                  initial={{ opacity: 0, x: 40 }}
                  animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
                  transition={{ duration: 0.8, delay: 0.6, ease }}
                >
                  <h3 className="text-sm text-(--color-text-muted) uppercase tracking-wider mb-4 font-bold">
                    Total Addressable Market (TAM)
                  </h3>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-3xl font-mono font-bold text-white">24,000,000</p>
                        <p className="text-xs text-(--color-text-muted) mt-1">Potential Users</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-(--color-text-muted) uppercase tracking-wide mb-1">TAM Valuation</p>
                        <p className="text-2xl md:text-3xl font-mono font-bold text-(--color-accent-cyan)">
                          $5.5B
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Revenue Model Note */}
                <motion.div
                  className="p-4 rounded border border-(--color-graphite)/50 bg-(--color-obsidian)/50"
                  initial={{ opacity: 0 }}
                  animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease }}
                >
                  <p className="text-sm text-(--color-text-secondary) flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-(--color-accent-gold)" />
                    Simple Pricing: <span className="text-white font-bold">$5.00/month</span> flat rate subscription.
                  </p>
                </motion.div>

              </div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
