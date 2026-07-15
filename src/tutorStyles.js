// Per-tutor typographic signature for the tutor's reply bubble.
// Same font / card / colors — only size, line-height, weight, colour and
// (for El Patrón) letter-spacing change, so you can tell who's speaking
// without reading the words. Keyed by roast tier.
export const TUTOR_TYPOGRAPHY = {
  Nice:      { fontSize: 15, lineHeight: 1.7,  fontWeight: 400, color: "#000" },                        // Profe
  Harsh:     { fontSize: 14, lineHeight: 2.1,  fontWeight: 400, color: "#6b6b70" },                     // La Tía
  Brutal:    { fontSize: 15, lineHeight: 1.5,  fontWeight: 400, color: "#000" },                        // El Vecino
  Merciless: { fontSize: 19, lineHeight: 1.25, fontWeight: 500, color: "#000", letterSpacing: "-0.01em" }, // El Patrón
};

// The user's own transcript line — fixed, regardless of tutor.
export const USER_TYPOGRAPHY = { fontSize: 16, lineHeight: 1.32, fontWeight: 600, color: "#000", letterSpacing: "-0.02em" };

// Resolve typography for the active tutor. Single-tutor languages
// (Il Vicino / Le Voisin / Der Nachbar) use the El Vecino (Brutal) values.
export function tutorTypography(tier, hasTier) {
  if (!hasTier) return TUTOR_TYPOGRAPHY.Brutal;
  return TUTOR_TYPOGRAPHY[tier] || TUTOR_TYPOGRAPHY.Brutal;
}
