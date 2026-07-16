// Vapi assistant lookup by (language, tier).
// - Spanish has three tier assistants (Nice → Harsh fallback).
// - Italian / French / German each have one assistant used for every tier.
// Adding a language = add a key; adding Spanish tiers = extend the roast map.
// Roast index matches TUTORS in settings.jsx: 0 Nice · 1 Harsh · 2 Brutal · 3 Merciless.

const ES = {
  harsh: "fb6f1f13-b002-4317-be54-063c56c18dc4", // La Tía
  brutal: "53ae6abb-a1b2-49ca-9fee-00556a0938cd", // El Vecino
  merciless: "b4c32128-b2a2-4a89-b8ae-7f33c6026bc4", // El Patrón
};

// Spanish: tier (roast index) → assistant. Nice(0) falls back to Harsh.
const ES_BY_ROAST = { 0: ES.harsh, 1: ES.harsh, 2: ES.brutal, 3: ES.merciless };

// Object → per-tier map; string → single assistant for all tiers.
export const ASSISTANTS = {
  es: ES_BY_ROAST,
  it: "840be111-94b2-49aa-a70f-90d5318b101f", // Il Vicino
  fr: "1807cdb5-87cf-4b10-adba-8e7a7a5c2438", // Le Voisin
  de: "ffe26744-52b8-42cd-b5b1-dd62b8eb1b34", // Der Nachbar
};

// Pick the assistant ID for a language + tier. Never throws.
export function pickAssistant(langId, roast) {
  const entry = ASSISTANTS[langId];
  if (typeof entry === "string") return entry; // single-tutor language
  if (entry) return entry[roast] ?? entry[1]; // Spanish tier map (default Harsh)
  return ES_BY_ROAST[1]; // ultimate fallback: language not wired → Spanish Harsh
}
