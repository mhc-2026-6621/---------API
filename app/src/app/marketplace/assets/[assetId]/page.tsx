"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Asset } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { AssetInfoSection } from "./_components/AssetInfoSection";
import { MonthlyPaymentSimulator } from "./_components/MonthlyPaymentSimulator";

export default function AssetDetailPage({ params }: { params: { assetId: string } }) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    fetchWithLog("アセット詳細取得", `/api/assets/${params.assetId}`).then(setAsset);
  }, [params.assetId, fetchWithLog]);

  if (!asset) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-text-secondary">読み込み中...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/marketplace" className="text-sm text-accent hover:underline mb-4 inline-block">
        ← 一覧に戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AssetInfoSection asset={asset} />
        <MonthlyPaymentSimulator asset={asset} />
      </div>
    </div>
  );
}
