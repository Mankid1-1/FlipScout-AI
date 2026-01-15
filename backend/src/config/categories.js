export const categories = [
  {
    key: "electronics",
    label: "Electronics",
    reliability: 0.75,
    baseResaleMid: 180,
    keywords: ["phone", "iphone", "android", "laptop", "tablet", "ipad", "camera", "console", "xbox", "playstation", "nintendo", "monitor"]
  },
  {
    key: "furniture",
    label: "Furniture",
    reliability: 0.6,
    baseResaleMid: 140,
    keywords: ["sofa", "couch", "chair", "table", "desk", "dresser", "bed", "nightstand", "bookshelf"]
  },
  {
    key: "apparel",
    label: "Apparel",
    reliability: 0.55,
    baseResaleMid: 60,
    keywords: ["jacket", "coat", "sneakers", "shoes", "boots", "hoodie", "dress", "jeans", "vintage"]
  },
  {
    key: "collectibles",
    label: "Collectibles",
    reliability: 0.5,
    baseResaleMid: 120,
    keywords: ["pokemon", "cards", "figurine", "lego", "rare", "limited", "collectible", "sealed"]
  },
  {
    key: "tools",
    label: "Tools",
    reliability: 0.65,
    baseResaleMid: 110,
    keywords: ["drill", "saw", "tool", "dewalt", "milwaukee", "makita", "wrench", "impact"]
  }
];

export const defaultCategory = {
  key: "general",
  label: "General",
  reliability: 0.45,
  baseResaleMid: 90,
  keywords: []
};
