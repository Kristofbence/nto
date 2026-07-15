// SCENARIOS · header with spin wheel, Scenario of the Day hero, and a grouped
// list of nationality-tagged scenarios. Every row / the START / the wheel lead
// into a Talk session. Ported from Scenarios.dc.html.
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

// difficulty tier word shown under each scenario title (1 easy · 2 medium · 3 brutal)
const TIER_WORD = { 1: "Easy", 2: "Medium", 3: "Brutal" };
// difficulty dot colour on the hero card: 1 easy(green) · 2 medium(amber) · 3 brutal(red)
const HEAT = { 1: "#34c759", 2: "#f5a623", 3: "#ff3b30" };

// Icons align 1:1 (by order) with SCENARIO_DATA in ../scenarios.
const ICONS = [PersonIcon, ChatBubblesIcon, ShieldIcon, DoorIcon, CarIcon, TagIcon, MugIcon, PlateIcon, FlameIcon, CompassIcon];
const SCENARIOS = SCENARIO_DATA.map((s, i) => ({ ...s, Icon: ICONS[i] }));

export default function Scenarios({ nav }) {
  const { settings, update } = useSettings();
  const lang = LANGS[settings.langId] || LANGS.es;
  // The hero card's scenario is stateful — Spin swaps in a random one IN PLACE
  // (no navigation). Seeded with the Scenario of the Day (Brutal, level 3).
  const [hero, setHero] = useState({ ...SCENARIO_OF_THE_DAY, level: 3 });
  // Start a session with the given scenario text.
  const start = (text) => (e) => {
    e.preventDefault();
    update({ scenario: text });
    if (nav) nav("talk");
  };
  // Replace the hero scenario with a different random one (in place).
  const spin = (e) => {
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
            Pick your fight — or spin for a random real-life scenario to practice your {lang.name}.
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
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
            {[1, 2, 3].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i <= hero.level ? HEAT[hero.level] : "#d1d1d6" }} />
            ))}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#8e8e93", textTransform: "uppercase", marginLeft: 4 }}>{TIER_WORD[hero.level]}</span>
          </div>
          {/* START (primary) + Spin (swap scenario in place), same row / height */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={start(scenarioText(hero.title, hero.desc))} style={{ flex: 3, height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", border: "none", borderRadius: 999, cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase" }}>Start →</span>
            </button>
            <button onClick={spin} aria-label="Spin for a random scenario" style={{ flex: 2, height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#E5E5EA", border: "none", borderRadius: 999, cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
              <DiceIcon size={22} stroke="#000" />
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.04em", color: "#000", textTransform: "uppercase" }}>Spin</span>
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
