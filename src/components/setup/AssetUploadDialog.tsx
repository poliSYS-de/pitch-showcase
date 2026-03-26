"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { BrandAsset } from "@/config/assets";

const CATEGORIES = ["logo", "team", "graphic", "visual", "icon", "upload"] as const;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

interface AssetUploadDialogProps {
  onClose: () => void;
  onAssetCreated: (asset: BrandAsset) => void;
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AssetUploadDialog({ onClose, onAssetCreated }: AssetUploadDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: File
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Metadata
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("upload");
  const [isTeam, setIsTeam] = useState(false);
  const [personName, setPersonName] = useState("");
  const [personPosition, setPersonPosition] = useState("");
  const [customId, setCustomId] = useState("");

  const autoId = toKebabCase(label);

  // F-QA-05: Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleFileSelect(f: File) {
    setError(null);
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Invalid file type. Accepted: PNG, JPG, WebP, SVG");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File too large. Maximum: 5 MB");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setStep(2);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  async function handleCreate() {
    if (!file || !label.trim() || !category) return;
    setIsCreating(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", label.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      if (customId.trim()) formData.append("customId", customId.trim());
      if (isTeam && personName.trim()) {
        formData.append("personName", personName.trim());
        formData.append("personPosition", personPosition.trim());
      }

      const res = await fetch("/api/assets", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        onAssetCreated(data.asset);
        onClose();
      } else {
        setError(data.error || "Failed to create asset");
      }
    } catch (err) {
      console.error("Create failed:", err);
      setError("Failed to create asset");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-200">New Asset</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl cursor-pointer">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          {step === 1 && (
            /* Step 1: File Upload */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-emerald-400 bg-emerald-500/5"
                  : "border-slate-700 hover:border-slate-500 bg-slate-800/30"
              }`}
            >
              <p className="text-lg text-slate-400 mb-2">Drop image here or click to browse</p>
              <p className="text-xs text-slate-600">Accepted: PNG, JPG, WebP, SVG &mdash; Max: 5 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              />
            </div>
          )}

          {step === 2 && (
            /* Step 2: Metadata */
            <>
              <div className="flex gap-4">
                {/* Preview */}
                {preview && (
                  <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase">Label *</label>
                    <input
                      type="text"
                      value={label}
                      onChange={e => setLabel(e.target.value)}
                      maxLength={60}
                      placeholder="e.g. Company Logo"
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      maxLength={200}
                      rows={2}
                      placeholder="Short description..."
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono uppercase">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Team member toggle */}
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTeam}
                  onChange={e => setIsTeam(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-500"
                />
                This is a team member photo
              </label>
              {isTeam && (
                <div className="grid grid-cols-2 gap-3 pl-5">
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase">Name</label>
                    <input
                      type="text"
                      value={personName}
                      onChange={e => setPersonName(e.target.value)}
                      maxLength={60}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase">Position</label>
                    <input
                      type="text"
                      value={personPosition}
                      onChange={e => setPersonPosition(e.target.value)}
                      maxLength={60}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>
              )}

              {/* Asset ID */}
              <div>
                <label className="text-[10px] text-slate-500 font-mono uppercase">Asset ID (auto-generated)</label>
                <input
                  type="text"
                  value={customId || autoId}
                  onChange={e => setCustomId(e.target.value)}
                  placeholder={autoId || "auto-generated-from-label"}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-[10px] text-slate-600 mt-0.5">Kebab-case. Collision auto-suffixed.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="px-6 py-4 border-t border-slate-800 flex justify-between">
            <button
              onClick={() => { setStep(1); setFile(null); setPreview(null); }}
              className="text-sm text-slate-400 hover:text-white cursor-pointer"
            >
              &larr; Back
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || !label.trim() || !category}
              className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? "Creating..." : "Create Asset"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
