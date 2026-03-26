"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import ParticleField from "@/components/visualizations/ParticleField";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

export default function HeroSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!logoRef.current) return;
    const letters = logoRef.current.querySelectorAll(".hero-letter");

    if (effectiveInView) {
      gsap.fromTo(
        letters,
        {
          opacity: 0,
          y: 100,
          rotateX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: "power3.out",
        }
      );
    } else {
      gsap.set(letters, { opacity: 0, y: 100, rotateX: -90 });
    }
  }, [effectiveInView]);

  const titleText = "AGENTIQ";
  const subtitleText = "CAPITAL";

  return (
    <SlideWrapper id="hero" className="relative overflow-hidden">
      <div ref={ref} className="relative z-10 h-full">
        <ParticleField count={60} color="oklch(65.2% 0.200 145.495)" />

        <ScrollExitWrapper className="relative z-10 w-full" yOffset={-100}>
          <div className="relative flex flex-col items-center justify-center min-h-screen w-full">
            {/* Top accent line */}
            <motion.div
              className="absolute top-[20%] left-0 w-full h-px bg-linear-to-r from-transparent via-(--color-accent-cyan) to-transparent origin-left"
              initial={{ scaleX: 0 }}
              animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            />

            {/* Main title */}
            <div
              ref={logoRef}
              className="text-center"
              style={{ perspective: "1000px" }}
            >
              <h1 className="text-[clamp(3rem,15vw,12rem)] font-bold tracking-[-0.04em] leading-none">
                {titleText.split("").map((char, i) => (
                  <span
                    key={i}
                    className="hero-letter inline-block"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              <h2 className="text-[clamp(2rem,8vw,6rem)] font-light tracking-[0.3em] text-(--color-text-secondary) mt-2">
                {subtitleText.split("").map((char, i) => (
                  <span
                    key={i}
                    className="hero-letter inline-block"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </div>

            {/* Tagline */}
            <motion.p
              className="mt-12 text-lg md:text-xl bg-(--color-primary) text-(--background) tracking-wider uppercase"
              initial={{ opacity: 0, y: 30 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Computationally Informed Finance, ASI VIA THE CAPITAL MARKETS.
            </motion.p>

            {/* Location badge */}
            <motion.div
              className="mt-8 flex items-center gap-3 text-sm text-(--color-text-muted)"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <span className="w-2 h-2 rounded-full bg-(--color-accent-cyan) animate-pulse" />
              <span className="font-mono">Bellevue, WA</span>
            </motion.div>

            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-[20%] left-0 w-full h-px bg-linear-to-r from-transparent via-(--color-steel) to-transparent origin-right"
              initial={{ scaleX: 0 }}
              animate={effectiveInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: "right" }}
            />

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              <span className="text-xs text-(--color-text-muted) uppercase tracking-widest">
                Scroll
              </span>
              <motion.div
                className="w-px h-12 bg-linear-to-b from-(--color-accent-cyan) to-transparent"
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </ScrollExitWrapper>

        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-(--color-graphite)" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-(--color-graphite)" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-(--color-graphite)" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-(--color-graphite)" />
      </div>
    </SlideWrapper>
  );
}
