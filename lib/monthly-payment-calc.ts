import { AssetCategory, QuoteRequest, QuoteResponse, CreditTier, RateBreakdown } from "@/types";
import { BASE_RATES, CREDIT_TIER_ADJUSTMENT, USED_ASSET_ADJUSTMENT, NO_INSPECTION_ADJUSTMENT, INSURANCE_RATE, MAINTENANCE_RATE } from "./rate-table";
import { FINANCE_PRODUCT_LABELS } from "./label-maps";
import { generateId } from "./format-utils";

function calcRate(
  category: AssetCategory,
  creditTier: CreditTier,
  isUsed: boolean,
  hasInspectionReport: boolean
): RateBreakdown {
  const baseRate = BASE_RATES[category];
  const creditAdjustment = CREDIT_TIER_ADJUSTMENT[creditTier];
  const usedAssetAdjustment = isUsed ? USED_ASSET_ADJUSTMENT : 0;
  const inspectionAdjustment = !hasInspectionReport ? NO_INSPECTION_ADJUSTMENT : 0;
  const finalRate = baseRate + creditAdjustment + usedAssetAdjustment + inspectionAdjustment;

  const notes: string[] = [];
  if (isUsed && usedAssetAdjustment > 0) notes.push("中古資産加算(+0.4%)適用");
  if (!hasInspectionReport && inspectionAdjustment > 0) notes.push("点検レポートなし加算(+0.3%)適用");
  if (hasInspectionReport) notes.push("点検レポートあり割引適用");
  if (creditAdjustment < 0) notes.push(`信用ティア${creditTier}優遇(${(creditAdjustment * 100).toFixed(1)}%)適用`);
  if (creditAdjustment > 0) notes.push(`信用ティア${creditTier}加算(+${(creditAdjustment * 100).toFixed(1)}%)適用`);

  return {
    baseRate,
    creditAdjustment,
    usedAssetAdjustment,
    inspectionAdjustment,
    finalRate,
    note: notes.join("。") + "。",
  };
}

export function calculateMonthlyPayment(req: QuoteRequest, category: AssetCategory, hasInspectionReport: boolean): QuoteResponse {
  const isUsed = category === "used_construction_equipment";
  const rateBreakdown = calcRate(category, req.buyerProfile.creditTier, isUsed, hasInspectionReport);

  const annualRate = rateBreakdown.finalRate;
  const monthlyRate = annualRate / 12;
  const n = req.termMonths;

  const residualValue = req.assetPrice * req.residualValuePercent / 100;
  const pvResidual = residualValue > 0 ? residualValue / Math.pow(1 + monthlyRate, n) : 0;
  const principal = req.assetPrice - req.downPayment - pvResidual;

  const monthlyPayment = monthlyRate > 0
    ? Math.round(principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)))
    : Math.round(principal / n);

  const insuranceMonthlyFee = req.includeInsurance ? Math.round(req.assetPrice * INSURANCE_RATE / 12) : 0;
  const maintenanceMonthlyFee = req.includeMaintenance ? Math.round(req.assetPrice * MAINTENANCE_RATE / 12) : 0;
  const totalMonthlyPayment = monthlyPayment + insuranceMonthlyFee + maintenanceMonthlyFee;

  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setMonth(validUntil.getMonth() + 1);
  validUntil.setDate(0);

  return {
    quoteId: generateId("quote"),
    assetId: req.assetId,
    financeProduct: req.financeProduct,
    financeProductLabel: FINANCE_PRODUCT_LABELS[req.financeProduct],
    termMonths: n,
    assetPrice: req.assetPrice,
    downPayment: req.downPayment,
    residualValue: Math.round(residualValue),
    financedAmount: Math.round(principal + pvResidual),
    annualRate,
    monthlyPayment,
    insuranceMonthlyFee,
    maintenanceMonthlyFee,
    totalMonthlyPayment,
    totalPayment: totalMonthlyPayment * n + req.downPayment,
    initialCost: req.downPayment,
    createdAt: now.toISOString(),
    validUntil: `${validUntil.getFullYear()}-${String(validUntil.getMonth() + 1).padStart(2, "0")}-${String(validUntil.getDate()).padStart(2, "0")}`,
    disclaimer: "この見積は概算です。本審査により条件が変更される場合があります。",
    rateBreakdown,
  };
}
