"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocLightboxProps {
  filename: string;
  title: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  tabs?: { label: string; filename: string }[];
}

const mdComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-2xl font-bold text-slate-100 mb-4">{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-xl font-semibold text-slate-200 mt-8 mb-3">{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-lg font-medium text-slate-300 mt-6 mb-2">{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-1">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-1">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="text-slate-300">{children}</li>,
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto mb-4">
          <code className="text-sm text-slate-300">{children}</code>
        </pre>
      );
    }
    return <code className="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-400 text-sm">{children}</code>;
  },
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => <th className="border border-slate-700 bg-slate-800 px-3 py-2 text-left text-slate-300 text-sm">{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td className="border border-slate-700 px-3 py-2 text-slate-400 text-sm">{children}</td>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-400 mb-4">{children}</blockquote>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => <a href={href} className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
  hr: () => <hr className="border-slate-700 my-6" />,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-slate-200 font-semibold">{children}</strong>,
};

export default function DocLightbox({ filename, title, onClose, onPrev, onNext, tabs }: DocLightboxProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const currentFilename = tabs ? tabs[activeTab].filename : filename;

  const fetchContent = useCallback(async (file: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/docs/${encodeURIComponent(file)}`);
      if (!res.ok) {
        setError("Failed to load document");
        return;
      }
      const text = await res.text();
      setContent(text);
    } catch {
      setError("Failed to load document");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent(currentFilename);
  }, [currentFilename, fetchContent]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const isPdf = currentFilename.endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {onPrev && (
              <button onClick={onPrev} className="text-slate-400 hover:text-white cursor-pointer text-sm">&larr; Prev</button>
            )}
            <h3 className="text-sm font-semibold text-slate-200 truncate max-w-md">{title}</h3>
            {onNext && (
              <button onClick={onNext} className="text-slate-400 hover:text-white cursor-pointer text-sm">Next &rarr;</button>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl cursor-pointer">&times;</button>
        </div>

        {/* Tabs */}
        {tabs && tabs.length > 1 && (
          <div className="flex gap-1 px-6 pt-3 flex-shrink-0">
            {tabs.map((tab, i) => (
              <button
                key={tab.filename}
                onClick={() => setActiveTab(i)}
                className={`text-xs font-mono px-3 py-1.5 rounded cursor-pointer transition-colors ${
                  activeTab === i
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                    : "bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-slate-500 text-sm">Loading...</div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && isPdf && (
            <div className="text-center py-12 space-y-4">
              <p className="text-slate-400">PDF documents can be downloaded or opened in a new tab.</p>
              <div className="flex gap-3 justify-center">
                <a
                  href={`/api/docs/${encodeURIComponent(currentFilename)}`}
                  download
                  className="text-sm bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Download PDF
                </a>
                <a
                  href={`/api/docs/${encodeURIComponent(currentFilename)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded cursor-pointer"
                >
                  Open in Browser
                </a>
              </div>
            </div>
          )}
          {!loading && !error && !isPdf && content && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents as never}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
