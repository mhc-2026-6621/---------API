"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentRole } from "@/hooks/use-current-role";
import { cn } from "@/lib/format-utils";
import { Role } from "@/contexts/RoleProvider";

const NAV_ITEMS: Record<Role, { label: string; href: string }[]> = {
  buyer: [
    { label: "マーケットプレイス", href: "/marketplace" },
    { label: "申込管理", href: "/finance/applications" },
  ],
  merchant: [
    { label: "マーケットプレイス", href: "/marketplace" },
    { label: "販売店ダッシュボード", href: "/merchant/dashboard" },
  ],
  admin: [
    { label: "管理者ダッシュボード", href: "/admin/dashboard" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  buyer: "Buyer（買い手）",
  merchant: "Merchant（販売店）",
  admin: "Finance Admin（管理者）",
};

export function GlobalHeader() {
  const { role, setRole } = useCurrentRole();
  const pathname = usePathname();

  return (
    <header className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/about" className="font-bold text-lg tracking-tight hover:text-white/90 transition-colors">
            エンベデットリースAPI
          </Link>
          <nav className="flex gap-1">
            {NAV_ITEMS[role].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded text-sm transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              className={cn(
                "px-3 py-1.5 rounded text-sm transition-colors",
                pathname === "/about"
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              APIについて
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">ロール:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white cursor-pointer"
          >
            {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
              <option key={r} value={r} className="text-gray-900">
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
