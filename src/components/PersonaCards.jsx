// PERSONA CARDS · the one mechanic for the Personality choice (tutor tier).
// Shared by Onboarding and Settings so the pick looks and behaves identically —
// no second UI to drift. Tier words are crimson per the design system; there is
// no amber here. Nice is locked and not selectable (the lock is the joke).
import { PERSONAS } from "../personas";
import { LockIcon } from "./icons";

const SELECTED_FILL = "rgba(255,59,48,0.10)";
const cardBase = {
  borderRadius: 20,
  padding: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
  transition: "background 0.15s ease",
  border: "1px solid rgba(0,0,0,0.05)",
};

export default function PersonaCards({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {PERSONAS.map((p, i) => {
        const on = i === value;
        const locked = p.locked;
        return (
          <div
            key={p.tier}
            onClick={(e) => { e.preventDefault(); if (!locked) onChange(i); }}
            style={{ ...cardBase, cursor: locked ? "default" : "pointer", background: on ? SELECTED_FILL : "#fff", opacity: locked ? 0.55 : 1 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff3b30", flex: "none", minWidth: 80 }}>{p.tier}</span>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: "#000", whiteSpace: "nowrap" }}>{p.name}</span>
              </div>
              {locked && <LockIcon size={15} stroke="#a1a1a6" strokeWidth={2.2} style={{ flex: "none" }} />}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, fontStyle: "italic", color: "#8e8e93", marginTop: 8, lineHeight: 1.35 }}>{p.sample}</div>
          </div>
        );
      })}
    </div>
  );
}
