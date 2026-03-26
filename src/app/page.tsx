import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { ALL_SLIDES, DEFAULT_SLIDE_IDS, BUILT_IN_PRESETS } from '@/config/slides';
import PitchDeckClient from './PitchDeckClient';

function getConfig() {
  const configPath = path.join(process.cwd(), 'deck-config.json');
  if (!existsSync(configPath)) {
    return { version: 1, defaultSlideIds: [...DEFAULT_SLIDE_IDS], customPresets: [] };
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function resolveSlides(slidesParam?: string, presetParam?: string) {
  const config = getConfig();
  const validIds = ALL_SLIDES.map(s => s.id);

  if (slidesParam) {
    if (slidesParam === 'all') return ALL_SLIDES.map(s => s.id);
    return slidesParam.split(',').map(s => s.trim()).filter(id => validIds.includes(id));
  }
  if (presetParam) {
    const custom = config.customPresets.find((p: { id: string; slideIds: string[] }) => p.id === presetParam);
    if (custom) return custom.slideIds.filter((id: string) => validIds.includes(id));
    const builtin = BUILT_IN_PRESETS.find(p => p.id === presetParam);
    if (builtin) return builtin.slideIds;
  }
  return config.defaultSlideIds;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ slides?: string; preset?: string }> }) {
  const params = await searchParams;
  const slideIds = resolveSlides(params.slides, params.preset);
  const slides = slideIds
    .map((id: string) => ALL_SLIDES.find(s => s.id === id))
    .filter(Boolean) as typeof ALL_SLIDES;

  return (
    <Suspense>
      <PitchDeckClient slides={slides} />
    </Suspense>
  );
}
