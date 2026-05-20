import { Application, Asset, Seller, TimelineStep } from "@/types";
import { Buyer } from "@/types";
import { QuoteResponse } from "@/types";
import { calculateRiskAssessment } from "./risk-score-calc";
import { generateId } from "./format-utils";

interface PreScreeningInput {
  buyer: Buyer;
  asset: Asset;
  seller: Pick<Seller, "id" | "name" | "certified" | "riskGrade">;
  quote: QuoteResponse;
  application: {
    financeProduct: string;
    termMonths: number;
    downPayment: number;
    personalGuarantee: boolean;
    financialStatementsAvailable: boolean;
    bankTransactionDataAvailable: boolean;
    purpose: string;
  };
  consents: {
    creditCheck: boolean;
    antiSocialCheck: boolean;
    privacyPolicy: boolean;
  };
}

function buildTimeline(status: string): TimelineStep[] {
  const steps = [
    { step: "quote_created", label: "月額試算" },
    { step: "pre_screening_submitted", label: "仮審査申込" },
    { step: "pre_approved", label: "仮承認" },
    { step: "formal_review", label: "本審査" },
    { step: "contract_pending", label: "電子契約" },
    { step: "delivered", label: "納品/検収" },
    { step: "seller_paid", label: "販売店支払" },
    { step: "billing_started", label: "月額請求開始" },
    { step: "matured", label: "満了処理" },
  ];

  const now = new Date();
  let foundCurrent = false;

  return steps.map((s) => {
    if (foundCurrent) {
      return { ...s, status: "pending" as const, completedAt: null };
    }
    if (s.step === status || (status === "manual_review" && s.step === "pre_approved")) {
      foundCurrent = true;
      return { ...s, status: "current" as const, completedAt: null };
    }
    return { ...s, status: "completed" as const, completedAt: new Date(now.getTime() - Math.random() * 60000).toISOString() };
  });
}

export function runPreScreening(input: PreScreeningInput): Application {
  const riskAssessment = calculateRiskAssessment(
    input.buyer,
    input.asset,
    input.seller,
    input.quote.financedAmount,
    input.consents,
    input.application.personalGuarantee,
    input.application.financialStatementsAvailable,
    input.application.bankTransactionDataAvailable
  );

  const status = riskAssessment.result === "pre_approved" ? "pre_approved"
    : riskAssessment.result === "manual_review" ? "manual_review"
    : "rejected";

  const requiredDocuments = [
    "本人確認書類",
    "商業登記簿謄本",
    "直近2期分の決算書",
    "対象物件の見積書",
    "製造番号が確認できる写真",
    "設置場所情報",
  ];

  const conditions = ["動産総合保険の付保", "検収完了後に販売店へ支払"];
  if (input.application.personalGuarantee) conditions.push("代表者保証あり");

  const nextAction = status === "pre_approved"
    ? "本審査書類をアップロードしてください。"
    : status === "manual_review"
    ? "追加書類の提出をお待ちください。担当者から連絡いたします。"
    : "今回の条件では対応が難しい状況です。条件変更をご検討ください。";

  const now = new Date();

  return {
    applicationId: generateId("app"),
    quoteId: input.quote.quoteId,
    assetId: input.asset.id,
    sellerId: input.seller.id,
    status: status as Application["status"],
    createdAt: now.toISOString(),
    buyer: input.buyer,
    asset: {
      id: input.asset.id,
      name: input.asset.name,
      price: input.asset.price,
      category: input.asset.category,
      maker: input.asset.maker,
      model: input.asset.model,
      serialNumber: input.asset.serialNumber,
    },
    seller: input.seller,
    quote: {
      quoteId: input.quote.quoteId,
      financeProduct: input.quote.financeProduct,
      termMonths: input.quote.termMonths,
      financedAmount: input.quote.financedAmount,
      downPayment: input.quote.downPayment,
      annualRate: input.quote.annualRate,
      totalMonthlyPayment: input.quote.totalMonthlyPayment,
    },
    decision: {
      result: riskAssessment.result,
      approvedAmount: riskAssessment.result !== "declined" ? input.quote.financedAmount : 0,
      termMonths: input.quote.termMonths,
      annualRate: input.quote.annualRate,
      estimatedMonthlyPayment: input.quote.totalMonthlyPayment,
      requiredDocuments,
      conditions,
      reasonCodes: riskAssessment.reasonCodes.map((r) => r.label),
    },
    riskAssessment,
    requiredDocuments: requiredDocuments.map((name) => ({ name, status: "pending" as const })),
    timeline: buildTimeline(status),
    payout: null,
    adminMemo: "",
    nextAction,
  };
}
