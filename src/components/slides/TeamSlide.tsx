"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlideWrapper from "@/components/ui/SlideWrapper";
import ScrollExitWrapper from "@/components/ui/ScrollExitWrapper";
import { useAnimationsEnabled } from "@/components/providers/AnimationsEnabledProvider";
import { getAssetPath } from "@/config/assets";

const ease = [0.16, 1, 0.3, 1] as const;

// Phase 1: Only photo via getAssetPath(). Name + role stay hardcoded.
// Phase 2: Complete person data from assets.ts (getActiveTeamMembers()).
const topMembers = [
  {
    name: "Brian Abbott",
    role: "CEO & Co-Founder",
    initials: "BA",
    photo: getAssetPath("team-brian-comic"),
    accentColor: "var(--color-accent-cyan)",
  },
  {
    name: "Taban Cosmos",
    role: "CTO",
    initials: "TC",
    photo: getAssetPath("team-taban-comic"),
    accentColor: "var(--color-accent-violet)",
  },
  {
    name: "Maximilian Muhr",
    role: "CMO & Co-Founder",
    initials: "MM",
    photo: getAssetPath("team-maximilian-comic"),
    accentColor: "var(--color-accent-gold)",
  },
];

const bottomMembers = [
  {
    name: "Paul Capano",
    role: "Operations",
    initials: "PC",
    photo: getAssetPath("team-paul-comic"),
    accentColor: "var(--color-accent-burnt)",
  },
  {
    name: "Sujit Kapur",
    role: "Financial Analyst",
    initials: "SK",
    photo: getAssetPath("team-sujit-comic"),
    accentColor: "var(--color-steel)",
  },
  {
    name: "Johnson Zhu",
    role: "ML Engineer",
    initials: "JZ",
    photo: getAssetPath("team-johnson-comic"),
    accentColor: "var(--color-accent-cyan)",
  },
];

export default function TeamSlide({ slideTag, slideLabel }: { slideTag?: string; slideLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const animationsEnabled = useAnimationsEnabled();
  const effectiveInView = animationsEnabled ? isInView : true;

  return (
    <SlideWrapper id="team" background="dark">
      <div ref={ref} className="relative z-10 h-full w-full">
        <ScrollExitWrapper className="w-full relative" yOffset={-80}>
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {/* Section label */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, x: -50 }}
              animate={
                effectiveInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <span className="text-xs font-mono text-[var(--color-accent-cyan)] tracking-widest uppercase">
                {slideTag} / {slideLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 50 }}
              animate={
                effectiveInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 50 }
              }
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              The{" "}
              <span className="text-[var(--color-accent-cyan)]">Team</span>
            </motion.h2>

            <motion.p
              className="text-lg text-[var(--color-text-muted)] mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={
                effectiveInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.35, ease }}
            >
              A cross-functional team combining deep finance expertise,
              engineering talent, and entrepreneurial vision.
            </motion.p>

            {/* Top Row — CEO, CTO, CMO (prominent) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {topMembers.map((member, idx) => (
                <motion.div
                  key={idx}
                  className="relative bg-[var(--color-obsidian)] border border-[var(--color-graphite)] p-6 text-center group hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.1, ease }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: member.accentColor }} />
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 mx-auto mb-4 rounded-full object-cover border-2"
                      style={{ borderColor: member.accentColor }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold border-2"
                      style={{ borderColor: member.accentColor, color: member.accentColor }}
                    >
                      {member.initials}
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">{member.name}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{member.role}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Row — Supporting team (smaller) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {bottomMembers.map((member, idx) => (
                <motion.div
                  key={idx}
                  className="relative bg-[var(--color-obsidian)] border border-[var(--color-graphite)] p-4 text-center group hover:border-[var(--color-accent-cyan)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  animate={effectiveInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.08, ease }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: member.accentColor }} />
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-14 h-14 mx-auto mb-3 rounded-full object-cover border-2"
                      style={{ borderColor: member.accentColor }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center text-lg font-bold border-2"
                      style={{ borderColor: member.accentColor, color: member.accentColor }}
                    >
                      {member.initials}
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">{member.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{member.role}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom note */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={effectiveInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease }}
            >
              <p className="text-sm text-[var(--color-text-muted)]">
                Based in Bellevue, WA — Building the future of financial
                intelligence
              </p>
            </motion.div>
          </div>
        </ScrollExitWrapper>
      </div>
    </SlideWrapper>
  );
}
