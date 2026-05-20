import { ApplicationStatus, AssetCategory, FinanceProduct, FinanceStatus, AnnualRevenueRange, EmployeeRange } from "@/types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  quote_created: "試算済",
  pre_screening_submitted: "仮審査中",
  pre_approved: "仮承認",
  manual_review: "追加確認",
  formal_review: "本審査中",
  approved: "承認済",
  rejected: "否決",
  contract_pending: "契約待ち",
  contracted: "契約済",
  delivered: "納品済",
  accepted: "検収済",
  seller_paid: "支払済",
  billing_started: "請求中",
  matured: "満了",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  quote_created: "bg-slate-100 text-slate-700",
  pre_screening_submitted: "bg-blue-100 text-blue-700",
  pre_approved: "bg-green-100 text-green-700",
  manual_review: "bg-amber-100 text-amber-700",
  formal_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  contract_pending: "bg-purple-100 text-purple-700",
  contracted: "bg-purple-100 text-purple-700",
  delivered: "bg-teal-100 text-teal-700",
  accepted: "bg-teal-100 text-teal-700",
  seller_paid: "bg-green-100 text-green-700",
  billing_started: "bg-blue-100 text-blue-700",
  matured: "bg-slate-100 text-slate-700",
};

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  used_construction_equipment: "中古建機",
  forklift: "フォークリフト",
  machine_tool: "工作機械",
  kitchen_food_equipment: "厨房/食品設備",
  industrial_machinery: "産業機械",
  refrigeration_equipment: "冷凍冷蔵設備",
  robot_conveyor: "ロボット/搬送",
};

export const FINANCE_PRODUCT_LABELS: Record<FinanceProduct, string> = {
  installment: "割賦",
  finance_lease: "ファイナンスリース",
  operating_lease: "オペレーティングリース",
};

export const FINANCE_STATUS_LABELS: Record<FinanceStatus, string> = {
  instant_quote: "即時試算可",
  pre_screening: "仮審査可",
  custom_quote: "要個別見積",
};

export const FINANCE_STATUS_COLORS: Record<FinanceStatus, string> = {
  instant_quote: "bg-green-100 text-green-700",
  pre_screening: "bg-blue-100 text-blue-700",
  custom_quote: "bg-amber-100 text-amber-700",
};

export const REVENUE_RANGE_LABELS: Record<AnnualRevenueRange, string> = {
  under_50m: "5,000万円未満",
  "50m_100m": "5,000万〜1億円",
  "100m_300m": "1〜3億円",
  "300m_1b": "3〜10億円",
  "1b_over": "10億円以上",
};

export const EMPLOYEE_RANGE_LABELS: Record<EmployeeRange, string> = {
  under_5: "5名未満",
  "5_20": "5〜20名",
  "20_50": "20〜50名",
  "50_100": "50〜100名",
  "100_over": "100名以上",
};

export const INDUSTRY_OPTIONS = [
  "建設業",
  "製造業",
  "運輸業",
  "食品製造業",
  "小売業",
  "卸売業",
  "サービス業",
  "その他",
];

export const TERM_OPTIONS = [36, 48, 60, 72];
