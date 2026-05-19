import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/data/data-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

  const assets = dataStore.getAssets({ category, minPrice, maxPrice });

  return NextResponse.json({ assets, total: assets.length });
}
