"use client";

interface DocEntry {
  file: string;
  label: string;
  format?: string;
  phase?: string;
  status?: string;
  verdict?: string;
}

interface Category {
  id: string;
  label: string;
  description: string;
  icon: string;
  accent: string;
  type: "task-log" | "doc-list" | "single-doc";
  docs?: DocEntry[];
  defaultDoc?: string;
}

interface DocCardProps {
  category: Category;
  onClick: () => void;
}

const ACCENT_MAP: Record<string, { border: string; bg: string; text: string; hover: string }> = {
  cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/5", text: "text-cyan-400", hover: "hover:border-cyan-500/50 hover:bg-cyan-500/10" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/5", text: "text-blue-400", hover: "hover:border-blue-500/50 hover:bg-blue-500/10" },
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/5", text: "text-emerald-400", hover: "hover:border-emerald-500/50 hover:bg-emerald-500/10" },
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/5", text: "text-violet-400", hover: "hover:border-violet-500/50 hover:bg-violet-500/10" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/5", text: "text-amber-400", hover: "hover:border-amber-500/50 hover:bg-amber-500/10" },
  rose: { border: "border-rose-500/30", bg: "bg-rose-500/5", text: "text-rose-400", hover: "hover:border-rose-500/50 hover:bg-rose-500/10" },
  indigo: { border: "border-indigo-500/30", bg: "bg-indigo-500/5", text: "text-indigo-400", hover: "hover:border-indigo-500/50 hover:bg-indigo-500/10" },
};

const ICON_PATHS: Record<string, string> = {
  "clipboard-list": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  "code": "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  "book-open": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  "lightbulb": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  "shield-check": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "flask-conical": "M9 3h6m-6 0v6.172a2 2 0 00.586 1.414l5.828 5.828A2 2 0 0116 17.828V21H8v-3.172a2 2 0 00-.586-1.414L1.586 10.586A2 2 0 011 9.172V3m8 0h6",
  "bot": "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47-2.47M5 14.5l2.47-2.47m0 0a24.365 24.365 0 019.06 0",
};

export default function DocCard({ category, onClick }: DocCardProps) {
  const colors = ACCENT_MAP[category.accent] || ACCENT_MAP["cyan"];
  const iconPath = ICON_PATHS[category.icon] || ICON_PATHS["code"];

  const docCount = category.docs?.length || 0;
  const isWide = category.id === "agent-system";

  return (
    <button
      onClick={onClick}
      className={`text-left border rounded-xl p-6 transition-all cursor-pointer ${colors.border} ${colors.bg} ${colors.hover} ${isWide ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
          <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
        <span className={`text-[10px] font-mono ${colors.text} opacity-70`}>
          {category.type === "task-log" ? "Browse \u203A" : category.type === "single-doc" ? "View \u203A" : `${docCount} docs`}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-1">{category.label}</h3>
      <p className="text-sm text-slate-400">{category.description}</p>
    </button>
  );
}
