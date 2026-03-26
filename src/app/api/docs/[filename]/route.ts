import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");
const ALLOWED_DIRS = [
  path.join(PROJECT_ROOT, "docs"),
  path.join(PROJECT_ROOT, "task-details"),
];
const ALLOWED_EXTENSIONS = [".md", ".pdf"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Sanitize: only basename, no path traversal
    const safeFilename = path.basename(filename);

    // Extension whitelist
    const ext = path.extname(safeFilename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 403 });
    }

    // Search in allowed directories
    let filePath: string | null = null;
    for (const dir of ALLOWED_DIRS) {
      const candidate = path.join(dir, safeFilename);
      const resolved = path.resolve(candidate);
      if (resolved.startsWith(dir) && existsSync(resolved)) {
        filePath = resolved;
        break;
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (ext === ".pdf") {
      const buffer = readFileSync(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${safeFilename}"`,
        },
      });
    }

    // Markdown
    const content = readFileSync(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("[API /docs/:filename]", err);
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}
