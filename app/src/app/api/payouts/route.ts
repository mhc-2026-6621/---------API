import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";
import { generateId } from "@/lib/format-utils";

export async function POST(request: Request) {
  const body = await request.json();
  const app = dataStore.getApplication(body.applicationId);
  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  if (app.status !== "accepted") {
    return NextResponse.json({ error: "Payout can only be scheduled after acceptance is completed" }, { status: 400 });
  }

  const seller = dataStore.getSeller(app.sellerId);
  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 5);

  const payout = {
    payoutId: generateId("payout"),
    applicationId: body.applicationId,
    sellerId: seller.id,
    sellerName: seller.name,
    payoutAmount: app.asset.price,
    scheduledPayoutDate: scheduledDate.toISOString().split("T")[0],
    payoutBankName: seller.payoutBankName,
    status: "scheduled" as const,
  };

  const result = dataStore.updateApplicationStatus(body.applicationId, "seller_paid");
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
  dataStore.setPayout(body.applicationId, payout);

  return NextResponse.json({ ...payout, message: "販売店支払が予約されました。" });
}
