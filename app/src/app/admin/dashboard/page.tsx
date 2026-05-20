"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Application, ApplicationStatus } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatYen } from "@/lib/format-utils";
import { cn } from "@/lib/format-utils";
import { RiskScorePanel } from "./_components/RiskScorePanel";
import { StatusUpdateDialog } from "./_components/StatusUpdateDialog";

type Tab = "all" | "high_value" | "manual_review" | "declined_candidate";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "審査待ち" },
  { key: "high_value", label: "高額案件" },
  { key: "manual_review", label: "要追加確認" },
  { key: "declined_candidate", label: "否決候補" },
];

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { fetchWithLog } = useApiCallLog();

  const loadApplications = useCallback(() => {
    fetchWithLog("申込一覧取得", "/api/applications").then((data) => {
      setApplications(data.applications || []);
    });
  }, [fetchWithLog]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filtered = applications.filter((app) => {
    switch (activeTab) {
      case "all":
        return ["pre_approved", "manual_review", "formal_review"].includes(app.status);
      case "high_value":
        return app.asset.price >= 10000000;
      case "manual_review":
        return app.status === "manual_review";
      case "declined_candidate":
        return app.riskAssessment.totalScore < 45;
      default:
        return true;
    }
  });

  const selectedApp = applications.find((a) => a.applicationId === selectedId);

  const handleStatusChange = async (newStatus: ApplicationStatus, memo: string) => {
    if (!selectedId) return;
    await fetchWithLog("ステータス変更", `/api/applications/${selectedId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, adminMemo: memo }),
    });
    loadApplications();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">ファイナンス管理者ダッシュボード</h1>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((tab) => {
          const count = applications.filter((app) => {
            switch (tab.key) {
              case "all": return ["pre_approved", "manual_review", "formal_review"].includes(app.status);
              case "high_value": return app.asset.price >= 10000000;
              case "manual_review": return app.status === "manual_review";
              case "declined_candidate": return app.riskAssessment.totalScore < 45;
              default: return true;
            }
          }).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-text-secondary py-8">該当する案件はありません</p>
          ) : (
            filtered.map((app) => (
              <button
                key={app.applicationId}
                onClick={() => setSelectedId(app.applicationId)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-colors",
                  selectedId === app.applicationId
                    ? "border-accent bg-accent/5"
                    : "border-border bg-white hover:border-accent/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-text-secondary">{app.applicationId}</span>
                  <StatusBadge status={app.status} size="sm" />
                </div>
                <p className="font-medium text-sm">{app.asset.name}</p>
                <p className="text-xs text-text-secondary">{app.buyer.companyName}</p>
                <p className="text-sm font-bold mt-1">¥{formatYen(app.asset.price)}</p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">{selectedApp.asset.name}</h2>
                    <p className="text-sm text-text-secondary">
                      {selectedApp.buyer.companyName} / ¥{formatYen(selectedApp.asset.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedApp.status} />
                    <Link
                      href={`/finance/applications/${selectedApp.applicationId}`}
                      className="text-xs text-accent hover:underline"
                    >
                      詳細画面 →
                    </Link>
                  </div>
                </div>

                <RiskScorePanel risk={selectedApp.riskAssessment} />
              </div>

              {selectedApp.adminMemo && (
                <div className="bg-white rounded-lg border border-border p-6">
                  <h3 className="font-bold text-sm mb-2">過去の審査メモ</h3>
                  <p className="text-sm text-text-secondary">{selectedApp.adminMemo}</p>
                </div>
              )}

              <div className="bg-white rounded-lg border border-border p-6">
                <h3 className="font-bold text-lg mb-4">ステータス変更</h3>
                <StatusUpdateDialog
                  currentStatus={selectedApp.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border p-12 text-center text-text-secondary">
              左の一覧から案件を選択してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
