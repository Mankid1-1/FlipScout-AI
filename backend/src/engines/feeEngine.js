import { feeTables, defaultShippingCost } from "../config/fees.js";
import { toNumber } from "../utils/normalize.js";

export function calculatePlatformFees(resalePrice, options = {}) {
  const price = toNumber(resalePrice) ?? 0;
  const shippingCost = toNumber(options.shippingCost) ?? defaultShippingCost;
  const purchasePrice = toNumber(options.purchasePrice) ?? 0;

  const results = Object.entries(feeTables).map(([key, table]) => {
    const fee = price * table.percent + table.fixed;
    const net = price - fee - shippingCost;
    const netProfit = net - purchasePrice;
    return {
      platform: key,
      label: table.label,
      fee: Math.round(fee * 100) / 100,
      shippingCost,
      net: Math.round(net * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      purchasePrice
    };
  });

  return results;
}
