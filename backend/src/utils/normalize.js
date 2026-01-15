export function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const match = String(value).match(/^-?\d+(\.\d+)?/);
  if (!match) {
    return null;
  }
  return Number.parseFloat(match[0]);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
