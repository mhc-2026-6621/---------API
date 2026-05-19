import { AssetCategory } from "@/types";
import { CreditTier } from "@/types";

export const BASE_RATES: Record<AssetCategory, number> = {
  used_construction_equipment: 0.058,
  forklift: 0.052,
  machine_tool: 0.062,
  kitchen_food_equipment: 0.065,
  industrial_machinery: 0.060,
  refrigeration_equipment: 0.063,
  robot_conveyor: 0.055,
};

export const CREDIT_TIER_ADJUSTMENT: Record<CreditTier, number> = {
  A: -0.005,
  B: 0,
  C: 0.012,
};

export const USED_ASSET_ADJUSTMENT = 0.004;
export const NO_INSPECTION_ADJUSTMENT = 0.003;
export const INSURANCE_RATE = 0.008;
export const MAINTENANCE_RATE = 0.015;
