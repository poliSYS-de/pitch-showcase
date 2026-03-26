"use client";

import { useRef, ReactNode, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

interface ScrollExitWrapperProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
}

export default function ScrollExitWrapper({
  children,
  className = "",
  yOffset = -50,
}: ScrollExitWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Use IntersectionObserver for opacity/scale - avoids useScroll+Lenis timing issues
  const opacity = useMotionValue(1);
  const scale = useMotionValue(1);
  const y = useMotionValue(0);
  const hasBeenVisible = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        // Track if element has been fully in view (for exit effect)
        if (ratio >= 0.4) hasBeenVisible.current = true;

        let o: number, s: number, yVal: number;
        if (ratio >= 0.4) {
          o = 1;
          s = 1;
          yVal = 0;
        } else if (ratio === 0) {
          // Below or above viewport - hide
          o = 0;
          s = 0.96;
          yVal = yOffset * 0.5;
        } else if (hasBeenVisible.current) {
          // Exiting (was visible, now leaving)
          o = ratio / 0.4;
          s = 0.96 + 0.04 * (ratio / 0.4);
          yVal = yOffset * (1 - ratio / 0.4) * 0.5;
        } else {
          // Entering (ratio > 0 but < 0.4, not yet "fully" in view) - show content
          o = 1;
          s = 1;
          yVal = 0;
        }
        opacity.set(o);
        scale.set(s);
        y.set(yVal);
      },
      { threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [yOffset, isMobile]);

  // Return simple div during SSR or if mobile
  if (isMobile === null || isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        scale,
        y,
        transformOrigin: "center bottom"
      }}
    >
      {children}
    </motion.div>
  );
}
