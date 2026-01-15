import { categories, defaultCategory } from "../config/categories.js";
import { toNumber } from "../utils/normalize.js";

function guessCategory(text) {
  const lower = text.toLowerCase();
  for (const category of categories) {
    if (category.keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }
  return defaultCategory;
}

function extractPrice(text) {
  const match = text.match(/\$\s*([0-9,.]+)/);
  if (match) {
    return toNumber(match[1]);
  }
  const plain = text.match(/\b([0-9]{2,6})\b/);
  return plain ? toNumber(plain[1]) : null;
}

export function parseListingInput(inputText) {
  const trimmed = inputText.trim();
  const isUrl = /^https?:\/\//i.test(trimmed);
  const normalized = {
    sourceType: isUrl ? "url" : "text",
    source: trimmed,
    title: "",
    price: null,
    description: "",
    location: null,
    conditionNotes: null,
    keywords: [],
    category: defaultCategory
  };

  if (isUrl) {
    try {
      const url = new URL(trimmed);
      normalized.title = url.hostname.replace("www.", "") + " listing";
      normalized.description = "Listing details sourced from URL. Paste full listing text for better accuracy.";
    } catch (error) {
      normalized.title = "Listing URL";
    }
  } else {
    const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    normalized.title = lines[0] ?? "Listing";
    normalized.description = lines.slice(1).join(" ");
    normalized.price = extractPrice(trimmed);

    const locationMatch = trimmed.match(/location\s*[:\-]\s*([^\n]+)/i);
    normalized.location = locationMatch ? locationMatch[1].trim() : null;

    const conditionMatch = trimmed.match(/condition\s*[:\-]\s*([^\n]+)/i);
    normalized.conditionNotes = conditionMatch ? conditionMatch[1].trim() : null;
  }

  const keywordSource = `${normalized.title} ${normalized.description}`.toLowerCase();
  normalized.category = guessCategory(keywordSource);
  normalized.keywords = normalized.category.keywords.filter((keyword) => keywordSource.includes(keyword));

  return normalized;
}
