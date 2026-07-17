// Client-owned opening lines.
//
// Vapi's "assistant speaks first" mode reads a STATIC string from the assistant
// config, sends it to TTS, speaks it, and then transcribes its own audio. That
// transcription is what reached the screen — which is how the correctly-spelled
// "quién" arrived as the English word "King". There is no model output for this
// line, so modelOutputInMessagesEnabled cannot fix it.
//
// So the client owns the opener: we pass the exact string via
// assistantOverrides.firstMessage (so TTS speaks OUR string) and seed it as the
// first bubble (so the display comes from the same string, never from audio).
//
// Keyed by langId → roast tier index (0 nice · 1 harsh · 2 brutal · 3 merciless).
// Only lines we hold VERBATIM from the assistant config are listed; anything
// absent falls back to the server's own first message (unchanged behaviour).
const FIRST_MESSAGES = {
  es: {
    // La Tía (harsh) — verbatim from the Vapi assistant config.
    1: "Ay… otro más. Bueno, siéntate. Antes de empezar a sufrir juntos, dime: ¿cómo te llamas? Y contéstame en español, por favor, que para eso viniste.",
    // El Patrón (merciless) — verbatim from assistant b4c321…026bc4 config.
    3: "Órale, ¿y este quién chingados es? A ver, güey, dime tu nombre en español, y no me hagas repetírtelo, porque no tengo toda la pinche tarde.",
  },
};

// The opening line for a tutor, or null if we don't hold it verbatim (in which
// case we leave the server's firstMessage in place rather than invent one).
export function firstMessageFor(langId, roast) {
  const byLang = FIRST_MESSAGES[langId];
  return (byLang && byLang[roast]) || null;
}
