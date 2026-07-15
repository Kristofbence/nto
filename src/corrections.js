// Mistake corrections for the red-pen highlight on the USER's transcript line.
//
// The tutor identifies which word the USER got wrong. Two ingestion paths are
// supported (see report):
//   1) RECOMMENDED — a Vapi tool/function call the tutor makes, e.g.
//      flagMistake({ wrong, right }). Structured, and NEVER spoken by TTS.
//   2) FALLBACK — an inline hidden marker in the tutor's text:
//      [[fix: "wrong" -> "right"]]  (we always strip it so it never displays;
//      note TTS may still read it aloud, which is why (1) is preferred).
//
// Both converge on {wrong, right} fixes attached to the most recent USER bubble.

const FIX_RE = /\[\[\s*fix\s*:\s*"([^"]+)"\s*->\s*"([^"]+)"\s*\]\]/gi;

// --- Inline marker path (transcripts) -------------------------------------

// Returns { clean, fixes }. `clean` always has markers removed (and any dangling
// half-marker during streaming). `fixes` is only parsed on final transcripts.
export function extractInlineFixes(text, isFinal) {
  if (!text) return { clean: text, fixes: [] };
  const fixes = [];
  if (isFinal) {
    let m;
    FIX_RE.lastIndex = 0;
    while ((m = FIX_RE.exec(text))) fixes.push({ wrong: m[1].trim(), right: m[2].trim() });
  }
  let clean = text.replace(FIX_RE, "");
  // Drop any incomplete "[[…" fragment (mid-stream) so raw markers never show.
  const open = clean.indexOf("[[");
  if (open >= 0) clean = clean.slice(0, open);
  clean = clean.replace(/\s{2,}/g, " ").trim();
  return { clean, fixes };
}

// --- Tool/function call path (structured) ---------------------------------

// Normalize a Vapi message that may carry tool/function calls into fixes.
// Defensive across shapes ("tool-calls" / "function-call" / snake_case) and
// arg keys (wrong/right, from/to, said/meant). Returns [] if none.
export function parseToolCallFixes(m) {
  if (!m || typeof m !== "object") return [];
  const calls = [];
  if (Array.isArray(m.toolCalls)) calls.push(...m.toolCalls);
  if (Array.isArray(m.tool_calls)) calls.push(...m.tool_calls);
  if (m.functionCall) calls.push({ function: m.functionCall });
  if (m.function_call) calls.push({ function: m.function_call });

  const fixes = [];
  for (const c of calls) {
    const fn = c.function || c.func || c;
    const name = (fn.name || "").toLowerCase();
    if (name && !/mistake|fix|correct|flag/.test(name)) continue;
    let args = fn.arguments ?? fn.parameters ?? fn.args ?? {};
    if (typeof args === "string") {
      try { args = JSON.parse(args); } catch { args = {}; }
    }
    const wrong = args.wrong ?? args.from ?? args.said ?? args.error;
    const right = args.right ?? args.to ?? args.meant ?? args.correction;
    if (wrong && right) fixes.push({ wrong: String(wrong).trim(), right: String(right).trim() });
  }
  return fixes;
}

// --- Attach to the transcript ---------------------------------------------

// Merge fixes onto the most recent USER bubble (dedupe by wrong word).
export function attachCorrections(messages, fixes) {
  if (!fixes || !fixes.length) return messages;
  const out = messages.slice();
  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i].role === "user") {
      const existing = out[i].corrections || [];
      const merged = existing.slice();
      for (const f of fixes) {
        if (!merged.some((x) => x.wrong.toLowerCase() === f.wrong.toLowerCase())) merged.push(f);
      }
      out[i] = { ...out[i], corrections: merged };
      return out;
    }
  }
  return out; // no user bubble yet → fail silently
}

// Set of lowercased "wrong" words for a bubble, for the red-pen renderer.
export function wrongWordSet(corrections) {
  const set = new Set();
  for (const c of corrections || []) {
    const w = c.wrong.toLowerCase().replace(/[^\p{L}\p{M}'-]/gu, "");
    if (w) set.add(w);
  }
  return set;
}
