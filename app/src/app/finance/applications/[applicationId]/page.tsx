"use client";

import { useEffect, useState } from "react";
import { Application } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatYen, formatPercent } from "@/lib/format-utils";
import { FINANCE_PRODUCT_LABELS } from "@/lib/label-maps";
import { ApplicationTimeline } from "./_components/ApplicationTimeline";
import { RequiredDocumentList } from "./_components/RequiredDocumentList";

export default function ApplicationDetailPage({ params }: { params: { applicationId: string } }) {
  const [app, setApp] = useState<Application | null>(null);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    fetchWithLog("申込詳細取得", `/api/applications/${params.applicationId}`).then(setApp);
  }, [params.applicationId, fetchWithLog]);

  if (!app) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-text-secondary">読み込み中...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">申込詳細</h1>
          <p className="text-sm text-text-secondary font-mono">{app.applicationId}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <ApplicationTimeline timeline={app.timeline} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-bold text-lg mb-3">対象アセット</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-secondary">名称</dt><dd>{app.asset.name}</dd>
            <dt className="text-text-secondary">価格</dt><dd>¥{formatYen(app.asset.price)}</dd>
            <dt className="text-text-secondary">メーカー</dt><dd>{app.asset.maker}</dd>
            <dt className="text-text-secondary">型式</dt><dd>{app.asset.model}</dd>
            <dt className="text-text-secondary">製造番号</dt><dd className="font-mono text-xs">{app.asset.serialNumber}</dd>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-bold text-lg mb-3">買い手企業</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-secondary">会社名</dt><dd>{app.buyer.companyName}</dd>
            <dt className="text-text-secondary">代表者</dt><dd>{app.buyer.representativeName}</dd>
            <dt className="text-text-secondary">業種</dt><dd>{app.buyer.industry}</dd>
            <dt className="text-text-secondary">設立</dt><dd>{app.buyer.establishedYear}年</dd>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-bold text-lg mb-3">ファイナンス条件</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-secondary">種別</dt><dd>{FINANCE_PRODUCT_LABELS[app.quote.financeProduct] || app.quote.financeProduct}</dd>
            <dt className="text-text-secondary">期間</dt><dd>{app.quote.termMonths}ヶ月</dd>
            <dt className="text-text-secondary">ファイナンス額</dt><dd>¥{formatYen(app.quote.financedAmount)}</dd>
            <dt className="text-text-secondary">頭金</dt><dd>¥{formatYen(app.quote.downPayment)}</dd>
            <dt className="text-text-secondary">年率</dt><dd>{formatPercent(app.quote.annualRate)}</dd>
            <dt className="text-text-secondary">月額</dt><dd className="font-bold text-accent">¥{formatYen(app.quote.totalMonthlyPayment)}</dd>
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-bold text-lg mb-3">販売店</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-text-secondary">名称</dt><dd>{app.seller.name}</dd>
            <dt className="text-text-secondary">認定</dt><dd>{app.seller.certified ? "✓ 認定済" : "未認定"}</dd>
            <dt className="text-text-secondary">グレード</dt><dd>{app.seller.riskGrade}</dd>
          </dl>
          {app.payout && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm font-medium">支払予定</p>
              <p className="text-sm">¥{formatYen(app.payout.payoutAmount)} / {app.payout.scheduledPayoutDate}</p>
            </div>
          )}
        </div>
      </div>

      <RequiredDocumentList documents={app.requiredDocuments} />

      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-bold text-lg mb-2">次のアクション</h3>
        <p className="text-sm text-text-secondary">{app.nextAction}</p>
      </div>
    </div>
  );
}
