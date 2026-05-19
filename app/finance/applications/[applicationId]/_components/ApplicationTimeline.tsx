"use client";

import { TimelineStep } from "@/types";
import { cn } from "@/lib/format-utils";
import { formatDate } from "@/lib/format-utils";

const STEP_ICONS: Record<string, string> = {
  completed: "✅",
  current: "◉",
  pending: "○",
  blocked: "🚫",
};

export function ApplicationTimeline({ timeline }: { timeline: TimelineStep[] }) {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="font-bold text-lg mb-4">申込進捗</h3>
      <div className="flex items-start overflow-x-auto pb-2">
        {timeline.map((step, i) => (
          <div key={step.step} className="flex items-start min-w-[100px]">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                step.status === "completed" && "bg-green-100",
                step.status === "current" && "bg-blue-100 animate-pulse",
                step.status === "pending" && "bg-gray-100",
                step.status === "blocked" && "bg-red-100",
              )}>
                {STEP_ICONS[step.status]}
              </div>
              <p className={cn(
                "text-xs mt-1 text-center whitespace-nowrap",
                step.status === "current" ? "font-bold text-blue-600" : "text-text-secondary"
              )}>
                {step.label}
              </p>
              {step.completedAt && (
                <p className="text-[10px] text-text-secondary">{formatDate(step.completedAt)}</p>
              )}
              {step.status === "current" && (
                <p className="text-[10px] text-blue-500 font-medium">現在</p>
              )}
            </div>
            {i < timeline.length - 1 && (
              <div className={cn(
                "h-0.5 mt-4 flex-1 min-w-[20px]",
                step.status === "completed" ? "bg-green-300" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
