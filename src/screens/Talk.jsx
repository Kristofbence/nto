// TALK · full-screen voice session (no tab bar). The mic now starts/stops a REAL
// Vapi voice call with the Spanish tutor; final transcripts stream into the feed.
// Design/layout is unchanged from the prototype — only behavior is wired up.
import { useEffect, useRef, useState } from "react";
import VapiPkg from "@vapi-ai/web";
import { CloseIcon, BookIcon, MicIcon, LanguagesIcon } from "../components/icons";
import { useTutorView } from "../settings";
import { pickAssistant } from "../assistants";
import { lookupWord } from "../lookup";
import { translate } from "../translate";
import { appendTranscript, bubbleText } from "../transcriptGroup";
import { cleanItalianTranscript } from "../transcriptCleanup";

// @vapi-ai/web ships as CommonJS; depending on the bundler's interop the default
// import can arrive as the class itself or wrapped as { default: class }. Unwrap
// to the actual constructor either way.
const Vapi = typeof VapiPkg === "function" ? VapiPkg : VapiPkg.default;

// Public key — safe to ship in front-end code. NEVER put a private key here.
const VAPI_PUBLIC_KEY = "fb6a87e8-4feb-4cbd-ade2-4ba12f74ade9";

const cardSoft = {
  maxWidth: "85%",
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  padding: "15px 16px 16px",
};

// Function/short words that should NOT get the "tap me" underline, so the bubble
// isn't a sea of dots. v1 stop-word list (Spanish articles/preps/conjunctions/
// pronouns/common verbs) plus a few English fillers.
const STOP_WORDS = new Set([
  // Spanish
  "de", "la", "el", "y", "que", "un", "una", "unos", "unas", "en", "a", "se", "lo",
  "los", "las", "del", "al", "o", "u", "e", "su", "sus", "mi", "mis", "tu", "tus",
  "me", "te", "nos", "os", "le", "les", "por", "para", "con", "sin", "sobre",
  "entre", "hasta", "desde", "si", "no", "ni", "como", "más", "muy", "ya", "es",
  "son", "fue", "era", "ser", "está", "están", "he", "ha", "han", "yo", "él",
  "ella", "ellos", "ellas", "esto", "eso", "esta", "este", "ese", "esa", "soy",
  "eres", "somos", "hay", "the", "a", "an", "to", "of", "and", "is", "it", "you",
  "i", "in", "on", "for",
]);

// A word worth hinting: 3+ letters and not a stop word.
function isContentWord(clean) {
  const w = clean.toLowerCase();
  return w.length >= 3 && !STOP_WORDS.has(w);
}

// Subtle dotted "tap me" hint (matches the original chat-screen style).
const DOTTED = {
  textDecoration: "underline",
  textDecorationStyle: "dotted",
  textDecorationColor: "#c7c7cc",
  textUnderlineOffset: "3px",
};

// Renders a string as individually tappable words (display-layer only).
// Content words get a subtle dotted underline as a tap hint; every word stays
// tappable. Whitespace/punctuation is preserved; punctuation is stripped from
// the word passed to onWord.
function TappableText({ text, onWord, style }) {
  return (text || "").split(/(\s+)/).map((tok, i) => {
    if (!tok || /^\s+$/.test(tok)) return tok;
    const clean = tok.replace(/[^\p{L}\p{M}''-]/gu, "");
    if (!clean) return tok;
    return (
      <span
        key={i}
        onClick={(e) => onWord(clean, e)}
        style={{
          cursor: "pointer",
          WebkitTapHighlightColor: "transparent",
          ...(isContentWord(clean) ? DOTTED : null),
          ...style,
        }}
      >
        {tok}
      </span>
    );
  });
}

// Small grey English translation line under a tutor bubble. Fetched lazily
// (only mounted once the user reveals it) and client-side (never via the
// assistant, so it's never spoken). undefined = loading, null = failed.
function TranslationLine({ text, lang }) {
  const [tr, setTr] = useState(undefined);
  useEffect(() => {
    let alive = true;
    setTr(undefined);
    if (!text) return undefined;
    translate(text, lang, "en")
      .then((t) => { if (alive) setTr(t ?? null); })
      .catch(() => { if (alive) setTr(null); });
    return () => { alive = false; };
  }, [text, lang]);
  const style = { fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 8, lineHeight: 1.42 };
  if (tr === undefined) return <div style={style}>Translating…</div>;
  if (tr === null) return <div style={style}>Translation unavailable.</div>;
  return <div style={style}>{tr}</div>;
}

// Empty/idle/connecting hero: the stacked NOT/THE/OWL wordmark, replaced by real
// bubbles once the conversation starts. Shows a small status line beneath.
function BrandWaiting({ callActive, status }) {
  const note = status || (callActive ? "Listening…" : null);
  return (
    <div style={{ margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 46, lineHeight: 0.9, letterSpacing: "-0.02em", color: "#000" }}>
        <div>NOT</div>
        <div>THE</div>
        <div>OWL</div>
      </div>
      {note && <div style={{ fontSize: 12, fontWeight: 600, color: "#8e8e93" }}>{note}</div>}
    </div>
  );
}

// Subtle affordance / toggle for tap-to-reveal translation.
const translateToggle = {
  display: "inline-flex", alignItems: "center", gap: 5, background: "transparent",
  border: "none", padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 600,
  color: "#8e8e93", WebkitTapHighlightColor: "transparent",
};

// A live transcript bubble — tutor (assistant) white/left, user grey/right.
// Tutor bubbles offer TAP-TO-REVEAL English (per bubble) once the turn is
// finalized (`ready`) and the "Show translations" setting is on.
function TranscriptBubble({ role, text, finalized, onWord, showTranslation, lang, ready }) {
  const isUser = role === "user";
  const [revealed, setRevealed] = useState(false);
  const canTranslate = !isUser && showTranslation && ready && !!finalized;

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", animation: "ntoMsgIn 0.3s ease both" }}>
      <div style={{ ...cardSoft, ...(isUser ? { background: "#E5E5EA" } : null) }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: isUser ? "#8e8e93" : "#a1a1a6", textTransform: "uppercase", marginBottom: 5, textAlign: isUser ? "right" : "left" }}>
          {isUser ? "You" : "Tutor"}
        </div>
        <div style={{ fontSize: 16, fontWeight: isUser ? 600 : 700, lineHeight: 1.32, letterSpacing: "-0.02em", color: "#000" }}>
          <TappableText text={text} onWord={onWord} />
        </div>

        {canTranslate && !revealed && (
          <button onClick={() => setRevealed(true)} style={{ ...translateToggle, marginTop: 8 }}>
            <LanguagesIcon size={13} stroke="#8e8e93" strokeWidth={2} />
            <span>Tap to translate</span>
          </button>
        )}
        {canTranslate && revealed && (
          <>
            <TranslationLine text={finalized} lang={lang} />
            <button onClick={() => setRevealed(false)} style={{ ...translateToggle, marginTop: 6 }}>
              <span>Hide translation</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Talk({ nav }) {
  // Conversation feed. Each item is one speaker turn: { role, finalized, partial }.
  // Starts empty (no pre-seeded demo); real turns fill in during a call.
  const [messages, setMessages] = useState([]);
  const [callActive, setCallActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState(null);

  // Tap-to-define popup (display-layer only; independent of the voice pipeline).
  const [popup, setPopup] = useState(null); // { word, left, top, placeAbove, width }
  const [entry, setEntry] = useState({ loading: false });
  const [added, setAdded] = useState(false); // "+ Add to vocabulary" feedback
  const dismissTimer = useRef(null);
  const { langId, lang, tutor, showTranslations, roast, levelName, scenario } = useTutorView();

  const closePopup = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setPopup(null);
  };

  const onWord = (word, e) => {
    e.stopPropagation();
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    const frame = e.currentTarget.closest(".nto-frame");
    const wr = e.currentTarget.getBoundingClientRect();
    const fr = frame ? frame.getBoundingClientRect() : { left: 0, top: 0, width: 390, height: 844 };
    const width = 240;
    let left = wr.left - fr.left + wr.width / 2 - width / 2;
    left = Math.max(8, Math.min(left, fr.width - width - 8));
    const belowY = wr.bottom - fr.top + 8;
    const placeAbove = belowY + 150 > fr.height; // flip above near the bottom
    const top = placeAbove ? wr.top - fr.top - 8 : belowY;
    setPopup({ word, left, top, placeAbove, width });
    setEntry({ loading: true });
    setAdded(false);
    lookupWord(word, langId)
      .then((r) => setEntry({ loading: false, ...r }))
      .catch(() => setEntry({ loading: false, error: true }))
      .finally(() => {
        // Auto-dismiss 3s after the result settles (so there's time to read it).
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        dismissTimer.current = setTimeout(() => setPopup(null), 3000);
      });
  };

  const addToVocabulary = (word) => {
    try {
      const key = "nto.vocabulary";
      // Normalize any legacy bare-string entries to { word, def }.
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      const list = raw
        .map((e) => (typeof e === "string" ? { word: e, def: "" } : e))
        .filter((e) => e && e.word);
      // Save the definition we already have in the popup (no re-fetch needed).
      const def = entry.english || entry.definition || "";
      const idx = list.findIndex((e) => e.word === word);
      if (idx >= 0) list.splice(idx, 1); // re-adding moves it to most-recent
      list.push({ word, def });
      localStorage.setItem(key, JSON.stringify(list));
      console.log("[vocabulary] added:", word, def);
    } catch (err) {
      console.warn("[vocabulary] save failed:", err);
    }
    setAdded(true);
    if (dismissTimer.current) clearTimeout(dismissTimer.current); // let them see "Added"
  };

  const feedRef = useRef(null);

  // One Vapi client for the life of this screen.
  const vapiRef = useRef(null);
  if (!vapiRef.current) vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

  // Subscribe to Vapi events once.
  useEffect(() => {
    const vapi = vapiRef.current;

    const onCallStart = () => {
      setStatus(null);
      setMessages([]); // fresh conversation
      setSeconds(0);
      setCallActive(true);
    };
    const onCallEnd = () => {
      setCallActive(false);
    };
    // Group transcripts by speaker turn: same role → keep filling the same
    // bubble (finals concatenate, partials grow it live); role change → new
    // bubble. So one spoken turn renders as one growing bubble.
    const onMessage = (m) => {
      if (m?.type !== "transcript" || !m?.transcript || !m?.role) return;
      setMessages((prev) =>
        appendTranscript(prev, { role: m.role, text: m.transcript, isFinal: m.transcriptType === "final" })
      );
    };
    const onError = (e) => {
      console.error("[Vapi] error:", e);
      setCallActive(false);
      const msg = e?.errorMsg || e?.message || (typeof e === "string" ? e : "Something went wrong. Try again.");
      setStatus(msg);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    // Dev-only test hook to inject transcripts (stripped from production builds).
    if (import.meta.env.DEV) window.__ntoVapi = vapi;

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      try { vapi.stop(); } catch { /* noop */ }
    };
  }, []);

  // Clear the popup auto-dismiss timer on unmount.
  useEffect(() => () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); }, []);

  // Session timer: count up while the call is live.
  useEffect(() => {
    if (!callActive) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callActive]);

  // Auto-scroll the feed to the newest message.
  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const toggleCall = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const vapi = vapiRef.current;
    if (callActive) {
      vapi.stop();
      return;
    }
    try {
      setStatus("Connecting…");
      // Pick the tutor by (language, tier); pass the student's level (and any
      // chosen scenario) so the assistant's {{level}} / {{scenario}} fill in.
      const assistantId = pickAssistant(langId, roast);
      const overrides = {
        variableValues: {
          level: (levelName || "").toLowerCase(),
          scenario: scenario || "",
        },
      };
      await vapi.start(assistantId, overrides);
    } catch (err) {
      console.error("[Vapi] start failed:", err);
      setStatus("Could not start. Allow mic access and try again.");
    }
  };

  // Auto-start the call on arrival — ANY route (Home mic, scenario START, or the
  // Talk tab). The browser mic-permission prompt is expected on first use; a
  // denial/failure surfaces via `status` under the brand card, not a crash.
  useEffect(() => {
    toggleCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = (e) => {
    e.preventDefault();
    try { vapiRef.current.stop(); } catch { /* noop */ }
    if (nav) nav("home");
  };

  const micStyle = {
    width: 80,
    height: 80,
    cursor: "pointer",
    borderRadius: "50%",
    fontFamily: "inherit",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#39FF14",
    transition: "transform 0.1s ease",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    ...(callActive
      ? { boxShadow: "0 8px 22px -4px rgba(0,0,0,0.28)", animation: "ntoPress 1s ease-in-out infinite", transform: "scale(0.94)" }
      : { boxShadow: "0 8px 20px -5px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.12)" }),
  };

  // Session timer: 00:00 at idle, counts up during a live call.
  const timerText = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <>
      {/* HEADER */}
      <div
        style={{
          flex: "none",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e2e7",
          padding: "56px 20px 14px",
          background: "#fff",
        }}
      >
        <div onClick={exit} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <CloseIcon size={20} />
          <span style={{ fontSize: 24, lineHeight: 1 }}>{lang.flag}</span>
        </div>
        {/* Active tutor + roast level (from the shared language/tier setting). */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.01em", color: "#000", lineHeight: 1 }}>{tutor.name}</span>
          {tutor.hasTier && (
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: tutor.heat }}>{tutor.tier}</span>
          )}
        </div>
      </div>

      {/* CHAT FEED */}
      <div ref={feedRef} className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 12px", display: "flex", flexDirection: "column", gap: 16, background: "#F2F2F7" }}>
        {messages.length === 0 ? (
          <BrandWaiting callActive={callActive} status={status} />
        ) : (
          messages.map((m, i) => {
            // Italian-only, display-only homophone cleanup (e.g. "6" → "sei").
            const clean = (t) => (langId === "it" ? cleanItalianTranscript(t) : t);
            return (
              <TranscriptBubble
                key={i}
                role={m.role}
                text={clean(bubbleText(m))}
                finalized={clean(m.finalized)}
                onWord={onWord}
                showTranslation={showTranslations}
                lang={langId}
                // A bubble's turn is over once a later bubble exists, or the call ended.
                ready={i < messages.length - 1 || !callActive}
              />
            );
          })
        )}
      </div>

      {/* ACTION ZONE */}
      <div
        style={{
          flex: "none",
          padding: "16px 28px 30px",
          background: "linear-gradient(to top,#F2F2F7 55%,rgba(242,242,247,0))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* status / waveform strip (fixed height — no layout shift) */}
        <div style={{ height: 16, display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: 10 }}>
          {callActive ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 16 }}>
              {[0, 0.12, 0.24, 0.36, 0.48].map((d, i) => (
                <span key={i} style={{ width: 4, height: 16, borderRadius: 2, background: "#34c759", transformOrigin: "bottom", animation: `ntoWave 0.7s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          ) : status ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: "#8e8e93", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "90%" }}>{status}</span>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <button
            onClick={(e) => { e.preventDefault(); nav && nav("vocabulary"); }}
            style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", background: "#dcdce1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <BookIcon size={21} stroke="#000" strokeWidth={2} />
          </button>

          <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button onClick={toggleCall} aria-label={callActive ? "Stop call" : "Start call"} style={micStyle}>
              <MicIcon size={30} />
            </button>
            <span style={{ fontSize: 19, fontWeight: 600, color: "#1c1c1e", fontVariantNumeric: "tabular-nums", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "0.01em" }}>{timerText}</span>
          </div>

          {/* spacer keeps the mic centered now that the skip button is removed */}
          <div style={{ flex: "none", width: 48, height: 48 }} aria-hidden="true" />
        </div>
      </div>

      {/* TAP-TO-DEFINE POPUP (display-layer only) */}
      {popup && (
        <>
          {/* outside-tap catcher */}
          <div onClick={closePopup} style={{ position: "absolute", inset: 0, zIndex: 100 }} />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: popup.left,
              top: popup.top,
              width: popup.width,
              zIndex: 101,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.05)",
              borderRadius: 20,
              boxShadow: "0 8px 30px -6px rgba(0,0,0,0.25)",
              padding: "14px 16px",
              boxSizing: "border-box",
              ...(popup.placeAbove ? { transform: "translateY(-100%)" } : null),
            }}
          >
            {/* header: word + close */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", color: "#000" }}>{popup.word}</div>
              <button
                onClick={closePopup}
                aria-label="Close"
                style={{ flex: "none", width: 22, height: 22, borderRadius: "50%", border: "none", background: "#f0f0f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, marginTop: 1, WebkitTapHighlightColor: "transparent" }}
              >
                <CloseIcon size={12} stroke="#8e8e93" strokeWidth={2.6} />
              </button>
            </div>

            {entry.loading ? (
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 6 }}>Looking it up…</div>
            ) : entry.notFound || entry.error ? (
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 6 }}>No definition found.</div>
            ) : (
              <>
                {entry.pos && (
                  <div style={{ fontSize: 12, fontStyle: "italic", color: "#8e8e93", marginTop: 2 }}>{entry.pos}</div>
                )}
                {entry.english && (
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000", marginTop: 8 }}>{entry.english}</div>
                )}
                {entry.definition && (
                  <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 6, lineHeight: 1.4 }}>{entry.definition}</div>
                )}
              </>
            )}

            {/* add to vocabulary */}
            {!entry.loading && (
              <button
                onClick={() => addToVocabulary(popup.word)}
                disabled={added}
                style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", padding: 0, cursor: added ? "default" : "pointer", fontSize: 13, fontWeight: 700, color: added ? "#34c759" : "#000", WebkitTapHighlightColor: "transparent" }}
              >
                {added ? "✓ Added to vocabulary" : "+ Add to vocabulary"}
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
