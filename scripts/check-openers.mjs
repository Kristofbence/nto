// BUILD GATE · every selectable persona must own its opening line.
//
// "Assistant speaks first" mode reads a static string from the Vapi assistant
// config, TTS-speaks it, then transcribes its own audio — which is how "quién"
// reached the screen as "King". The fix is the client owning the opener
// (src/firstMessages.js). If a selectable persona (built && !locked) has NO
// client opener, it silently falls back to that broken path.
//
// This script makes that gap a BUILD FAILURE instead of a runtime surprise.
// It runs before `vite build` (see package.json). Openers are added verbatim
// from each assistant's config — never invented.
import { PERSONAS } from "../src/personas.js";
import { firstMessageFor } from "../src/firstMessages.js";

const gaps = [];
for (const [lang, tiers] of Object.entries(PERSONAS)) {
  tiers.forEach((p, i) => {
    if (p.built && !p.locked && !firstMessageFor(lang, i)) {
      gaps.push(`  ${lang} · tier ${i} · ${p.tier} · ${p.name}`);
    }
  });
}

if (gaps.length) {
  console.error(
    `\n✗ check-openers: ${gaps.length} selectable persona(s) have no client opener:\n` +
    gaps.join("\n") +
    `\n\nAdd each to FIRST_MESSAGES in src/firstMessages.js (verbatim from the ` +
    `Vapi assistant config), or the "King" transcription bug ships for them.\n`
  );
  process.exit(1);
}

console.log("✓ check-openers: every selectable persona has a client opener.");
