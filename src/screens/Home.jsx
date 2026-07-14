// HOME · base camp. Rotating hostile greeting, START TALKING hero with a
// daily-practice arc, survival + persona tiles, scenario-of-the-day, and two
// live-data tiles. Ported pixel-for-pixel from Home.dc.html.
import { useEffect, useState } from "react";
import TabBar from "../components/TabBar";
import { useTutorView, useSettings } from "../settings";
import { session } from "../session";
import { SCENARIO_OF_THE_DAY, scenarioText } from "../scenarios";
import { cardStyle, greyCardStyle, primaryShadow } from "../tokens";
import {
  MicIcon,
  SettingsIcon,
  FlameIcon,
  BookIcon,
  ChartIcon,
  ArrowRight,
  SpinArrows,
} from "../components/icons";

// Rotating bilingual deadpan roasts (Spanish · English).
const GREETINGS = [
  { es: "Ah. Volviste. Ni terminé mi café.", en: "Oh. You're back. I didn't finish my coffee." },
  { es: "¿Listo para más humillación?", en: "Ready for more humiliation?" },
  { es: "Déjame adivinar. Olvidaste todo otra vez.", en: "Let me guess. You forgot everything again." },
  { es: "Ay, mi desastre favorito.", en: "Oh, my favorite disaster." },
  { es: "Racha de 4 días. Renuncias mañana.", en: "4-day streak. You'll quit tomorrow." },
];

const eyebrow = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "#a1a1a6",
  textTransform: "uppercase",
};

export default function Home({ nav }) {
  const [gi, setGi] = useState(0);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setGi((g) => (g + 1) % GREETINGS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    if (nav) nav(id);
  };
  const g = GREETINGS[gi];

  // Current tutor / level / language from the shared, persisted store.
  const { tutor, levelName, lang } = useTutorView();
  const { update } = useSettings();
  // Start a Talk session: set the scenario ("" = free conversation) and request
  // the Talk screen to auto-start the voice call on arrival.
  const startTalk = (scenario) => (e) => {
    e.preventDefault();
    update({ scenario });
    session.autostart = true;
    if (nav) nav("talk");
  };

  const micStyle = {
    width: 88,
    height: 88,
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
      ? { boxShadow: "0 8px 22px -4px rgba(0,0,0,0.28)", transform: "scale(0.94)" }
      : { animation: "ntoGlow 2.4s ease-in-out infinite" }),
  };

  return (
    <>
      {/* APP BAR */}
      <div
        style={{
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e2e7",
          padding: "56px 20px 13px",
          background: "#fff",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>
          NOT THE OWL
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span onClick={go("language")} style={{ fontSize: 24, lineHeight: 1, cursor: "pointer" }}>
            {lang.flag}
          </span>
          <span onClick={go("settings")} style={{ cursor: "pointer", display: "flex" }}>
            <SettingsIcon />
          </span>
        </div>
      </div>

      {/* SCROLL BODY */}
      <div
        className="nto-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "22px 16px 124px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* HOSTILE GREETING */}
        <div
          style={{
            ...greyCardStyle,
            padding: "15px 16px 16px",
            minHeight: 112,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            <span style={{ color: "#000" }}>{tutor.name}</span>{" "}
            <span style={{ color: "#c7c7cc" }}>·</span>{" "}
            <span style={{ color: tutor.heat }}>{tutor.tier}</span>
          </div>
          <div key={g.es} style={{ animation: "ntoFade 0.4s ease both", marginTop: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.24, letterSpacing: "-0.02em", color: "#000" }}>
              {g.es}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 7, lineHeight: 1.3 }}>
              {g.en}
            </div>
          </div>
        </div>

        {/* HERO · START TALKING */}
        <div
          style={{
            ...cardStyle,
            padding: "26px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", width: 118, height: 118, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="118" height="118" viewBox="0 0 118 118" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)", pointerEvents: "none" }}>
              <circle cx="59" cy="59" r="53" fill="none" stroke="#e2e2e7" strokeWidth="7" />
              <circle cx="59" cy="59" r="53" fill="none" stroke="#3a3a3c" strokeWidth="7" strokeLinecap="round" strokeDasharray="176.5 333" />
            </svg>
            <button
              onClick={startTalk("")}
              onMouseDown={() => setListening(true)}
              onMouseUp={() => setListening(false)}
              onMouseLeave={() => setListening(false)}
              onTouchStart={() => setListening(true)}
              onTouchEnd={() => setListening(false)}
              style={micStyle}
            >
              <MicIcon size={34} />
            </button>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b70", marginTop: 15 }}>
            <span style={{ fontWeight: 700, letterSpacing: "0.06em", color: "#a1a1a6" }}>DAILY PRACTICE</span> ·{" "}
            <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums", color: "#000", fontWeight: 700 }}>8</span>{" "}
            of{" "}
            <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums" }}>15</span>{" "}
            min left today
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1, marginTop: 12, whiteSpace: "nowrap" }}>
            START TALKING
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 11, fontSize: 12, fontWeight: 500, color: "#6b6b70", whiteSpace: "nowrap" }}>
            <span>{lang.flag} {lang.name} · {levelName}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: tutor.heat, flex: "none" }} />
            <span style={{ fontWeight: 700, color: "#000" }}>{tutor.name}</span>
          </div>
        </div>

        {/* SURVIVAL + PERSONA ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "stretch" }}>
          <div onClick={go("stats")} style={{ ...greyCardStyle, padding: 16, display: "flex", flexDirection: "column", cursor: "pointer" }}>
            <FlameIcon />
            <div style={{ marginTop: "auto", paddingTop: 16 }}>
              <div style={eyebrow}>Survival</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#000", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginTop: 5 }}>
                DAY <span style={{ color: "#ff3b30" }}>4</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#8e8e93", marginTop: 7 }}>Personal best: 12</div>
            </div>
          </div>

          <div onClick={go("settings")} style={{ ...greyCardStyle, padding: 16, display: "flex", flexDirection: "column", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: tutor.heat }} />
              <span style={eyebrow}>Your tutor</span>
            </div>
            <div style={{ marginTop: "auto", paddingTop: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: "#000", lineHeight: 1 }}>{tutor.name}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: tutor.heat, marginTop: 5 }}>{tutor.tier}</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#8e8e93", marginTop: 7 }}>{lang.name} · {levelName}</div>
            </div>
          </div>
        </div>

        {/* SCENARIO OF THE DAY */}
        <div style={{ ...greyCardStyle, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={eyebrow}>Scenario of the day</div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1.1, marginTop: 7 }}>
              The Barcelona Bar
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
              <span style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3b30" }} />
                ))}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#8e8e93", textTransform: "uppercase" }}>Brutal</span>
            </div>
            <button
              onClick={startTalk(scenarioText(SCENARIO_OF_THE_DAY.title, SCENARIO_OF_THE_DAY.desc))}
              style={{ marginTop: 13, display: "inline-flex", alignItems: "center", gap: 6, background: "#000", border: "none", borderRadius: 999, padding: "9px 16px", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: "#fff" }}>START</span>
              <ArrowRight />
            </button>
          </div>

          {/* roulette wheel · green FRAME, hollow center · doorway to Scenarios */}
          <a
            href="#"
            onClick={go("scenarios")}
            style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <div style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", border: "4px solid #39FF14", boxShadow: "0 2px 6px rgba(0,0,0,0.14)" }} />
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ position: "absolute", inset: 0 }}>
                <g stroke="#c7c7cc" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="48.3" y1="15.7" x2="51.1" y2="12.9" />
                  <line x1="55" y1="32" x2="59" y2="32" />
                  <line x1="48.3" y1="48.3" x2="51.1" y2="51.1" />
                  <line x1="32" y1="55" x2="32" y2="59" />
                  <line x1="15.7" y1="48.3" x2="12.9" y2="51.1" />
                  <line x1="9" y1="32" x2="5" y2="32" />
                  <line x1="15.7" y1="15.7" x2="12.9" y2="12.9" />
                </g>
              </svg>
              <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "8px solid #ff3b30", zIndex: 2 }} />
              <SpinArrows size={24} style={{ position: "relative", zIndex: 1 }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#8e8e93", textTransform: "uppercase" }}>Spin</span>
          </a>
        </div>

        {/* BENTO · TWO LIVE-DATA TILES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "stretch" }}>
          {/* VOCABULARY */}
          <a
            href="#"
            onClick={go("vocabulary")}
            style={{ ...cardStyle, padding: 16, display: "flex", flexDirection: "column", minHeight: 132, cursor: "pointer", textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={eyebrow}>Vocabulary</div>
              <BookIcon />
            </div>
            <div style={{ marginTop: "auto" }}>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#000", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>47</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase", marginTop: 7 }}>Words butchered</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b70", marginTop: 9 }}>
                Last: <span style={{ fontStyle: "italic", color: "#000" }}>embarazada</span>
              </div>
            </div>
          </a>

          {/* THIS WEEK */}
          <a
            href="#"
            onClick={go("stats")}
            style={{ ...cardStyle, padding: 16, display: "flex", flexDirection: "column", minHeight: 132, cursor: "pointer", textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={eyebrow}>This week</div>
              <ChartIcon />
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{ display: "inline-block", position: "relative", fontSize: 11, fontWeight: 800, letterSpacing: "0.02em", color: "#000", padding: "1px 6px" }}>
                <span style={{ position: "absolute", inset: 0, background: "rgba(255,59,48,0.18)", transform: "rotate(-1.2deg)", borderRadius: 2 }} />
                <span style={{ position: "relative" }}>THE CONFIDENTLY WRONG</span>
              </span>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#34c759", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "-0.03em" }}>+9%</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#a1a1a6", textTransform: "uppercase" }}>Fluency</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b70", marginTop: 9 }}>See the damage →</div>
          </a>
        </div>
      </div>

      <TabBar active="home" nav={nav} />
    </>
  );
}
