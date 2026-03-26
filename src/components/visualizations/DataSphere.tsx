"use client";

import { useRef, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

interface DataSphereProps {
  size?: number;
  className?: string;
  pointCount?: number;
}

interface SpherePoint {
  x: number;
  y: number;
  z: number;
  i: number;
}

export default function DataSphere({
  size = 300,
  className = "",
  pointCount = 200,
}: DataSphereProps) {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const animationRef = useRef<gsap.core.Tween | null>(null);
  // Generate sphere points only on client side
  const formatValue = (value: number) => Number(value.toFixed(3));

  const points = useMemo<SpherePoint[]>(() => {
    const result: SpherePoint[] = [];
    const radius = size * 0.35;

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;

      const x = formatValue(radius * Math.cos(theta) * Math.sin(phi));
      const y = formatValue(radius * Math.sin(theta) * Math.sin(phi));
      const z = formatValue(radius * Math.cos(phi));

      result.push({ x, y, z, i });
    }
    return result;
  }, [pointCount, size]);

  useEffect(() => {
    if (!svgRef.current || !isInView) return;

    const pointElements = svgRef.current.querySelectorAll(".sphere-point");
    if (pointElements.length === 0) return;
    
    // Initial animation
    gsap.fromTo(
      pointElements,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: {
          each: 0.01,
          from: "random",
        },
        ease: "power2.out",
      }
    );

    // Continuous rotation effect
    let rotation = 0;
    const animate = () => {
      rotation += 0.002;
      pointElements.forEach((point) => {
        const el = point as SVGElement;
        const baseX = parseFloat(el.dataset.baseX || "0");
        const baseY = parseFloat(el.dataset.baseY || "0");
        const baseZ = parseFloat(el.dataset.baseZ || "0");

        // Rotate around Y axis
        const cosR = Math.cos(rotation);
        const sinR = Math.sin(rotation);
        const newX = baseX * cosR - baseZ * sinR;
        const newZ = baseX * sinR + baseZ * cosR;

        // Project to 2D
        const scale = 200 / (200 + newZ);
        const projX = size / 2 + newX * scale;
        const projY = size / 2 + baseY * scale;

        el.setAttribute("cx", projX.toString());
        el.setAttribute("cy", projY.toString());
        el.setAttribute("r", (2 * scale).toString());
        el.style.opacity = (0.3 + scale * 0.7).toString();
      });

      animationRef.current = gsap.delayedCall(0.016, animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isInView, size]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="centerGradient">
            <stop offset="0%" stopColor="var(--color-accent-cyan)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent-cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {points.map((point) => (
          <circle
            key={point.i}
            className="sphere-point"
            cx={size / 2 + point.x}
            cy={size / 2 + point.y}
            r={2}
            fill="var(--color-accent-cyan)"
            data-base-x={point.x}
            data-base-y={point.y}
            data-base-z={point.z}
            filter="url(#glow)"
          />
        ))}

        {/* Center glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.15}
          fill="url(#centerGradient)"
          opacity={0.3}
        />
      </svg>

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xs text-(--color-text-muted) uppercase tracking-widest">
            Market
          </p>
          <p className="text-lg font-mono text-(--color-accent-cyan)">
            Sphere
          </p>
        </div>
      </div>
    </motion.div>
  );
}
