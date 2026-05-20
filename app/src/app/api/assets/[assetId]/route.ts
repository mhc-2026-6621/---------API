import { NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";

export async function GET(_request: Request, { params }: { params: { assetId: string } }) {
  const asset = dataStore.getAsset(params.assetId);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
  return NextResponse.json(asset);
}
