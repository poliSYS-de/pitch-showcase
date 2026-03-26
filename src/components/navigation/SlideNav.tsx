"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
interface SlideNavProps {
  slides: { id: string; label: string }[];
}

export default function SlideNav({ slides }: SlideNavProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.8 });

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show progress bar while scrolling, and auto-hide after ~2s of inactivity
      setShowProgress(true);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      hideTimer.current = window.setTimeout(() => {
        setShowProgress(false);
      }, 2000);

      // Determine active slide
      slides.forEach((slide, index) => {
        const element = document.getElementById(slide.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setActiveSlide(index);
          }
        }
      });

      // Hide/show nav based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [slides]);

  const scrollToSlide = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top progress bar - shows only while scrolling, smooth via spring */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-(--color-obsidian) z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="h-full bg-(--color-accent-cyan) origin-left"
              style={{ scaleX: smoothProgress }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow Trigger when nav is hidden */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center justify-center cursor-pointer p-2 rounded-full hover:bg-(--color-obsidian)/50 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={handleMouseEnter}
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
              className="text-(--color-secondary)"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side navigation dots */}
      <AnimatePresence>
        {isHovered && (
          <motion.nav
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col items-end gap-4">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => scrollToSlide(slide.id)}
                  className="group flex items-center gap-3"
                  aria-label={`Go to ${slide.label}`}
                >
                  {/* Label */}
                  <span
                    className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      activeSlide === index
                        ? "text-(--color-accent-cyan) opacity-100"
                        : "text-(--color-text-muted) opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {slide.label}
                  </span>

                  {/* Dot */}
                  <div className="relative">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? "bg-(--color-accent-cyan) scale-125"
                          : "bg-(--color-steel) group-hover:bg-(--color-text-secondary)"
                      }`}
                    />
                    {activeSlide === index && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-(--color-accent-cyan)"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Slide counter */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-8 left-8 z-50 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl text-(--color-accent-cyan)">
                {String(activeSlide + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-(--color-text-muted)">/</span>
              <span className="text-sm text-(--color-text-muted)">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-(--color-obsidian)/90 backdrop-blur-sm border-t border-(--color-graphite)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs font-mono text-(--color-text-muted)">
                {String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
              <span className="text-xs font-mono text-(--color-accent-cyan)">
                {slides[activeSlide]?.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
