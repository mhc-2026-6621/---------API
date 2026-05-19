import { formatYen } from "@/lib/format-utils";
import { cn } from "@/lib/format-utils";

interface YenAmountProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  suffix?: string;
  highlight?: boolean;
}

const SIZE_CLASSES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl font-bold",
};

export function YenAmount({ amount, size = "md", label, suffix, highlight }: YenAmountProps) {
  return (
    <span className={cn(SIZE_CLASSES[size], highlight && "text-accent")}>
      {label && <span className="text-sm font-normal mr-1">{label}</span>}
      ¥{formatYen(amount)}
      {suffix && <span className="text-sm font-normal">{suffix}</span>}
    </span>
  );
}
