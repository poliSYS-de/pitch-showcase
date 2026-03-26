"use client";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import AnimationsEnabledProvider from "@/components/providers/AnimationsEnabledProvider";
import SlideNav from "@/components/navigation/SlideNav";
import { SLIDE_COMPONENTS } from "@/config/slideComponents";
import type { SlideConfig } from "@/config/slides";

interface PitchDeckClientProps {
  slides: SlideConfig[];
}

export default function PitchDeckClient({ slides }: PitchDeckClientProps) {
  const navSlides = slides.map(s => ({ id: s.id, label: s.label }));

  return (
    <SmoothScrollProvider>
      <AnimationsEnabledProvider>
        <main className="relative">
          <SlideNav slides={navSlides} />
          {slides.map((slide, index) => {
            const Component = SLIDE_COMPONENTS[slide.component];
            return Component ? <Component key={slide.id} deckPosition={index + 1} slideTag={slide.slideTag} slideLabel={slide.label} /> : null;
          })}
        </main>
      </AnimationsEnabledProvider>
    </SmoothScrollProvider>
  );
}
