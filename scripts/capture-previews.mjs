import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'slide-previews');

const SLIDES = [
  'hero', 'overview', 'opportunity', 'product', 'vibe', 'levels', 'lfm',
  'gtm', 'marketing', 'scale', 'finance', 'team', 'ask', 'closing',
  'lfm-construction', 'lfm-design', 'lfm-opportunity',
  'company', 'features', 'product-alt', 'vision', 'visuals'
];

const BASE = 'http://localhost:3010';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Render at 1600x900 for quality, then capture full viewport
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 0.25 });

  for (const id of SLIDES) {
    const url = `${BASE}/?slides=${id}`;
    console.log(`Capturing ${id}...`);
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2500));
      const outPath = path.join(OUTPUT_DIR, `${id}.jpg`);
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 70 });
      console.log(`  -> ${outPath}`);
    } catch (err) {
      console.error(`  FAILED: ${id} — ${err.message}`);
    }
  }

  await browser.close();
  console.log('Done!');
}

main();
