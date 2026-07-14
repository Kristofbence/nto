// TALK · full-screen voice session (no tab bar). Tutor/user chat feed with the
// embarazada false-friend roast, plus dictionary · mic · skip action zone.
// Mic is a press-to-listen visual stub (Vapi voice is a later stage).
// Ported from Not The Owl Chat.dc.html.
import { useState } from "react";
import { CloseIcon, BookIcon, MicIcon, SkipIcon } from "../components/icons";

export default function Talk({ nav }) {
  const [listening, setListening] = useState(false);

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
    ...(listening
      ? { boxShadow: "0 8px 22px -4px rgba(0,0,0,0.28)", animation: "ntoPress 1s ease-in-out infinite", transform: "scale(0.94)" }
      : { boxShadow: "0 8px 20px -5px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.12)" }),
  };

  const cardSoft = {
    maxWidth: "85%",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    padding: "15px 16px 16px",
  };

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
        <div onClick={(e) => { e.preventDefault(); nav && nav("home"); }} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <CloseIcon size={20} />
          <span style={{ fontSize: 24, lineHeight: 1 }}>🇪🇸</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "#a1a1a6", textTransform: "uppercase" }}>Survival</span>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.01em", color: "#000" }}>DAY <span style={{ color: "#ff3b30" }}>4</span></span>
        </div>
      </div>

      {/* CHAT FEED */}
      <div style={{ flex: 1, overflow: "hidden", padding: "20px 16px 12px", display: "flex", flexDirection: "column", gap: 16, background: "#F2F2F7" }}>
        {/* MSG 1 · TUTOR */}
        <div style={{ display: "flex", justifyContent: "flex-start", animation: "ntoMsgIn 0.3s ease both" }}>
          <div style={cardSoft}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginBottom: 5 }}>Tutor</div>
            <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.24, letterSpacing: "-0.02em", color: "#000" }}>
              ¿Por qué llegaste tarde a la{" "}
              <span style={{ textDecoration: "underline", textDecorationStyle: "dotted", textDecorationColor: "#c7c7cc", textUnderlineOffset: 4, cursor: "pointer" }}>reunión</span>?
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 8 }}>Why were you late to the meeting?</div>
          </div>
        </div>

        {/* MSG 2 · USER */}
        <div style={{ display: "flex", justifyContent: "flex-end", animation: "ntoMsgIn 0.3s ease 0.05s both" }}>
          <div style={{ ...cardSoft, background: "#E5E5EA" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#8e8e93", textTransform: "uppercase", marginBottom: 5, textAlign: "right" }}>You</div>
            <div style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.36, letterSpacing: "-0.02em", color: "#000" }}>
              Lo siento, estoy muy{" "}
              <span style={{ background: "#ff3b30", color: "#fff", fontWeight: 700, padding: "2px 8px", borderRadius: 6, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>embarazada</span>{" "}
              por llegar tarde.
            </div>
          </div>
        </div>

        {/* MSG 3 · TUTOR ROAST */}
        <div style={{ display: "flex", justifyContent: "flex-start", animation: "ntoMsgIn 0.3s ease 0.1s both" }}>
          <div style={cardSoft}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginBottom: 5 }}>Tutor</div>
            <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.32, letterSpacing: "-0.02em", color: "#000" }}>
              Acabas de decir que estás embarazada. Eres un hombre de 25 años. La palabra es{" "}
              <span style={{ fontStyle: "italic" }}>avergonzado</span>. Repítelo.
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 9, lineHeight: 1.42 }}>
              You just said you are pregnant. You are a 25-year-old man. The word is avergonzado. Repeat it.
            </div>
          </div>
        </div>
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
        <div style={{ height: 16, display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: 10 }}>
          {listening && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 16 }}>
              {[0, 0.12, 0.24, 0.36, 0.48].map((d, i) => (
                <span key={i} style={{ width: 4, height: 16, borderRadius: 2, background: "#34c759", transformOrigin: "bottom", animation: `ntoWave 0.7s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <button
            onClick={(e) => { e.preventDefault(); nav && nav("dictionary"); }}
            style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", background: "#dcdce1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <BookIcon size={21} stroke="#000" strokeWidth={2} />
          </button>

          <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <button
              onMouseDown={() => setListening(true)}
              onMouseUp={() => setListening(false)}
              onMouseLeave={() => setListening(false)}
              onTouchStart={() => setListening(true)}
              onTouchEnd={() => setListening(false)}
              style={micStyle}
            >
              <MicIcon size={30} />
            </button>
            <span style={{ fontSize: 19, fontWeight: 600, color: "#1c1c1e", fontVariantNumeric: "tabular-nums", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "0.01em" }}>14:27</span>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); /* Stage 4: load next scenario */ }}
            style={{ flex: "none", width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.08)", background: "#dcdce1", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <SkipIcon size={21} />
          </button>
        </div>
      </div>
    </>
  );
}
