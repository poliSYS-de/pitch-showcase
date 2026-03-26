// ============================================================================
// Brand Asset Registry — Thin wrapper over assets.json (Single Source of Truth)
// See: docs/KONZEPT-ASSET-EDITOR.md v1.1 (Phase 2.5)
// ============================================================================

import { ALL_SLIDES } from "./slides";
import assetsData from "../../assets.json";

// === Interfaces ===

export interface AssetVariant {
  format: "png" | "jpg" | "jpeg" | "svg" | "webp";
  path: string;
  sizeKB?: number;
  dimensions?: string;
  isPrimary: boolean;
}

export interface BrandAsset {
  id: string;
  variants: AssetVariant[];
  category: "logo" | "team" | "graphic" | "visual" | "icon" | "upload";
  label: string;
  description: string;
  status: "active" | "deprecated" | "reserve";
  person?: {
    name: string;
    position: string;
    active: boolean;
  };
  usedInSlides?: string[];
  addedDate: string;
  deprecatedDate?: string;
  deprecatedReason?: string;
}

// === Data ===

export const ALL_ASSETS: BrandAsset[] = assetsData as BrandAsset[];

// === Helper Functions ===

/**
 * Resolve Asset-ID to file path. Supports preferred format with fallback to primary.
 */
export function getAssetPath(assetId: string, preferredFormat?: string): string {
  const asset = ALL_ASSETS.find(a => a.id === assetId);
  if (!asset) {
    console.warn(`[Asset Registry] Asset not found: ${assetId}`);
    return "/images/placeholder.png";
  }
  if (asset.status === "deprecated") {
    console.warn(`[Asset Registry] Using deprecated asset: ${assetId}`);
  }
  if (preferredFormat) {
    const variant = asset.variants.find(v => v.format === preferredFormat);
    if (variant) return variant.path;
  }
  const primary = asset.variants.find(v => v.isPrimary) || asset.variants[0];
  return primary.path;
}

/**
 * Get the primary variant of an asset.
 */
export function getPrimaryVariant(asset: BrandAsset): AssetVariant {
  return asset.variants.find(v => v.isPrimary) || asset.variants[0];
}

/**
 * Get all assets for a person (comic + linkedin + ...).
 */
export function getPersonAssets(personName: string): BrandAsset[] {
  return ALL_ASSETS.filter(a => a.person?.name === personName);
}

/**
 * Get all assets of a category.
 */
export function getAssetsByCategory(category: BrandAsset["category"]): BrandAsset[] {
  return ALL_ASSETS.filter(a => a.category === category);
}

/**
 * Get all active team members (comic illustrations, active person).
 */
export function getActiveTeamMembers(): BrandAsset[] {
  return ALL_ASSETS.filter(a =>
    a.category === "team" &&
    a.status === "active" &&
    a.person?.active === true
  );
}

/**
 * Check if an Asset-ID exists in the registry.
 */
export function isValidAssetId(assetId: string): boolean {
  return ALL_ASSETS.some(a => a.id === assetId);
}

/**
 * Find active assets that are not referenced in any slide.
 */
export function getOrphanedAssets(): BrandAsset[] {
  return ALL_ASSETS.filter(a =>
    a.status === "active" &&
    (!a.usedInSlides || a.usedInSlides.length === 0)
  );
}

/**
 * QA helper: validate all usedInSlides references against slides.ts.
 */
export function validateAssetSlideRefs(): { asset: string; invalidRefs: string[] }[] {
  const validSlideTags = ALL_SLIDES.map(s => s.slideTag);
  return ALL_ASSETS
    .filter(a => a.usedInSlides && a.usedInSlides.length > 0)
    .map(a => ({
      asset: a.id,
      invalidRefs: a.usedInSlides!.filter(tag => !validSlideTags.includes(tag)),
    }))
    .filter(r => r.invalidRefs.length > 0);
}
