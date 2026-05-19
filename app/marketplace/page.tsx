"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { AssetCard } from "./_components/AssetCard";
import { AssetSearchFilter } from "./_components/AssetSearchFilter";

export default function MarketplacePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    const endpoint = `/api/assets${params.toString() ? `?${params}` : ""}`;

    fetchWithLog("アセット一覧取得", endpoint).then((data) => {
      setAssets(data.assets || []);
      setLoading(false);
    });
  }, [category, fetchWithLog]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">アセットマーケットプレイス</h1>

      <div className="mb-6">
        <AssetSearchFilter selectedCategory={category} onCategoryChange={setCategory} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">読み込み中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
