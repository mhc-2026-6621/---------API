import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";

export async function GET(_request: Request, { params }: { params: { applicationId: string } }) {
  const app = dataStore.getApplication(params.applicationId);
  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  return NextResponse.json(app);
}
