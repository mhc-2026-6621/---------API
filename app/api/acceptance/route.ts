import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";

export async function POST(request: Request) {
  const body = await request.json();
  const result = dataStore.updateApplicationStatus(body.applicationId, "accepted");

  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 400;
    return NextResponse.json({ error: result.message }, { status });
  }

  return NextResponse.json({
    applicationId: body.applicationId,
    status: "accepted",
    acceptedAt: new Date().toISOString(),
    message: "検収が完了しました。販売店支払処理へ進みます。",
    nextAction: "ファイナンス管理者が販売店支払を実行します。",
  });
}
