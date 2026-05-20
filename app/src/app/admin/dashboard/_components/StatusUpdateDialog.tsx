"use client";

import { useEffect, useState } from "react";
import { ApplicationStatus } from "@/types";
import { getAllowedScreeningActions } from "@/lib/application-status-rules";

interface Props {
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus, memo: string) => void;
}

const ACTIONS: { label: string; status: ApplicationStatus; color: string; requiresMemo: boolean }[] = [
  { label: "本審査へ進める", status: "formal_review", color: "bg-blue-600 hover:bg-blue-700", requiresMemo: false },
  { label: "追加書類依頼", status: "manual_review", color: "bg-amber-600 hover:bg-amber-700", requiresMemo: true },
  { label: "承認", status: "approved", color: "bg-green-600 hover:bg-green-700", requiresMemo: false },
  { label: "否決", status: "rejected", color: "bg-red-600 hover:bg-red-700", requiresMemo: true },
];

export function StatusUpdateDialog({ currentStatus, onStatusChange }: Props) {
  const [memo, setMemo] = useState("");
  const [confirming, setConfirming] = useState<ApplicationStatus | null>(null);
  const allowedActions = getAllowedScreeningActions(currentStatus);
  const hasAvailableMemoAction = ACTIONS.some((action) => action.requiresMemo && allowedActions.includes(action.status));

  useEffect(() => {
    setConfirming(null);
  }, [currentStatus]);

  const canRunAction = (status: ApplicationStatus) => allowedActions.includes(status);

  const handleAction = (status: ApplicationStatus, requiresMemo: boolean) => {
    if (!canRunAction(status)) return;
    if (requiresMemo && !memo.trim()) return;
    if (confirming === status) {
      onStatusChange(status, memo);
      setConfirming(null);
      setMemo("");
    } else {
      setConfirming(status);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">審査メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full border border-border rounded px-3 py-2 text-sm"
          rows={3}
          placeholder="メモを入力（任意）"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => {
          const isUnavailable = !canRunAction(action.status);
          const needsMemo = action.requiresMemo && !memo.trim();
          const isDisabled = isUnavailable || needsMemo;
          const title = isUnavailable
            ? "現在のステータスでは実行できません"
            : needsMemo
            ? "審査メモを入力してください"
            : `${currentStatus} から ${action.status} へ変更`;

          return (
            <button
              key={action.status}
              onClick={() => handleAction(action.status, action.requiresMemo)}
              disabled={isDisabled}
              title={title}
              className={`${action.color} text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {confirming === action.status ? `確定: ${action.label}` : action.label}
            </button>
          );
        })}
      </div>

      {confirming && (
        <p className="text-xs text-amber-600">もう一度ボタンを押すと確定します。</p>
      )}
      {allowedActions.length === 0 && (
        <p className="text-xs text-text-secondary">現在のステータスで実行できる審査アクションはありません。</p>
      )}
      {hasAvailableMemoAction && !memo.trim() && (
        <p className="text-xs text-text-secondary">追加書類依頼・否決には審査メモが必要です。</p>
      )}
    </div>
  );
}
