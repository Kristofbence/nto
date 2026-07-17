// Reusable floating bottom tab bar · iOS 26 inset-pill style.
// Shows on Home / Scenarios / Stats; hidden on Talk (session mode).
import { HomeIcon, MicIcon, FightIcon, BarsIcon } from "./icons";
import { useSettings, langHasTiers } from "../settings";

const TABS = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "talk", label: "Talk", Icon: MicIcon },
  { id: "scenarios", label: "Scenarios", Icon: FightIcon },
  { id: "stats", label: "Stats", Icon: BarsIcon },
];

export default function TabBar({ active = "home", nav }) {
  const { settings } = useSettings();
  // Scenarios are Spanish-only content today; hide the tab for other languages.
  const tabs = langHasTiers(settings.langId)
    ? TABS
    : TABS.filter((t) => t.id !== "scenarios");

  const go = (id) => (e) => {
    e.preventDefault();
    if (nav) nav(id);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 10,
        zIndex: 50, // always above page content (e.g. the spin wheel's pointer)
        fontFamily: "Inter,-apple-system,system-ui,sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.05)",
        borderRadius: 28,
        boxShadow: "0 4px 16px -4px rgba(0,0,0,0.12)",
        padding: "10px 8px",
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const on = active === id;
        return (
          <a
            key={id}
            href="#"
            onClick={go(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
              textDecoration: "none",
              WebkitTapHighlightColor: "transparent",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: on ? "#000" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s ease",
              }}
            >
              <Icon stroke={on ? "#fff" : "#8e8e93"} />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: on ? 700 : 600,
                letterSpacing: "0.01em",
                color: on ? "#000" : "#8e8e93",
              }}
            >
              {label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
