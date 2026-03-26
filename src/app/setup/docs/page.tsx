"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DocCard from "@/components/setup/DocCard";
import TaskLogView from "@/components/setup/TaskLogView";
import rawRegistry from "../../../../docs-registry.json";

const DocLightbox = dynamic(() => import("@/components/setup/DocLightbox"), { ssr: false });

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

const docsRegistry = rawRegistry as { version: number; categories: Category[] };

export default function DocsPage() {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ filename: string; title: string } | null>(null);
  const [taskCount, setTaskCount] = useState(0);

  const activeCategory = docsRegistry.categories.find(c => c.id === activeView);

  useEffect(() => {
    fetch("/api/docs/tasks")
      .then(res => res.json())
      .then(data => setTaskCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  function handleCardClick(category: Category) {
    if (category.type === "single-doc" && category.defaultDoc) {
      const filename = category.defaultDoc.split("/").pop() || "";
      setSelectedDoc({ filename, title: category.label });
    } else {
      setActiveView(category.id);
    }
  }

  function handleDocClick(doc: DocEntry) {
    const filename = doc.file.split("/").pop() || "";
    setSelectedDoc({ filename, title: doc.label });
  }

  // Stats
  const totalDocs = docsRegistry.categories.reduce((sum, c) => {
    if ("docs" in c && Array.isArray(c.docs)) return sum + c.docs.length;
    if (c.type === "single-doc") return sum + 1;
    return sum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {activeView ? (
        /* Sub-View */
        <>
          <button
            onClick={() => setActiveView(null)}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
          >
            &larr; Back to Documentation Hub
          </button>

          {activeView === "task-log" ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-1">Task Log</h2>
              <p className="text-sm text-slate-400 mb-6">Chronological development history with all tickets</p>
              <TaskLogView />
            </div>
          ) : activeCategory && "docs" in activeCategory && Array.isArray(activeCategory.docs) ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-200 mb-1">{activeCategory.label}</h2>
              <p className="text-sm text-slate-400 mb-6">{activeCategory.description}</p>
              <div className="space-y-2">
                {(activeCategory.docs as DocEntry[]).map(doc => (
                  <button
                    key={doc.file}
                    onClick={() => handleDocClick(doc)}
                    className="w-full text-left border border-slate-700 rounded-lg px-4 py-3 hover:border-slate-600 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-200">{doc.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.phase && (
                            <span className="text-[10px] font-mono text-violet-400">{doc.phase}</span>
                          )}
                          {doc.status && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              doc.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" :
                              doc.status?.includes("AUFLAGEN") ? "bg-amber-500/20 text-amber-400" :
                              "bg-slate-500/20 text-slate-400"
                            }`}>
                              {doc.status}
                            </span>
                          )}
                          {doc.verdict && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              doc.verdict === "FREIGABE" ? "bg-emerald-500/20 text-emerald-400" :
                              doc.verdict?.includes("AUFLAGEN") ? "bg-amber-500/20 text-amber-400" :
                              doc.verdict?.includes("NICHT") ? "bg-red-500/20 text-red-400" :
                              "bg-slate-500/20 text-slate-400"
                            }`}>
                              {doc.verdict}
                            </span>
                          )}
                          {doc.format === "pdf" && (
                            <span className="text-[10px] font-mono text-rose-400">PDF</span>
                          )}
                        </div>
                      </div>
                      <span className="text-slate-600">&rsaquo;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        /* Main Hub View */
        <>
          <div>
            <h2 className="text-2xl font-bold text-slate-200 mb-1">
              Documentation <span className="text-violet-400">Hub</span>
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Development showcase: specs, tickets, reviews, and guides
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 inline-flex gap-4 text-xs font-mono text-slate-400">
              {taskCount > 0 && <><span>{taskCount} tickets</span><span>&middot;</span></>}
              <span>{totalDocs} docs</span>
              <span>&middot;</span>
              <span>{docsRegistry.categories.find(c => c.id === "qa-reviews")?.docs?.length || 0} reviews</span>
              <span>&middot;</span>
              <span>6 agents</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docsRegistry.categories.map(category => (
              <DocCard
                key={category.id}
                category={category}
                onClick={() => handleCardClick(category)}
              />
            ))}
          </div>
        </>
      )}

      {/* Document Lightbox with arrow navigation */}
      {selectedDoc && (() => {
        const catDocs = activeCategory?.docs as DocEntry[] | undefined;
        const idx = catDocs?.findIndex(d => d.file.split("/").pop() === selectedDoc.filename) ?? -1;
        return (
          <DocLightbox
            filename={selectedDoc.filename}
            title={selectedDoc.title}
            onClose={() => setSelectedDoc(null)}
            onPrev={idx > 0 ? () => {
              const prev = catDocs![idx - 1];
              setSelectedDoc({ filename: prev.file.split("/").pop() || "", title: prev.label });
            } : undefined}
            onNext={catDocs && idx >= 0 && idx < catDocs.length - 1 ? () => {
              const next = catDocs[idx + 1];
              setSelectedDoc({ filename: next.file.split("/").pop() || "", title: next.label });
            } : undefined}
          />
        );
      })()}
    </div>
  );
}
