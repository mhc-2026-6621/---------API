export type AssetCategory =
  | "used_construction_equipment"
  | "forklift"
  | "machine_tool"
  | "kitchen_food_equipment"
  | "industrial_machinery"
  | "refrigeration_equipment"
  | "robot_conveyor";

export type FinanceStatus =
  | "instant_quote"
  | "pre_screening"
  | "custom_quote";

export type FinanceProduct =
  | "installment"
  | "finance_lease"
  | "operating_lease";

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  categoryLabel: string;
  maker: string;
  model: string;
  serialNumber: string;
  year: number;
  usageHours: number | null;
  conditionGrade: string;
  location: string;
  price: number;
  taxIncluded: boolean;
  sellerId: string;
  sellerName: string;
  financeAvailable: boolean;
  financeStatus: FinanceStatus;
  estimatedMonthlyPayment: number;
  inspectionReportAvailable: boolean;
  ownershipCheckStatus: "verified" | "pending" | "not_checked";
  lienCheckStatus: "clear" | "pending" | "flagged";
  photos: { url: string | null; caption: string }[];
  maintenanceHistory: {
    date: string;
    type: string;
    description: string;
  }[];
  recommendedFinanceProducts: {
    product: FinanceProduct;
    label: string;
    termMonths: number;
    estimatedMonthly: number;
  }[];
}
