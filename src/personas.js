// The roast personas (tiers) for every language, in stored order — the array
// index IS the persisted `roast` value (0 Nice · 1 Harsh · 2 Brutal · 3 Merciless).
// Shared by Onboarding and Settings so the Personality choice uses ONE data
// source and ONE card mechanic.
//
// Two INDEPENDENT flags, never inferred from anything else:
//   built  — this tier exists (has a wired tutor). Unbuilt tiers render dimmed
//            and inert, with NO icon (a lock would wrongly imply "Pro unlocks it").
//   locked — this tier is Pro-gated. Shows the lock icon. Today: Spanish Profe only.
// A tier is selectable iff (built && !locked).
//
// `origin` is a place tag rendered as a muted suffix — its own field, never
// folded into `name` (long names would wrap mid-parenthesis otherwise).
export const PERSONAS = {
  es: [
    { tier: "Nice",      name: "Profe",     origin: "", sample: "¡Vas muy bien, mi amor! Sigue así.",                    built: true, locked: true  },
    { tier: "Harsh",     name: "La Tía",    origin: "", sample: "Otra vez ese error… pero bueno, algún día aprendes.",   built: true, locked: false },
    { tier: "Brutal",    name: "El Vecino", origin: "", sample: "Dijiste eso con toda confianza. Estaba mal. Terrifying.", built: true, locked: false },
    { tier: "Merciless", name: "El Patrón", origin: "", sample: "¿Neta, güey? Mi abuela habla mejor y está dormida.",    built: true, locked: false },
  ],
  it: [
    { tier: "Nice",      name: "La Nonna",        origin: "Bologna", sample: "Mangia. Poi parliamo.",           built: false, locked: false },
    { tier: "Harsh",     name: "La Suocera",      origin: "",        sample: "No, no. Va benissimo. Davvero.",   built: false, locked: false },
    { tier: "Brutal",    name: "Il Vicino",       origin: "",        sample: "Ho sentito tutto. Purtroppo.",     built: true,  locked: false },
    { tier: "Merciless", name: "Il Pescivendolo", origin: "Naples",  sample: "Signò! Signò! ...ah, sei tu.",     built: false, locked: false },
  ],
  fr: [
    { tier: "Nice",      name: "Mamie",        origin: "Lyon",  sample: "Tu as maigri. Assieds-toi.",         built: false, locked: false },
    { tier: "Harsh",     name: "La Concierge", origin: "Paris", sample: "Je ne dis rien. Mais je vois tout.",  built: false, locked: false },
    { tier: "Brutal",    name: "Le Voisin",    origin: "",      sample: "C'était du français, ça ?",           built: true,  locked: false },
    // Le Serveur answers in English on purpose — you speak bad French, he
    // switches to English. That IS the joke; the line is not a bug.
    { tier: "Merciless", name: "Le Serveur",   origin: "Paris", sample: "...Would you like the English menu?", built: false, locked: false },
  ],
  de: [
    { tier: "Nice",      name: "Die Oma",           origin: "Hamburg", sample: "Hast du überhaupt gegessen?",         built: false, locked: false },
    { tier: "Harsh",     name: "Die Hausmeisterin", origin: "",        sample: "Das steht so in der Hausordnung.",    built: false, locked: false },
    { tier: "Brutal",    name: "Der Nachbar",       origin: "",        sample: "Ich habe Sie gehört. Durch die Wand.", built: true,  locked: false },
    { tier: "Merciless", name: "Der Türsteher",     origin: "Berlin",  sample: "Heute nicht.",                        built: false, locked: false },
  ],
};

// Brutal is the built/default tier for every language, so it's a safe fallback
// selection anywhere (built && !locked in es/it/fr/de alike).
export const DEFAULT_TIER = 2;

export function personasFor(langId) {
  return PERSONAS[langId] || PERSONAS.es;
}

// A tier is choosable only if it exists and isn't Pro-gated.
export function isSelectable(langId, i) {
  const p = personasFor(langId)[i];
  return !!p && p.built && !p.locked;
}
