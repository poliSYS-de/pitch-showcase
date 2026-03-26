import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { processUploadedImage, validateImageBuffer } from "@/lib/image-processing";

export const runtime = "nodejs";
export const maxDuration = 30;

const ASSETS_PATH = path.join(process.cwd(), "assets.json");
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const VALID_CATEGORIES = ["team", "logo", "graphic", "visual", "icon", "upload"] as const;

function readAssets() {
  if (!existsSync(ASSETS_PATH)) return [];
  return JSON.parse(readFileSync(ASSETS_PATH, "utf-8"));
}

function writeAssets(assets: unknown[]) {
  writeFileSync(ASSETS_PATH, JSON.stringify(assets, null, 2));
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/assets — List all assets
export async function GET() {
  return NextResponse.json(readAssets());
}

// POST /api/assets — Create new asset (upload + metadata)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const label = formData.get("label") as string | null;
    const description = (formData.get("description") as string) || "";
    const category = formData.get("category") as string | null;
    const personName = formData.get("personName") as string | null;
    const personPosition = formData.get("personPosition") as string | null;
    const customId = formData.get("customId") as string | null;

    if (!file || !label || !category) {
      return NextResponse.json({ error: "File, label, and category are required" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: PNG, JPG, WebP, SVG" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }
    if (label.length > 60) {
      return NextResponse.json({ error: "Label too long. Max 60 characters" }, { status: 400 });
    }
    if (description.length > 200) {
      return NextResponse.json({ error: "Description too long. Max 200 characters" }, { status: 400 });
    }
    // F-QA-04: Validate category against whitelist
    if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
      return NextResponse.json({ error: "Invalid category. Allowed: team, logo, graphic, visual, icon, upload" }, { status: 400 });
    }

    // F-QA-02: Validate image buffer content, not just Content-Type header
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      await validateImageBuffer(buffer, file.type);
    } catch {
      return NextResponse.json({ error: "Invalid image file. The uploaded file is not a valid image." }, { status: 400 });
    }

    const assets = readAssets();

    // Generate ID
    let id = customId ? toKebabCase(customId) : toKebabCase(label);
    let suffix = 2;
    const baseId = id;
    while (assets.some((a: { id: string }) => a.id === id)) {
      id = `${baseId}-${suffix}`;
      suffix++;
    }

    // Determine target directory
    const categoryDirs: Record<string, string> = {
      team: "images/team/comic",
      logo: "images/logo",
      graphic: "images/graphic",
      visual: "images/visual",
      icon: "images/icon",
      upload: "images/upload",
    };
    const targetDir = categoryDirs[category] || "images/upload";

    // Process image (save original + auto-WebP)
    const variants = await processUploadedImage(buffer, targetDir, file.name);

    // Build asset object
    const newAsset = {
      id,
      variants,
      category,
      label,
      description,
      status: "active",
      ...(personName ? { person: { name: personName, position: personPosition || "", active: true } } : {}),
      addedDate: new Date().toISOString().split("T")[0],
      usedInSlides: [],
    };

    assets.push(newAsset);
    writeAssets(assets);

    revalidatePath("/setup/brand-assets");
    revalidatePath("/setup");

    return NextResponse.json({ success: true, asset: newAsset });
  } catch (err) {
    console.error("[API /assets POST]", err);
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
