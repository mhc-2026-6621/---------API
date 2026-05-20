"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Asset } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { PreScreeningForm } from "./_components/PreScreeningForm";

function FinanceApplyContent() {
  const searchParams = useSearchParams();
  const assetId = searchParams.get("assetId");
  const quoteId = searchParams.get("quoteId") || undefined;
  const [asset, setAsset] = useState<Asset | null>(null);
  const { fetchWithLog } = useApiCallLog();

  useEffect(() => {
    if (assetId) {
      fetchWithLog("アセット詳細取得", `/api/assets/${assetId}`).then(setAsset);
    }
  }, [assetId, fetchWithLog]);

  if (!assetId) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-text-secondary">アセットが指定されていません</div>;
  }

  if (!asset) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-text-secondary">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">ファイナンス仮審査申込</h1>
      <PreScreeningForm asset={asset} quoteId={quoteId} />
    </div>
  );
}

export default function FinanceApplyPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-center text-text-secondary">読み込み中...</div>}>
      <FinanceApplyContent />
    </Suspense>
  );
}
