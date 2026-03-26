import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");
const TASK_DETAILS_DIR = path.join(PROJECT_ROOT, "task-details");

interface TaskLogEntry {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignedTo?: string;
  completedBy?: string;
  date?: string;
  version?: number;
  summary?: string;
  hasDetail: boolean;
  hasQAReport: boolean;
  qaFindings?: string;
}

type StatusMapping = Record<string, string>;

const STATUS_MAP: StatusMapping = {
  "offen": "offen",
  "pausiert": "offen",
  "in-arbeit": "in-arbeit",
  "ready for qa": "ready-for-qa",
  "ready for QA": "ready-for-qa",
};

function normalizeStatus(raw: string): string {
  const lower = raw.toLowerCase().trim();

  // Direct match
  if (STATUS_MAP[raw]) return STATUS_MAP[raw];
  if (STATUS_MAP[lower]) return STATUS_MAP[lower];

  // Pattern matches
  if (/erledigt/i.test(raw)) return "bestanden";
  if (/qa:\s*bestanden\s+mit\s+auflagen/i.test(raw)) return "bestanden-mit-auflagen";
  if (/qa:\s*bestanden/i.test(raw)) return "bestanden";
  if (/qa:\s*nicht\s+bestanden/i.test(raw)) return "nicht-bestanden";
  if (/bestanden\s+mit\s+auflagen/i.test(raw)) return "bestanden-mit-auflagen";
  if (/nicht\s+bestanden/i.test(raw)) return "nicht-bestanden";
  if (/bestanden/i.test(raw)) return "bestanden";

  return "offen";
}

function parseMarkdownTable(lines: string[]): Record<string, string>[] {
  if (lines.length < 2) return [];

  // First line is header
  const headerLine = lines[0];
  const headers = headerLine.split("|").map(h => h.trim()).filter(h => h.length > 0);

  // Skip separator line (line 1), parse data rows
  const rows: Record<string, string>[] = [];
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.startsWith("|")) continue;
    const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length);
    if (cells.length === 0) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.toLowerCase().replace(/[#]/g, "num")] = cells[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function parseTaskListe(content: string): TaskLogEntry[] {
  const entries: TaskLogEntry[] = [];
  const lines = content.split("\n");

  let currentSection = "";
  let tableLines: string[] = [];

  function flushTable() {
    if (tableLines.length === 0) return;
    const rows = parseMarkdownTable(tableLines);

    for (const row of rows) {
      const id = row["num"] || "";
      if (!id.startsWith("T-AC-")) continue;

      const title = row["task"] || "";
      const priority = row["prio"] || "";
      const rawStatus = row["status"] || "";
      const assignedTo = row["zugewiesen"] || row["po-id"] || "";
      const date = row["datum"] || row["begonnen"] || "";
      const versionStr = row["v#"] || row["vnum"] || "";
      const summary = row["notiz"] || "";

      // Determine status from section if not explicit
      let status: string;
      if (rawStatus) {
        status = normalizeStatus(rawStatus);
      } else if (currentSection.includes("erledigt")) {
        status = "bestanden";
      } else if (currentSection.includes("in arbeit")) {
        status = "in-arbeit";
      } else if (currentSection.includes("ready for qa")) {
        status = "ready-for-qa";
      } else {
        status = "offen";
      }

      // Extract QA findings from summary
      let qaFindings: string | undefined;
      const findingsMatch = summary.match(/(\d+P\d[\s,+]*)+/);
      if (findingsMatch) qaFindings = findingsMatch[0].trim();

      const taskId = id.trim();
      const briefPath = path.join(TASK_DETAILS_DIR, `${taskId}-brief.md`);
      const qaPath = path.join(TASK_DETAILS_DIR, `${taskId}-qa-report.md`);

      entries.push({
        id: taskId,
        title: title.replace(/~~(.*?)~~/g, "$1").trim(),
        priority: priority || "P2",
        status,
        assignedTo: assignedTo.replace(/~~(.*?)~~/g, "$1").trim() || undefined,
        date: date || undefined,
        version: parseInt(versionStr) || undefined,
        summary: summary.replace(/→.*$/, "").trim() || undefined,
        hasDetail: existsSync(briefPath),
        hasQAReport: existsSync(qaPath),
        qaFindings,
      });
    }

    tableLines = [];
  }

  for (const line of lines) {
    // Detect section headers
    if (line.startsWith("## ")) {
      flushTable();
      currentSection = line.replace("## ", "").toLowerCase().trim();
      continue;
    }

    // Detect table start/continue
    if (line.trim().startsWith("|")) {
      tableLines.push(line);
    } else if (tableLines.length > 0 && line.trim() === "") {
      // Empty line after table = end of table
      flushTable();
    }
  }

  // Flush remaining
  flushTable();

  return entries;
}

export async function GET() {
  try {
    const entries: TaskLogEntry[] = [];

    // Parse task-liste.md
    const taskListePath = path.join(PROJECT_ROOT, "task-liste.md");
    if (existsSync(taskListePath)) {
      const content = readFileSync(taskListePath, "utf-8");
      entries.push(...parseTaskListe(content));
    }

    // Parse task-liste-archiv.md
    const archivPath = path.join(PROJECT_ROOT, "task-liste-archiv.md");
    if (existsSync(archivPath)) {
      const content = readFileSync(archivPath, "utf-8");
      entries.push(...parseTaskListe(content));
    }

    // Deduplicate by ID (prefer non-archive version)
    const byId = new Map<string, TaskLogEntry>();
    for (const entry of entries) {
      const existing = byId.get(entry.id);
      if (!existing || entry.status !== "offen") {
        byId.set(entry.id, entry);
      }
    }

    // Sort by ticket number (descending = newest first)
    const sorted = Array.from(byId.values()).sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.id.replace(/\D/g, "")) || 0;
      return numB - numA;
    });

    return NextResponse.json(sorted);
  } catch (err) {
    console.warn("[API /docs/tasks] Parse error:", err);
    return NextResponse.json([]);
  }
}
