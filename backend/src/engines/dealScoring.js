import { scoringThresholds } from "../config/thresholds.js";
import { clamp } from "../utils/normalize.js";

export function scoreDeal({ listing, pricing }) {
  const price = listing.price ?? pricing.resaleMid * 0.7;
  const discount = (pricing.resaleMid - price) / pricing.resaleMid;
  const confidence = pricing.confidence;
  const categoryReliability = listing.category?.reliability ?? 0.4;
  const conditionPenalty = listing.conditionNotes ? 0.05 : 0.12;
  const pickupBonus = listing.location ? 0.05 : 0;

  const rawScore =
    50 +
    discount * 40 +
    confidence * 20 +
    categoryReliability * 10 -
    conditionPenalty * 100 +
    pickupBonus * 100;

  const score = Math.round(
    clamp(rawScore, scoringThresholds.minScore, scoringThresholds.maxScore)
  );

  const why = [];
  if (discount >= scoringThresholds.strongDeal) {
    why.push("Strong discount compared to expected resale value.");
  } else if (discount > 0) {
    why.push("Moderate discount leaves room for profit.");
  } else {
    why.push("Listing price is close to expected resale value.");
  }

  if (confidence >= 0.7) {
    why.push("High pricing confidence for this category.");
  } else if (confidence >= 0.5) {
    why.push("Moderate pricing confidence based on category comps.");
  } else {
    why.push("Low pricing confidence; comps may vary.");
  }

  if (listing.location) {
    why.push("Local pickup can improve margins.");
  }

  if (listing.conditionNotes) {
    why.push("Condition details provided reduce uncertainty.");
  } else {
    why.push("Condition unclear; budget for potential fixes.");
  }

  let riskLevel = "High";
  if (confidence >= scoringThresholds.mediumRisk && discount > 0) {
    riskLevel = "Low";
  } else if (confidence >= scoringThresholds.highRisk) {
    riskLevel = "Medium";
  }

  return {
    score,
    discount: Math.round(discount * 100) / 100,
    riskLevel,
    why
  };
}
