"use client";

import { cn } from "@/lib/format-utils";

interface Props {
  documents: { name: string; status: "submitted" | "pending" | "rejected" }[];
}

const STATUS_MAP = {
  submitted: { icon: "✅", label: "提出済", color: "text-green-600" },
  pending: { icon: "⏳", label: "未提出", color: "text-amber-600" },
  rejected: { icon: "❌", label: "要再提出", color: "text-red-600" },
};

export function RequiredDocumentList({ documents }: Props) {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="font-bold text-lg mb-4">必要書類</h3>
      <div className="space-y-2">
        {documents.map((doc) => {
          const s = STATUS_MAP[doc.status];
          return (
            <div key={doc.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{doc.name}</span>
              <span className={cn("text-sm flex items-center gap-1", s.color)}>
                {s.icon} {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
