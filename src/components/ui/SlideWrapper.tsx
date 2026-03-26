"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

interface SlideWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
  background?: "dark" | "darker" | "accent";
}

const backgroundStyles = {
  dark: "bg-(--color-charcoal)",
  darker: "bg-(--color-obsidian)",
  accent: "bg-(--color-slate)",
};

export default function SlideWrapper({
  children,
  id,
  className = "",
  background = "dark",
}: SlideWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const animationsEnabled = useAnimationsEnabled();
  // Use amount 0 so any pixel visible triggers (desktop/Lenis can miss with stricter thresholds)
  const isInView = useInView(ref, { once: true, amount: 0 });

  // Mobile (< 768): no fly-in/out animation, persistent display
  if (!animationsEnabled) {
    return (
      <section
        ref={ref}
        id={id}
        className={`slide ${backgroundStyles[background]} ${className}`}
      >
        {children}
      </section>
    );
  }

  const variants = {
    hidden: { opacity: 0, y: 80, scale: 0.96, rotateX: -10, rotateZ: -1.5 },
    visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, rotateZ: 0 },
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`slide ${backgroundStyles[background]} ${className}`}
      style={{ transformPerspective: 1400, willChange: "transform, opacity" }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
