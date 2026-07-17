// The four Spanish roast personas (tiers), in stored order — the array index is
// the persisted `roast` value. Shared by Onboarding and Settings so the
// Personality choice uses ONE data source and ONE mechanic. Nice is locked; the
// lock is the joke and is never explained. `sample` is a one-line taste of the
// persona's voice, shown on the card.
export const PERSONAS = [
  { tier: "Nice", name: "Profe", sample: "¡Vas muy bien, mi amor! Sigue así.", locked: true },
  { tier: "Harsh", name: "La Tía", sample: "Otra vez ese error… pero bueno, algún día aprendes.", locked: false },
  { tier: "Brutal", name: "El Vecino", sample: "Dijiste eso con toda confianza. Estaba mal. Terrifying.", locked: false },
  { tier: "Merciless", name: "El Patrón", sample: "¿Neta, güey? Mi abuela habla mejor y está dormida.", locked: false },
];
