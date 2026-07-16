// SETTINGS · language, roast-level slider (matches the onboarding tutor dial),
// session toggles, account rows. Ported from Not The Owl Settings.dc.html.
// Adds one on-brand "Replay intro" row to re-run onboarding.
import { useRef, useState } from "react";
import { CloseIcon, ChevronRight, LockIcon } from "../components/icons";
import { useSettings, LANGS, LEVELS, langHasTiers } from "../settings";

const LEARN_LEVELS = LEVELS;
const ROAST_TIERS = [
  { label: "Nice", note: "Unlock to be treated with respect.", locked: true },
  { label: "Harsh", note: "It'll sigh a lot.", locked: false },
  { label: "Brutal", note: "The default. It remembers everything.", locked: false },
  { label: "Merciless", note: "You asked for this.", locked: false },
];
const HEAT = ["#34c759", "#f5a623", "#ff7a1a", "#ff3b30"];
const STOP_LEFTS = ["12.5%", "37.5%", "62.5%", "87.5%"];
const LABEL_ACTIVE = ["#000000", "#f5a623", "#ff7a1a", "#ff3b30"];

const sectionLabel = { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", padding: "0 4px 8px" };
const groupCard = { background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", overflow: "hidden" };
const rowLabel = { flex: 1, minWidth: 0, fontSize: 15, fontWeight: 600, color: "#000" };

export default function Settings({ nav }) {
  // Roast level and learning level come from the shared, persisted store.
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
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const setRoastFromClientX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let ratio = (clientX - r.left) / r.width;
    ratio = Math.max(0, Math.min(1, ratio));
    setRoast(Math.max(0, Math.min(3, Math.round(ratio * 3))));
  };
  const dragStart = (e) => {
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    setRoastFromClientX(e.clientX);
  };
  const dragMove = (e) => { if (dragging.current) setRoastFromClientX(e.clientX); };
  const dragEnd = () => { dragging.current = false; };

  const track = (on) => ({
    flex: "none", width: 48, height: 28, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", position: "relative",
    transition: "background 0.2s ease", outline: "none", WebkitTapHighlightColor: "transparent", background: on ? "#39FF14" : "#d1d1d6",
  });
  const knob = (on) => ({
    position: "absolute", top: 3, left: 3, width: 22, height: 22, borderRadius: "50%", background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "transform 0.2s ease", transform: `translateX(${on ? 20 : 0}px)`,
  });

  const heat = HEAT[roast];
  const roastThumb = {
    position: "absolute", top: 0, left: STOP_LEFTS[roast], transform: "translateX(-50%)", width: 26, height: 26, borderRadius: "50%",
    background: "#fff", border: `4px solid ${heat}`, boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    transition: "left 0.22s cubic-bezier(0.22,1,0.36,1),border-color 0.2s ease",
  };

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
        {/* LEVEL */}
        <div>
          <div style={sectionLabel}>Level</div>
          <div style={groupCard}>
            <Row last onClick={cycleLevel}>
              <div style={rowLabel}>Your level</div>
              <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#8e8e93" }}>{LEARN_LEVELS[learnIdx]}</span>
                <ChevronRight />
              </div>
            </Row>
          </div>
        </div>

        {/* ROAST LEVEL */}
        <div>
          <div style={sectionLabel}>Roast level</div>
          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", padding: "18px 16px 16px" }}>
            {/* Tiers only apply to Spanish; grey out + explain for single-tutor languages. */}
            <div style={hasTiers ? undefined : { opacity: 0.4, pointerEvents: "none" }}>
              <div ref={trackRef} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} style={{ position: "relative", height: 28, margin: "0 12px", cursor: "pointer", touchAction: "none" }}>
                <div style={{ position: "absolute", top: 11, left: 0, right: 0, height: 7, borderRadius: 4, background: "linear-gradient(90deg,#34c759 0%,#f5a623 52%,#ff3b30 100%)" }} />
                <div style={roastThumb} />
              </div>
              <div style={{ display: "flex", marginTop: 12 }}>
                {ROAST_TIERS.map((t, i) => {
                  const on = i === roast;
                  return (
                    <div key={t.label} onClick={(e) => { e.preventDefault(); setRoast(i); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", transition: "color 0.15s ease", color: on ? LABEL_ACTIVE[i] : "#8e8e93" }}>{t.label}</span>
                        {t.locked && <LockIcon size={10} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {hasTiers ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 14, lineHeight: 1.35 }}>{ROAST_TIERS[roast].note}</div>
                {ROAST_TIERS[roast].locked && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9 }}>
                    <LockIcon size={13} stroke="#ff3b30" strokeWidth={2.2} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#ff3b30" }}>Unlock Nice — Pro</span>
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 14, lineHeight: 1.35 }}>
                One tutor for {LANGS[settings.langId].name} — more tiers coming.
              </div>
            )}
          </div>
        </div>

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
