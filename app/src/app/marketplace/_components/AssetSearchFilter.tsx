"use client";

import { AssetCategory } from "@/types";
import { CATEGORY_LABELS } from "@/lib/label-maps";

export type PriceBand = "" | "under_5m" | "5m_10m" | "10m_20m" | "over_20m";
export type SortOption = "recommended" | "price_asc" | "price_desc" | "year_desc" | "monthly_asc";

interface Props {
  selectedCategory: string;
  searchQuery: string;
  priceBand: PriceBand;
  sortBy: SortOption;
  resultCount: number;
  onCategoryChange: (category: string) => void;
  onSearchQueryChange: (query: string) => void;
  onPriceBandChange: (priceBand: PriceBand) => void;
  onSortByChange: (sortBy: SortOption) => void;
}

const PRICE_BANDS: { value: PriceBand; label: string }[] = [
  { value: "", label: "すべて" },
  { value: "under_5m", label: "500万円未満" },
  { value: "5m_10m", label: "500万〜1,000万円" },
  { value: "10m_20m", label: "1,000万〜2,000万円" },
  { value: "over_20m", label: "2,000万円以上" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "おすすめ順" },
  { value: "price_asc", label: "価格が安い順" },
  { value: "price_desc", label: "価格が高い順" },
  { value: "year_desc", label: "年式が新しい順" },
  { value: "monthly_asc", label: "月額が安い順" },
];

export function AssetSearchFilter({
  selectedCategory,
  searchQuery,
  priceBand,
  sortBy,
  resultCount,
  onCategoryChange,
  onSearchQueryChange,
  onPriceBandChange,
  onSortByChange,
}: Props) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 flex-1">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-text-secondary mb-1">キーワード</label>
            <input
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-white"
              placeholder="メーカー、型式、所在地で検索"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">カテゴリ</label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">すべて</option>
              {(Object.entries(CATEGORY_LABELS) as [AssetCategory, string][]).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">価格帯</label>
            <select
              value={priceBand}
              onChange={(e) => onPriceBandChange(e.target.value as PriceBand)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-white"
            >
              {PRICE_BANDS.map((band) => (
                <option key={band.value || "all"} value={band.value}>{band.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">並び替え</label>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              className="w-full border border-border rounded px-3 py-2 text-sm bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-sm text-text-secondary whitespace-nowrap">
          検索結果 <span className="font-bold text-text-primary">{resultCount}</span> 件
        </div>
      </div>
    </div>
  );
}
