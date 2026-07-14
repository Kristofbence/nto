// VOCABULARY · "words you keep butchering" — the user's saved words / false-friend
// fails with roast notes and butcher counts. Ported from the Dictionary mockup.
import { CloseIcon, ArrowRight } from "../components/icons";

const WORDS = [
  { wrong: "embarazada", right: "avergonzado", note: "You said 'pregnant'. You meant 'embarrassed'.", count: "×4" },
  { wrong: "constipado", right: "estreñido", note: "You said you had a cold. You did not.", count: "×3" },
  { wrong: "molestar", right: "acosar", note: "It means 'to bother'. Calm down.", count: "×3" },
  { wrong: "ropa", right: "cuerda", note: "You asked for clothes. You wanted rope.", count: "×2" },
  { wrong: "éxito", right: "salida", note: "'Éxito' is success. The exit is 'salida'.", count: "×2" },
  { wrong: "sopa", right: "jabón", note: "You ordered soup. You meant soap. Somehow.", count: "×1" },
];

export default function Vocabulary({ nav }) {
  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div onClick={(e) => { e.preventDefault(); nav && nav("home"); }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <CloseIcon size={20} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>VOCABULARY</div>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* HEADER STAT */}
        <div style={{ padding: "0 4px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" }}>Words you keep butchering</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: "#000", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "-0.04em" }}>47</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#ff3b30" }}>−18 this week</span>
          </div>
        </div>

        {/* WORD LIST */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", overflow: "hidden" }}>
          {WORDS.map((w, i) => (
            <div key={w.wrong} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < WORDS.length - 1 ? "1px solid #ececef" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em", color: "#ff3b30", textDecoration: "line-through", textDecorationThickness: 2 }}>{w.wrong}</span>
                  <ArrowRight size={13} stroke="#a1a1a6" strokeWidth={2.6} />
                  <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em", color: "#000" }}>{w.right}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 5, lineHeight: 1.35 }}>{w.note}</div>
              </div>
              <div style={{ flex: "none", fontSize: 12, fontWeight: 700, color: "#8e8e93", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace" }}>{w.count}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", fontSize: 12, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", padding: "2px 12px" }}>
          And 41 more. We stopped listing them out of pity.
        </div>
      </div>
    </>
  );
}
