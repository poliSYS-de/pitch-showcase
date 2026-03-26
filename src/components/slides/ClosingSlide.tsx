"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import ParticleField from "@/components/visualizations/ParticleField";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";

export default function ClosingSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  useEffect(() => {
    if (!logoRef.current || !effectiveInView) return;

    const letters = logoRef.current.querySelectorAll(".logo-letter");

    gsap.fromTo(
      letters,
      {
        opacity: 0,
        y: 50,
        rotateY: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [effectiveInView]);

  const contactInfo: { label: string; value: string; href?: string }[] = [
    { label: "Website", value: "agentiqcapital.com", href: "https://agentiqcapital.com" },
    { label: "Platform", value: "app.agentiqcapital.com", href: "https://app.agentiqcapital.com" },
    { label: "Email", value: "brian@agentiqcapital.com" },
    { label: "Phone", value: "(425) 324-5711" },
  ];

  return (
    <SlideWrapper id="closing" background="darker" className="relative">
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto w-full text-center">
        <ParticleField count={60} color="oklch(65.2% 0.200 145.495)" />

        <ScrollExitWrapper className="w-full">
          {/* Section label */}
          <motion.p
            className="text-xs font-mono text-(--color-accent-cyan) tracking-widest uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={effectiveInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
          >
            {slideTag} / {slideLabel}
          </motion.p>

          {/* Logo */}
          <div
            ref={logoRef}
            className="mb-12"
            style={{ perspective: "1000px" }}
          >
            <h2 className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-tight">
              {"AGENTIQ".split("").map((letter, i) => (
                <span
                  key={i}
                  className="logo-letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {letter}
                </span>
              ))}
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.3em] text-(--color-text-secondary) mt-2">
              {"CAPITAL".split("").map((letter, i) => (
                <span
                  key={i}
                  className="logo-letter inline-block"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {letter}
                </span>
              ))}
            </h3>
          </div>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-xl text-(--color-text) mb-16 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={effectiveInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >

            Computationally Informed Finance, ASI VIA the Capital Markets.
          </motion.p>

          {/* Contact grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={effectiveInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="p-4 bg-(--color-slate)/20 border border-(--color-graphite)"
              >
                <p className="text-xs text-(--color-text-muted) uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-mono text-(--color-accent-cyan) break-all">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline hover:text-(--color-text) transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            className="mt-20 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={effectiveInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="w-16 h-px bg-(--color-graphite)" />
            <div className="w-2 h-2 rounded-full bg-(--color-accent-cyan) animate-pulse" />
            <div className="w-16 h-px bg-(--color-graphite)" />
          </motion.div>

          {/* Copyright */}
          <motion.p
            className="mt-8 text-xs text-(--color-text-muted)"
            initial={{ opacity: 0 }}
            animate={effectiveInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            © 2026 Agentiq Capital, Inc. All rights reserved.
          </motion.p>
        </ScrollExitWrapper>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-(--color-graphite)" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-(--color-graphite)" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-(--color-graphite)" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-(--color-graphite)" />
    </SlideWrapper>
  );
}
