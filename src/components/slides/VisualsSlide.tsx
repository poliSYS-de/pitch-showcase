"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";
import { getAssetPath } from "@/config/assets";

const ease = [0.16, 1, 0.3, 1] as const;

export default function VisualsSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  return (
    <SlideWrapper id="visuals" background="darker">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full">
            {/* Section label */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, x: -50 }}
              animate={effectiveInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-xs font-mono text-(--color-accent-cyan) tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              Visual <span className="text-(--color-accent-cyan)">Demonstration</span>
            </motion.h2>

            {/* Visuals Grid: visual3 left, visual1 center, visual2 right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
              {/* Visual 3 - Left */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              >
                <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-cyan) to-(--color-accent-violet) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
                  <Image
                    src={getAssetPath("visual-3-png")}
                    alt="Balance Sheet Visualization"
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
                  Balance Sheet Visualization
                </p>
              </motion.div>

              {/* Visual 1 - Center */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              >
                <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-cyan) to-(--color-accent-violet) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
                  <Image
                    src={getAssetPath("visual-1-png")}
                    alt="Visual Demonstration 1"
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
                  Advanced Market Analysis
                </p>
              </motion.div>

              {/* Visual 2 - Right */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={effectiveInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.6, ease }}
              >
                <div className="absolute -inset-1 bg-linear-to-r from-(--color-accent-violet) to-(--color-accent-cyan) rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative rounded-lg overflow-hidden border border-(--color-graphite) bg-(--color-obsidian)">
                  <Image
                    src={getAssetPath("visual-2-png")}
                    alt="Visual Demonstration 2"
                    width={800}
                    height={800}
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-sm text-(--color-text-muted) text-center font-mono">
                  Financial Performance Metrics
                </p>
              </motion.div>
            </div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
