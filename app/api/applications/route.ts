import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";
import { runPreScreening } from "@/lib/pre-screening-judge";
import { calculateMonthlyPayment } from "@/lib/monthly-payment-calc";
import { FinanceProduct, QuoteResponse } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const asset = dataStore.getAsset(body.assetId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  const seller = dataStore.getSeller(body.sellerId || asset.sellerId);
  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  if (!body.consents?.creditCheck || !body.consents?.antiSocialCheck || !body.consents?.privacyPolicy) {
    return NextResponse.json({ error: "Required consents are missing" }, { status: 400 });
  }

  let quoteData: QuoteResponse | undefined = body.quoteId ? dataStore.quotes.find((q) => q.quoteId === body.quoteId) : undefined;
  if (body.quoteId && !quoteData) {
    return NextResponse.json({ error: "Quote not found or expired. Please create a new quote." }, { status: 400 });
  }
  if (quoteData && quoteData.assetId !== asset.id) {
    return NextResponse.json({ error: "Quote does not match the selected asset" }, { status: 400 });
  }
  if (quoteData && quoteData.validUntil && new Date(`${quoteData.validUntil}T23:59:59`) < new Date()) {
    return NextResponse.json({ error: "Quote has expired. Please create a new quote." }, { status: 400 });
  }

  if (!quoteData) {
    quoteData = calculateMonthlyPayment(
      {
        assetId: asset.id,
        assetPrice: asset.price,
        financeProduct: body.application.financeProduct as FinanceProduct,
        termMonths: Number(body.application.termMonths),
        downPayment: Number(body.application.downPayment || 0),
        residualValuePercent: 0,
        includeInsurance: true,
        includeMaintenance: false,
        buyerProfile: {
          businessType: body.buyer.industry,
          yearsInBusiness: new Date().getFullYear() - Number(body.buyer.establishedYear),
          annualRevenueRange: body.buyer.annualRevenueRange,
          creditTier: "B",
        },
      },
      asset.category,
      asset.inspectionReportAvailable
    );
    dataStore.addQuote(quoteData);
  }

  const application = runPreScreening({
    buyer: body.buyer,
    asset,
    seller: { id: seller.id, name: seller.name, certified: seller.certified, riskGrade: seller.riskGrade },
    quote: quoteData,
    application: body.application,
    consents: body.consents,
  });

  dataStore.addApplication(application);

  return NextResponse.json(application, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ applications: dataStore.getApplications() });
}
