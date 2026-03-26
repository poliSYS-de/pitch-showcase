"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { BrandAsset, AssetVariant } from "@/config/assets";

interface AssetLightboxProps {
  asset: BrandAsset;
  onClose: () => void;
  onAssetUpdated: (updated: BrandAsset) => void;
}

export default function AssetLightbox({ asset, onClose, onAssetUpdated }: AssetLightboxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string>(
    () => (asset.variants.find(v => v.isPrimary) || asset.variants[0])?.format || "png"
  );

  // Editable fields
  const [label, setLabel] = useState(asset.label);
  const [description, setDescription] = useState(asset.description);
  const [personPosition, setPersonPosition] = useState(asset.person?.position || "");

  // Replace preview
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const variantInputRef = useRef<HTMLInputElement>(null);

  // Confirm dialog
  const [showConfirm, setShowConfirm] = useState<{ action: string; message: string } | null>(null);

  // F-QA-06: Error state for user-visible error messages
  const [error, setError] = useState<string | null>(null);

  // F-QA-14: Deprecation reason input
  const [deprecationReason, setDeprecationReason] = useState("");

  // F-QA-05: Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showConfirm) {
          setShowConfirm(null);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showConfirm, onClose]);

  const primaryVariant = asset.variants.find(v => v.isPrimary) || asset.variants[0];
  const activeVariant = asset.variants.find(v => v.format === activeFormat) || primaryVariant;
  const hasSlideRefs = (asset.usedInSlides?.length || 0) > 0;

  function resetEditState() {
    setLabel(asset.label);
    setDescription(asset.description);
    setPersonPosition(asset.person?.position || "");
    setReplaceFile(null);
    setReplacePreview(null);
    setIsEditing(false);
  }

  async function handleSave() {
    if (!label.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { label, description };
      if (asset.person) {
        body.person = { position: personPosition };
      }
      const res = await fetch(`/api/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
        setIsEditing(false);
      } else {
        setError(data.error || "Failed to save changes");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleReplaceSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // F-QA-07: Use error state instead of alert()
      setError("File too large. Maximum: 5 MB");
      return;
    }
    setError(null);
    setReplaceFile(file);
    const reader = new FileReader();
    reader.onload = () => setReplacePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleReplaceConfirm() {
    if (!replaceFile) return;
    setIsReplacing(true);
    setShowConfirm(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", replaceFile);
      const res = await fetch(`/api/assets/${asset.id}/replace`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
        setReplaceFile(null);
        setReplacePreview(null);
      } else {
        setError(data.error || "Failed to replace image");
      }
    } catch (err) {
      console.error("Replace failed:", err);
      setError("Failed to replace image. Please try again.");
    } finally {
      setIsReplacing(false);
    }
  }

  function handleReplaceClick() {
    if (hasSlideRefs) {
      setShowConfirm({
        action: "replace",
        message: `This image is used in LIVE slides!\n\nAffected slides:\n${asset.usedInSlides?.map(s => `  ${s}`).join("\n")}\n\nReplacing this image will change how your pitch deck looks for investors.`,
      });
    } else {
      handleReplaceConfirm();
    }
  }

  async function handleStatusChange(newStatus: "active" | "deprecated" | "reserve") {
    if (newStatus === "deprecated" && hasSlideRefs) {
      setShowConfirm({
        action: "deprecate",
        message: `This asset is used in LIVE slides!\n\nAffected slides:\n${asset.usedInSlides?.map(s => `  ${s}`).join("\n")}\n\nDeprecating will flag this asset for replacement but slides will still render.`,
      });
      return;
    }
    await executeStatusChange(newStatus);
  }

  async function executeStatusChange(newStatus: string, reason?: string) {
    setIsSaving(true);
    setShowConfirm(null);
    setError(null);
    try {
      const body: Record<string, unknown> = { status: newStatus };
      if (reason) body.deprecatedReason = reason;
      const res = await fetch(`/api/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Status change failed:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSetPrimary(format: string) {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/assets/${asset.id}/variants/${format}/primary`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
      } else {
        setError(data.error || "Failed to set primary");
      }
    } catch (err) {
      console.error("Set primary failed:", err);
      setError("Failed to set primary. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteVariant(format: string) {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/assets/${asset.id}/variants/${format}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
        if (activeFormat === format) {
          setActiveFormat(data.asset.variants[0]?.format || "png");
        }
      } else {
        setError(data.error || "Failed to delete variant");
      }
    } catch (err) {
      console.error("Delete variant failed:", err);
      setError("Failed to delete variant. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddVariant(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // F-QA-07: Use error state instead of alert()
      setError("File too large. Maximum: 5 MB");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/assets/${asset.id}/variants`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onAssetUpdated(data.asset);
      } else {
        setError(data.error || "Failed to add variant");
      }
    } catch (err) {
      console.error("Add variant failed:", err);
      setError("Failed to add variant. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
        <div
          className="relative bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* F-QA-06: Error Banner */}
          {error && (
            <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/30 rounded px-3 py-2 text-xs text-red-400 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-2 cursor-pointer">&times;</button>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            {isEditing ? (
              <>
                <button onClick={resetEditState} className="text-sm text-slate-400 hover:text-white cursor-pointer">Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !label.trim()}
                  className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <button onClick={onClose} className="text-sm text-slate-400 hover:text-white cursor-pointer">&times; Close</button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-slate-400 hover:text-emerald-400 cursor-pointer flex items-center gap-1.5"
                >
                  <span>&#9998;</span> Edit
                </button>
              </>
            )}
          </div>

          {/* Format Tabs */}
          <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
            {asset.variants.map(v => (
              <button
                key={v.format}
                onClick={() => setActiveFormat(v.format)}
                className={`text-xs font-mono px-2.5 py-1 rounded border cursor-pointer transition-colors ${
                  activeFormat === v.format
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {v.format.toUpperCase()}
                {v.isPrimary && " \u2713primary"}
              </button>
            ))}
            {isEditing && (
              <>
                <button
                  onClick={() => variantInputRef.current?.click()}
                  className="text-xs font-mono px-2.5 py-1 rounded border border-dashed border-slate-600 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 cursor-pointer"
                >
                  + Add
                </button>
                <input ref={variantInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="hidden" onChange={handleAddVariant} />
              </>
            )}
            {isEditing && activeVariant && !activeVariant.isPrimary && (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => handleSetPrimary(activeFormat)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Set Primary
                </button>
                <button
                  onClick={() => handleDeleteVariant(activeFormat)}
                  className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Image Preview */}
          <div className="px-6 pt-4">
            <div className="relative bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
              <img
                src={replacePreview || activeVariant?.path || "/images/placeholder.png"}
                alt={asset.label}
                className="max-w-full max-h-[50vh] object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
              />
              {isEditing && !replacePreview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="bg-slate-800/90 px-4 py-2 rounded-lg text-sm">&#128260; Replace Image</span>
                </button>
              )}
              {replacePreview && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => { setReplaceFile(null); setReplacePreview(null); }}
                    className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded cursor-pointer hover:bg-slate-600"
                  >
                    Undo
                  </button>
                  <button
                    onClick={handleReplaceClick}
                    disabled={isReplacing}
                    className="text-xs bg-emerald-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isReplacing ? "Replacing..." : "Confirm Replace"}
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp,.svg" className="hidden" onChange={handleReplaceSelect} />
            </div>

            {/* Size/format info */}
            <p className="text-xs text-slate-600 font-mono mt-2 text-center">
              {activeVariant?.sizeKB ? `${activeVariant.sizeKB} KB` : ""}
              {activeVariant?.dimensions ? ` \u00B7 ${activeVariant.dimensions}` : ""}
              {` \u00B7 ${(activeVariant?.format || "").toUpperCase()}`}
            </p>
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 space-y-3">
            {isEditing ? (
              <>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase">Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    maxLength={60}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                  />
                  <span className="text-[10px] text-slate-600 float-right">{label.length}/60</span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-mono uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={200}
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                  <span className="text-[10px] text-slate-600 float-right">{description.length}/200</span>
                </div>
                {asset.person && (
                  <div>
                    <label className="text-[10px] text-slate-500 font-mono uppercase">Position</label>
                    <input
                      type="text"
                      value={personPosition}
                      onChange={e => setPersonPosition(e.target.value)}
                      maxLength={60}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-emerald-500/50"
                    />
                    {/* F-QA-12: Character counter for position field */}
                    <span className="text-[10px] text-slate-600 float-right">{personPosition.length}/60</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-slate-200">{asset.label}</p>
                {asset.person && (
                  <p className="text-sm text-slate-400">{asset.person.name} &mdash; {asset.person.position}</p>
                )}
                <p className="text-xs text-slate-500">{asset.description}</p>
                <p className="text-xs text-slate-600 font-mono">{asset.id}</p>
              </>
            )}
          </div>

          {/* Status */}
          <div className="px-6 pb-2">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                asset.status === "active" ? "bg-emerald-500/20 text-emerald-300" :
                asset.status === "deprecated" ? "bg-red-500/20 text-red-300" :
                "bg-amber-500/20 text-amber-300"
              }`}>
                {asset.status === "active" ? "\u25CF Active" :
                 asset.status === "deprecated" ? "\u25CF Deprecated" :
                 "\u25CF Reserve"}
              </span>
              {isEditing && (
                <div className="flex gap-2 ml-auto">
                  {asset.status !== "active" && (
                    <button
                      onClick={() => handleStatusChange("active")}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 cursor-pointer border border-emerald-500/30 px-2 py-0.5 rounded"
                    >
                      Activate
                    </button>
                  )}
                  {asset.status !== "deprecated" && (
                    <button
                      onClick={() => handleStatusChange("deprecated")}
                      className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer border border-red-500/30 px-2 py-0.5 rounded"
                    >
                      Deprecate
                    </button>
                  )}
                  {asset.status !== "reserve" && (
                    <button
                      onClick={() => handleStatusChange("reserve")}
                      className="text-[10px] text-amber-400 hover:text-amber-300 cursor-pointer border border-amber-500/30 px-2 py-0.5 rounded"
                    >
                      Set Reserve
                    </button>
                  )}
                </div>
              )}
            </div>
            {asset.status === "deprecated" && asset.deprecatedReason && (
              <p className="text-[10px] text-red-400 italic mt-1">{asset.deprecatedReason}</p>
            )}
          </div>

          {/* Used in Slides */}
          <div className="px-6 pb-6">
            <div className={`rounded-lg border px-4 py-3 mt-2 ${
              hasSlideRefs
                ? isEditing ? "border-amber-500/40 bg-amber-500/5" : "border-slate-700 bg-slate-800/50"
                : "border-slate-800 bg-slate-800/30"
            }`}>
              <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Used in Slides</p>
              {hasSlideRefs ? (
                <>
                  {asset.usedInSlides!.map(tag => (
                    <p key={tag} className="text-xs text-cyan-400 font-mono">{tag}</p>
                  ))}
                  {isEditing && (
                    <p className="text-[10px] text-amber-400 mt-2">
                      Changes will be visible instantly in these slides!
                    </p>
                  )}
                  {asset.status === "deprecated" && (
                    <p className="text-[10px] text-red-400 mt-1">
                      Still used in slides — consider replacing!
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-600">Not used in any slide</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog — F-QA-11: Focus trapping via onKeyDown */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(null)}
          onKeyDown={e => { if (e.key === "Tab") e.preventDefault(); }}
        >
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <p className="text-amber-400 text-lg font-bold mb-3">&#9888; Warning</p>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap mb-4">{showConfirm.message}</pre>
            {/* F-QA-14: Deprecation reason input */}
            {showConfirm.action === "deprecate" && (
              <div className="mb-4">
                <label className="text-[10px] text-slate-500 font-mono uppercase">Reason (optional)</label>
                <input
                  type="text"
                  value={deprecationReason}
                  onChange={e => setDeprecationReason(e.target.value)}
                  maxLength={200}
                  placeholder="Why is this asset being deprecated?"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm px-3 py-1.5 rounded mt-1 focus:outline-none focus:border-amber-500/50"
                  autoFocus
                />
                <span className="text-[10px] text-slate-600 float-right">{deprecationReason.length}/200</span>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowConfirm(null); setDeprecationReason(""); }}
                className="text-sm text-slate-400 hover:text-white px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showConfirm.action === "replace") handleReplaceConfirm();
                  else if (showConfirm.action === "deprecate") {
                    executeStatusChange("deprecated", deprecationReason.trim() || undefined);
                    setDeprecationReason("");
                  }
                }}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                {showConfirm.action === "replace" ? "Yes, replace image" : "Yes, deprecate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
