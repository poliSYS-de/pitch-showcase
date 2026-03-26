import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { convertToWebP, validateImageBuffer } from "@/lib/image-processing";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 30;

const ASSETS_PATH = path.join(process.cwd(), "assets.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

function readAssets() {
  if (!existsSync(ASSETS_PATH)) return [];
  return JSON.parse(readFileSync(ASSETS_PATH, "utf-8"));
}

function writeAssets(assets: unknown[]) {
  writeFileSync(ASSETS_PATH, JSON.stringify(assets, null, 2));
}

// POST /api/assets/:id/variants — Add format variant
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const setAsPrimary = formData.get("isPrimary") === "true";

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    // F-QA-02: Validate image buffer content
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await validateImageBuffer(buffer, file.type);
    } catch {
      return NextResponse.json({ error: "Invalid image file. The uploaded file is not a valid image." }, { status: 400 });
    }

    const assets = readAssets();
    const idx = assets.findIndex((a: { id: string }) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = assets[idx];
    const ext = path.extname(file.name).toLowerCase().replace(".", "");
    const format = ext === "jpeg" ? "jpeg" : ext;

    // Check if format variant already exists
    const existingIdx = asset.variants.findIndex((v: { format: string }) => v.format === format);
    if (existingIdx !== -1) {
      return NextResponse.json({ error: `Variant with format ${format} already exists. Use replace instead.` }, { status: 400 });
    }

    // Determine target directory from primary variant
    const primaryVariant = asset.variants.find((v: { isPrimary: boolean }) => v.isPrimary) || asset.variants[0];
    const targetDir = path.dirname(primaryVariant.path).replace(/^\//, "");
    const fullDir = path.join(PUBLIC_DIR, targetDir);
    if (!existsSync(fullDir)) {
      mkdirSync(fullDir, { recursive: true });
    }

    // F-QA-01: Sanitize filename to prevent path traversal
    const safeFilename = path.basename(file.name);
    const filePath = path.join(fullDir, safeFilename);
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(PUBLIC_DIR))) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }
    writeFileSync(filePath, buffer);

    const metadata = await sharp(buffer).metadata();
    const newVariant = {
      format,
      path: `/${path.join(targetDir, safeFilename).replace(/\\/g, "/")}`,
      sizeKB: Math.round(buffer.length / 1024),
      dimensions: `${metadata.width || 0}x${metadata.height || 0}`,
      isPrimary: setAsPrimary,
    };

    if (setAsPrimary) {
      asset.variants = asset.variants.map((v: { isPrimary: boolean }) => ({ ...v, isPrimary: false }));
    }

    asset.variants.push(newVariant);

    // Auto-generate WebP if uploaded format isn't WebP or SVG
    if (format !== "webp" && format !== "svg") {
      const webpExists = asset.variants.some((v: { format: string }) => v.format === "webp");
      if (!webpExists) {
        const baseName = path.basename(file.name, path.extname(file.name));
        const webpRelPath = path.join(targetDir, `${baseName}.webp`).replace(/\\/g, "/");
        const webpInfo = await convertToWebP(buffer, webpRelPath);
        asset.variants.push({
          format: "webp",
          path: `/${webpRelPath}`,
          sizeKB: webpInfo.sizeKB,
          dimensions: webpInfo.dimensions,
          isPrimary: false,
        });
      }
    }

    assets[idx] = asset;
    writeAssets(assets);

    revalidatePath("/setup/brand-assets");
    revalidatePath("/setup");

    return NextResponse.json({ success: true, asset });
  } catch (err) {
    console.error("[API /assets/:id/variants POST]", err);
    return NextResponse.json({ error: "Failed to add variant" }, { status: 500 });
  }
}
