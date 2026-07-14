// Groups streaming transcripts into one bubble per speaker turn.
// Each bubble is { role, finalized, partial }:
//   - same role as the last bubble  → keep filling it (finals concatenate,
//     partials grow it live)
//   - different role                → start a new bubble
// This turns a turn that Vapi emits as several finals into ONE growing bubble.
export function appendTranscript(prev, { role, text, isFinal }) {
  if (!text || !role) return prev;
  const arr = prev.slice();
  const last = arr[arr.length - 1];

  if (!last || last.role !== role) {
    arr.push({ role, finalized: isFinal ? text : "", partial: isFinal ? "" : text });
  } else if (isFinal) {
    arr[arr.length - 1] = {
      ...last,
      finalized: last.finalized ? `${last.finalized} ${text}` : text,
      partial: "",
    };
  } else {
    arr[arr.length - 1] = { ...last, partial: text };
  }
  return arr;
}

// Text to display for a bubble: finalized utterances plus any in-progress partial.
export function bubbleText(m) {
  return m.finalized + (m.partial ? (m.finalized ? " " : "") + m.partial : "");
}
