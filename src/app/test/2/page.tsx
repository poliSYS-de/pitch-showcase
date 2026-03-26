"use client";

import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import UltimateScrollShowcase from "@/components/test/UltimateScrollShowcase";

export default function Test2Page() {
  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-(--color-background) text-(--color-text)">
        <div className="container mx-auto px-6 md:px-10 py-20 space-y-20">
          <UltimateScrollShowcase />
        </div>
      </main>
    </SmoothScrollProvider>
  );
}
