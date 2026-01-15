import { defaultCategory } from "../config/categories.js";
import { clamp } from "../utils/normalize.js";

export function getPricingEstimates(listing) {
  const category = listing.category ?? defaultCategory;
  const baseMid = category.baseResaleMid ?? defaultCategory.baseResaleMid;
  const price = listing.price ?? baseMid * 0.6;
  const mid = Math.max(baseMid, price * 1.3);
  const resaleMid = Math.round(mid);
  const resaleLow = Math.round(resaleMid * 0.85);
  const resaleHigh = Math.round(resaleMid * 1.15);
  const confidence = clamp(category.reliability ?? 0.4, 0, 1);

  return {
    resaleLow,
    resaleMid,
    resaleHigh,
    confidence
  };
}
