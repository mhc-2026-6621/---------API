import { ApplicationStatus } from "@/types";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/label-maps";
import { cn } from "@/lib/format-utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        STATUS_COLORS[status],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
