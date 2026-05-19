"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Application } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatYen, formatDate } from "@/lib/format-utils";

export default function ApplicationListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    fetchWithLog("申込一覧取得", "/api/applications").then((data) => {
      setApplications(data.applications || []);
    });
  }, [fetchWithLog]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">申込管理</h1>
        <Link
          href="/marketplace"
          className="text-sm text-accent hover:underline"
        >
          マーケットプレイスで物件を探す →
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-border p-12 text-center text-text-secondary">
          <p className="text-lg mb-2">申込はまだありません</p>
          <p className="text-sm">マーケットプレイスから物件を選び、月額試算・仮審査を申し込んでください。</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="text-left px-4 py-3 font-bold">申込ID</th>
                <th className="text-left px-4 py-3 font-bold">アセット</th>
                <th className="text-left px-4 py-3 font-bold">買い手企業</th>
                <th className="text-right px-4 py-3 font-bold">金額</th>
                <th className="text-center px-4 py-3 font-bold">ステータス</th>
                <th className="text-left px-4 py-3 font-bold">申込日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.applicationId} className="border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{app.applicationId}</td>
                  <td className="px-4 py-3 font-medium">{app.asset.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{app.buyer.companyName}</td>
                  <td className="px-4 py-3 text-right font-bold">¥{formatYen(app.asset.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {app.timeline.find((t) => t.step === "pre_screening_submitted")?.completedAt
                      ? formatDate(app.timeline.find((t) => t.step === "pre_screening_submitted")!.completedAt!)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/finance/applications/${app.applicationId}`}
                      className="text-accent hover:underline text-xs"
                    >
                      詳細 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
