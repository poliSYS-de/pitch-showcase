import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { processUploadedImage, validateImageBuffer } from "@/lib/image-processing";

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

// POST /api/assets/:id/replace — Replace primary image
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

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
    const primaryVariant = asset.variants.find((v: { isPrimary: boolean }) => v.isPrimary) || asset.variants[0];

    // Backup old primary file (timestamp to prevent collision — PR-04)
    // F-QA-03: Define backupPath in outer scope for rollback
    const oldFilePath = path.join(PUBLIC_DIR, primaryVariant.path);
    let backupPath: string | null = null;
    if (existsSync(oldFilePath)) {
      const ext = path.extname(oldFilePath);
      const base = oldFilePath.slice(0, -ext.length);
      const timestamp = Math.floor(Date.now() / 1000);
      backupPath = `${base}.backup-${timestamp}${ext}`;
      renameSync(oldFilePath, backupPath);
    }

    // Determine target directory from old path
    const targetDir = path.dirname(primaryVariant.path).replace(/^\//, "");

    try {
      // Process new image
      const newVariants = await processUploadedImage(buffer, targetDir, file.name);

      // Remove old variants of the same formats, keep non-conflicting ones
      const newFormats = new Set(newVariants.map(v => v.format));
      const keptVariants = asset.variants.filter(
        (v: { format: string; isPrimary: boolean }) => !v.isPrimary && !newFormats.has(v.format)
      );

      asset.variants = [...newVariants, ...keptVariants];
      assets[idx] = asset;
      writeAssets(assets);

      revalidatePath("/setup/brand-assets");
      revalidatePath("/setup");
      if (asset.usedInSlides?.length > 0) {
        revalidatePath("/");
      }

      return NextResponse.json({ success: true, asset });
    } catch (processErr) {
      // F-QA-03: Rollback using stored backupPath from outer scope
      if (backupPath && existsSync(backupPath)) {
        renameSync(backupPath, oldFilePath);
      }
      throw processErr;
    }
  } catch (err) {
    console.error("[API /assets/:id/replace POST]", err);
    return NextResponse.json({ error: "Failed to replace image" }, { status: 500 });
  }
}
