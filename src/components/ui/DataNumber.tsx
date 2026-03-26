"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface DataNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
  label?: string;
}

export default function DataNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  duration = 2,
  label,
}: DataNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimatedRef = useRef(false);

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) =>
    current.toFixed(decimals)
  );

  useEffect(() => {
    if (isInView && !hasAnimatedRef.current) {
      spring.set(value);
      hasAnimatedRef.current = true;
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className={`${className}`}>
      <motion.div
        className="font-mono text-(--color-text-primary) tracking-tight"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-(--color-accent-cyan)">{prefix}</span>
        <motion.span>{display}</motion.span>
        <span className="text-(--color-text-secondary)">{suffix}</span>
      </motion.div>
      {label && (
        <motion.p
          className="text-(--color-text-muted) text-sm mt-1 uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
