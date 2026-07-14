// LANGUAGE · current language (Spanish, active) + a locked list of others.
// Ported from Not The Owl Language.dc.html.
import { CloseIcon, CheckIcon, LockIcon } from "../components/icons";

const LOCKED = [
  { flag: "🇫🇷", name: "French" },
  { flag: "🇩🇪", name: "German" },
  { flag: "🇮🇹", name: "Italian" },
  { flag: "🇧🇷", name: "Portuguese" },
  { flag: "🇯🇵", name: "Japanese" },
];

export default function Language({ nav }) {
  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div onClick={(e) => { e.preventDefault(); nav && nav("home"); }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <CloseIcon size={20} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>LANGUAGE</div>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ padding: "0 4px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "#000", lineHeight: 1.15 }}>Pick a language to disappoint us in.</div>
        </div>

        {/* CURRENT */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", padding: "0 4px 8px" }}>Currently failing</div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", display: "flex", alignItems: "center", gap: 14, padding: 16 }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>🇪🇸</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>Spanish</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 3 }}>4-day streak · 47 words butchered</div>
            </div>
            <div style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", background: "#39FF14", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckIcon size={15} stroke="#000" />
            </div>
          </div>
        </div>

        {/* LOCKED */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", padding: "0 4px 8px" }}>Not yet available</div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", overflow: "hidden" }}>
            {LOCKED.map((l, i) => (
              <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < LOCKED.length - 1 ? "1px solid #ececef" : "none" }}>
                <span style={{ fontSize: 26, lineHeight: 1, opacity: 0.45 }}>{l.flag}</span>
                <div style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 600, color: "#8e8e93" }}>{l.name}</div>
                <LockIcon size={16} stroke="#c7c7cc" strokeWidth={2} style={{ flex: "none" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", padding: "2px 12px" }}>
          Master one disaster before starting another.
        </div>
      </div>
    </>
  );
}
