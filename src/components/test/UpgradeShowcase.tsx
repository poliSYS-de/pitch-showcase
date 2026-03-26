"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Metric = {
  label: string;
  value: string;
};

type RailItem = {
  code: string;
  title: string;
  meta: string;
  summary: string;
  metrics: Metric[];
};

type SignalItem = {
  title: string;
  descriptor: string;
  value: string;
  span: string;
  accent: string;
  chips: string[];
};

type StackLayer = {
  title: string;
  subtitle: string;
  score: string;
  detail: string;
  offset: string;
};

const railItems: RailItem[] = [
  {
    code: "A01",
    title: "Market Sensemaking",
    meta: "Context Capture",
    summary: "Turn raw signals into a narrative that explains why this moment matters.",
    metrics: [
      { label: "Signals", value: "148" },
      { label: "Curated", value: "32" },
      { label: "Confidence", value: "92%" },
      { label: "Latency", value: "4m" },
    ],
  },
  {
    code: "A02",
    title: "Model Alignment",
    meta: "Consensus Layer",
    summary: "Align models to a single thesis with transparent weight and attribution.",
    metrics: [
      { label: "Models", value: "9" },
      { label: "Variance", value: "0.18" },
      { label: "Drift", value: "1.4%" },
      { label: "Revisions", value: "3" },
    ],
  },
  {
    code: "A03",
    title: "Execution Readiness",
    meta: "Decision Gate",
    summary: "Expose decision thresholds with clear triggers and exit conditions.",
    metrics: [
      { label: "Triggers", value: "6" },
      { label: "Coverage", value: "98%" },
      { label: "Risk", value: "Low" },
      { label: "Horizon", value: "Q3" },
    ],
  },
];

const signalItems: SignalItem[] = [
  {
    title: "Liquidity Pulse",
    descriptor: "Cross-venue aggregation",
    value: "0.78",
    span: "lg:col-span-7",
    accent: "var(--color-accent)",
    chips: ["Orderbook", "Depth", "Spread"],
  },
  {
    title: "Model Integrity",
    descriptor: "Constraint compliance",
    value: "96%",
    span: "lg:col-span-5",
    accent: "var(--color-warning)",
    chips: ["Stress", "Bias", "Drift"],
  },
  {
    title: "Anomaly Index",
    descriptor: "Live divergence",
    value: "12.4",
    span: "lg:col-span-5",
    accent: "var(--color-success)",
    chips: ["Outliers", "Velocity", "Cluster"],
  },
  {
    title: "Execution Delta",
    descriptor: "Latency vs intent",
    value: "18ms",
    span: "lg:col-span-7",
    accent: "var(--color-primary)",
    chips: ["Path", "Impact", "Decay"],
  },
];

const stackLayers: StackLayer[] = [
  {
    title: "Insight Layer",
    subtitle: "Narrative + Validation",
    score: "94",
    detail: "Decision story is consistent across all channels.",
    offset: "lg:translate-x-0 lg:translate-y-0",
  },
  {
    title: "Signal Layer",
    subtitle: "Real-time Market Flow",
    score: "88",
    detail: "Liquidity windows tracked with 4-minute freshness.",
    offset: "lg:translate-x-10 lg:translate-y-10",
  },
  {
    title: "Execution Layer",
    subtitle: "Trigger Conditions",
    score: "91",
    detail: "Trade paths aligned with risk gates and thresholds.",
    offset: "lg:translate-x-20 lg:translate-y-20",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function UpgradeNarrativeRail() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <motion.div
        className="lg:col-span-4"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.35em] uppercase">
            Upgrade 01
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Narrative Rail
          </h2>
          <p className="text-sm md:text-base text-(--color-text-secondary)">
            Break data into readable narrative chapters with a professional, trader-grade perspective.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Narrative-driven", "Transparent weighting", "Trading language"].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 text-xs font-mono border border-(--color-border) text-(--color-text-secondary)"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="lg:col-span-8">
        <div className="relative border-l border-(--color-border) pl-6 space-y-8">
          {railItems.map((item, index) => (
            <motion.div
              key={item.code}
              className="grid md:grid-cols-[120px,1fr] gap-4 items-start"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 * index }}
            >
              <div className="text-2xl md:text-3xl font-mono text-(--color-accent)">
                {item.code}
              </div>
              <div className="bg-(--color-surface) border border-(--color-border) px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="text-xs font-mono text-(--color-text-secondary)">
                    {item.meta}
                  </span>
                </div>
                <p className="mt-3 text-sm text-(--color-text-secondary)">
                  {item.summary}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {item.metrics.map((metric) => (
                    <div
                      key={metric.label}
                    className="flex items-baseline justify-between border-b border-(--color-border) pb-2"
                    >
                    <span className="text-xs font-mono text-(--color-text-secondary)">
                        {metric.label}
                      </span>
                      <span className="text-sm font-semibold">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UpgradeSignalMatrix() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <motion.div
        className="lg:col-span-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.35em] uppercase">
              Upgrade 02
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold">
              Signal Matrix
            </h2>
          </div>
          <p className="max-w-xl text-sm md:text-base text-(--color-text-secondary)">
            Express liquidity, risk, and execution through an asymmetric matrix to form an instantly readable market console.
          </p>
        </div>
      </motion.div>

      {signalItems.map((item, index) => (
        <motion.div
          key={item.title}
          className={`bg-(--color-surface) border border-(--color-border) px-6 py-5 ${item.span}`}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.08 * index }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-xs font-mono text-(--color-text-secondary)">
                {item.descriptor}
              </p>
            </div>
            <div
              className="text-3xl md:text-4xl font-mono"
              style={{ color: item.accent }}
            >
              {item.value}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.chips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 text-xs font-mono border border-(--color-border) text-(--color-text-secondary)"
              >
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span
              className="h-1 w-16"
              style={{ backgroundColor: item.accent }}
            />
            <span className="text-xs font-mono text-(--color-text-secondary)">
              Live stability curve
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

export function UpgradeDepthStack() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <motion.div
        className="lg:col-span-5 space-y-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.35em] uppercase">
          Upgrade 03
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold">Depth Stack</h2>
        <p className="text-sm md:text-base text-(--color-text-secondary)">
          Turn abstract indicators into spatial layers that feel tangible.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Spatial hierarchy", "Material contrast", "Structured risk"].map((chip) => (
            <span
              key={chip}
              className="px-3 py-1 text-xs font-mono border border-(--color-border) text-(--color-text-secondary)"
            >
              {chip}
            </span>
          ))}
        </div>
      </motion.div>
      <div className="lg:col-span-7">
        <div className="relative min-h-90">
          <div className="grid gap-6 lg:gap-0">
            {stackLayers.map((layer, index) => (
              <motion.div
                key={layer.title}
                className={`lg:absolute lg:left-0 lg:right-0 ${layer.offset} bg-(--color-surface) border border-(--color-border) px-6 py-5`}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeUp}
                transition={{ duration: 0.7, delay: 0.1 * index }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{layer.title}</h3>
                    <p className="mt-2 text-xs font-mono text-(--color-text-secondary)">
                      {layer.subtitle}
                    </p>
                  </div>
                  <div className="text-3xl font-mono text-(--color-accent)">
                    {layer.score}
                  </div>
                </div>
                <p className="mt-4 text-sm text-(--color-text-secondary)">
                  {layer.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UpgradeShowcase() {
  return (
    <div className="space-y-24">
      <UpgradeNarrativeRail />
      <UpgradeSignalMatrix />
      <UpgradeDepthStack />
    </div>
  );
}
