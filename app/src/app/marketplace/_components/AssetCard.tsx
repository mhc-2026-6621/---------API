"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Gauge, MapPin, ShieldCheck, ShoppingCart } from "lucide-react";
import { Asset } from "@/types";
import { YenAmount } from "@/components/shared/YenAmount";
import { FINANCE_STATUS_LABELS, FINANCE_STATUS_COLORS, CATEGORY_LABELS } from "@/lib/label-maps";
import { cn, formatYen } from "@/lib/format-utils";

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
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-border hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link href={`/marketplace/assets/${asset.id}`} className="block">
        <div className="h-44 bg-slate-100 flex items-center justify-center text-5xl border-b border-border">
          {CATEGORY_ICONS[asset.category] || "📦"}
        </div>
      </Link>
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <Link href={`/marketplace/assets/${asset.id}`} className="block space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {CATEGORY_LABELS[asset.category]}
            </span>
            <span className={cn("text-xs px-2 py-0.5 rounded", FINANCE_STATUS_COLORS[asset.financeStatus])}>
              {FINANCE_STATUS_LABELS[asset.financeStatus]}
            </span>
          </div>
          <h3 className="font-bold text-base leading-tight min-h-10">{asset.name}</h3>
          <p className="text-xs text-text-secondary">{asset.maker} / {asset.model}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{asset.year}年式</span>
            <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" />{asset.usageHours != null ? `${asset.usageHours.toLocaleString()}h` : "稼働時間なし"}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{asset.location}</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />点検{asset.inspectionReportAvailable ? "あり" : "確認中"}</span>
          </div>
        </Link>
        <div className="mt-auto pt-3 border-t border-border space-y-2">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-text-secondary">販売価格</p>
              <YenAmount amount={asset.price} size="md" />
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">参考月額</p>
              <p className="text-sm font-bold text-accent">¥{formatYen(asset.estimatedMonthlyPayment)}〜</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary truncate">販売店: {asset.sellerName}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsAddedToCart(true)}
            className="flex items-center justify-center gap-1.5 bg-[#1e3a5f] text-white text-sm py-2 rounded hover:bg-[#2d5a8e] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddedToCart ? "追加済み" : "購入する"}
          </button>
          <Link
            href={`/marketplace/assets/${asset.id}`}
            className="text-center border border-[#1e3a5f] text-[#1e3a5f] text-sm py-2 rounded hover:bg-[#1e3a5f] hover:text-white transition-colors"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
