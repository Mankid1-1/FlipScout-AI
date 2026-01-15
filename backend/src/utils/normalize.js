export function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const normalized = String(value).replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
