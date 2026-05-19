import { FinanceProduct } from "./asset";
import { AnnualRevenueRange } from "./buyer";

export interface QuoteRequest {
  assetId: string;
  assetPrice: number;
  financeProduct: FinanceProduct;
  termMonths: number;
  downPayment: number;
  residualValuePercent: number;
  includeInsurance: boolean;
  includeMaintenance: boolean;
  buyerProfile: {
    businessType: string;
    yearsInBusiness: number;
    annualRevenueRange: AnnualRevenueRange;
    creditTier: CreditTier;
  };
}

export type CreditTier = "A" | "B" | "C";

export interface RateBreakdown {
  baseRate: number;
  creditAdjustment: number;
  usedAssetAdjustment: number;
  inspectionAdjustment: number;
  finalRate: number;
  note: string;
}

export interface QuoteResponse {
  quoteId: string;
  assetId: string;
  financeProduct: FinanceProduct;
  financeProductLabel: string;
  termMonths: number;
  assetPrice: number;
  downPayment: number;
  residualValue: number;
  financedAmount: number;
  annualRate: number;
  monthlyPayment: number;
  insuranceMonthlyFee: number;
  maintenanceMonthlyFee: number;
  totalMonthlyPayment: number;
  totalPayment: number;
  initialCost: number;
  createdAt: string;
  validUntil: string;
  disclaimer: string;
  rateBreakdown: RateBreakdown;
}

export interface Quote {
  quoteId: string;
  assetId: string;
  financeProduct: FinanceProduct;
  financeProductLabel: string;
  termMonths: number;
  assetPrice: number;
  downPayment: number;
  residualValue: number;
  financedAmount: number;
  annualRate: number;
  monthlyPayment: number;
  insuranceMonthlyFee: number;
  maintenanceMonthlyFee: number;
  totalMonthlyPayment: number;
  totalPayment: number;
  initialCost: number;
  createdAt: string;
  validUntil: string;
  disclaimer: string;
}
