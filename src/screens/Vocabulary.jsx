// VOCABULARY · the user's saved words. Reads the SAME localStorage key that the
// Talk popup's "+ Add to vocabulary" button writes to ("nto.vocabulary").
// Entries are { word, def } (definition saved at add-time — no re-fetch). If the
// user hasn't saved anything yet, we show the preset false-friends list as
// examples so the screen is never empty. Display layer only.
import { useState } from "react";
import { CloseIcon, ArrowRight } from "../components/icons";
import { useSettings, langHasTiers } from "../settings";

const STORAGE_KEY = "nto.vocabulary"; // matches Talk's addToVocabulary

// Preset examples shown only when the user has no saved words yet.
const PRESET = [
  { wrong: "embarazada", right: "avergonzado", note: "You said 'pregnant'. You meant 'embarrassed'.", count: "×4" },
  { wrong: "constipado", right: "estreñido", note: "You said you had a cold. You did not.", count: "×3" },
  { wrong: "molestar", right: "acosar", note: "It means 'to bother'. Calm down.", count: "×3" },
  { wrong: "ropa", right: "cuerda", note: "You asked for clothes. You wanted rope.", count: "×2" },
  { wrong: "éxito", right: "salida", note: "'Éxito' is success. The exit is 'salida'.", count: "×2" },
  { wrong: "sopa", right: "jabón", note: "You ordered soup. You meant soap. Somehow.", count: "×1" },
];

function loadSaved() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return raw
      .map((e) => (typeof e === "string" ? { word: e, def: "" } : { word: e?.word, def: e?.def || "" }))
      .filter((e) => e.word);
  } catch {
    return [];
  }
}

const label = { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" };
const cardList = { background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", overflow: "hidden" };

export default function Vocabulary({ nav }) {
  const { settings } = useSettings();
  // The preset examples are Spanish false-friends; only show them for Spanish.
  const showPreset = langHasTiers(settings.langId);
  const [saved, setSaved] = useState(loadSaved);
  const hasSaved = saved.length > 0;

  const remove = (word) => {
    const next = saved.filter((e) => e.word !== word);
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  // Most-recent first.
  const rows = [...saved].reverse();

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
        {hasSaved ? (
          <>
            {/* HEADER · saved count */}
            <div style={{ padding: "0 4px" }}>
              <div style={label}>Words you've saved</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: "#000", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "-0.04em" }}>{saved.length}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93" }}>{saved.length === 1 ? "word" : "words"}</span>
              </div>
            </div>

            {/* SAVED LIST */}
            <div style={cardList}>
              {rows.map((w, i) => (
                <div key={w.word} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < rows.length - 1 ? "1px solid #ececef" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em", color: "#000" }}>{w.word}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 5, lineHeight: 1.35 }}>
                      {w.def || "Saved from a conversation."}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(w.word)}
                    aria-label={`Remove ${w.word}`}
                    style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", border: "none", background: "#f0f0f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, WebkitTapHighlightColor: "transparent" }}
                  >
                    <CloseIcon size={13} stroke="#8e8e93" strokeWidth={2.4} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: 12, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", padding: "2px 12px" }}>
              Tap any word during a conversation to save it here.
            </div>
          </>
        ) : (
          <>
            {/* EMPTY STATE · preset examples (Spanish); generic copy otherwise */}
            <div style={{ padding: "0 4px" }}>
              <div style={label}>{showPreset ? "Examples" : "Nothing yet"}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6b6b70", marginTop: 8, lineHeight: 1.4 }}>
                {showPreset
                  ? "You haven't saved any words yet. Tap words during a conversation to save them here. Meanwhile, some classics you'll probably butcher:"
                  : "You haven't saved any words yet. Tap words during a conversation to save them here. We'll keep a running list of your greatest hits."}
              </div>
            </div>

            {showPreset && (
              <div style={cardList}>
                {PRESET.map((w, i) => (
                  <div key={w.wrong} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: i < PRESET.length - 1 ? "1px solid #ececef" : "none" }}>
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
            )}
          </>
        )}
      </div>
    </>
  );
}
