// STATS · the weekly "Roast Wrapped" recap. Title card, bento stat tiles,
// vocabulary ledger, trophy, punchline, report card, and a SHARE button.
// Ported from Wrapped.dc.html.
import TabBar from "../components/TabBar";
import { useTutorView } from "../settings";
import { FlameIcon, ShareIcon, ArrowUp, TrophyIcon, GaugeIcon } from "../components/icons";

const eyebrow = { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" };
const monoNum = { fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums" };

// Vocabulary ledger — single placeholder source so the numbers, the net, and
// the bar widths can never disagree. (Bar is bound to these, verified below.)
const LEARNED = 82;
const FORGOTTEN = 50;
const NET = LEARNED - FORGOTTEN;
const NET_STR = (NET >= 0 ? "+" : "") + NET;
const cardSoft = { background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" };

const REPORT = [
  { skill: "Grammar", pct: "54%", color: "#ff3b30", grade: "Shaky" },
  { skill: "Vocabulary", pct: "71%", color: "#34c759", grade: "Decent" },
  { skill: "Pronunciation", pct: "32%", color: "#ff3b30", grade: "Tragic" },
  { skill: "Accent", pct: "28%", color: "#ff3b30", grade: "Criminal" },
];

export default function Wrapped({ nav }) {
  const { tutor, lang } = useTutorView();
  const share = (e) => {
    if (e) e.preventDefault();
    const data = { title: "Not The Owl", text: `My ${lang.name} this week: THE CONFIDENTLY WRONG. +9% fluency.` };
    if (navigator.share) navigator.share(data).catch(() => {});
    else alert("Share sheet\n\n" + data.text);
  };

  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>NOT THE OWL</div>
        <span onClick={share} style={{ cursor: "pointer", display: "flex" }}>
          <ShareIcon />
        </span>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "14px 14px 108px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* TITLE BLOCK */}
        <div style={{ ...cardSoft, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ flex: "none", width: 40, height: 40, borderRadius: 12, background: "#E5E5EA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlameIcon size={21} stroke="#000" strokeWidth={2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1 }}>Your {lang.name}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 4 }}>This week · Jul 7–13</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 3, whiteSpace: "nowrap" }}>
                Roasted by {tutor.name}{tutor.hasTier && <> · <span style={{ fontWeight: 700, color: "#ff3b30" }}>{tutor.tier}</span></>}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <span style={{ display: "inline-block", position: "relative", fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000", padding: "1px 6px" }}>
              <span style={{ position: "absolute", inset: 0, background: "rgba(255,59,48,0.18)", transform: "rotate(-1.2deg)", borderRadius: 2 }} />
              <span style={{ position: "relative" }}>THE CONFIDENTLY WRONG</span>
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", marginTop: 11 }}>Wrong word 47 times. Never paused. Terrifying.</div>
        </div>

        {/* BENTO ROW A */}
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          {/* FLUENCY GAUGE */}
          <div style={{ ...cardSoft, flex: 1, padding: "15px 15px 16px", display: "flex", flexDirection: "column" }}>
            <div style={eyebrow}>Fluency</div>
            <div style={{ position: "relative", width: 132, height: 78, margin: "8px auto 0" }}>
              <svg width="132" height="78" viewBox="0 0 132 78" style={{ display: "block" }}>
                <path d="M14 70 A52 52 0 0 1 118 70" fill="none" stroke="#e9e9ec" strokeWidth="10" strokeLinecap="round" />
                <path d="M14 70 A52 52 0 0 1 118 70" fill="none" stroke="#34c759" strokeWidth="10" strokeLinecap="round" strokeDasharray="102 164" />
              </svg>
              <div style={{ position: "absolute", left: 0, right: 0, top: 34, textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: "#34c759", ...monoNum, letterSpacing: "-0.03em", lineHeight: 1 }}>+9%</span>
                  <ArrowUp size={12} stroke="#34c759" strokeWidth={3.4} />
                </div>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 2 }}>This week</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#8e8e93", textAlign: "center", marginTop: 6 }}>vs last week</div>
          </div>

          {/* MINUTES SPOKEN */}
          <div style={{ ...cardSoft, flex: 1, padding: "15px 15px 16px", display: "flex", flexDirection: "column" }}>
            <div style={eyebrow}>Minutes Spoken</div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: "#000", ...monoNum, letterSpacing: "-0.03em", marginTop: 12 }}>184</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8e8e93", marginTop: 6 }}>26 / day avg</div>
            <div style={{ marginTop: "auto", paddingTop: 14 }}>
              <svg width="100%" height="30" viewBox="0 0 150 30" preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
                <polyline points="2,20 27,13 52,23 77,9 102,17 127,6 148,12" fill="none" stroke="#c2c2c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="148" cy="12" r="2.6" fill="#000" />
              </svg>
            </div>
          </div>
        </div>

        {/* BENTO ROW B · VOCABULARY LEDGER */}
        <div style={{ ...cardSoft, padding: 16 }}>
          <div style={eyebrow}>The Vocabulary Ledger</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#000", ...monoNum, letterSpacing: "-0.03em" }}>{LEARNED}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 7 }}>Learned</div>
            </div>
            <div style={{ width: 1, alignSelf: "stretch", background: "#e2e2e7", margin: "0 16px" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#ff3b30", ...monoNum, letterSpacing: "-0.03em" }}>{FORGOTTEN}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 7 }}>Forgotten</div>
            </div>
          </div>
          {/* bar · segment widths bound to the learned / forgotten counts */}
          <div style={{ display: "flex", height: 6, marginTop: 14, gap: 3 }}>
            <div style={{ flexGrow: LEARNED, background: "#1c1c1e", borderRadius: 3 }} />
            <div style={{ flexGrow: FORGOTTEN, background: "#ff3b30", borderRadius: 3 }} />
          </div>
          {/* net · own line below the bar, left-aligned */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#a1a1a6", textTransform: "uppercase" }}>Net</span>
            <span style={{ fontSize: 19, fontWeight: 800, color: "#000", ...monoNum, letterSpacing: "-0.02em" }}>{NET_STR}</span>
            <ArrowUp size={12} stroke="#34c759" strokeWidth={3.2} />
          </div>
        </div>

        {/* BENTO ROW C */}
        <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
          {/* TOP 3% TROPHY */}
          <div style={{ flex: 1, background: "#fff6f5", border: "1px solid rgba(255,59,48,0.16)", borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: 15, display: "flex", flexDirection: "column" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,59,48,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrophyIcon />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1, marginTop: 14 }}>TOP <span style={{ color: "#ff3b30" }}>3%</span></div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 8, lineHeight: 1.3 }}>Most Roasted<br />of {lang.name} learners</div>
          </div>

          {/* AVG PACE */}
          <div style={{ ...cardSoft, flex: 1, padding: 15, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={eyebrow}>Avg Pace</div>
              <GaugeIcon />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: "#000", ...monoNum, letterSpacing: "-0.03em", marginTop: 14 }}>47</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 8, lineHeight: 1.3 }}>Average<br />Words / Min</div>
          </div>
        </div>

        {/* PUNCHLINE CALLOUT */}
        <div style={{ background: "rgba(255,59,48,0.06)", border: "1px solid rgba(255,59,48,0.1)", borderRadius: 14, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)", padding: "12px 15px", margin: "1px 4px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 500, fontStyle: "italic", color: "#6b6b70", lineHeight: 1.35 }}>Statistically, you're now a slightly less dangerous tourist.</div>
        </div>

        {/* THE REPORT CARD */}
        <div style={{ ...cardSoft, padding: 16 }}>
          <div style={{ ...eyebrow, marginBottom: 14 }}>The report card</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {REPORT.map((r) => (
              <div key={r.skill} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 96, flex: "none", fontSize: 14, fontWeight: 600, color: "#000" }}>{r.skill}</div>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#e2e2e7", overflow: "hidden" }}>
                  <div style={{ width: r.pct, height: "100%", background: r.color, borderRadius: 3 }} />
                </div>
                <div style={{ width: 64, flex: "none", textAlign: "right", fontSize: 12, fontWeight: 800, letterSpacing: "0.04em", color: r.color, textTransform: "uppercase" }}>{r.grade}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER · SHARE */}
        <div style={{ marginTop: 3 }}>
          <button onClick={share} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#39FF14", border: "none", borderRadius: 999, padding: "16px 0", cursor: "pointer", boxShadow: "0 8px 20px -5px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.12)", outline: "none", WebkitTapHighlightColor: "transparent" }}>
            <ShareIcon size={16} stroke="#000" strokeWidth={2.4} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", color: "#000", textTransform: "uppercase" }}>Share</span>
          </button>
        </div>
      </div>

      <TabBar active="stats" nav={nav} />
    </>
  );
}
