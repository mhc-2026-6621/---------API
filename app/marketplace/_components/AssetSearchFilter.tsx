"use client";

import { AssetCategory } from "@/types";
import { CATEGORY_LABELS } from "@/lib/label-maps";

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function AssetSearchFilter({ selectedCategory, onCategoryChange }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm text-text-secondary">カテゴリ:</label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-border rounded px-3 py-1.5 text-sm bg-white"
      >
        <option value="">すべて</option>
        {(Object.entries(CATEGORY_LABELS) as [AssetCategory, string][]).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
