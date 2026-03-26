import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const ASSETS_PATH = path.join(process.cwd(), "assets.json");

function readAssets() {
  if (!existsSync(ASSETS_PATH)) return [];
  return JSON.parse(readFileSync(ASSETS_PATH, "utf-8"));
}

function writeAssets(assets: unknown[]) {
  writeFileSync(ASSETS_PATH, JSON.stringify(assets, null, 2));
}

// PATCH /api/assets/:id — Update metadata (label, description, status, person)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const assets = readAssets();
    const idx = assets.findIndex((a: { id: string }) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const asset = assets[idx];

    // Update allowed fields
    if (body.label !== undefined) {
      // F-QA-09: Trim to catch whitespace-only labels
      if (typeof body.label !== "string" || body.label.trim().length === 0) return NextResponse.json({ error: "Label cannot be empty" }, { status: 400 });
      if (body.label.length > 60) return NextResponse.json({ error: "Label too long. Max 60 characters" }, { status: 400 });
      asset.label = body.label;
    }
    if (body.description !== undefined) {
      if (body.description.length > 200) return NextResponse.json({ error: "Description too long. Max 200 characters" }, { status: 400 });
      asset.description = body.description;
    }
    if (body.status !== undefined) {
      const validStatuses = ["active", "deprecated", "reserve"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      asset.status = body.status;
      if (body.status === "deprecated") {
        asset.deprecatedDate = new Date().toISOString().split("T")[0];
        // F-QA-10: Validate deprecatedReason length
      if (body.deprecatedReason) {
        if (typeof body.deprecatedReason === "string" && body.deprecatedReason.length > 200) {
          return NextResponse.json({ error: "Deprecated reason too long. Max 200 characters" }, { status: 400 });
        }
        asset.deprecatedReason = body.deprecatedReason;
      }
      } else {
        delete asset.deprecatedDate;
        delete asset.deprecatedReason;
      }
    }
    if (body.person !== undefined && asset.person) {
      // F-QA-08: Validate person field lengths
      if (body.person.position !== undefined) {
        if (typeof body.person.position === "string" && body.person.position.length > 60) {
          return NextResponse.json({ error: "Position too long. Max 60 characters" }, { status: 400 });
        }
        asset.person.position = body.person.position;
      }
      if (body.person.name !== undefined) {
        if (typeof body.person.name === "string" && body.person.name.length > 60) {
          return NextResponse.json({ error: "Name too long. Max 60 characters" }, { status: 400 });
        }
        asset.person.name = body.person.name;
      }
    }

    assets[idx] = asset;
    writeAssets(assets);

    revalidatePath("/setup/brand-assets");
    revalidatePath("/setup");
    if (asset.usedInSlides?.length > 0) {
      revalidatePath("/");
    }

    return NextResponse.json({ success: true, asset });
  } catch (err) {
    console.error("[API /assets/:id PATCH]", err);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}
