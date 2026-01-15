import { parseListingInput } from "./listingIntake.js";
import { getPricingEstimates } from "./pricingEngine.js";
import { calculatePlatformFees } from "./feeEngine.js";
import { scoreDeal } from "./dealScoring.js";
import { generateSellerMessages } from "./messageGenerator.js";

export function analyzeListing(inputText) {
  const listing = parseListingInput(inputText);
  const pricing = getPricingEstimates(listing);
  const suggestedOffer = Math.round(pricing.resaleMid * 0.65);
  const purchasePrice = listing.price ?? suggestedOffer;
  const feeEstimates = calculatePlatformFees(pricing.resaleMid, { purchasePrice });
  const dealScore = scoreDeal({ listing, pricing });

  const bestPlatform = feeEstimates.reduce((best, current) => {
    if (!best || current.netProfit > best.netProfit) {
      return current;
    }
    return best;
  }, null);

  const messages = generateSellerMessages(listing, suggestedOffer);

  return {
    listing,
    pricing,
    suggestedOffer,
    purchasePrice,
    feeEstimates,
    bestPlatform,
    dealScore,
    messages
  };
}
