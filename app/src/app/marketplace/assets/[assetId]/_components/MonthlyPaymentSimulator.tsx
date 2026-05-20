"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { Asset, QuoteResponse } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { YenAmount } from "@/components/shared/YenAmount";
import { FINANCE_PRODUCT_LABELS, TERM_OPTIONS } from "@/lib/label-maps";
import { formatYen, formatPercent } from "@/lib/format-utils";
import { cn } from "@/lib/format-utils";

export function MonthlyPaymentSimulator({ asset }: { asset: Asset }) {
  const router = useRouter();
  const { fetchWithLog } = useApiCallLog();

  const [financeProduct, setFinanceProduct] = useState("installment");
  const [termMonths, setTermMonths] = useState(60);
  const [downPayment, setDownPayment] = useState(0);
  const [residualValuePercent, setResidualValuePercent] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeMaintenance, setIncludeMaintenance] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    const body = {
      assetId: asset.id,
      assetPrice: asset.price,
      financeProduct,
      termMonths,
      downPayment,
      residualValuePercent,
      includeInsurance,
      includeMaintenance,
      buyerProfile: {
        businessType: "general",
        yearsInBusiness: 10,
        annualRevenueRange: "100m_300m",
        creditTier: "B",
      },
    };

    const result = await fetchWithLog("月額試算", "/api/finance/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setQuote(result);
    setIsCalculating(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-bold mb-1">{asset.name}</h2>
        <p className="text-text-secondary text-sm mb-3">{asset.maker} {asset.model}</p>
        <YenAmount amount={asset.price} size="lg" />
        <span className="text-sm text-text-secondary ml-1">{asset.taxIncluded ? "（税込）" : ""}</span>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsAddedToCart(true)}
            className="flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3 rounded-lg font-bold hover:bg-[#2d5a8e] transition-colors"
          >
            {isAddedToCart ? <CheckCircle className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            {isAddedToCart ? "カートに追加済み" : "通常購入する"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/finance/apply?assetId=${asset.id}`)}
            className="border-2 border-[#1e3a5f] text-[#1e3a5f] py-3 rounded-lg font-bold hover:bg-[#1e3a5f] hover:text-white transition-colors"
          >
            リース・分割で申込
          </button>
        </div>
        {isAddedToCart && (
          <p className="mt-2 text-xs text-success">通常購入のカートに追加しました。既存ECの購入フローへ進む想定です。</p>
        )}

        <div className="mt-4 bg-accent/10 rounded-lg p-4">
          <YenAmount amount={asset.estimatedMonthlyPayment} size="lg" label="月額" suffix="〜" highlight />
          <p className="text-xs text-text-secondary mt-1">リース・分割払いを選ぶ場合の参考月額</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-bold text-lg mb-4">月額ファイナンス試算</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ファイナンス種別</label>
            <select
              value={financeProduct}
              onChange={(e) => setFinanceProduct(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm"
            >
              {Object.entries(FINANCE_PRODUCT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">期間</label>
            <div className="flex gap-2">
              {TERM_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTermMonths(t)}
                  className={cn(
                    "flex-1 py-2 rounded text-sm border transition-colors",
                    termMonths === t
                      ? "bg-[#1e3a5f] text-white border-[#1e3a5f]"
                      : "border-border hover:border-[#1e3a5f]"
                  )}
                >
                  {t}ヶ月
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">頭金</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full border border-border rounded px-3 py-2 text-sm"
              placeholder="0"
              min={0}
              step={100000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">残価設定</label>
            <select
              value={residualValuePercent}
              onChange={(e) => setResidualValuePercent(Number(e.target.value))}
              className="w-full border border-border rounded px-3 py-2 text-sm"
            >
              <option value={0}>なし</option>
              <option value={10}>10%</option>
              <option value={20}>20%</option>
            </select>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeInsurance} onChange={(e) => setIncludeInsurance(e.target.checked)} className="rounded" />
              動産総合保険
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeMaintenance} onChange={(e) => setIncludeMaintenance(e.target.checked)} className="rounded" />
              メンテナンス
            </label>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isCalculating ? "計算中..." : "月額を試算する"}
          </button>
        </div>
      </div>

      {quote && (
        <div className="bg-white rounded-lg border-2 border-accent p-6">
          <h3 className="font-bold text-lg mb-4">試算結果</h3>
          <div className="text-center mb-4">
            <p className="text-sm text-text-secondary">月額お支払い額</p>
            <YenAmount amount={quote.totalMonthlyPayment} size="lg" highlight />
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">元利均等月額</span>
              <span>¥{formatYen(quote.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">保険料月額</span>
              <span>¥{formatYen(quote.insuranceMonthlyFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">メンテナンス月額</span>
              <span>¥{formatYen(quote.maintenanceMonthlyFee)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-text-secondary">ファイナンス対象額</span>
              <span>¥{formatYen(quote.financedAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">頭金</span>
              <span>¥{formatYen(quote.downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">適用年率</span>
              <span>{formatPercent(quote.annualRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">期間</span>
              <span>{quote.termMonths}ヶ月</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">有効期限</span>
              <span>{quote.validUntil}まで</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-4">※{quote.disclaimer}</p>
          <button
            onClick={() => router.push(`/finance/apply?assetId=${asset.id}&quoteId=${quote.quoteId}`)}
            className="w-full mt-4 bg-[#1e3a5f] text-white py-3 rounded-lg font-bold hover:bg-[#2d5a8e] transition-colors"
          >
            仮審査に進む →
          </button>
        </div>
      )}

      {!quote && (
        <button
          onClick={() => router.push(`/finance/apply?assetId=${asset.id}`)}
          className="w-full bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] py-3 rounded-lg font-bold hover:bg-[#1e3a5f] hover:text-white transition-colors"
        >
          リース・分割の仮審査に進む
        </button>
      )}
    </div>
  );
}
