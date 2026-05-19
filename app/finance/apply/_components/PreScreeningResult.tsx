"use client";

import Link from "next/link";
import { Application } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { YenAmount } from "@/components/shared/YenAmount";
import { formatYen, formatPercent } from "@/lib/format-utils";

const RESULT_STYLES = {
  pre_approved: { bg: "bg-green-50", border: "border-green-200", text: "仮承認されました" },
  manual_review: { bg: "bg-amber-50", border: "border-amber-200", text: "追加確認が必要です" },
  declined: { bg: "bg-red-50", border: "border-red-200", text: "今回はご対応が難しい状況です" },
};

export function PreScreeningResult({ application }: { application: Application }) {
  const resultKey = application.decision.result as keyof typeof RESULT_STYLES;
  const style = RESULT_STYLES[resultKey] || RESULT_STYLES.manual_review;

  return (
    <div className={`rounded-lg border-2 ${style.border} ${style.bg} p-6 space-y-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">仮審査結果</h2>
        <StatusBadge status={application.status} />
      </div>

      <p className="text-lg font-medium">{style.text}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-text-secondary">申込ID</p>
          <p className="font-mono font-bold">{application.applicationId}</p>
        </div>
        <div>
          <p className="text-text-secondary">承認可能額</p>
          <p className="font-bold">¥{formatYen(application.decision.approvedAmount)}</p>
        </div>
        <div>
          <p className="text-text-secondary">月額</p>
          <YenAmount amount={application.decision.estimatedMonthlyPayment} highlight />
        </div>
        <div>
          <p className="text-text-secondary">年率</p>
          <p className="font-bold">{formatPercent(application.decision.annualRate)}</p>
        </div>
      </div>

      {application.decision.requiredDocuments.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-2">必要書類</h3>
          <ul className="space-y-1">
            {application.decision.requiredDocuments.map((doc) => (
              <li key={doc} className="text-sm flex items-center gap-2">
                <span className="text-text-secondary">□</span> {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {application.decision.reasonCodes.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-2">判定理由</h3>
          <div className="flex flex-wrap gap-2">
            {application.decision.reasonCodes.map((reason) => (
              <span key={reason} className="bg-white px-2 py-1 rounded text-xs border border-border">
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded p-3">
        <p className="text-sm font-medium">次のアクション</p>
        <p className="text-sm text-text-secondary">{application.nextAction}</p>
      </div>

      <Link
        href={`/finance/applications/${application.applicationId}`}
        className="block w-full text-center bg-[#1e3a5f] text-white py-3 rounded-lg font-bold hover:bg-[#2d5a8e] transition-colors"
      >
        申込詳細を見る →
      </Link>
    </div>
  );
}
