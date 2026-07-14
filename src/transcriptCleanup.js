// Display-only cleanup for ITALIAN transcripts.
// Deepgram sometimes resolves Italian homophones to digits (e.g. "sei" → "6",
// "primo/prima" → "1º"). We fix STANDALONE digit tokens for DISPLAY ONLY — never
// inside larger numbers ("16", "60"), never other languages, and never the audio
// / voice pipeline. Add new cases to RULES as you find them.

// Token boundaries: string start/end, whitespace, or common punctuation.
const SEP = "\\s.,!?¡¿;:\"'()«»…—–\\-";

// Each rule: `token` is a regex fragment for the standalone digit form,
// `replacement` is the Italian word to show instead.
const RULES = [
  { token: "6", replacement: "sei" },          // "Tu di dove 6?" → "Tu di dove sei?"
  { token: "1[ºo°]", replacement: "prima" },   // "1º" / "1o" / "1°" (ordinal) → "prima"
  // { token: "...", replacement: "..." },      // extend here
];

// Precompile: (leading boundary or start) TOKEN (followed by boundary or end).
// The leading boundary is captured and re-emitted; the trailing is a lookahead
// so adjacent tokens ("6 6") both get replaced.
const COMPILED = RULES.map((r) => ({
  re: new RegExp(`(^|[${SEP}])(?:${r.token})(?=$|[${SEP}])`, "gu"),
  replacement: r.replacement,
}));

export function cleanItalianTranscript(text) {
  if (!text) return text;
  let out = text;
  for (const { re, replacement } of COMPILED) out = out.replace(re, `$1${replacement}`);
  return out;
}
