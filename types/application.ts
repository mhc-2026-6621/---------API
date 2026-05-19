import { Asset } from "./asset";
import { Buyer } from "./buyer";
import { Quote } from "./quote";
import { RiskAssessment } from "./risk";
import { Seller } from "./seller";
import { Payout } from "./payout";

export type ApplicationStatus =
  | "quote_created"
  | "pre_screening_submitted"
  | "pre_approved"
  | "manual_review"
  | "formal_review"
  | "approved"
  | "rejected"
  | "contract_pending"
  | "contracted"
  | "delivered"
  | "accepted"
  | "seller_paid"
  | "billing_started"
  | "matured";

export type TimelineStepStatus = "completed" | "current" | "pending" | "blocked";

export interface TimelineStep {
  step: string;
  label: string;
  status: TimelineStepStatus;
  completedAt: string | null;
}

export interface Application {
  applicationId: string;
  quoteId: string;
  assetId: string;
  sellerId: string;
  status: ApplicationStatus;
  createdAt: string;
  buyer: Buyer;
  asset: Pick<Asset, "id" | "name" | "price" | "category" | "maker" | "model" | "serialNumber">;
  seller: Pick<Seller, "id" | "name" | "certified" | "riskGrade">;
  quote: Pick<Quote, "quoteId" | "financeProduct" | "termMonths" | "financedAmount" | "downPayment" | "annualRate" | "totalMonthlyPayment">;
  decision: {
    result: "pre_approved" | "manual_review" | "declined";
    approvedAmount: number;
    termMonths: number;
    annualRate: number;
    estimatedMonthlyPayment: number;
    requiredDocuments: string[];
    conditions: string[];
    reasonCodes: string[];
  };
  riskAssessment: RiskAssessment;
  requiredDocuments: {
    name: string;
    status: "submitted" | "pending" | "rejected";
  }[];
  timeline: TimelineStep[];
  payout: Payout | null;
  adminMemo: string;
  nextAction: string;
}
