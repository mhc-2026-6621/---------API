"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatYen } from "@/lib/format-utils";

const KPI_DATA = [
  { label: "月額試算クリック", value: "1,247", change: "+15.2%", positive: true },
  { label: "仮審査申込数", value: "89", change: "+8件", positive: true },
  { label: "仮承認率", value: "72.3%", change: "+3.1pt", positive: true },
  { label: "成約率", value: "45.2%", change: "+2.4pt", positive: true },
  { label: "GMV", value: "¥186M", change: "+23.1%", positive: true },
];

export default function MerchantDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    fetchWithLog("申込一覧取得", "/api/applications").then((data) => {
      setApplications(data.applications || []);
    });
  }, [fetchWithLog]);

  const totalPayout = applications
    .filter((a) => a.payout)
    .reduce((sum, a) => sum + (a.payout?.payoutAmount || 0), 0);
  const payoutCount = applications.filter((a) => a.payout).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">販売店ダッシュボード</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-lg border border-border p-4">
            <p className="text-xs text-text-secondary">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            <p className={`text-xs mt-1 ${kpi.positive ? "text-success" : "text-danger"}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-accent/10 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">販売店支払予定額</p>
          <p className="text-2xl font-bold text-accent">¥{formatYen(totalPayout)}</p>
          <p className="text-xs text-text-secondary mt-1">支払予定 {payoutCount}件</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 リース/割賦導入により、高額商品の成約率が+12.5%改善。検収後、販売店へ一括支払。買い手は月額払い。
        </p>
      </div>

      <div className="bg-white rounded-lg border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold text-lg">申込一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-3 text-left font-medium text-text-secondary">アセット</th>
                <th className="px-6 py-3 text-left font-medium text-text-secondary">買い手企業</th>
                <th className="px-6 py-3 text-right font-medium text-text-secondary">金額</th>
                <th className="px-6 py-3 text-center font-medium text-text-secondary">ステータス</th>
                <th className="px-6 py-3 text-right font-medium text-text-secondary">支払予定</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.applicationId} className="border-b border-border hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <Link href={`/finance/applications/${app.applicationId}`} className="text-accent hover:underline font-medium">
                      {app.asset.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{app.buyer.companyName}</td>
                  <td className="px-6 py-3 text-right">¥{formatYen(app.asset.price)}</td>
                  <td className="px-6 py-3 text-center"><StatusBadge status={app.status} size="sm" /></td>
                  <td className="px-6 py-3 text-right">
                    {app.payout ? `¥${formatYen(app.payout.payoutAmount)} (${app.payout.status})` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
