"use client";

import { Asset } from "@/types";
import { formatYen } from "@/lib/format-utils";

const CATEGORY_ICONS: Record<string, string> = {
  used_construction_equipment: "🏗️",
  forklift: "🏭",
  machine_tool: "⚙️",
  kitchen_food_equipment: "🧊",
  industrial_machinery: "🔧",
  refrigeration_equipment: "❄️",
  robot_conveyor: "🤖",
};

export function AssetInfoSection({ asset }: { asset: Asset }) {
  return (
    <div className="space-y-6">
      <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center text-7xl">
        {CATEGORY_ICONS[asset.category] || "📦"}
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-bold text-lg mb-4">アセット詳細</h3>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-text-secondary">カテゴリ</dt>
          <dd>{asset.categoryLabel}</dd>
          <dt className="text-text-secondary">メーカー</dt>
          <dd>{asset.maker}</dd>
          <dt className="text-text-secondary">型式</dt>
          <dd>{asset.model}</dd>
          <dt className="text-text-secondary">製造番号</dt>
          <dd className="font-mono text-xs">{asset.serialNumber}</dd>
          <dt className="text-text-secondary">年式</dt>
          <dd>{asset.year}年</dd>
          {asset.usageHours != null && (
            <>
              <dt className="text-text-secondary">稼働時間</dt>
              <dd>{formatYen(asset.usageHours)}時間</dd>
            </>
          )}
          <dt className="text-text-secondary">状態ランク</dt>
          <dd className="font-bold">{asset.conditionGrade}</dd>
          <dt className="text-text-secondary">所在地</dt>
          <dd>{asset.location}</dd>
          <dt className="text-text-secondary">販売店</dt>
          <dd>{asset.sellerName}</dd>
          <dt className="text-text-secondary">点検レポート</dt>
          <dd>{asset.inspectionReportAvailable ? "✓ あり" : "— なし"}</dd>
          <dt className="text-text-secondary">所有権確認</dt>
          <dd>{asset.ownershipCheckStatus === "verified" ? "✓ 確認済" : "確認中"}</dd>
          <dt className="text-text-secondary">担保権確認</dt>
          <dd>{asset.lienCheckStatus === "clear" ? "✓ クリア" : "確認中"}</dd>
        </dl>
      </div>

      {asset.maintenanceHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-bold text-lg mb-4">整備履歴</h3>
          <div className="space-y-2">
            {asset.maintenanceHistory.map((h, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-text-secondary whitespace-nowrap">{h.date}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{h.type}</span>
                <span>{h.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
