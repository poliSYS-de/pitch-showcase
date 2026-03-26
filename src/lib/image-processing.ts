import sharp from "sharp";
import path from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 80;

export interface ProcessedImage {
  format: string;
  path: string;
  sizeKB: number;
  dimensions: string;
  isPrimary: boolean;
}

/**
 * Save an uploaded image file to disk and auto-generate a WebP variant.
 * Returns an array of variants (original + WebP if applicable).
 */
export async function validateImageBuffer(buffer: Buffer, declaredType: string): Promise<void> {
  if (declaredType === "image/svg+xml") {
    const text = buffer.toString("utf-8", 0, Math.min(buffer.length, 1024));
    if (!text.includes("<svg")) {
      throw new Error("Invalid SVG: no <svg tag found in buffer");
    }
    return;
  }
  // For raster images, sharp.metadata() will throw if buffer is not a valid image
  await sharp(buffer).metadata();
}

export async function processUploadedImage(
  buffer: Buffer,
  targetDir: string,
  filename: string
): Promise<ProcessedImage[]> {
  const variants: ProcessedImage[] = [];
  // F-QA-01: Sanitize filename to prevent path traversal
  const safeFilename = path.basename(filename);
  const ext = path.extname(safeFilename).toLowerCase().replace(".", "");
  const baseName = path.basename(safeFilename, path.extname(safeFilename));
  const fullDir = path.join(PUBLIC_DIR, targetDir);

  // Ensure directory exists
  if (!existsSync(fullDir)) {
    mkdirSync(fullDir, { recursive: true });
  }

  // F-QA-01: Verify resolved path is within PUBLIC_DIR
  const resolvedDir = path.resolve(fullDir);
  if (!resolvedDir.startsWith(path.resolve(PUBLIC_DIR))) {
    throw new Error("Target directory outside of public folder");
  }

  // Get metadata from the original image
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // 1. Save original as-is
  const originalPath = path.join(fullDir, safeFilename);
  const resolvedOriginal = path.resolve(originalPath);
  if (!resolvedOriginal.startsWith(path.resolve(PUBLIC_DIR))) {
    throw new Error("File path outside of public folder");
  }
  writeFileSync(originalPath, buffer);
  const originalSizeKB = Math.round(buffer.length / 1024);

  variants.push({
    format: ext === "jpeg" ? "jpeg" : ext as string,
    path: `/${path.join(targetDir, safeFilename).replace(/\\/g, "/")}`,
    sizeKB: originalSizeKB,
    dimensions: `${width}x${height}`,
    isPrimary: true,
  });

  // 2. Auto-generate WebP (skip if original is already WebP or SVG)
  if (ext !== "webp" && ext !== "svg") {
    const webpFilename = `${baseName}.webp`;
    const webpPath = path.join(fullDir, webpFilename);

    let pipeline = sharp(buffer).webp({ quality: WEBP_QUALITY });
    if (width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH);
    }
    const webpBuffer = await pipeline.toBuffer();
    writeFileSync(webpPath, webpBuffer);

    const webpMeta = await sharp(webpBuffer).metadata();
    variants.push({
      format: "webp",
      path: `/${path.join(targetDir, webpFilename).replace(/\\/g, "/")}`,
      sizeKB: Math.round(webpBuffer.length / 1024),
      dimensions: `${webpMeta.width || 0}x${webpMeta.height || 0}`,
      isPrimary: false,
    });
  }

  return variants;
}

/**
 * Convert a single buffer to WebP and save it.
 */
export async function convertToWebP(
  buffer: Buffer,
  outputPath: string
): Promise<{ sizeKB: number; dimensions: string }> {
  let pipeline = sharp(buffer).webp({ quality: WEBP_QUALITY });
  const metadata = await sharp(buffer).metadata();
  if ((metadata.width || 0) > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH);
  }
  const webpBuffer = await pipeline.toBuffer();
  const fullPath = path.join(PUBLIC_DIR, outputPath);
  const dir = path.dirname(fullPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(fullPath, webpBuffer);
  const webpMeta = await sharp(webpBuffer).metadata();
  return {
    sizeKB: Math.round(webpBuffer.length / 1024),
    dimensions: `${webpMeta.width || 0}x${webpMeta.height || 0}`,
  };
}
