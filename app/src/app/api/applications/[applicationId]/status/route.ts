import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";

export async function PATCH(request: Request, { params }: { params: { applicationId: string } }) {
  const body = await request.json();
  const result = dataStore.updateApplicationStatus(params.applicationId, body.status, body.adminMemo);

  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 400;
    return NextResponse.json({ error: result.message }, { status });
  }

  return NextResponse.json(result.data);
}
