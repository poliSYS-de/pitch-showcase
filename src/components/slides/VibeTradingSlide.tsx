"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/* ---------- Bullet-Timing chart: Robinhood-style volatile growth ---------- */
// 80 data points — volatile like real portfolio, big spikes + dips towards end
const chartData = [
  5, 6, 5, 7, 8, 7, 9, 11, 10, 12, 14, 13, 15, 14, 17, 19, 18, 16, 20, 22,
  21, 24, 23, 26, 28, 25, 30, 33, 31, 35, 38, 34, 40, 44, 42, 46, 50, 45, 52, 48,
  55, 60, 56, 65, 62, 70, 64, 72, 78, 68, 82, 88, 80, 92, 85, 95, 100, 90, 105, 98,
  110, 120, 108, 130, 118, 140, 125, 150, 135, 155, 145, 165, 150, 170, 160, 180, 165, 175, 185, 170,
];
const maxVal = Math.max(...chartData);
const barCount = chartData.length;

/* Key events at specific indices */
const events: { barIdx: number; label: string; color: string; side: "top" | "bottom" }[] = [
  { barIdx: 8, label: "Entered Long", color: "#00ff88", side: "top" },
  { barIdx: 24, label: "Position Held", color: "#ffcc00", side: "bottom" },
  { barIdx: 40, label: "Vibe Trading", color: "#c084fc", side: "top" },
  { barIdx: 54, label: "Put Hedge", color: "#ff6b6b", side: "bottom" },
  { barIdx: 66, label: "Closed Hedge", color: "#00ddff", side: "top" },
  { barIdx: 78, label: "Closed Long", color: "#00ff88", side: "top" },
];

function GrowthChart({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setDone(false);
      return;
    }
    if (done) return;

    const interval = setInterval(() => {
      setPhase((prev) => {
        if (prev >= barCount) {
          setDone(true);
          return barCount;
        }
        return prev + 1;
      });
    }, 150); // 150ms × 80 bars = ~12s total

    return () => clearInterval(interval);
  }, [isActive, done]);

  // SVG dimensions
  const W = 580;
  const H = 360;
  const padL = 16;
  const padR = 70;
  const padT = 70;
  const padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const barW = chartW / barCount;

  const visibleBars = chartData.slice(0, phase);

  // Build area fill + line path
  const linePoints = visibleBars.map((v, i) => {
    const x = padL + i * barW + barW / 2;
    const y = padT + chartH - (v / maxVal) * chartH;
    return { x, y };
  });

  const linePath = linePoints.length > 1
    ? `M${linePoints.map((p) => `${p.x},${p.y}`).join(" L")}`
    : "";

  // Area fill (line → bottom → back)
  const areaPath = linePoints.length > 1
    ? `${linePath} L${linePoints[linePoints.length - 1].x},${padT + chartH} L${linePoints[0].x},${padT + chartH} Z`
    : "";

  const yLabels = ["$0.00", "$200.0K", "$400.0K", "$600.0K", "$800.0K"];

  // Current dollar value
  const currentVal = visibleBars.length > 0
    ? (visibleBars[visibleBars.length - 1] / maxVal) * 654921.23
    : 0;

  // Day change (simulated)
  const prevVal = visibleBars.length > 1
    ? (visibleBars[visibleBars.length - 2] / maxVal) * 654921.23
    : 0;
  const dayChange = currentVal - prevVal;
  const dayPct = prevVal > 0 ? (dayChange / prevVal) * 100 : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,200,220,0.35)" />
          <stop offset="100%" stopColor="rgba(0,200,220,0.02)" />
        </linearGradient>
      </defs>

      {/* Grid lines — subtle */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = padT + chartH * (1 - pct);
        return (
          <g key={i}>
            <line
              x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="rgba(255,255,255,0.04)" strokeWidth={1}
            />
            {/* Y-axis labels on RIGHT side like Robinhood */}
            <text
              x={W - padR + 8} y={y + 4} textAnchor="start"
              fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="monospace"
            >
              {yLabels[i]}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {["2025", "2026"].map((label, i) => (
        <text
          key={label}
          x={padL + chartW * (i === 0 ? 0.3 : 0.7)} y={H - 8}
          textAnchor="middle" fill="rgba(255,255,255,0.3)"
          fontSize="12" fontFamily="monospace"
        >
          {label}
        </text>
      ))}

      {/* Area fill under line */}
      {areaPath && (
        <path d={areaPath} fill="url(#areaGrad)" />
      )}

      {/* Dark bars — very subtle like original */}
      {visibleBars.map((v, i) => {
        const barH = (v / maxVal) * chartH;
        const x = padL + i * barW;
        const y = padT + chartH - barH;
        return (
          <rect key={i} x={x} y={y}
            width={Math.max(barW - 1, 1.5)} height={barH}
            fill="rgba(0,180,200,0.12)"
          />
        );
      })}

      {/* Main line — bright cyan like Robinhood */}
      {linePath && (
        <path d={linePath} fill="none" stroke="#4dd8e8"
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        />
      )}

      {/* Event dots */}
      {events.map((evt) => {
        if (phase <= evt.barIdx) return null;
        const val = chartData[evt.barIdx];
        const cx = padL + evt.barIdx * barW + barW / 2;
        const cy = padT + chartH - (val / maxVal) * chartH;
        const labelY = evt.side === "top" ? cy - 32 : cy + 24;
        const textLen = evt.label.length * 9 + 20;
        const pillH = 22;
        return (
          <g key={evt.barIdx}>
            <circle cx={cx} cy={cy} r={18} fill="none"
              stroke={evt.color} strokeWidth={1} opacity={0.2}
            />
            <circle cx={cx} cy={cy} r={11} fill="none"
              stroke={evt.color} strokeWidth={2.5} opacity={0.6}
            />
            <circle cx={cx} cy={cy} r={6} fill={evt.color} />
            <line x1={cx} y1={cy} x2={cx}
              y2={evt.side === "top" ? cy - 22 : cy + 16}
              stroke={evt.color} strokeWidth={2} opacity={0.8}
            />
            <rect
              x={cx - textLen / 2} y={labelY - pillH / 2 - 2}
              width={textLen} height={pillH} rx={5}
              fill="rgba(10,10,20,0.9)" stroke={evt.color} strokeWidth={1.5}
            />
            <text x={cx} y={labelY + 5} textAnchor="middle"
              fill={evt.color} fontSize="14" fontFamily="monospace"
              fontWeight="bold"
            >
              {evt.label}
            </text>
          </g>
        );
      })}

      {/* Glow dot at tip of line */}
      {visibleBars.length > 0 && !done && linePoints.length > 0 && (
        <>
          <circle
            cx={linePoints[linePoints.length - 1].x}
            cy={linePoints[linePoints.length - 1].y}
            r={7} fill="rgba(77,216,232,0.25)"
          />
          <circle
            cx={linePoints[linePoints.length - 1].x}
            cy={linePoints[linePoints.length - 1].y}
            r={3} fill="#4dd8e8"
          />
        </>
      )}

      {/* Top left: "Total Value" label */}
      <text x={padL + 4} y={20}
        fill="rgba(255,255,255,0.45)" fontSize="12" fontFamily="monospace"
      >
        Total Value
      </text>

      {/* Big dollar amount */}
      {visibleBars.length > 0 && (
        <text x={padL + 4} y={50}
          fill="white" fontSize="30" fontFamily="monospace" fontWeight="bold"
        >
          ${currentVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </text>
      )}

      {/* Day Change line — green like Robinhood */}
      {visibleBars.length > 2 && (
        <text x={padL + 4} y={66}
          fill="#00ff88" fontSize="11" fontFamily="monospace"
        >
          {dayChange >= 0 ? "+" : ""}${Math.abs(dayChange).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({dayPct >= 0 ? "+" : ""}{dayPct.toFixed(2)}%)
        </text>
      )}
    </svg>
  );
}

export default function VibeTradingSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  return (
    <SlideWrapper id="vibe-trading" background="dark">
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

            {/* Title section */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1">
                MVP Social Trading Platform
              </h2>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                The Social Trading Growth Engine
              </p>
            </motion.div>

            {/* Spacer */}
            <div className="mb-14" />

            {/* Bullet-Timing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left: Bullet-Time Description */}
              <motion.div
                className="flex flex-col justify-center"
                initial={{ opacity: 0, x: -60 }}
                animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-[var(--color-text-primary)]">
                  Bullet-Timing
                </h3>
                <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-5">
                  Freeze a moment in a trade. Rotate around it in time. See all
                  data layers simultaneously — capturing the exact instant a trade
                  turns profitable with unprecedented clarity.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-lg">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)] mt-2.5 shrink-0" />
                    Continuous Intelligent Capture via Agentic UI
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text-secondary)] text-lg">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)] mt-2.5 shrink-0" />
                    Per Social Context Generated Trade Videos
                  </li>
                </ul>
              </motion.div>

              {/* Right: Growth Chart Animation */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                <div className="relative bg-[var(--color-obsidian)] border border-[var(--color-graphite)] rounded-lg h-80 md:h-96 p-4 overflow-hidden">
                  <GrowthChart isActive={effectiveInView} />

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[var(--color-accent-cyan)] rounded-tl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[var(--color-accent-gold)] rounded-br-lg" />
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
