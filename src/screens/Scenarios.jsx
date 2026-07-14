// SCENARIOS · header with spin wheel, Scenario of the Day hero, and a grouped
// list of nationality-tagged scenarios. Every row / the START / the wheel lead
// into a Talk session. Ported from Scenarios.dc.html.
import TabBar from "../components/TabBar";
import {
  SpinArrows,
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

// difficulty: 1 easy(green) · 2 medium(amber) · 3 brutal(red)
const HEAT = { 1: "#34c759", 2: "#f5a623", 3: "#ff3b30" };

const SCENARIOS = [
  { title: "Meeting Her Colombian Father", level: 3, Icon: PersonIcon },
  { title: "The Jealous Argentinian Ex", level: 3, Icon: ChatBubblesIcon },
  { title: "Lying at the Venezuelan Border", level: 3, Icon: ShieldIcon },
  { title: "Walk of Shame in Madrid", level: 2, Icon: DoorIcon },
  { title: "The Bogotá Taxi Scam", level: 2, Icon: CarIcon },
  { title: "Returning the Worn Dress in Sevilla", level: 2, Icon: TagIcon },
  { title: "Small Talk with the Roommate", level: 2, Icon: MugIcon },
  { title: "The Suegra's 3-Hour Lunch", level: 3, Icon: PlateIcon },
  { title: "Picking a Fight in a Buenos Aires Café", level: 2, Icon: FlameIcon },
  { title: "Lost in the Amazonas", level: 3, Icon: CompassIcon },
];

function Dots({ level }) {
  return (
    <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= level ? HEAT[level] : "#d1d1d6" }} />
      ))}
    </div>
  );
}

export default function Scenarios({ nav }) {
  const goTalk = (e) => { e.preventDefault(); nav && nav("talk"); };

  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>NOT THE OWL</div>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 14px 150px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* HEADER ROW · title + spin wheel */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 4px 0" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "#000" }}>🇪🇸 Scenarios</div>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: "#6b6b70", marginTop: 6 }}>
              Pick your fight — or spin for a random real-life scenario to practice your Spanish.
            </div>
          </div>
          <a href="#" onClick={goTalk} style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, textDecoration: "none", WebkitTapHighlightColor: "transparent" }}>
            <div style={{ position: "relative", width: 76, height: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", boxShadow: "0 3px 10px -2px rgba(0,0,0,0.16),0 1px 3px rgba(0,0,0,0.08)" }} />
              <svg width="76" height="76" viewBox="0 0 76 76" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <g stroke="#c7c7cc" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="38" y1="5" x2="38" y2="10" />
                  <line x1="54.5" y1="9.4" x2="52" y2="13.7" />
                  <line x1="66.6" y1="21.5" x2="62.3" y2="24" />
                  <line x1="71" y1="38" x2="66" y2="38" />
                  <line x1="66.6" y1="54.5" x2="62.3" y2="52" />
                  <line x1="54.5" y1="66.6" x2="52" y2="62.3" />
                  <line x1="38" y1="71" x2="38" y2="66" />
                  <line x1="21.5" y1="66.6" x2="24" y2="62.3" />
                  <line x1="9.4" y1="54.5" x2="13.7" y2="52" />
                  <line x1="5" y1="38" x2="10" y2="38" />
                  <line x1="9.4" y1="21.5" x2="13.7" y2="24" />
                  <line x1="21.5" y1="9.4" x2="24" y2="13.7" />
                </g>
              </svg>
              <div style={{ position: "absolute", top: 1, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #ff3b30", zIndex: 2, pointerEvents: "none" }} />
              <div style={{ position: "relative", width: 52, height: 52, borderRadius: "50%", background: "#39FF14", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px -3px rgba(0,0,0,0.25)" }}>
                <SpinArrows size={24} />
              </div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#8e8e93", textTransform: "uppercase" }}>Spin</span>
          </a>
        </div>

        {/* HERO · SCENARIO OF THE DAY */}
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 22, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", padding: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" }}>Scenario of the day</div>
            <WineIcon />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", marginTop: 12, lineHeight: 1.02 }}>The Barcelona Bar</div>
          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.42, color: "#6b6b70", marginTop: 9 }}>
            She's the most beautiful person in the room. You have one shot, one language, and a rapidly closing window. Go.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff3b30" }} />
            ))}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#8e8e93", textTransform: "uppercase", marginLeft: 4 }}>Brutal</span>
          </div>
          <button onClick={goTalk} style={{ width: "100%", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#000", border: "none", borderRadius: 999, padding: "15px 0", cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" }}>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase" }}>Start →</span>
          </button>
        </div>

        {/* LIST HEADER */}
        <div style={{ padding: "6px 4px 0" }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "#a1a1a6", textTransform: "uppercase" }}>Your scenarios</div>
        </div>

        {/* LIST */}
        <div style={{ background: "#ECECEF", border: "1px solid rgba(0,0,0,0.04)", borderRadius: 20, overflow: "hidden" }}>
          {SCENARIOS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.title}
                onClick={goTalk}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 16px", borderBottom: i < SCENARIOS.length - 1 ? "1px solid #d1d1d6" : "none", cursor: "pointer" }}
              >
                <Icon style={{ flex: "none" }} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.title}
                </div>
                <Dots level={s.level} />
              </div>
            );
          })}
        </div>
      </div>

      <TabBar active="scenarios" nav={nav} />
    </>
  );
}
