import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";
import { calculateMonthlyPayment } from "@/lib/monthly-payment-calc";
import { QuoteRequest } from "@/types";

export async function POST(request: Request) {
  const body: QuoteRequest = await request.json();
  const asset = dataStore.getAsset(body.assetId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  if (body.downPayment < 0 || body.downPayment >= asset.price) {
    return NextResponse.json({ error: "Down payment must be greater than or equal to 0 and less than the asset price" }, { status: 400 });
  }
  if (body.termMonths <= 0) {
    return NextResponse.json({ error: "Term months must be greater than 0" }, { status: 400 });
  }
  if (body.residualValuePercent < 0 || body.residualValuePercent > 80) {
    return NextResponse.json({ error: "Residual value percent must be between 0 and 80" }, { status: 400 });
  }

  const quote = calculateMonthlyPayment({ ...body, assetPrice: asset.price }, asset.category, asset.inspectionReportAvailable);
  dataStore.addQuote(quote);

  return NextResponse.json(quote);
}
