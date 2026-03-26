"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { BrandAsset } from "@/config/assets";
import AssetLightbox from "@/components/setup/AssetLightbox";
import AssetUploadDialog from "@/components/setup/AssetUploadDialog";

const CATEGORIES = ["all", "team", "logo", "graphic", "visual", "icon", "upload"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const categoryColors: Record<string, string> = {
  team: "bg-blue-500/20 text-blue-300",
  logo: "bg-purple-500/20 text-purple-300",
  graphic: "bg-teal-500/20 text-teal-300",
  visual: "bg-cyan-500/20 text-cyan-300",
  icon: "bg-amber-500/20 text-amber-300",
  upload: "bg-slate-500/20 text-slate-300",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-300",
  deprecated: "bg-red-500/20 text-red-300",
  reserve: "bg-amber-500/20 text-amber-300",
};

function getPrimaryPath(asset: BrandAsset): string {
  const primary = asset.variants?.find(v => v.isPrimary) || asset.variants?.[0];
  return primary?.path || "/images/placeholder.png";
}

function getPrimaryFormat(asset: BrandAsset): string {
  const primary = asset.variants?.find(v => v.isPrimary) || asset.variants?.[0];
  return primary?.format || "png";
}

function AssetCard({ asset, onImageClick }: { asset: BrandAsset; onImageClick: (asset: BrandAsset) => void }) {
  return (
    <div
      className={`relative bg-slate-800 border rounded-lg overflow-hidden transition-colors duration-200 ${
        asset.status === "deprecated"
          ? "border-red-500/40 opacity-60"
          : asset.status === "reserve"
            ? "border-amber-500/30 opacity-80"
            : "border-slate-700 hover:border-emerald-500/50"
      }`}
    >
      <button
        onClick={() => onImageClick(asset)}
        className="w-full aspect-square bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <img
          src={getPrimaryPath(asset)}
          alt={asset.label}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
        />
      </button>

      <div className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${categoryColors[asset.category] || "bg-slate-600 text-slate-300"}`}>
            {asset.category.toUpperCase()}
          </span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${statusColors[asset.status]}`}>
            {asset.status === "deprecated" ? "DEPRECATED" : asset.status === "reserve" ? "Reserve" : "Active"}
          </span>
          {asset.variants?.length > 1 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-600/50 text-slate-400">
              {asset.variants.length} formats
            </span>
          )}
        </div>

        {asset.person ? (
          <>
            <p className="text-sm font-semibold text-slate-200 leading-tight">{asset.person.name}</p>
            <p className="text-xs text-slate-400">{asset.person.position}</p>
            {!asset.person.active && (
              <span className="text-[10px] text-red-400 font-mono">Former</span>
            )}
          </>
        ) : (
          <p className="text-sm font-semibold text-slate-200 leading-tight">{asset.label}</p>
        )}

        <p className="text-xs text-slate-500 leading-snug">{asset.description}</p>

        {asset.status === "deprecated" && asset.deprecatedReason && (
          <p className="text-[10px] text-red-400 italic">{asset.deprecatedReason}</p>
        )}

        {asset.usedInSlides && asset.usedInSlides.length > 0 && (
          <div className="flex flex-wrap gap-1">
            <span className="text-[10px] text-slate-500">Used in:</span>
            {asset.usedInSlides.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-[10px] text-slate-600 font-mono">
          {getPrimaryFormat(asset).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default function BrandAssetsPage() {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxAsset, setLightboxAsset] = useState<BrandAsset | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch("/api/assets");
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      if (activeCategory !== "all" && asset.category !== activeCategory) return false;
      if (!showDeprecated && asset.status === "deprecated") return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          asset.label.toLowerCase().includes(q) ||
          asset.description.toLowerCase().includes(q) ||
          asset.id.toLowerCase().includes(q) ||
          (asset.person?.name.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }
      return true;
    });
  }, [assets, activeCategory, showDeprecated, searchQuery]);

  const assetCounts = useMemo(() => {
    const counts: Record<string, number> = { all: assets.length };
    for (const asset of assets) {
      counts[asset.category] = (counts[asset.category] || 0) + 1;
    }
    return counts;
  }, [assets]);

  function handleAssetUpdated(updated: BrandAsset) {
    setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
    setLightboxAsset(updated);
  }

  function handleAssetCreated(created: BrandAsset) {
    setAssets(prev => [...prev, created]);
  }

  return (
    <div className="text-slate-200">
      {/* Sub-header with filters */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-[105px] z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold">
                Brand <span className="text-emerald-400">Assets</span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">
                  <span className="text-emerald-400 font-bold">{assets.length}</span> registered assets
                </p>
                <p className="text-xs text-slate-600">
                  {assets.filter(a => a.status === "active").length} active &middot;{" "}
                  {assets.filter(a => a.status === "reserve").length} reserve &middot;{" "}
                  {assets.filter(a => a.status === "deprecated").length} deprecated
                </p>
              </div>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                + New Asset
              </button>
            </div>
          </div>

          {/* Category Tabs + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  {assetCounts[cat] ? ` (${assetCounts[cat]})` : ""}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded focus:outline-none focus:border-emerald-500/50 w-48"
              />
              <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDeprecated}
                  onChange={e => setShowDeprecated(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-red-500"
                />
                Deprecated
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {isLoading ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">Loading assets...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No assets found</p>
            <p className="text-xs mt-1">Try a different filter or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredAssets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onImageClick={setLightboxAsset}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxAsset && (
        <AssetLightbox
          asset={lightboxAsset}
          onClose={() => setLightboxAsset(null)}
          onAssetUpdated={handleAssetUpdated}
        />
      )}

      {/* Upload Dialog */}
      {showUpload && (
        <AssetUploadDialog
          onClose={() => setShowUpload(false)}
          onAssetCreated={handleAssetCreated}
        />
      )}
    </div>
  );
}
