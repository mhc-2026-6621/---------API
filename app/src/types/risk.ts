export interface RiskAssessment {
  creditScore: number;
  assetScore: number;
  sellerScore: number;
  totalScore: number;
  result: "pre_approved" | "manual_review" | "declined";
  reasonCodes: {
    code: string;
    label: string;
    impact: string;
  }[];
  warningFlags: {
    code: string;
    label: string;
  }[];
}
