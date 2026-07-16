// Build the chat feed from Vapi's committed conversation history
// (message.messages on a "conversation-update" event — NOT messagesOpenAIFormatted,
// which is empty for this assistant; the turns live in `messages`).
//
// The assistant's text here is the MODEL's own output — its SOURCE text — NOT a
// transcription of the assistant's TTS audio. That requires the call to be
// started with `modelOutputInMessagesEnabled: true`. We deliberately never read
// transcript{role:"assistant"} anywhere: re-transcribing our own speech is the
// lossy round-trip that turned "quién" into "King" and truncated bubbles when
// playback was interrupted.
//
// Responsibilities:
//   - drop system/tool messages; keep user + assistant turns in order.
//   - extract inline [[fix: "x" -> "y"]] markers from assistant text, attach
//     them to the preceding user bubble, and strip them from the display.
//   - re-apply tool-call corrections (toolFixes) to the user turn they were
//     flagged against.
//   - never let an assistant bubble SHRINK versus the previous render. Text
//     lives in conversation history, decoupled from audio; this guard is
//     belt-and-suspenders in case the platform ever truncates a barged-in turn.
import { extractInlineFixes } from "./corrections";

// Roles we display. The assistant turn is "bot" in conversation-update.messages
// (the native shape) and "assistant" in the OpenAI shape — accept both, drop
// system/tool.
const DISPLAY_ROLES = new Set(["user", "assistant", "bot"]);

export function buildFeed(messages, prev = [], toolFixes = [], firstAssistantPin = null) {
  const out = [];
  for (const x of messages || []) {
    if (!x || !DISPLAY_ROLES.has(x.role)) continue;
    // Content lives in `message` on conversation-update.messages (native); the
    // OpenAI-formatted array used `content` (empty in this config). Accept either.
    const content = typeof x.message === "string" ? x.message : typeof x.content === "string" ? x.content : "";
    if (x.role !== "user") {
      // "assistant" or "bot" → the tutor's line.
      const { clean, fixes } = extractInlineFixes(content, true);
      if (fixes.length) attachToLastUser(out, fixes);
      const text = (clean || "").trim();
      if (text) out.push({ role: "assistant", text, corrections: [] });
    } else {
      const text = content.trim();
      if (text) out.push({ role: "user", text, corrections: [] });
    }
  }

  // Client-owned opener wins. The assistant's first line (the one it speaks
  // before any user turn) is a static config string we hold verbatim — the
  // history version is a transcription of its own TTS ("quién" -> "King"), so we
  // overwrite it with our string and never let any message "correct" it.
  if (firstAssistantPin) {
    const idx = out.findIndex((m) => m.role === "assistant");
    const userBefore = idx > 0 && out.slice(0, idx).some((m) => m.role === "user");
    if (idx >= 0 && !userBefore) out[idx].text = firstAssistantPin;
    else out.unshift({ role: "assistant", text: firstAssistantPin, corrections: [] });
  }

  // Structured (tool-call) corrections → the user bubble they were flagged on.
  for (const f of toolFixes) {
    const b = nthUserBubble(out, f.userIndex);
    if (b) addFix(b, f);
  }

  // Assistant bubbles never shrink vs. the previous render (interrupt safety).
  const prevAsst = prev.filter((m) => m.role === "assistant");
  let ai = 0;
  for (const m of out) {
    if (m.role !== "assistant") continue;
    const p = prevAsst[ai++];
    if (p && p.text.length > m.text.length) m.text = p.text;
  }
  return out;
}

function attachToLastUser(out, fixes) {
  for (let i = out.length - 1; i >= 0; i--) {
    if (out[i].role === "user") {
      for (const f of fixes) addFix(out[i], f);
      return;
    }
  }
}

function nthUserBubble(out, n) {
  if (n < 0) return null;
  let k = -1;
  for (const m of out) if (m.role === "user" && ++k === n) return m;
  return null;
}

function addFix(bubble, f) {
  if (!bubble.corrections) bubble.corrections = [];
  if (!bubble.corrections.some((c) => c.wrong.toLowerCase() === f.wrong.toLowerCase())) {
    bubble.corrections.push({ wrong: f.wrong, right: f.right });
  }
}
