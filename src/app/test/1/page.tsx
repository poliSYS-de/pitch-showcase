"use client";

import UpgradeShowcase from "@/components/test/UpgradeShowcase";

export default function TestPage() {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-text)">
      <div className="container mx-auto px-6 md:px-10 py-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div className="text-xs font-mono text-(--color-text-secondary) tracking-[0.35em] uppercase">
              Test Lab
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              Agentiq Upgrade Lab
            </h1>
            <p className="text-sm md:text-base text-(--color-text-secondary) max-w-2xl">
              Three deployable upgrade directions in one place: narrative interaction, signal matrix, and spatial layering.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-(--color-surface) border border-(--color-border) px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-(--color-text-secondary)">
                  Status
                </span>
                <span className="text-xs font-mono text-(--color-accent)">
                  ACTIVE
                </span>
              </div>
              <div className="text-3xl font-mono">03</div>
              <div className="text-sm text-(--color-text-secondary)">
                Each module can be moved into any main slide with a maintainable structure.
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1 w-16 bg-(--color-accent)" />
                <span className="text-xs font-mono text-(--color-text-secondary)">
                  Upgrade backlog
                </span>
              </div>
            </div>
          </div>
        </div>
        <UpgradeShowcase />
      </div>
    </main>
  );
}
