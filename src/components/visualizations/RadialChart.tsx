"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

/**
 * Methodology layer data structure
 * Based on the visual-engine methodology stack implementation
 */
interface MethodologyLayer {
  id: string;
  name: string;
  shortTitle: string;
  value: number;
  order: number;
  color: {
    primary: string;
    accent: string;
    dark: string;
  };
  description?: string;
}

interface RadialChartProps {
  layers?: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
  className?: string;
}

/**
 * Default methodology layers matching the visual-engine implementation
 * Using CSS variables for consistent theming
 */
const DEFAULT_METHODOLOGY_LAYERS: MethodologyLayer[] = [
  {
    id: "market",
    name: "Market",
    shortTitle: "MKT",
    value: 85,
    order: 1,
    color: {
      primary: "var(--color-layer-market)",
      accent: "var(--color-layer-market-accent)",
      dark: "var(--color-layer-market-dark)",
    },
    description: "Price action, volume, flows, volatility, sentiment",
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    shortTitle: "FND",
    value: 72,
    order: 2,
    color: {
      primary: "var(--color-layer-fundamentals)",
      accent: "var(--color-layer-fundamentals-accent)",
      dark: "var(--color-layer-fundamentals-dark)",
    },
    description: "Revenue, margins, balance sheet, cash flows",
  },
  {
    id: "technicals",
    name: "Technicals",
    shortTitle: "TCH",
    value: 90,
    order: 3,
    color: {
      primary: "var(--color-layer-technicals)",
      accent: "var(--color-layer-technicals-accent)",
      dark: "var(--color-layer-technicals-dark)",
    },
    description: "Trend, momentum, support/resistance, patterns",
  },
  {
    id: "quantitative",
    name: "Quantitative",
    shortTitle: "QNT",
    value: 68,
    order: 4,
    color: {
      primary: "var(--color-layer-quantitative)",
      accent: "var(--color-layer-quantitative-accent)",
      dark: "var(--color-layer-quantitative-dark)",
    },
    description: "Factor exposures, risk premia, statistical edges",
  },
  {
    id: "dynamic",
    name: "Dynamic",
    shortTitle: "LFM",
    value: 78,
    order: 5,
    color: {
      primary: "var(--color-layer-dynamic)",
      accent: "var(--color-layer-dynamic-accent)",
      dark: "var(--color-layer-dynamic-dark)",
    },
    description: "LFM + multi-agent dynamic re-weighting",
  },
];

/**
 * Convert simple layer format to methodology layer format
 */
function convertToMethodologyLayers(
  simpleLayers: { name: string; value: number; color: string }[]
): MethodologyLayer[] {
  const colorMap: Record<string, { primary: string; accent: string; dark: string }> = {
    Market: DEFAULT_METHODOLOGY_LAYERS[0].color,
    Fundamentals: DEFAULT_METHODOLOGY_LAYERS[1].color,
    Technicals: DEFAULT_METHODOLOGY_LAYERS[2].color,
    Quantitative: DEFAULT_METHODOLOGY_LAYERS[3].color,
    Dynamic: DEFAULT_METHODOLOGY_LAYERS[4].color,
  };

  const shortTitleMap: Record<string, string> = {
    Market: "MKT",
    Fundamentals: "FND",
    Technicals: "TCH",
    Quantitative: "QNT",
    Dynamic: "LFM",
  };

  return simpleLayers.map((layer, index) => ({
    id: layer.name.toLowerCase(),
    name: layer.name,
    shortTitle: shortTitleMap[layer.name] || layer.name.substring(0, 3).toUpperCase(),
    value: layer.value,
    order: index + 1,
    color: colorMap[layer.name] || {
      primary: layer.color,
      accent: layer.color,
      dark: layer.color,
    },
  }));
}

/**
 * RadialChart - Stacked circular methodology layers visualization
 * 
 * Renders 5 circular layers stacked with vertical offset, similar to
 * the MethodologyStackView from visual-engine. Each layer has a visible
 * "tab" header showing the layer name. Clicking a layer brings it to the top.
 */
export default function RadialChart({
  layers: inputLayers,
  size = 320,
  className = "",
}: RadialChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Convert input layers to methodology format or use defaults
  const initialLayers = inputLayers
    ? convertToMethodologyLayers(inputLayers)
    : DEFAULT_METHODOLOGY_LAYERS;

  const [layerOrder, setLayerOrder] = useState<MethodologyLayer[]>(initialLayers);
  const [selectedLayer, setSelectedLayer] = useState<MethodologyLayer>(initialLayers[0]);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle layer click - reorder so clicked layer moves to top
  const handleLayerSelect = useCallback(
    (layer: MethodologyLayer) => {
      if (layer.id === selectedLayer.id || isAnimating) return;

      setIsAnimating(true);

      // Reorder: move clicked layer to index 0 (top)
      const newOrder = [layer, ...layerOrder.filter((l) => l.id !== layer.id)];

      setLayerOrder(newOrder);
      setSelectedLayer(layer);

      // Reset animation flag after transition
      setTimeout(() => {
        setIsAnimating(false);
      }, 700);
    },
    [selectedLayer.id, isAnimating, layerOrder]
  );

  // GSAP entrance animation
  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const circles = containerRef.current.querySelectorAll(".methodology-layer");

    gsap.fromTo(
      circles,
      {
        opacity: 0,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );
  }, [isInView]);

  // Calculate dimensions - each layer has a tab header + circle body
  const circleSize = size * 0.55; // Circle diameter
  const tabHeight = 24; // Height of the tab header showing layer name
  const verticalOffset = tabHeight + 8; // Each layer offset by tab height + gap
  const totalHeight = circleSize + tabHeight + verticalOffset * (layerOrder.length - 1) + 40;

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={containerRef}
        className="relative flex justify-center items-start"
        style={{
          width: size,
          height: totalHeight,
        }}
      >
        {/* Render layers in reverse order so first layer (top) renders last (on top) */}
        {[...layerOrder].reverse().map((layer, reverseIndex) => {
          const index = layerOrder.length - 1 - reverseIndex;
          const isTop = index === 0;
          const translateY = index * verticalOffset;
          const scale = 1 - index * 0.02;
          const zIndex = layerOrder.length - index;
          const isHovered = hoveredLayer === layer.id;

          return (
            <button
              key={layer.id}
              onClick={() => handleLayerSelect(layer)}
              onMouseEnter={() => setHoveredLayer(layer.id)}
              onMouseLeave={() => setHoveredLayer(null)}
              className={`
                methodology-layer absolute left-1/2
                cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                focus:outline-none focus-visible:ring-4 focus-visible:ring-(--color-accent-cyan)/40
                ${index > 0 ? "hover:-translate-y-1" : ""}
              `}
              style={{
                width: circleSize + 20,
                top: 0,
                transform: `translate(-50%, ${translateY}px) scale(${scale})`,
                zIndex,
                willChange: "transform",
              }}
              aria-label={`Select ${layer.name} methodology layer`}
              tabIndex={0}
            >
              {/* Circle Body */}
              <div
                className="relative rounded-full mx-auto transition-all duration-300"
                style={{
                  width: circleSize,
                  height: circleSize,
                  backgroundColor: layer.color.primary,
                  border: `3px solid ${isHovered || isTop ? layer.color.accent : "rgba(255,255,255,0.3)"}`,
                  marginTop: -3, // Overlap with tab
                  boxShadow: isTop 
                    ? `0 8px 32px rgba(0,0,0,0.3)`
                    : "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center p-3 text-center select-none">
                  {isTop ? (
                    // Top circle: full content with score ring
                    <>
                      {/* Score Ring SVG */}
                      <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox={`0 0 ${circleSize} ${circleSize}`}
                      >
                        {/* Background circle */}
                        <circle
                          cx={circleSize / 2}
                          cy={circleSize / 2}
                          r={circleSize / 2 - 14}
                          fill="none"
                          stroke="rgba(0,0,0,0.12)"
                          strokeWidth={5}
                        />
                        {/* Progress circle */}
                        <circle
                          cx={circleSize / 2}
                          cy={circleSize / 2}
                          r={circleSize / 2 - 14}
                          fill="none"
                          stroke={layer.color.accent}
                          strokeWidth={5}
                          strokeLinecap="round"
                          strokeDasharray={`${((layer.value / 100) * 2 * Math.PI * (circleSize / 2 - 14))} ${2 * Math.PI * (circleSize / 2 - 14)}`}
                          className="transition-all duration-700 ease-out"
                          style={{
                            filter: `drop-shadow(0 0 4px ${layer.color.accent})`,
                          }}
                        />
                      </svg>

                      {/* Score display */}
                      <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <span
                          className="text-base font-semibold uppercase tracking-[0.2em]"
                          style={{ color: layer.color.dark }}
                        >
                          {layer.name}
                        </span>
                        <span
                          className="text-3xl font-bold tabular-nums"
                          style={{ color: layer.color.dark }}
                        >
                          {layer.value}
                        </span>
                        <span
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: layer.color.dark, opacity: 0.7 }}
                        >
                          Score
                        </span>
                      </div>

                      {/* Pulse ring effect */}
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none animate-pulse-ring"
                        style={{
                          border: `2px solid ${layer.color.accent}`,
                          opacity: 0.2,
                        }}
                      />
                    </>
                  ) : (
                    // Stacked circles: show layer order number
                    <>
                      <span
                        className="font-mono text-2xl font-bold"
                        style={{ color: layer.color.dark, opacity: 0.25 }}
                      >
                        #{index + 1}
                      </span>
                      <div
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur"
                        style={{
                          backgroundColor: "rgba(10, 10, 15, 0.45)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {layer.name}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stack label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-(--color-text-muted)">
        <span className="w-4 h-px bg-(--color-graphite)" />
        <span className="font-mono uppercase tracking-wider text-[9px]">Methodology Stack</span>
        <span className="w-4 h-px bg-(--color-graphite)" />
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes pulse-ring {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.1;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
}
