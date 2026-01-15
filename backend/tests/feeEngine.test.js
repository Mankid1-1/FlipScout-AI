import test from "node:test";
import assert from "node:assert/strict";
import { calculatePlatformFees } from "../src/engines/feeEngine.js";

test("calculatePlatformFees returns net and profit values for each platform", () => {
  const results = calculatePlatformFees(200, {
    shippingCost: 10,
    purchasePrice: 80
  });
  const ebay = results.find((item) => item.platform === "ebay");

  assert.ok(ebay);
  assert.ok(ebay.net < 200);
  assert.ok(Number.isFinite(ebay.netProfit));
  assert.equal(results.length, 3);
});
