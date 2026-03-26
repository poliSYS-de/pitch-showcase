"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SLIDE_COMPONENTS } from "@/config/slideComponents";
import AnimationsEnabledProvider from "@/components/providers/AnimationsEnabledProvider";
import type { SlideConfig } from "@/config/slides";

interface SlidePreviewLightboxProps {
  slideId: string | null;
  allSlides: SlideConfig[];
  onClose: () => void;
  onNavigate: (slideId: string) => void;
}

export default function SlidePreviewLightbox({
  slideId,
  allSlides,
  onClose,
  onNavigate,
}: SlidePreviewLightboxProps) {
  const currentSlide = slideId ? allSlides.find((s) => s.id === slideId) : null;
  const currentIndex = currentSlide
    ? allSlides.findIndex((s) => s.id === slideId)
    : -1;
  const prevSlide = currentIndex > 0 ? allSlides[currentIndex - 1] : null;
  const nextSlide =
    currentIndex < allSlides.length - 1 ? allSlides[currentIndex + 1] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevSlide) onNavigate(prevSlide.id);
      if (e.key === "ArrowRight" && nextSlide) onNavigate(nextSlide.id);
    },
    [onClose, onNavigate, prevSlide, nextSlide]
  );

  // Lock body scroll + keyboard listener
  useEffect(() => {
    if (!slideId) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [slideId, handleKeyDown]);

  const Component = currentSlide
    ? SLIDE_COMPONENTS[currentSlide.component]
    : null;

  return (
    <AnimatePresence>
      {slideId && currentSlide && Component && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-white/60">
                {currentSlide.slideTag}
              </span>
              <span className="text-sm font-semibold text-white">
                {currentSlide.label}
              </span>
              <span className="text-xs font-mono text-white/40">
                {currentIndex + 1} / {allSlides.length}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4l12 12M16 4l-12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Arrows */}
          {prevSlide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(prevSlide.id);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {nextSlide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(nextSlide.id);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Live Slide Container */}
          <motion.div
            key={slideId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-[90vw] h-[85vh] mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full overflow-hidden rounded-xl border border-white/10">
              <div
                className="origin-top-left"
                style={{
                  width: "1920px",
                  height: "1080px",
                  transform: `scale(${Math.min(
                    (typeof window !== "undefined" ? window.innerWidth * 0.9 : 1728) / 1920,
                    (typeof window !== "undefined" ? window.innerHeight * 0.85 - 48 : 918) / 1080
                  )})`,
                }}
              >
                <AnimationsEnabledProvider>
                  <Component slideTag={currentSlide.slideTag} slideLabel={currentSlide.label} />
                </AnimationsEnabledProvider>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
