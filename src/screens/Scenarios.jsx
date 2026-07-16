// SCENARIOS · title, Scenario of the Day hero (START + Roll), and a grouped
// list of nationality-tagged scenarios. Every row / the START leads into a Talk
// session; Roll swaps the hero scenario in place. Ported from Scenarios.dc.html.
import { useState } from "react";
import TabBar from "../components/TabBar";
import { useSettings, LANGS } from "../settings";
import { SCENARIOS as SCENARIO_DATA, SCENARIO_OF_THE_DAY, scenarioText } from "../scenarios";
import {
  DiceIcon,
  ChevronRight,
  WineIcon,
  PersonIcon,
  ChatBubblesIcon,
  ShieldIcon,
  DoorIcon,
  CarIcon,
  TagIcon,
  MugIcon,
  PlateIcon,
  FlameIcon,
  CompassIcon,
} from "../components/icons";

// difficulty tier word (shown in crimson everywhere; never dots)
const TIER_WORD = { 1: "Easy", 2: "Medium", 3: "Brutal" };

// Icons align 1:1 (by order) with SCENARIO_DATA in ../scenarios.
const ICONS = [PersonIcon, ChatBubblesIcon, ShieldIcon, DoorIcon, CarIcon, TagIcon, MugIcon, PlateIcon, FlameIcon, CompassIcon];
const SCENARIOS = SCENARIO_DATA.map((s, i) => ({ ...s, Icon: ICONS[i] }));

export default function Scenarios({ nav }) {
  const { settings, update } = useSettings();
  const lang = LANGS[settings.langId] || LANGS.es;
  // The hero card's scenario is stateful — Roll swaps in a random one IN PLACE
  // (no navigation). Seeded with the Scenario of the Day (Brutal, level 3).
  const [hero, setHero] = useState({ ...SCENARIO_OF_THE_DAY, level: 3 });
  // Start a session with the given scenario text.
  const start = (text) => (e) => {
    e.preventDefault();
    update({ scenario: text });
    if (nav) nav("talk");
  };
  // Replace the hero scenario with a different random one (in place).
  const roll = (e) => {
    e.preventDefault();
    const pool = SCENARIOS.filter((s) => s.title !== hero.title);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setHero({ title: pick.title, desc: pick.desc, level: pick.level });
  };

  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>NOT THE OWL</div>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 14px 150px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* HEADER ROW · title */}
        <div style={{ padding: "6px 4px 0" }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "#000" }}>{lang.flag} Scenarios</div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: "#6b6b70", marginTop: 6 }}>
            Pick your fight — or roll for a random one.
          </div>
        </div>

        {/* HERO · SCENARIO OF THE DAY */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 22, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", padding: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" }}>Scenario of the day</div>
            <WineIcon />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", marginTop: 12, lineHeight: 1.02 }}>{hero.title}</div>
          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.42, color: "#6b6b70", marginTop: 9 }}>
            {hero.desc}
          </div>
          {/* difficulty = tier word only, crimson (no dots — dots live nowhere) */}
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#ff3b30", textTransform: "uppercase" }}>{TIER_WORD[hero.level]}</span>
          </div>
          {/* START (primary) + Roll (swap scenario in place), same row / height */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={start(scenarioText(hero.title, hero.desc))} style={{ flex: 3, height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", border: "none", borderRadius: 999, cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase" }}>Start →</span>
            </button>
            <button onClick={roll} aria-label="Roll for a random scenario" style={{ flex: 2, height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#E5E5EA", border: "none", borderRadius: 999, cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
              <DiceIcon size={22} stroke="#000" />
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.04em", color: "#000", textTransform: "uppercase" }}>Roll</span>
            </button>
          </div>
        </div>

        {/* LIST HEADER */}
        <div style={{ padding: "6px 4px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "#8e8e93", textTransform: "uppercase" }}>Your scenarios</div>
        </div>

        {/* LIST */}
        <div style={{ background: "#E5E5EA", border: "1px solid rgba(0,0,0,0.04)", borderRadius: 20, overflow: "hidden", flexShrink: 0 }}>
          {SCENARIOS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.title}
                onClick={start(scenarioText(s.title, s.desc))}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderBottom: i < SCENARIOS.length - 1 ? "1px solid #d1d1d6" : "none", cursor: "pointer" }}
              >
                <Icon style={{ flex: "none" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff3b30", marginTop: 4 }}>
                    {TIER_WORD[s.level]}
                  </div>
                </div>
                <ChevronRight stroke="#a1a1a6" style={{ flex: "none" }} />
              </div>
            );
          })}
        </div>
      </div>

      <TabBar active="scenarios" nav={nav} />
    </>
  );
}
