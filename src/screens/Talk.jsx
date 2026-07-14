// TALK · full-screen voice session (no tab bar). The mic now starts/stops a REAL
// Vapi voice call with the Spanish tutor; final transcripts stream into the feed.
// Design/layout is unchanged from the prototype — only behavior is wired up.
import { useEffect, useRef, useState } from "react";
import VapiPkg from "@vapi-ai/web";
import { CloseIcon, BookIcon, MicIcon, SkipIcon } from "../components/icons";
import { useTutorView } from "../settings";
import { lookupWord } from "../lookup";

// @vapi-ai/web ships as CommonJS; depending on the bundler's interop the default
// import can arrive as the class itself or wrapped as { default: class }. Unwrap
// to the actual constructor either way.
const Vapi = typeof VapiPkg === "function" ? VapiPkg : VapiPkg.default;

// Public key — safe to ship in front-end code. NEVER put a private key here.
const VAPI_PUBLIC_KEY = "fb6a87e8-4feb-4cbd-ade2-4ba12f74ade9";
const SPANISH_ASSISTANT_ID = "fb6f1f13-b002-4317-be54-063c56c18dc4";

const cardSoft = {
  maxWidth: "85%",
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  padding: "15px 16px 16px",
};

// Renders a string as individually tappable words (display-layer only — no
// visible styling by default, so bubbles look identical). Whitespace/punctuation
// is preserved; punctuation is stripped from the word passed to onWord.
function TappableText({ text, onWord, style }) {
  return (text || "").split(/(\s+)/).map((tok, i) => {
    if (!tok || /^\s+$/.test(tok)) return tok;
    const clean = tok.replace(/[^\p{L}\p{M}''-]/gu, "");
    if (!clean) return tok;
    return (
      <span
        key={i}
        onClick={(e) => onWord(clean, e)}
        style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", ...style }}
      >
        {tok}
      </span>
    );
  });
}

// A live transcript bubble — tutor (assistant) white/left, user grey/right.
function TranscriptBubble({ role, text, onWord }) {
  const isUser = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", animation: "ntoMsgIn 0.3s ease both" }}>
      <div style={{ ...cardSoft, ...(isUser ? { background: "#E5E5EA" } : null) }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: isUser ? "#8e8e93" : "#a1a1a6", textTransform: "uppercase", marginBottom: 5, textAlign: isUser ? "right" : "left" }}>
          {isUser ? "You" : "Tutor"}
        </div>
        <div style={{ fontSize: 19, fontWeight: isUser ? 600 : 700, lineHeight: 1.3, letterSpacing: "-0.02em", color: "#000" }}>
          <TappableText text={text} onWord={onWord} />
        </div>
      </div>
    </div>
  );
}

export default function Talk({ nav }) {
  // messages === null → show the pre-seeded demo exchange (idle/empty state).
  // Once a real call starts we clear it to [] and append live transcripts.
  const [messages, setMessages] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState(null);

  // Tap-to-define popup (display-layer only; independent of the voice pipeline).
  const [popup, setPopup] = useState(null); // { word, left, top, placeAbove, width }
  const [entry, setEntry] = useState({ loading: false });
  const { langId } = useTutorView();

  const onWord = (word, e) => {
    e.stopPropagation();
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
    lookupWord(word, langId)
      .then((r) => setEntry({ loading: false, ...r }))
      .catch(() => setEntry({ loading: false, error: true }));
  };
  const closePopup = () => setPopup(null);

  const feedRef = useRef(null);

  // One Vapi client for the life of this screen.
  const vapiRef = useRef(null);
  if (!vapiRef.current) vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

  // Subscribe to Vapi events once.
  useEffect(() => {
    const vapi = vapiRef.current;

    const onCallStart = () => {
      setStatus(null);
      setMessages([]); // clear the demo bubbles so real transcripts show
      setSeconds(0);
      setCallActive(true);
    };
    const onCallEnd = () => {
      setCallActive(false);
    };
    const onMessage = (m) => {
      // Only commit FINAL transcripts to the feed (ignore partial/interim).
      if (m?.type === "transcript" && m?.transcriptType === "final" && m?.transcript) {
        setMessages((prev) => [...(prev || []), { role: m.role, text: m.transcript }]);
      }
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

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      try { vapi.stop(); } catch { /* noop */ }
    };
  }, []);

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
      await vapi.start(SPANISH_ASSISTANT_ID);
    } catch (err) {
      console.error("[Vapi] start failed:", err);
      setStatus("Could not start. Allow mic access and try again.");
    }
  };

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

  // Idle (before any call) keeps the prototype's placeholder time; a real call
  // shows the live count-up.
  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const timerText = messages === null ? "14:27" : mmss;

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
          <span style={{ fontSize: 24, lineHeight: 1 }}>🇪🇸</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#a1a1a6", textTransform: "uppercase" }}>Survival</span>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.01em", color: "#000" }}>DAY <span style={{ color: "#ff3b30" }}>4</span></span>
        </div>
      </div>

      {/* CHAT FEED */}
      <div ref={feedRef} className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 12px", display: "flex", flexDirection: "column", gap: 16, background: "#F2F2F7" }}>
        {messages === null ? (
          <>
            {/* MSG 1 · TUTOR */}
            <div style={{ display: "flex", justifyContent: "flex-start", animation: "ntoMsgIn 0.3s ease both" }}>
              <div style={cardSoft}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginBottom: 5 }}>Tutor</div>
                <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.24, letterSpacing: "-0.02em", color: "#000" }}>
                  <TappableText text="¿Por qué llegaste tarde a la " onWord={onWord} />
                  <span onClick={(e) => onWord("reunión", e)} style={{ textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#c7c7cc", textUnderlineOffset: 4, cursor: "pointer" }}>reunión</span>?
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 8 }}>Why were you late to the meeting?</div>
              </div>
            </div>

            {/* MSG 2 · USER */}
            <div style={{ display: "flex", justifyContent: "flex-end", animation: "ntoMsgIn 0.3s ease 0.05s both" }}>
              <div style={{ ...cardSoft, background: "#E5E5EA" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#8e8e93", textTransform: "uppercase", marginBottom: 5, textAlign: "right" }}>You</div>
                <div style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.36, letterSpacing: "-0.02em", color: "#000" }}>
                  <TappableText text="Lo siento, estoy muy " onWord={onWord} />
                  <span style={{ background: "#ff3b30", color: "#fff", fontWeight: 700, padding: "2px 8px", borderRadius: 6, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>embarazada</span>
                  <TappableText text=" por llegar tarde." onWord={onWord} />
                </div>
              </div>
            </div>

            {/* MSG 3 · TUTOR ROAST */}
            <div style={{ display: "flex", justifyContent: "flex-start", animation: "ntoMsgIn 0.3s ease 0.1s both" }}>
              <div style={cardSoft}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginBottom: 5 }}>Tutor</div>
                <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.32, letterSpacing: "-0.02em", color: "#000" }}>
                  <TappableText text="Acabas de decir que estás embarazada. Eres un hombre de 25 años. La palabra es " onWord={onWord} />
                  <span onClick={(e) => onWord("avergonzado", e)} style={{ fontStyle: "italic", cursor: "pointer" }}>avergonzado</span>
                  <TappableText text=". Repítelo." onWord={onWord} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 9, lineHeight: 1.42 }}>
                  You just said you are pregnant. You are a 25-year-old man. The word is avergonzado. Repeat it.
                </div>
              </div>
            </div>
          </>
        ) : messages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", fontSize: 14, fontWeight: 500, color: "#8e8e93", padding: "0 24px", lineHeight: 1.4 }}>
            Listening… say something in Spanish.
          </div>
        ) : (
          messages.map((m, i) => <TranscriptBubble key={i} role={m.role} text={m.text} onWord={onWord} />)
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
            onClick={(e) => { e.preventDefault(); nav && nav("dictionary"); }}
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

          <button
            onClick={(e) => { e.preventDefault(); /* Stage 4: load next scenario */ }}
            style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", background: "#dcdce1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <SkipIcon size={21} />
          </button>
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
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", color: "#000" }}>{popup.word}</div>
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
          </div>
        </>
      )}
    </>
  );
}
