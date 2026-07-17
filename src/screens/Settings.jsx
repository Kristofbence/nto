// SETTINGS · language, roast-level slider (matches the onboarding tutor dial),
// session toggles, account rows. Ported from Not The Owl Settings.dc.html.
// Adds one on-brand "Replay intro" row to re-run onboarding.
import { useState } from "react";
import { CloseIcon, ChevronRight } from "../components/icons";
import PersonaCards from "../components/PersonaCards";
import { useSettings, LANGS, LEVELS, LANG_TUTORS, langHasTiers } from "../settings";

const LEARN_LEVELS = LEVELS;
// CEFR codes are labels only — the stored levelIdx still maps to the same
// BEGINNER/INTERMEDIATE/ADVANCED value sent to the assistant.
const CEFR = ["A1 · A2", "B1 · B2", "C1 · C2"];

const sectionLabel = { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", padding: "0 4px 8px" };
const groupCard = { background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", overflow: "hidden" };
const rowLabel = { flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: "#000" };

export default function Settings({ nav }) {
  // Personality (roast tier) and learning level come from the shared store.
  const { settings, update } = useSettings();
  const roast = settings.roast;
  const setRoast = (v) => update({ roast: v });
  const learnIdx = settings.levelIdx;
  const cycleLevel = () => update({ levelIdx: (settings.levelIdx + 1) % LEARN_LEVELS.length });
  const hasTiers = langHasTiers(settings.langId);

  // "Show translations" is shared + persisted (read by the Talk screen).
  const translations = settings.showTranslations;
  const setTranslations = (v) => update({ showTranslations: v });
  const [haptics, setHaptics] = useState(true);

  const track = (on) => ({
    flex: "none", width: 48, height: 28, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", position: "relative",
    transition: "background 0.2s ease", outline: "none", WebkitTapHighlightColor: "transparent", background: on ? "#39FF14" : "#d1d1d6",
  });
  const knob = (on) => ({
    position: "absolute", top: 3, left: 3, width: 22, height: 22, borderRadius: "50%", background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "transform 0.2s ease", transform: `translateX(${on ? 20 : 0}px)`,
  });

  const Row = ({ children, last, onClick, cursor }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 16px", borderBottom: last ? "none" : "1px solid #ececef", cursor: cursor || (onClick ? "pointer" : "default") }}>
      {children}
    </div>
  );

  return (
    <>
      {/* APP BAR */}
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #e2e2e7", padding: "56px 20px 13px", background: "#fff" }}>
        <div onClick={(e) => { e.preventDefault(); nav && nav("home"); }} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <CloseIcon size={20} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>SETTINGS</div>
      </div>

      {/* SCROLL BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 16px 26px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* LANGUAGE */}
        <div>
          <div style={sectionLabel}>Language</div>
          <div style={groupCard}>
            <Row onClick={(e) => { e.preventDefault(); nav && nav("language"); }}>
              <div style={rowLabel}>Learning</div>
              <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#8e8e93", whiteSpace: "nowrap" }}>{LANGS[settings.langId].flag} {LANGS[settings.langId].name}</span>
                <ChevronRight />
              </div>
            </Row>
            <Row last onClick={cycleLevel}>
              <div style={rowLabel}>Your level</div>
              <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontWeight: 600, color: "#8e8e93" }}>{CEFR[learnIdx]}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>{LEARN_LEVELS[learnIdx]}</span>
                <ChevronRight />
              </div>
            </Row>
          </div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 8, padding: "0 4px", lineHeight: 1.35 }}>
            One language at a time. Multiple languages? That's a pro thing.
          </div>
        </div>

        {/* PERSONALITY — the tutor tier as four cards (same mechanic as
            onboarding; one decision, one control). Single-tutor languages have
            one persona, shown as a read-only row. */}
        {hasTiers ? (
          <div>
            <div style={sectionLabel}>Personality</div>
            <PersonaCards value={roast} onChange={setRoast} />
          </div>
        ) : (
          <div>
            <div style={sectionLabel}>Tutor</div>
            <div style={groupCard}>
              <Row last cursor="default">
                <div style={rowLabel}>Tutor</div>
                <span style={{ flex: "none", fontSize: 15, fontWeight: 600, color: "#8e8e93", whiteSpace: "nowrap" }}>
                  {(LANG_TUTORS[settings.langId] || {}).name}
                </span>
              </Row>
            </div>
          </div>
        )}

        {/* SESSION */}
        <div>
          <div style={sectionLabel}>Session</div>
          <div style={groupCard}>
            <Row cursor="default">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Show translations</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 2 }}>Training wheels. Obviously.</div>
              </div>
              <button onClick={() => setTranslations(!translations)} style={track(translations)}><span style={knob(translations)} /></button>
            </Row>
            <Row cursor="default">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Haptic punishment</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 2 }}>A little buzz when you fail.</div>
              </div>
              <button onClick={() => setHaptics((v) => !v)} style={track(haptics)}><span style={knob(haptics)} /></button>
            </Row>
            <Row last>
              <div style={rowLabel}>Daily goal</div>
              <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#8e8e93", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace" }}>15 min</span>
                <ChevronRight />
              </div>
            </Row>
          </div>
        </div>

        {/* ACCOUNT */}
        <div>
          <div style={sectionLabel}>Account</div>
          <div style={groupCard}>
            <Row><div style={rowLabel}>Manage subscription</div><ChevronRight /></Row>
            <Row><div style={rowLabel}>Restore purchases</div><ChevronRight /></Row>
            <Row onClick={(e) => { e.preventDefault(); nav && nav("onboarding"); }}>
              <div style={rowLabel}>Replay intro</div><ChevronRight />
            </Row>
            <Row last><div style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: "#ff3b30" }}>Sign out</div></Row>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: "#a1a1a6", padding: "2px 12px" }}>Not The Owl · v0.4 · You've been warned.</div>
      </div>
    </>
  );
}
