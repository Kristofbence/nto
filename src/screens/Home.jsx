// HOME · base camp. Rotating hostile greeting, START TALKING hero with a
// daily-practice arc, survival + persona tiles, scenario-of-the-day, and two
// live-data tiles. Ported pixel-for-pixel from Home.dc.html.
import { useEffect, useState } from "react";
import TabBar from "../components/TabBar";
import { useTutorView, useSettings } from "../settings";
import { SCENARIO_OF_THE_DAY, scenarioText } from "../scenarios";
import { cardStyle, greyCardStyle, primaryShadow } from "../tokens";
import {
  MicIcon,
  SettingsIcon,
  BookIcon,
  ChartIcon,
  ArrowRight,
  ChevronRight,
  EyeIcon,
} from "../components/icons";

// Rotating bilingual deadpan greetings, KEYED BY ROAST TIER (0 nice · 1 harsh ·
// 2 brutal · 3 merciless) so each persona only ever speaks its own lines —
// mirrors firstMessages.js. Three per tier. (Spanish-only; the card is hidden
// for other languages.)
const GREETINGS = {
  0: [ // Profe (Nice, locked) — reachable only via a stale roast:0, never empty.
    { es: "Ay, mi amor. Volviste.", en: "Oh, my love. You came back." },
    { es: "Yo sabía que no te ibas a rendir.", en: "I knew you wouldn't give up." },
    { es: "Tranquilo. Hoy vamos despacio.", en: "Relax. Today we go slowly." },
  ],
  1: [ // La Tía (Harsh) — weapon is disappointment, never swearing.
    { es: "Déjame adivinar. Olvidaste todo otra vez.", en: "Let me guess. You forgot everything again." },
    { es: "Ay, mi desastre favorito.", en: "Ah, my favourite disaster." },
    { es: "Tu mamá me preguntó cómo vas. Le mentí.", en: "Your mother asked how you're doing. I lied to her." },
  ],
  2: [ // El Vecino (Brutal) — dry, unimpressed by you specifically.
    { es: "Ah. Volviste. Ni terminé mi café.", en: "Ah. You're back. I hadn't even finished my coffee." },
    { es: "Cuatro días. Impresionante, para ti.", en: "Four days. Impressive, for you." },
    { es: "Pasa. No toques nada.", en: "Come in. Don't touch anything." },
  ],
  3: [ // El Patrón (Merciless).
    { es: "¿Listo para más humillación?", en: "Ready for more humiliation?" },
    { es: "Racha de 4 días. Renuncias mañana.", en: "Four-day streak. You quit tomorrow." },
    { es: "Órale. El mismo pendejo de ayer.", en: "Well well. The same idiot as yesterday." },
  ],
};

const eyebrow = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  color: "#8e8e93", // a11y: was #a1a1a6; darkened for contrast on grey cards
  textTransform: "uppercase",
};

// Minutes of daily practice left today (placeholder until real tracking exists).
const DAILY_LEFT = 8;

export default function Home({ nav }) {
  const [gi, setGi] = useState(0);
  const [listening, setListening] = useState(false);
  const [revealed, setRevealed] = useState(false); // tutor-quote translation

  useEffect(() => {
    const t = setInterval(() => {
      setGi((g) => g + 1); // unbounded; modulo the active tier's line count at read
      setRevealed(false); // each new line starts collapsed
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    if (nav) nav(id);
  };

  // Current tutor / level / language from the shared, persisted store.
  const { tutor, levelName, lang, hasTiers, roast } = useTutorView();
  // Greetings are keyed by roast tier so a persona can never speak another's
  // line. Guard against a stale/out-of-range roast with the Brutal default.
  const lines = GREETINGS[roast] || GREETINGS[2];
  const g = lines[gi % lines.length];
  const { update } = useSettings();
  // Start a Talk session: set the scenario ("" = free conversation). Talk
  // auto-starts the call on arrival regardless of route.
  const startTalk = (scenario) => (e) => {
    e.preventDefault();
    update({ scenario });
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
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginRight: -11 }}>
          <span
            onClick={go("language")}
            style={{ width: 44, height: 44, margin: "-11px 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, lineHeight: 1, cursor: "pointer" }}
          >
            {lang.flag}
          </span>
          <span
            onClick={go("settings")}
            style={{ width: 44, height: 44, margin: "-11px 0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
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
          padding: "22px 16px 104px", // clear the floating nav (~88px) + 16px
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* SURVIVAL · ambient stat, RIGHT-aligned so it reads as a stat, not a
            section header (section headers are always left-aligned here). */}
        <div style={{ textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#8e8e93", textTransform: "uppercase" }}>
          Survival Day 4 · Best 12
        </div>

        {/* TUTOR IDENTITY + SWITCHER · tap to change tutor / roast.
            Spanish only — the greetings are Spanish copy, so we hide the whole
            card for single-tutor languages rather than show a stale quote. */}
        {hasTiers && (
        <div
          onClick={go("settings")}
          style={{
            ...greyCardStyle,
            padding: "15px 16px 16px",
            // Fixed height sized to a two-line quote, content top-aligned, so
            // one- and two-line greetings occupy identical space — nothing
            // below the card ever moves.
            minHeight: 132,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span style={{ color: "#000" }}>{tutor.name}</span>
              {tutor.hasTier && (
                <>
                  {" "}<span style={{ color: "#c7c7cc" }}>·</span>{" "}
                  <span style={{ color: "#ff3b30" }}>{tutor.tier}</span>
                </>
              )}
            </div>
            <ChevronRight style={{ flex: "none" }} />
          </div>
          <div key={g.es} style={{ animation: "ntoFade 0.4s ease both", marginTop: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.24, letterSpacing: "-0.02em", color: "#000" }}>
              {g.es}
            </div>
            {revealed ? (
              <div style={{ fontSize: 13, fontWeight: 500, color: "#6b6b70", marginTop: 8, lineHeight: 1.3 }}>
                {g.en}
              </div>
            ) : (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRevealed(true); }}
                style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent" }}
              >
                <EyeIcon />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93" }}>Translate</span>
              </button>
            )}
          </div>
        </div>
        )}

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
          <div style={{ fontSize: 12, fontWeight: 400, color: "#8e8e93", marginTop: 15 }}>
            DAILY PRACTICE ·{" "}
            <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums" }}>{DAILY_LEFT}</span> min left today
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1, marginTop: 12, whiteSpace: "nowrap" }}>
            START TALKING
          </div>
          <div style={{ marginTop: 11, fontSize: 12, fontWeight: 400, color: "#8e8e93", whiteSpace: "nowrap" }}>
            {lang.name} · {levelName}
          </div>
        </div>

        {/* SCENARIO OF THE DAY · Spanish-only content (hidden otherwise) */}
        {hasTiers && (
        <div style={{ ...greyCardStyle, padding: 16 }}>
          <div style={eyebrow}>Scenario of the day</div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1.1, marginTop: 7 }}>
            The Barcelona Bar
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#ff3b30", textTransform: "uppercase" }}>Brutal</span>
            <button
              onClick={startTalk(scenarioText(SCENARIO_OF_THE_DAY.title, SCENARIO_OF_THE_DAY.desc))}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#000", border: "none", borderRadius: 999, padding: "9px 16px", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", color: "#fff" }}>START</span>
              <ArrowRight />
            </button>
          </div>
        </div>
        )}

        {/* BENTO · TWO LIVE-DATA TILES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "stretch" }}>
          {/* VOCABULARY */}
          <a
            href="#"
            onClick={go("vocabulary")}
            style={{ ...greyCardStyle, padding: 16, display: "flex", flexDirection: "column", minHeight: 132, cursor: "pointer", textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={eyebrow}>Vocabulary</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <BookIcon />
                <ChevronRight />
              </div>
            </div>
            <div style={{ marginTop: "auto" }}>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#000", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>47</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#8e8e93", textTransform: "uppercase", marginTop: 7 }}>Words butchered</div>
              {/* "Last:" cites a Spanish word — hide it for other languages
                  rather than build a per-language recent-word list. */}
              {hasTiers && (
                <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b70", marginTop: 9 }}>
                  Last: <span style={{ fontStyle: "italic", color: "#000" }}>embarazada</span>
                </div>
              )}
            </div>
          </a>

          {/* THIS WEEK */}
          <a
            href="#"
            onClick={go("stats")}
            style={{ ...greyCardStyle, padding: 16, display: "flex", flexDirection: "column", minHeight: 132, cursor: "pointer", textDecoration: "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={eyebrow}>This week</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ChartIcon />
                <ChevronRight />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <span style={{ display: "inline-block", position: "relative", fontSize: 11, fontWeight: 800, letterSpacing: "0.02em", color: "#000", padding: "1px 6px" }}>
                <span style={{ position: "absolute", inset: 0, background: "rgba(255,59,48,0.18)", transform: "rotate(-1.2deg)", borderRadius: 2 }} />
                <span style={{ position: "relative" }}>THE CONFIDENTLY WRONG</span>
              </span>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, color: "#34c759", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", letterSpacing: "-0.03em" }}>+9%</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#8e8e93", textTransform: "uppercase" }}>Fluency</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#6b6b70", marginTop: 9 }}>See the damage →</div>
          </a>
        </div>
      </div>

      {/* fade scrim · softens content into the bg just above the floating nav */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 88,
          height: 28,
          background: "linear-gradient(to bottom, rgba(242,242,247,0), #f2f2f7)",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      <TabBar active="home" nav={nav} />
    </>
  );
}
