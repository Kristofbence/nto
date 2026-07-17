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
// absent falls back to the server's own first message (the broken path).
//
// Coverage is enforced two ways so a gap can't ship silently:
//   • dev tripwire below (console.error at call-start), and
//   • scripts/check-openers.mjs — a BUILD GATE that fails if any selectable
//     persona (built && !locked) has no entry here.
import { isSelectable } from "./personas.js";

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
  const msg = (byLang && byLang[roast]) || null;
  // Loud in dev, silent + graceful in prod: a selectable persona with no client
  // opener will fall back to the server firstMessage and reproduce the "King"
  // transcription bug. Warn so it can't slip by unnoticed during development.
  if (!msg && isSelectable(langId, roast) && import.meta.env?.DEV) {
    console.error(
      `[firstMessages] No client opener for ${langId} tier ${roast} — falling back ` +
      `to the server firstMessage; "King"-class transcription artifacts likely.`
    );
  }
  return msg;
}
