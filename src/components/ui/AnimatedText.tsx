"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: "words" | "chars" | "lines";
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: delay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  type = "words",
  tag: Tag = "p",
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const words = text.split(" ");
  const chars = text.split("");

  if (type === "words") {
    return (
      <motion.div
        ref={ref}
        className={`overflow-hidden ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={delay}
      >
        <Tag className="flex flex-wrap">
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em]"
              style={{ perspective: "1000px" }}
            >
              {word}
            </motion.span>
          ))}
        </Tag>
      </motion.div>
    );
  }

  if (type === "chars") {
    return (
      <motion.div
        ref={ref}
        className={`overflow-hidden ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={delay}
      >
        <Tag className="flex flex-wrap">
          {chars.map((char, i) => (
            <motion.span
              key={i}
              variants={charVariants}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Tag>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Tag>{text}</Tag>
    </motion.div>
  );
}
