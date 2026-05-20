"use client";

import { useState } from "react";
import { Asset, Application } from "@/types";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { INDUSTRY_OPTIONS, REVENUE_RANGE_LABELS, EMPLOYEE_RANGE_LABELS, FINANCE_PRODUCT_LABELS, TERM_OPTIONS } from "@/lib/label-maps";
import { formatYen } from "@/lib/format-utils";
import { PreScreeningResult } from "./PreScreeningResult";

const SAMPLE_DATA = {
  corporateNumber: "1234567890123",
  companyName: "東京サンプル建設株式会社",
  representativeName: "山田 太郎",
  industry: "建設業",
  establishedYear: "2009",
  annualRevenueRange: "100m_300m",
  employeeRange: "20_50",
  headOfficeAddress: "東京都千代田区丸の内1-1-1",
  installationAddress: "千葉県市原市〇〇町1-2-3",
  purpose: "自社工事現場での掘削作業に利用",
};

interface Props {
  asset: Asset;
  quoteId?: string;
}

export function PreScreeningForm({ asset, quoteId }: Props) {
  const { fetchWithLog } = useApiCallLog();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Application | null>(null);

  const [form, setForm] = useState({
    corporateNumber: "",
    companyName: "",
    representativeName: "",
    industry: "",
    establishedYear: "",
    annualRevenueRange: "",
    employeeRange: "",
    headOfficeAddress: "",
    installationAddress: "",
    purpose: "",
    financeProduct: "installment",
    termMonths: "60",
    downPayment: "0",
    personalGuarantee: true,
    financialStatementsAvailable: true,
    bankTransactionDataAvailable: false,
    creditCheck: true,
    antiSocialCheck: true,
    privacyPolicy: true,
  });

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const fillSample = () => {
    setForm((prev) => ({ ...prev, ...SAMPLE_DATA }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      quoteId: quoteId || undefined,
      assetId: asset.id,
      sellerId: asset.sellerId,
      buyer: {
        corporateNumber: form.corporateNumber,
        companyName: form.companyName,
        representativeName: form.representativeName,
        industry: form.industry,
        establishedYear: Number(form.establishedYear),
        annualRevenueRange: form.annualRevenueRange,
        employeeRange: form.employeeRange,
        headOfficeAddress: form.headOfficeAddress,
        installationAddress: form.installationAddress,
      },
      application: {
        financeProduct: form.financeProduct,
        termMonths: Number(form.termMonths),
        downPayment: Number(form.downPayment),
        personalGuarantee: form.personalGuarantee,
        financialStatementsAvailable: form.financialStatementsAvailable,
        bankTransactionDataAvailable: form.bankTransactionDataAvailable,
        purpose: form.purpose,
      },
      consents: {
        creditCheck: form.creditCheck,
        antiSocialCheck: form.antiSocialCheck,
        privacyPolicy: form.privacyPolicy,
      },
    };

    const data = await fetchWithLog("仮審査申込", "/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setResult(data);
    setSubmitting(false);
  };

  if (result) {
    return <PreScreeningResult application={result} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="font-bold text-sm mb-2">対象アセット</h3>
          <p className="font-bold">{asset.name}</p>
          <p className="text-sm text-text-secondary">¥{formatYen(asset.price)}</p>
          <p className="text-sm text-text-secondary">{asset.sellerName}</p>
        </div>
        <div className="bg-white rounded-lg border border-border p-4">
          <h3 className="font-bold text-sm mb-2">ファイナンス条件（確認）</h3>
          <p className="text-sm">種別: {FINANCE_PRODUCT_LABELS[form.financeProduct as keyof typeof FINANCE_PRODUCT_LABELS]}</p>
          <p className="text-sm">期間: {form.termMonths}ヶ月</p>
          <p className="text-sm">頭金: ¥{formatYen(Number(form.downPayment))}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">法人情報</h3>
          <button type="button" onClick={fillSample} className="text-sm bg-accent/10 text-accent px-3 py-1 rounded hover:bg-accent/20">
            サンプル入力
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">法人番号 <span className="text-danger">*</span></label>
            <input type="text" required value={form.corporateNumber} onChange={(e) => update("corporateNumber", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" maxLength={13} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">会社名 <span className="text-danger">*</span></label>
            <input type="text" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">代表者名 <span className="text-danger">*</span></label>
            <input type="text" required value={form.representativeName} onChange={(e) => update("representativeName", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">業種 <span className="text-danger">*</span></label>
            <select required value={form.industry} onChange={(e) => update("industry", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm">
              <option value="">選択してください</option>
              {INDUSTRY_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">設立年 <span className="text-danger">*</span></label>
            <input type="number" required value={form.establishedYear} onChange={(e) => update("establishedYear", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" min={1900} max={2026} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">年商レンジ <span className="text-danger">*</span></label>
            <select required value={form.annualRevenueRange} onChange={(e) => update("annualRevenueRange", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm">
              <option value="">選択してください</option>
              {Object.entries(REVENUE_RANGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">従業員数 <span className="text-danger">*</span></label>
            <select required value={form.employeeRange} onChange={(e) => update("employeeRange", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm">
              <option value="">選択してください</option>
              {Object.entries(EMPLOYEE_RANGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">本社所在地 <span className="text-danger">*</span></label>
            <input type="text" required value={form.headOfficeAddress} onChange={(e) => update("headOfficeAddress", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">設置予定場所 <span className="text-danger">*</span></label>
            <input type="text" required value={form.installationAddress} onChange={(e) => update("installationAddress", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">利用目的 <span className="text-danger">*</span></label>
            <textarea required value={form.purpose} onChange={(e) => update("purpose", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" rows={2} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-bold text-lg mb-4">ファイナンス条件</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">種別</label>
            <select value={form.financeProduct} onChange={(e) => update("financeProduct", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm">
              {Object.entries(FINANCE_PRODUCT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">期間</label>
            <select value={form.termMonths} onChange={(e) => update("termMonths", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm">
              {TERM_OPTIONS.map((t) => <option key={t} value={t}>{t}ヶ月</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">頭金</label>
            <input type="number" value={form.downPayment} onChange={(e) => update("downPayment", e.target.value)}
              className="w-full border border-border rounded px-3 py-2 text-sm" min={0} step={100000} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.personalGuarantee} onChange={(e) => update("personalGuarantee", e.target.checked)} />
            代表者保証あり
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.financialStatementsAvailable} onChange={(e) => update("financialStatementsAvailable", e.target.checked)} />
            決算書提出可
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.bankTransactionDataAvailable} onChange={(e) => update("bankTransactionDataAvailable", e.target.checked)} />
            売上データ提出可
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-bold text-lg mb-4">同意事項</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" required checked={form.creditCheck} onChange={(e) => update("creditCheck", e.target.checked)} />
            信用情報照会に同意する
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" required checked={form.antiSocialCheck} onChange={(e) => update("antiSocialCheck", e.target.checked)} />
            反社チェックに同意する
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" required checked={form.privacyPolicy} onChange={(e) => update("privacyPolicy", e.target.checked)} />
            個人情報の取り扱いに同意する
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1e3a5f] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#2d5a8e] transition-colors disabled:opacity-50"
      >
        {submitting ? "送信中..." : "仮審査を申し込む"}
      </button>
    </form>
  );
}
