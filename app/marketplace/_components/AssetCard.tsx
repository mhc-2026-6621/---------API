"use client";

import Link from "next/link";
import { Asset } from "@/types";
import { YenAmount } from "@/components/shared/YenAmount";
import { FINANCE_STATUS_LABELS, FINANCE_STATUS_COLORS, CATEGORY_LABELS } from "@/lib/label-maps";
import { cn } from "@/lib/format-utils";

const CATEGORY_ICONS: Record<string, string> = {
  used_construction_equipment: "🏗️",
  forklift: "🏭",
  machine_tool: "⚙️",
  kitchen_food_equipment: "🧊",
  industrial_machinery: "🔧",
  refrigeration_equipment: "❄️",
  robot_conveyor: "🤖",
};

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Link href={`/marketplace/assets/${asset.id}`} className="block">
      <div className="bg-white rounded-lg border border-border hover:shadow-lg transition-shadow overflow-hidden">
        <div className="h-40 bg-slate-100 flex items-center justify-center text-5xl">
          {CATEGORY_ICONS[asset.category] || "📦"}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {CATEGORY_LABELS[asset.category]}
            </span>
            <span className={cn("text-xs px-2 py-0.5 rounded", FINANCE_STATUS_COLORS[asset.financeStatus])}>
              {FINANCE_STATUS_LABELS[asset.financeStatus]}
            </span>
          </div>
          <h3 className="font-bold text-sm leading-tight">{asset.name}</h3>
          <p className="text-xs text-text-secondary">
            {asset.maker} / {asset.year}年
            {asset.usageHours != null && ` / ${asset.usageHours.toLocaleString()}h`}
          </p>
          <p className="text-xs text-text-secondary">{asset.location}</p>
          <div className="pt-2 border-t border-border">
            <YenAmount amount={asset.price} size="md" />
            <div className="mt-1">
              <YenAmount amount={asset.estimatedMonthlyPayment} size="md" label="月額" suffix="〜" highlight />
            </div>
          </div>
          <button className="w-full mt-2 bg-[#1e3a5f] text-white text-sm py-2 rounded hover:bg-[#2d5a8e] transition-colors">
            詳細を見る
          </button>
        </div>
      </div>
    </Link>
  );
}
