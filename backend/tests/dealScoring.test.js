import test from "node:test";
import assert from "node:assert/strict";
import { scoreDeal } from "../src/engines/dealScoring.js";

const listing = {
  price: 50,
  category: { reliability: 0.7 },
  location: "Austin, TX"
};

const pricing = {
  resaleMid: 150,
  confidence: 0.8
};

test("scoreDeal stays within 0-100", () => {
  const result = scoreDeal({ listing, pricing });
  assert.ok(result.score >= 0 && result.score <= 100);
});

test("scoreDeal returns risk level", () => {
  const result = scoreDeal({ listing, pricing });
  assert.ok(["Low", "Medium", "High"].includes(result.riskLevel));
});
