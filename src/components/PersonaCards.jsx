// PERSONA CARDS · the one mechanic for the Personality choice (tutor tier).
// Shared by Onboarding and Settings so the pick looks and behaves identically.
// Tier words are crimson per the design system; there is no amber here.
//
// Three visual states, driven by the persona's two flags (see personas.js):
//   selectable (built && !locked) — full opacity, tappable, highlights when current
//   locked     (Pro-gated)        — 0.55 opacity, LOCK icon, inert   (es Profe only)
//   unbuilt    (!built)           — 0.40 opacity, NO icon, inert, no tap feedback
// The lock icon means "Pro unlocks this" — so it must NEVER appear on an unbuilt
// tier, or it would imply the tier is purchasable. Unbuilt is just dimmed.
import { personasFor } from "../personas";
import { LockIcon } from "./icons";

const SELECTED_FILL = "rgba(255,59,48,0.10)";
const cardBase = {
  borderRadius: 20,
  padding: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
  transition: "background 0.15s ease",
  border: "1px solid rgba(0,0,0,0.05)",
};

export default function PersonaCards({ langId = "es", value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {personasFor(langId).map((p, i) => {
        const selectable = p.built && !p.locked;
        const on = i === value && selectable;
        const opacity = !p.built ? 0.4 : p.locked ? 0.55 : 1;
        return (
          <div
            key={p.tier}
            onClick={selectable ? (e) => { e.preventDefault(); onChange(i); } : undefined}
            style={{ ...cardBase, cursor: selectable ? "pointer" : "default", background: on ? SELECTED_FILL : "#fff", opacity }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff3b30", flex: "none", minWidth: 80 }}>{p.tier}</span>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: "#000" }}>
                  {p.name}
                  {p.origin && <span style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", letterSpacing: 0 }}>{"  "}· {p.origin}</span>}
                </span>
              </div>
              {p.locked && <LockIcon size={15} stroke="#a1a1a6" strokeWidth={2.2} style={{ flex: "none" }} />}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", marginTop: 8, lineHeight: 1.35 }}>{p.sample}</div>
          </div>
        );
      })}
    </div>
  );
}
