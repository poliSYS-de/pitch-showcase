"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import * as d3 from "d3";

interface GradientSunburstProps {
  size?: number;
  className?: string;
}

/**
 * Hierarchy node data structure for D3 partition layout
 */
interface HierarchyNodeData {
  name: string;
  value?: string;
  size?: number;
  children?: HierarchyNodeData[];
}

type D3HierarchyNode = d3.HierarchyRectangularNode<HierarchyNodeData>;

/**
 * Technical indicator categories matching the visual-engine implementation
 */
const INDICATOR_CATEGORIES: Record<string, string[]> = {
  Trend: ["SMA", "EMA", "WMA", "HMA", "PSAR", "SuperTrend", "Ichimoku"],
  Momentum: ["RSI", "MACD", "Stochastic", "CCI", "Williams %R", "ROC", "MFI"],
  Volatility: ["Bollinger", "ATR", "Keltner", "Donchian", "VIX Corr", "Std Dev"],
  Volume: ["OBV", "VWAP", "AD Line", "CMF", "Volume Profile", "Force Index"],
  BreadthAndOthers: ["ADX", "Aroon", "DMI", "Pivot Points", "Fibonacci", "Elliott"],
};

/**
 * Mock time-series data for gradient computation
 * Simulates indicator values over time (e.g., RSI values over 20 periods)
 */
function generateMockTimeSeries(indicatorName: string, seed: number): number[] {
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const points = 12;
  const values: number[] = [];
  
  // Generate time-series values based on indicator type
  for (let i = 0; i < points; i++) {
    const r = random(seed + i * 0.1 + indicatorName.charCodeAt(0));
    
    // Different ranges for different indicator types
    if (indicatorName.includes("RSI") || indicatorName.includes("Stochastic")) {
      // Oscillators: 0-100
      values.push(30 + r * 40); // Range 30-70 with variation
    } else if (indicatorName.includes("MACD") || indicatorName.includes("CCI")) {
      // Centered oscillators: -100 to 100
      values.push((r - 0.5) * 100);
    } else {
      // Normalized: 0-1
      values.push(r);
    }
  }
  
  return values;
}

/**
 * Compute gradient stops from time-series values
 * Maps values to colors: green (bullish) → yellow (neutral) → red (bearish)
 * Using OKLCH color space for perceptually uniform gradients
 */
function computeGradientFromTimeSeries(
  values: number[],
  indicatorName: string
): { offset: number; color: string }[] {
  const stops: { offset: number; color: string }[] = [];
  const formatValue = (value: number) => Number(value.toFixed(3));
  const formatOklch = (l: number, c: number, h: number) =>
    `oklch(${formatValue(l)}% ${formatValue(c)} ${formatValue(h)})`;
  
  // Normalize values to 0-1 range
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  
  const normalizedValues = values.map(v => (v - min) / range);
  
  // Color scale: green (bullish) → yellow (neutral) → red (bearish)
  // For RSI-like indicators: low = oversold (bullish), high = overbought (bearish)
  const isOscillator = indicatorName.includes("RSI") || 
                       indicatorName.includes("Stochastic") ||
                       indicatorName.includes("Williams");
  
  normalizedValues.forEach((norm, i) => {
    const offset = i / (normalizedValues.length - 1);
    
    // Invert for oscillators (low RSI = bullish)
    const signal = isOscillator ? 1 - norm : norm;
    
    // Map to color using OKLCH color space (matching app theme)
    let color: string;
    if (signal > 0.6) {
      // Bullish: green (matching --color-success)
      const intensity = (signal - 0.6) / 0.4;
      color = formatOklch(70 + intensity * 5, 0.15 + intensity * 0.02, 160);
    } else if (signal < 0.4) {
      // Bearish: red/orange (matching --color-error)
      const intensity = (0.4 - signal) / 0.4;
      color = formatOklch(
        65 + intensity * 5,
        0.18 + intensity * 0.02,
        35 - intensity * 8
      );
    } else {
      // Neutral: yellow (matching --color-warning)
      color = formatOklch(82, 0.16, 72);
    }

    stops.push({ offset: formatValue(offset), color });
  });
  
  return stops;
}

/**
 * Build hierarchy data for the sunburst chart
 */
function buildHierarchy(): HierarchyNodeData {
  const children = Object.entries(INDICATOR_CATEGORIES).map(([categoryName, indicators]) => ({
    name: categoryName,
    children: indicators.map((indicatorName) => ({
      name: indicatorName,
      value: indicatorName,
      size: 100,
    })),
    size: indicators.length,
  }));
  
  return {
    name: "Technicals",
    children,
    size: children.length,
  };
}

/**
 * Category color scale - using OKLCH for consistency with app theme
 */
const CATEGORY_COLORS: Record<string, string> = {
  Trend: "oklch(30% 0.06 200)",
  Momentum: "oklch(32% 0.08 145)",
  Volatility: "oklch(35% 0.06 60)",
  Volume: "oklch(32% 0.05 270)",
  BreadthAndOthers: "oklch(33% 0.06 340)",
};

/**
 * GradientSunburst - Sunburst chart with time-series gradient colors
 * 
 * Each sector represents a technical indicator, with radial gradients
 * showing the indicator's signal strength over time (green → yellow → red).
 * Based on the visual-engine GradientSunburstSvg implementation.
 */
export default function GradientSunburst({ size = 320, className = "" }: GradientSunburstProps) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const id = useId();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const formatValue = (value: number) => Number(value.toFixed(3));

  // Build hierarchy and layout
  const { nodes, arc, center, radius, indicatorNodes } = useMemo(() => {
    const data = buildHierarchy();
    const hierarchyRoot = d3.hierarchy<HierarchyNodeData>(data)
      .sum((d) => d.size ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const r = size / 2;
    const partition = d3.partition<HierarchyNodeData>().size([2 * Math.PI, r]);
    const root = partition(hierarchyRoot);

    // Arc generator with configurable radii
    const innerRadiusPercent = 0.35;
    const categoryRadiusPercent = 0.50;
    const outerRadiusPercent = 0.95;

    const arcGenerator = d3.arc<D3HierarchyNode>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle(0.005)
      .cornerRadius(4)
      .innerRadius((d) => {
        if (d.depth === 1) return r * innerRadiusPercent;
        if (d.depth === 2) return r * categoryRadiusPercent;
        return d.y0;
      })
      .outerRadius((d) => {
        if (d.depth === 1) return r * categoryRadiusPercent;
        if (d.depth === 2) return r * outerRadiusPercent;
        return d.y1;
      });

    const allNodes = root.descendants().filter(d => d.depth > 0);
    const indicators = allNodes.filter(d => d.depth === 2);

    return {
      nodes: allNodes,
      arc: arcGenerator,
      center: { x: r, y: r },
      radius: r,
      indicatorNodes: indicators,
    };
  }, [size]);

  // Generate gradients for each indicator
  const gradients = useMemo(() => {
    return indicatorNodes.map((node, i) => {
      const seed = node.data.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) / 100;
      const timeSeries = generateMockTimeSeries(node.data.name, seed + i);
      const stops = computeGradientFromTimeSeries(timeSeries, node.data.name);
      
      // Calculate gradient direction (radial from center to sector)
      const midAngle = (node.x0 + node.x1) / 2;
      const R = radius * 0.95;
      const x2 = formatValue(Math.cos(midAngle - Math.PI / 2) * R);
      const y2 = formatValue(Math.sin(midAngle - Math.PI / 2) * R);
      
      return {
        id: `gradient-${id}-${node.data.name.replace(/\s+/g, "-")}`,
        node,
        stops,
        x2,
        y2,
      };
    });
  }, [indicatorNodes, radius, id]);

  // GSAP entrance animation
  useEffect(() => {
    if (!svgRef.current || !isInView) return;

    const segments = svgRef.current.querySelectorAll(".sunburst-segment");
    gsap.fromTo(
      segments,
      { opacity: 0, scale: 0.92, transformOrigin: "center center" },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.03,
        ease: "power3.out",
      }
    );
  }, [isInView]);

  // Get node color
  const getNodeColor = (node: D3HierarchyNode): string => {
    if (node.depth === 0) return "transparent";
    if (node.depth === 1) return CATEGORY_COLORS[node.data.name] || "oklch(35% 0.05 200)";
    if (node.depth === 2) {
      const gradient = gradients.find(g => g.node.data.name === node.data.name);
      return gradient ? `url(#${gradient.id})` : "oklch(65% 0.02 245.87)";
    }
    return "oklch(65% 0.02 245.87)";
  };

  const innerRadiusPercent = 0.35;
  const centerBackgroundRadius = Math.max(0, radius * innerRadiusPercent - 6);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto overflow-visible"
      >
        <defs>
          {/* Glow filter for hover effect */}
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Generate gradients for each indicator */}
          {gradients.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={gradient.x2}
              y2={gradient.y2}
            >
              {gradient.stops.map((stop, i) => (
                <stop
                  key={i}
                  offset={`${stop.offset * 100}%`}
                  stopColor={stop.color}
                />
              ))}
            </linearGradient>
          ))}
        </defs>

        <g transform={`translate(${center.x},${center.y})`}>
          {/* Shadow layer for 3D effect */}
          <g transform="translate(0, 6)" opacity={0.3}>
            {nodes.map((node, i) => {
              const pathData = arc(node);
              if (!pathData) return null;
              return (
                <path
                  key={`shadow-${i}`}
                  d={pathData}
                  fill="oklch(15% 0 0)"
                />
              );
            })}
          </g>

          {/* Main layer */}
          <g>
            {nodes.map((node, i) => {
              const pathData = arc(node);
              if (!pathData) return null;

              const isHovered = hoveredNode === node.data.name;
              const color = getNodeColor(node);

              return (
                <g key={`node-${i}`}>
                  <path
                    d={pathData}
                    fill={color}
                    className="sunburst-segment transition-all duration-200"
                    stroke={isHovered ? "var(--color-text-primary)" : "var(--color-obsidian)"}
                    strokeWidth={isHovered ? 2 : 0.5}
                    filter={isHovered ? `url(#glow-${id})` : undefined}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredNode(node.data.name)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />

                  {/* Labels for categories */}
                  {node.depth === 1 && (node.x1 - node.x0) > 0.3 && (
                    <text
                      transform={(() => {
                        const midAngle = (node.x0 + node.x1) / 2;
                        const labelRadius = radius * 0.425;
                        const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
                        const y = labelRadius * Math.sin(midAngle - Math.PI / 2);
                        return `translate(${x},${y})`;
                      })()}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--color-text-primary)"
                      fontSize={9}
                      fontWeight={600}
                      pointerEvents="none"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                    >
                      {node.data.name.length > 10
                        ? node.data.name.substring(0, 8) + "..."
                        : node.data.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Center circle */}
          <g>
            <circle
              r={centerBackgroundRadius}
              fill="var(--color-obsidian)"
              stroke="var(--color-graphite)"
              strokeWidth={2}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-6}
              fill="var(--color-text-primary)"
              fontSize={12}
              fontWeight={700}
              letterSpacing={0.5}
            >
              GRADIENT
            </text>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={8}
              fill="var(--color-accent-cyan)"
              fontSize={10}
              fontWeight={600}
              letterSpacing={1}
            >
              SUNBURST
            </text>
          </g>
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-(--color-slate) border border-(--color-graphite) rounded-lg shadow-lg pointer-events-none z-10">
          <p className="text-sm font-medium text-(--color-text-primary)">
            {hoveredNode}
          </p>
          <p className="text-xs text-(--color-text-muted)">
            Time-series gradient signal
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(72% 0.17 160)" }} />
          <span className="text-(--color-text-muted)">Bullish</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(82% 0.16 72)" }} />
          <span className="text-(--color-text-muted)">Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(68% 0.19 30)" }} />
          <span className="text-(--color-text-muted)">Bearish</span>
        </div>
      </div>
    </motion.div>
  );
}
