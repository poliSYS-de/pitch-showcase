import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const ASSETS_PATH = path.join(process.cwd(), "assets.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function readAssets() {
  if (!existsSync(ASSETS_PATH)) return [];
  return JSON.parse(readFileSync(ASSETS_PATH, "utf-8"));
}

function writeAssets(assets: unknown[]) {
  writeFileSync(ASSETS_PATH, JSON.stringify(assets, null, 2));
}

// PATCH /api/assets/:id/variants/:format/primary — Set variant as primary
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string; format: string }> }
) {
  try {
    const { id, format } = await params;
    const assets = readAssets();
    const idx = assets.findIndex((a: { id: string }) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = assets[idx];
    const variantIdx = asset.variants.findIndex((v: { format: string }) => v.format === format);
    if (variantIdx === -1) {
      return NextResponse.json({ error: `Variant with format ${format} not found` }, { status: 404 });
    }

    // Set all to non-primary, then set the target
    asset.variants = asset.variants.map((v: { format: string; isPrimary: boolean }) => ({
      ...v,
      isPrimary: v.format === format,
    }));

    assets[idx] = asset;
    writeAssets(assets);

    revalidatePath("/setup/brand-assets");
    revalidatePath("/setup");
    if (asset.usedInSlides?.length > 0) {
      revalidatePath("/");
    }

    return NextResponse.json({ success: true, asset });
  } catch (err) {
    console.error("[API /assets/:id/variants/:format PATCH]", err);
    return NextResponse.json({ error: "Failed to set primary" }, { status: 500 });
  }
}

// DELETE /api/assets/:id/variants/:format — Remove variant (not primary)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; format: string }> }
) {
  try {
    const { id, format } = await params;
    const assets = readAssets();
    const idx = assets.findIndex((a: { id: string }) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = assets[idx];
    const variant = asset.variants.find((v: { format: string }) => v.format === format);
    if (!variant) {
      return NextResponse.json({ error: `Variant with format ${format} not found` }, { status: 404 });
    }
    if (variant.isPrimary) {
      return NextResponse.json({ error: "Cannot delete primary variant" }, { status: 400 });
    }
    if (asset.variants.length <= 1) {
      return NextResponse.json({ error: "Cannot delete last variant" }, { status: 400 });
    }

    // Delete file from disk
    const filePath = path.join(PUBLIC_DIR, variant.path);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    asset.variants = asset.variants.filter((v: { format: string }) => v.format !== format);
    assets[idx] = asset;
    writeAssets(assets);

    revalidatePath("/setup/brand-assets");
    revalidatePath("/setup");

    return NextResponse.json({ success: true, asset });
  } catch (err) {
    console.error("[API /assets/:id/variants/:format DELETE]", err);
    return NextResponse.json({ error: "Failed to delete variant" }, { status: 500 });
  }
}
