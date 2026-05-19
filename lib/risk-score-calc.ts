import { Asset, Buyer, Seller, RiskAssessment } from "@/types";

export function calcCreditScore(buyer: Buyer): number {
  let score = 0;
  const currentYear = new Date().getFullYear();
  const years = currentYear - buyer.establishedYear;

  if (years >= 10) score += 25;
  else if (years >= 5) score += 15;
  else if (years >= 3) score += 5;

  const revenueScores: Record<string, number> = {
    "1b_over": 20, "300m_1b": 20, "100m_300m": 15, "50m_100m": 10, under_50m: 5,
  };
  score += revenueScores[buyer.annualRevenueRange] ?? 5;

  const industryScores: Record<string, number> = {
    "製造業": 5, "運輸業": 3, "建設業": 0, "食品製造業": -5, "飲食業": -5,
  };
  score += industryScores[buyer.industry] ?? 0;

  return Math.min(100, Math.max(0, score));
}

export function calcAssetScore(asset: Pick<Asset, "serialNumber" | "conditionGrade" | "year" | "inspectionReportAvailable" | "ownershipCheckStatus" | "lienCheckStatus">): number {
  let score = 0;

  if (asset.serialNumber) score += 20;

  const gradeScores: Record<string, number> = { "A+": 25, A: 20, "B+": 15, B: 10, C: 5 };
  score += gradeScores[asset.conditionGrade] ?? 5;

  const age = new Date().getFullYear() - asset.year;
  if (age <= 5) score += 20;
  else if (age <= 10) score += 10;
  else score += 5;

  if (asset.inspectionReportAvailable) score += 15;
  if (asset.ownershipCheckStatus === "verified") score += 10;
  if (asset.lienCheckStatus === "clear") score += 10;

  return Math.min(100, Math.max(0, score));
}

export function calcSellerScore(seller: Pick<Seller, "certified" | "riskGrade">): number {
  let score = 0;

  if (seller.certified) score += 50;

  const gradeScores: Record<string, number> = { A: 30, B: 20, C: 10, D: 0 };
  score += gradeScores[seller.riskGrade] ?? 0;

  score += 20;

  return Math.min(100, Math.max(0, score));
}

export function calculateRiskAssessment(
  buyer: Buyer,
  asset: Asset,
  seller: Pick<Seller, "id" | "name" | "certified" | "riskGrade">,
  amount: number,
  consents: { creditCheck: boolean; antiSocialCheck: boolean; privacyPolicy: boolean },
  hasPersonalGuarantee: boolean,
  hasFinancialStatements: boolean,
  hasBankData: boolean
): RiskAssessment {
  let creditScore = calcCreditScore(buyer);
  if (hasFinancialStatements) creditScore = Math.min(100, creditScore + 15);
  if (hasPersonalGuarantee) creditScore = Math.min(100, creditScore + 10);
  if (hasBankData) creditScore = Math.min(100, creditScore + 5);

  const assetScore = calcAssetScore(asset);
  const sellerScore = calcSellerScore(seller);

  const totalScore = Math.round(creditScore * 0.5 + assetScore * 0.3 + sellerScore * 0.2);

  const reasonCodes: RiskAssessment["reasonCodes"] = [];
  const years = new Date().getFullYear() - buyer.establishedYear;
  if (years >= 10) reasonCodes.push({ code: "YEARS_GT_10", label: "法人年数10年以上", impact: "+10" });
  if (asset.serialNumber) reasonCodes.push({ code: "ASSET_LIQUID", label: "対象物件の中古流通性あり", impact: "+8" });
  if (seller.certified) reasonCodes.push({ code: "SELLER_CERTIFIED", label: "販売店が認定済み", impact: "+5" });
  if (hasFinancialStatements) reasonCodes.push({ code: "FS_AVAILABLE", label: "決算書提出可", impact: "+5" });
  if (hasPersonalGuarantee) reasonCodes.push({ code: "GUARANTEE", label: "代表者保証あり", impact: "+5" });

  const warningFlags: RiskAssessment["warningFlags"] = [];
  if (amount > 10000000) warningFlags.push({ code: "HIGH_VALUE", label: "高額案件（1,000万円超）" });
  if (years < 3) warningFlags.push({ code: "YOUNG_COMPANY", label: "法人設立3年未満" });
  if (!seller.certified) warningFlags.push({ code: "UNCERTIFIED_SELLER", label: "未認定販売店" });

  let result: RiskAssessment["result"];
  if (!consents.antiSocialCheck || totalScore < 45) {
    result = "declined";
  } else if (amount > 30000000 || years < 3 || totalScore < 70 || !asset.serialNumber || !seller.certified) {
    result = "manual_review";
  } else if (totalScore >= 70 && consents.creditCheck && consents.antiSocialCheck && consents.privacyPolicy && asset.serialNumber && seller.certified) {
    result = "pre_approved";
  } else {
    result = "manual_review";
  }

  return { creditScore, assetScore, sellerScore, totalScore, result, reasonCodes, warningFlags };
}
