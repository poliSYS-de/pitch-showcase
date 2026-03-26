"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: string;
}

export default function ParticleField({
  count = 50,
  className = "",
  color = "var(--color-accent-cyan)",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      let vx = (Math.random() - 0.5) * 0.1;
      let vy = (Math.random() - 0.5) * 0.1;
      // Ensure minimum velocity to prevent stagnation
      if (Math.abs(vx) < 0.02) vx = 0.02 * (Math.random() > 0.5 ? 1 : -1);
      if (Math.abs(vy) < 0.02) vy = 0.02 * (Math.random() > 0.5 ? 1 : -1);

      particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx,
        vy,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      
      // Robust clear: reset transform to clear entire raw canvas buffer
      // This prevents "smearing" artifacts if scaling/dpr calculations drift
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Parse color for drawing
      ctx.fillStyle = color;
      
      // Dynamic connection distance based on screen size (responsive)
      // Use min dimension to ensure consistency on different aspect ratios
      const connectionDist = Math.min(rect.width, rect.height) * 0.15;
      const connectionDistSq = connectionDist * connectionDist; // Optimization: compare squared distances

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges with buffer
        if (particle.x < -10) particle.x = 110;
        if (particle.x > 110) particle.x = -10;
        if (particle.y < -10) particle.y = 110;
        if (particle.y > 110) particle.y = -10;

        // Draw particle
        const x = (particle.x / 100) * rect.width;
        const y = (particle.y / 100) * rect.height;

        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((other, j) => {
          if (i >= j) return;
          
          const ox = (other.x / 100) * rect.width;
          const oy = (other.y / 100) * rect.height;
          
          // Optimization: Distance squared check avoids expensive Math.hypot/sqrt
          const dx = x - ox;
          const dy = y - oy;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.globalAlpha = (1 - dist / connectionDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(ox, oy);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, count]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
}
