"use client";

import { RiskAssessment } from "@/types";
import { cn } from "@/lib/format-utils";

function ScoreBar({ label, score, max = 100 }: { label: string; score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 70 ? "bg-green-500" : pct >= 45 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-bold">{score}/{max}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function RiskScorePanel({ risk }: { risk: RiskAssessment }) {
  const resultLabel = risk.result === "pre_approved" ? "仮承認"
    : risk.result === "manual_review" ? "追加確認" : "否決";
  const resultColor = risk.result === "pre_approved" ? "text-green-600 bg-green-50"
    : risk.result === "manual_review" ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-text-secondary">信用</p>
          <p className="text-2xl font-bold">{risk.creditScore}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-text-secondary">アセット</p>
          <p className="text-2xl font-bold">{risk.assetScore}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-text-secondary">販売店</p>
          <p className="text-2xl font-bold">{risk.sellerScore}</p>
        </div>
        <div className={cn("rounded-lg border p-3 text-center", resultColor)}>
          <p className="text-xs">総合</p>
          <p className="text-2xl font-bold">{risk.totalScore}</p>
          <p className="text-xs font-medium">{resultLabel}</p>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="信用スコア (creditScore × 0.5)" score={risk.creditScore} />
        <ScoreBar label="アセットスコア (assetScore × 0.3)" score={risk.assetScore} />
        <ScoreBar label="販売店スコア (sellerScore × 0.2)" score={risk.sellerScore} />
      </div>

      {risk.reasonCodes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">判定理由</p>
          <div className="flex flex-wrap gap-2">
            {risk.reasonCodes.map((r) => (
              <span key={r.code} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                {r.label} ({r.impact})
              </span>
            ))}
          </div>
        </div>
      )}

      {risk.warningFlags.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">警告フラグ</p>
          <div className="flex flex-wrap gap-2">
            {risk.warningFlags.map((w) => (
              <span key={w.code} className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs">
                ⚠ {w.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
