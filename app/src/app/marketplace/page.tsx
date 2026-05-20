"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CreditCard, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Asset } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { AssetCard } from "./_components/AssetCard";
import { AssetSearchFilter, PriceBand, SortOption } from "./_components/AssetSearchFilter";
import { CATEGORY_LABELS } from "@/lib/label-maps";

const CATEGORY_HIGHLIGHTS = [
  "used_construction_equipment",
  "forklift",
  "machine_tool",
  "kitchen_food_equipment",
] as const;

function matchesPriceBand(asset: Asset, priceBand: PriceBand) {
  if (priceBand === "under_5m") return asset.price < 5000000;
  if (priceBand === "5m_10m") return asset.price >= 5000000 && asset.price < 10000000;
  if (priceBand === "10m_20m") return asset.price >= 10000000 && asset.price < 20000000;
  if (priceBand === "over_20m") return asset.price >= 20000000;
  return true;
}

export default function MarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceBand, setPriceBand] = useState<PriceBand>("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [loading, setLoading] = useState(true);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    setLoading(true);
    fetchWithLog("アセット一覧取得", "/api/assets").then((data) => {
      setAssets(data.assets || []);
      setLoading(false);
    });
  }, [fetchWithLog]);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = assets.filter((asset) => {
      const targetText = [asset.name, asset.maker, asset.model, asset.sellerName, asset.location, asset.categoryLabel]
        .join(" ")
        .toLowerCase();
      return (!category || asset.category === category) && (!query || targetText.includes(query)) && matchesPriceBand(asset, priceBand);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "year_desc") return b.year - a.year;
      if (sortBy === "monthly_asc") return a.estimatedMonthlyPayment - b.estimatedMonthlyPayment;
      return Number(b.inspectionReportAvailable) - Number(a.inspectionReportAvailable) || a.price - b.price;
    });
  }, [assets, category, priceBand, searchQuery, sortBy]);

  const instantQuoteCount = assets.filter((asset) => asset.financeStatus === "instant_quote").length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white border border-border rounded-lg p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold text-accent mb-1">B2B EQUIPMENT MARKETPLACE</p>
              <h1 className="text-2xl font-bold">産業機械・設備マーケット</h1>
              <p className="text-sm text-text-secondary mt-2">
                中古建機、フォークリフト、工作機械、食品設備を通常購入またはリース・分割で検討できます。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center min-w-full lg:min-w-[420px]">
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold">{assets.length}</p>
                <p className="text-xs text-text-secondary">掲載商品</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold">{instantQuoteCount}</p>
                <p className="text-xs text-text-secondary">即時試算</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-lg font-bold">全国</p>
                <p className="text-xs text-text-secondary">配送相談</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORY_HIGHLIGHTS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(category === key ? "" : key)}
              className={`text-left bg-white border rounded-lg p-4 shadow-sm transition-colors ${category === key ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent"}`}
            >
              <p className="text-sm font-bold">{CATEGORY_LABELS[key]}</p>
              <p className="text-xs text-text-secondary mt-1">在庫 {assets.filter((asset) => asset.category === key).length} 件</p>
            </button>
          ))}
        </section>

        <AssetSearchFilter
          selectedCategory={category}
          searchQuery={searchQuery}
          priceBand={priceBand}
          sortBy={sortBy}
          resultCount={filteredAssets.length}
          onCategoryChange={setCategory}
          onSearchQueryChange={setSearchQuery}
          onPriceBandChange={setPriceBand}
          onSortByChange={setSortBy}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4">
            <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
              <h2 className="text-sm font-bold mb-3">購入サポート</h2>
              <div className="space-y-3 text-sm text-text-secondary">
                <p className="flex gap-2"><PackageCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />点検レポート付き商品を掲載</p>
                <p className="flex gap-2"><CreditCard className="w-4 h-4 text-accent shrink-0 mt-0.5" />リース・割賦の月額目安を表示</p>
                <p className="flex gap-2"><Truck className="w-4 h-4 text-warning shrink-0 mt-0.5" />搬出・配送条件は販売店に確認</p>
                <p className="flex gap-2"><ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />所有権・担保権確認ステータスを表示</p>
              </div>
            </div>
            <div className="bg-white border border-border rounded-lg p-4 shadow-sm">
              <h2 className="text-sm font-bold mb-3">出店販売店</h2>
              <div className="space-y-2 text-sm text-text-secondary">
                {Array.from(new Set(assets.map((asset) => asset.sellerName))).map((sellerName) => (
                  <p key={sellerName} className="flex gap-2"><Building2 className="w-4 h-4 shrink-0 mt-0.5" />{sellerName}</p>
                ))}
              </div>
            </div>
          </aside>

          <main>
            {loading ? (
              <div className="text-center py-12 text-text-secondary bg-white border border-border rounded-lg">読み込み中...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-12 text-text-secondary bg-white border border-border rounded-lg">条件に一致する商品がありません。</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
