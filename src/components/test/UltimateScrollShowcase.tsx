"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import DataSphere from "@/components/visualizations/DataSphere";
import RadialChart from "@/components/visualizations/RadialChart";
import GradientSunburst from "@/components/visualizations/GradientSunburst";

type SpineEvent = {
  code: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
};

type SignalTile = {
  title: string;
  value: string;
  detail: string;
  accent: string;
  span: string;
};

const spineEvents: SpineEvent[] = [
  {
    code: "S01",
    title: "Signal Harvest",
    summary: "Aggregate cross-market evidence into a single, ranked thesis.",
    metrics: [
      { label: "Feeds", value: "42" },
      { label: "Latency", value: "4m" },
      { label: "Noise", value: "Low" },
      { label: "Drift", value: "1.4%" },
    ],
  },
  {
    code: "S02",
    title: "Narrative Lock",
    summary: "Bind market context, fundamentals, and flows into one story.",
    metrics: [
      { label: "Cohesion", value: "94%" },
      { label: "Coverage", value: "98%" },
      { label: "Revisions", value: "2" },
      { label: "Bias", value: "Neutral" },
    ],
  },
  {
    code: "S03",
    title: "Execution Gate",
    summary: "Surface trade triggers with explicit timing and risk bounds.",
    metrics: [
      { label: "Triggers", value: "6" },
      { label: "Horizon", value: "Q3" },
      { label: "Drawdown", value: "0.9%" },
      { label: "Exit", value: "Auto" },
    ],
  },
];

const signalTiles: SignalTile[] = [
  {
    title: "Liquidity Pulse",
    value: "0.78",
    detail: "Cross-venue depth & spread symmetry",
    accent: "var(--color-accent)",
    span: "lg:col-span-7",
  },
  {
    title: "Model Integrity",
    value: "96%",
    detail: "Constraint compliance across agents",
    accent: "var(--color-warning)",
    span: "lg:col-span-5",
  },
  {
    title: "Anomaly Index",
    value: "12.4",
    detail: "Live divergence from consensus",
    accent: "var(--color-success)",
    span: "lg:col-span-5",
  },
  {
    title: "Execution Delta",
    value: "18ms",
    detail: "Latency vs intent alignment",
    accent: "var(--color-primary)",
    span: "lg:col-span-7",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

function TerminalHero() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="min-h-[90vh] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
        <motion.div
          className="lg:col-span-7 space-y-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.45em] uppercase">
            Agentiq Scroll Lab
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            The Market Becomes
            <span className="block">A Spatial Console</span>
          </h1>
          <p className="text-sm md:text-base text-(--color-text-secondary) max-w-2xl">
            A fully upgraded visual language: narrative-driven, data-first, and
            engineered to feel like a Bloomberg terminal rendered in motion.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Narrative Signal Flow", "Spatial Risk Surface", "Execution Theater"].map(
              (chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 text-xs font-mono border border-(--color-border) text-(--color-text-secondary)"
                >
                  {chip}
                </span>
              )
            )}
          </div>
        </motion.div>
        <motion.div
          className="lg:col-span-5 bg-(--color-surface) border border-(--color-border) px-6 py-6 space-y-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Session
            </span>
            <span className="text-xs font-mono text-(--color-accent)">LIVE</span>
          </div>
          <div className="text-4xl font-mono">00:38</div>
          <div className="space-y-4">
            {[
              { label: "Signal Density", value: "5.4x" },
              { label: "Consistency", value: "94%" },
              { label: "Decision Time", value: "2.1m" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-(--color-border) pb-2"
              >
                <span className="text-xs font-mono text-(--color-text-secondary)">
                  {item.label}
                </span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1 w-16 bg-(--color-accent)" />
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Upgrade layer engaged
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NarrativeSpine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.45em] uppercase">
            Sequence
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold">Narrative Spine</h2>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            The scroll becomes a decision path. Each stage compresses data into
            a single intent.
          </p>
          <div className="relative h-48 w-6">
            <div className="absolute left-2 top-0 h-full w-px bg-(--color-border)" />
            <motion.div
              className="absolute left-2 top-0 w-px bg-(--color-accent) origin-top"
              style={{ height: "100%", scaleY: lineScale }}
            />
            <div className="absolute left-0 top-0 flex flex-col gap-8">
              {spineEvents.map((event) => (
                <div
                  key={event.code}
                  className="h-3 w-3 border border-(--color-accent) bg-(--color-obsidian)"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8 space-y-10">
        {spineEvents.map((event, index) => (
          <motion.div
            key={event.code}
            className="bg-(--color-surface) border border-(--color-border) px-6 py-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1 * index }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-(--color-accent)">
                {event.code}
              </div>
              <div className="text-xs font-mono text-(--color-text-secondary)">
                Phase {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <h3 className="mt-3 text-xl font-semibold">{event.title}</h3>
            <p className="mt-3 text-sm text-(--color-text-secondary)">
              {event.summary}
            </p>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {event.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-t border-(--color-border) pt-3"
                >
                  <div className="text-xs font-mono text-(--color-text-secondary)">
                    {metric.label}
                  </div>
                  <div className="text-sm font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SignalMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="space-y-8">
      <motion.div
        className="flex flex-wrap items-end justify-between gap-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div>
          <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.45em] uppercase">
            Matrix
          </div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
            Signal Matrix
          </h2>
        </div>
        <p className="max-w-xl text-sm md:text-base text-(--color-text-secondary)">
          Asymmetric tiles provide instant comprehension without flattening the
          data story.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {signalTiles.map((tile, index) => (
          <motion.div
            key={tile.title}
            className={`bg-(--color-surface) border border-(--color-border) px-6 py-6 ${tile.span}`}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.08 * index }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{tile.title}</h3>
                <p className="mt-2 text-xs font-mono text-(--color-text-secondary)">
                  {tile.detail}
                </p>
              </div>
              <div
                className="text-3xl md:text-4xl font-mono"
                style={{ color: tile.accent }}
              >
                {tile.value}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="h-1 w-16" style={{ backgroundColor: tile.accent }} />
              <span className="text-xs font-mono text-(--color-text-secondary)">
                Live stability curve
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SpatialConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sphereScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.9]);
  const sphereRotate = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const sunburstScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.45em] uppercase">
          Spatial
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold">
          Spatial Decision Console
        </h2>
        <p className="text-sm md:text-base text-(--color-text-secondary)">
          Data becomes a navigable surface. The market is no longer a list — it
          is a space.
        </p>
        <div className="space-y-4">
          {[
            "Volumetric context for price action",
            "Layered methodology confidence",
            "Motion tells where to look",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 bg-(--color-accent)" />
              <span className="text-sm text-(--color-text-secondary)">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-(--color-surface) border border-(--color-border) px-6 py-6"
          style={{ scale: sphereScale, rotateZ: sphereRotate }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Data Sphere
            </span>
            <span className="text-xs font-mono text-(--color-accent)">LIVE</span>
          </div>
          <div className="mt-6 flex justify-center">
            <DataSphere size={260} />
          </div>
        </motion.div>
        <motion.div
          className="bg-(--color-surface) border border-(--color-border) px-6 py-6"
          style={{ scale: sunburstScale }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Allocation Sunburst
            </span>
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Snapshot
            </span>
          </div>
          <div className="mt-6 flex justify-center">
            <GradientSunburst size={240} />
          </div>
        </motion.div>
        <div className="md:col-span-2 bg-(--color-surface) border border-(--color-border) px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Methodology Pulse
            </span>
            <span className="text-xs font-mono text-(--color-text-secondary)">
              5-Layer
            </span>
          </div>
          <div className="mt-6 flex flex-col lg:flex-row items-center gap-8">
            <RadialChart size={260} />
            <div className="space-y-4">
              {[
                { label: "Market", value: "85%" },
                { label: "Fundamentals", value: "72%" },
                { label: "Technicals", value: "90%" },
                { label: "Quant", value: "68%" },
                { label: "Dynamic", value: "78%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-6 border-b border-(--color-border) pb-2"
                >
                  <span className="text-xs font-mono text-(--color-text-secondary)">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShockFinale() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1.03]);

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <motion.div
        className="lg:col-span-7 bg-(--color-surface) border border-(--color-border) px-8 py-8 space-y-6"
        style={{ scale }}
      >
        <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.45em] uppercase">
          Finale
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold">
          This Is Not A Slide Deck
        </h2>
        <p className="text-sm md:text-base text-(--color-text-secondary)">
          It is a decision engine in motion. A scroll narrative that makes data
          tactile, the story legible, and the opportunity unforgettable.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Clarity", value: "High" },
            { label: "Speed", value: "2.1m" },
            { label: "Trust", value: "A+" },
            { label: "Recall", value: "95%" },
          ].map((item) => (
            <div key={item.label} className="border border-(--color-border) px-4 py-3">
              <div className="text-xs font-mono text-(--color-text-secondary)">
                {item.label}
              </div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-(--color-obsidian) border border-(--color-border) px-6 py-6">
          <div className="text-xs font-mono text-(--color-text-secondary)">
            Consensus Ledger
          </div>
          <div className="mt-4 text-4xl font-mono text-(--color-accent)">
            0.92
          </div>
          <div className="mt-2 text-xs font-mono text-(--color-text-secondary)">
            Weighted confidence score
          </div>
        </div>
        <div className="bg-(--color-surface) border border-(--color-border) px-6 py-6">
          <div className="text-xs font-mono text-(--color-text-secondary)">
            Execution Window
          </div>
          <div className="mt-4 text-4xl font-mono">11:32</div>
          <div className="mt-2 text-xs font-mono text-(--color-text-secondary)">
            Optimal entry identified
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UltimateScrollShowcase() {
  return (
    <div className="space-y-28">
      <TerminalHero />
      <NarrativeSpine />
      <SignalMatrix />
      <SpatialConsole />
      <ShockFinale />
    </div>
  );
}
