import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { ALL_SLIDES, DEFAULT_SLIDE_IDS } from '@/config/slides';

const CONFIG_PATH = path.join(process.cwd(), 'deck-config.json');
const BUILT_IN_IDS = ['default', 'quick', 'all', 'mkt-focus'];

function readConfig() {
  if (!existsSync(CONFIG_PATH)) {
    return { version: 1, defaultSlideIds: DEFAULT_SLIDE_IDS, customPresets: [] };
  }
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

export async function GET() {
  return NextResponse.json(readConfig());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = readConfig();
    const validIds = ALL_SLIDES.map(s => s.id);

    if (body.defaultSlideIds) {
      const filtered = body.defaultSlideIds.filter((id: string) => validIds.includes(id));
      if (filtered.length === 0) return NextResponse.json({ error: 'No valid slide IDs' }, { status: 400 });
      config.defaultSlideIds = filtered;
    }

    if (body.customPresets) {
      if (body.customPresets.length > 10) {
        return NextResponse.json({ error: 'Max 10 custom presets' }, { status: 400 });
      }
      for (const preset of body.customPresets) {
        if (BUILT_IN_IDS.includes(preset.id)) {
          return NextResponse.json({ error: `Preset ID "${preset.id}" is reserved` }, { status: 400 });
        }
        preset.slideIds = preset.slideIds.filter((id: string) => validIds.includes(id));
      }
      config.customPresets = body.customPresets;
    }

    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
