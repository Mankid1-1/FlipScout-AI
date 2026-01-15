const templates = {
  fastCash: (title, price) =>
    `Hi! I can pick up the ${title} today and pay $${price}. Let me know if that works.`,
  politeOffer: (title, price) =>
    `Hi there! Would you consider $${price} for the ${title}? I can meet at your convenience.`,
  bundleAsk: (title, price) =>
    `If you have any other items to bundle with the ${title}, I can offer $${price} and pick up quickly.`
};

export function generateSellerMessages(listing, suggestedOffer) {
  const title = listing.title || "item";
  const rawOffer = Number(suggestedOffer);
  const validatedOffer = Number.isFinite(rawOffer) && rawOffer > 0 ? rawOffer : 1;
  const offer = Math.round(validatedOffer);
  return [
    templates.fastCash(title, offer),
    templates.politeOffer(title, offer),
    templates.bundleAsk(title, offer)
  ];
}
