"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

const DocLightbox = dynamic(() => import("./DocLightbox"), { ssr: false });

interface TaskLogEntry {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignedTo?: string;
  date?: string;
  version?: number;
  summary?: string;
  hasDetail: boolean;
  hasQAReport: boolean;
  qaFindings?: string;
}

type Filter = "all" | "completed" | "open" | "qa-failed";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  "offen": { label: "OPEN", className: "bg-slate-500/20 text-slate-400" },
  "in-arbeit": { label: "IN PROGRESS", className: "bg-blue-500/20 text-blue-400" },
  "ready-for-qa": { label: "READY FOR QA", className: "bg-amber-500/20 text-amber-400" },
  "bestanden": { label: "\u2713 QA PASSED", className: "bg-emerald-500/20 text-emerald-400" },
  "bestanden-mit-auflagen": { label: "\u26A0 QA PASSED*", className: "bg-amber-500/20 text-amber-400" },
  "nicht-bestanden": { label: "\u2717 QA FAILED", className: "bg-red-500/20 text-red-400" },
};

const PRIO_COLORS: Record<string, string> = {
  "P0": "text-red-400",
  "P1": "text-amber-400",
  "P2": "text-blue-400",
  "P3": "text-slate-400",
};

export default function TaskLogView() {
  const [tasks, setTasks] = useState<TaskLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedTask, setSelectedTask] = useState<TaskLogEntry | null>(null);

  useEffect(() => {
    fetch("/api/docs/tasks")
      .then(res => res.json())
      .then(data => { setTasks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = tasks;

    if (filter === "completed") result = result.filter(t => t.status === "bestanden" || t.status === "bestanden-mit-auflagen");
    else if (filter === "open") result = result.filter(t => t.status === "offen" || t.status === "in-arbeit");
    else if (filter === "qa-failed") result = result.filter(t => t.status === "nicht-bestanden");

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.assignedTo || "").toLowerCase().includes(q)
      );
    }

    if (!sortDesc) result = [...result].reverse();
    return result;
  }, [tasks, filter, search, sortDesc]);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === "bestanden" || t.status === "bestanden-mit-auflagen").length;
    const open = tasks.filter(t => t.status === "offen" || t.status === "in-arbeit").length;
    return { total: tasks.length, completed, open };
  }, [tasks]);

  const selectedIdx = selectedTask ? filtered.findIndex(t => t.id === selectedTask.id) : -1;

  function handlePrev() {
    if (selectedIdx > 0) setSelectedTask(filtered[selectedIdx - 1]);
  }
  function handleNext() {
    if (selectedIdx < filtered.length - 1) setSelectedTask(filtered[selectedIdx + 1]);
  }

  function getLightboxTabs(task: TaskLogEntry) {
    const tabs = [];
    if (task.hasDetail) tabs.push({ label: "Brief", filename: `${task.id}-brief.md` });
    if (task.hasQAReport) tabs.push({ label: "QA Report", filename: `${task.id}-qa-report.md` });
    return tabs.length > 0 ? tabs : [{ label: "Brief", filename: `${task.id}-brief.md` }];
  }

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading task log...</div>;
  }

  return (
    <div>
      {/* Stats */}
      <p className="text-xs text-slate-500 font-mono mb-4">
        {stats.total} tickets &middot; {stats.completed} completed &middot; {stats.open} open
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(["all", "completed", "open", "qa-failed"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded cursor-pointer transition-colors ${
              filter === f
                ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                : "bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            {f === "all" ? "All" : f === "completed" ? "Completed" : f === "open" ? "Open" : "QA Failed"}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="ml-auto bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded focus:outline-none focus:border-cyan-500/50 w-40"
        />
        <button
          onClick={() => setSortDesc(!sortDesc)}
          className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer font-mono"
        >
          {sortDesc ? "\u2195 Newest" : "\u2195 Oldest"}
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map(task => {
          const badge = STATUS_BADGES[task.status] || STATUS_BADGES["offen"];
          return (
            <div
              key={task.id}
              onClick={() => (task.hasDetail || task.hasQAReport) ? setSelectedTask(task) : null}
              className={`border border-slate-700 rounded-lg px-4 py-3 transition-colors ${
                (task.hasDetail || task.hasQAReport) ? "cursor-pointer hover:border-slate-600 hover:bg-slate-800/50" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400">{task.id}</span>
                    <span className={`text-xs font-mono ${PRIO_COLORS[task.priority] || "text-slate-400"}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 truncate">{task.title}</p>
                  {(task.assignedTo || task.qaFindings) && (
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      {task.assignedTo && `PO: ${task.assignedTo}`}
                      {task.qaFindings && ` \u00B7 ${task.qaFindings}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badge.className}`}>
                    {badge.label}
                  </span>
                  {(task.hasDetail || task.hasQAReport) && (
                    <span className="text-slate-600 text-xs">&rsaquo;</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-slate-500 py-8 text-sm">No matching tickets found</div>
      )}

      {/* Lightbox */}
      {selectedTask && (
        <DocLightbox
          filename={`${selectedTask.id}-brief.md`}
          title={`${selectedTask.id} — ${selectedTask.title}`}
          onClose={() => setSelectedTask(null)}
          onPrev={selectedIdx > 0 ? handlePrev : undefined}
          onNext={selectedIdx < filtered.length - 1 ? handleNext : undefined}
          tabs={getLightboxTabs(selectedTask)}
        />
      )}
    </div>
  );
}
