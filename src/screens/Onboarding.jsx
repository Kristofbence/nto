// ONBOARDING · first-launch flow: Language → Level → (Tutor, Spanish only).
// Finishing (or Skip) navigates to Home. Ported from Not The Owl Onboarding.dc.html.
import { useState } from "react";
import { ChevronLeft } from "../components/icons";
import PersonaCards from "../components/PersonaCards";
import { useSettings, langHasTiers } from "../settings";

const MONO = "'SF Mono',ui-monospace,Menlo,monospace";

// Four languages. Spanish has the four roast tiers; it/fr/de have one tutor each.
const LANGS = [
  { id: "es", flag: "🇪🇸", name: "Spanish", note: "500M speakers. None impressed." },
  { id: "it", flag: "🇮🇹", name: "Italian", note: "Talk with your hands. Won't help." },
  { id: "fr", flag: "🇫🇷", name: "French", note: "The judgiest of them all." },
  { id: "de", flag: "🇩🇪", name: "German", note: "Compound nouns. Compound suffering." },
];

// Level and persona are INDEPENDENT choices. CEFR codes are labels only — the
// stored index (levelIdx) still maps to BEGINNER/INTERMEDIATE/ADVANCED for {{level}}.
const LEVELS = [
  { label: "Beginner", cefr: "A1 · A2", desc: "I know 'hola' and panic." },
  { label: "Intermediate", cefr: "B1 · B2", desc: "I can order food and lie a little." },
  { label: "Advanced", cefr: "C1 · C2", desc: "I'm fluent-ish and delusional." },
];

const SELECTED_FILL = "rgba(255,59,48,0.10)";

export default function Onboarding({ nav }) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("es");
  const [level, setLevel] = useState(1);
  const [dial, setDial] = useState(2); // Brutal · pre-selected default (Spanish only)
  const { update } = useSettings();

  // Steps: 0 language, 1 level, then 2 tutor ONLY for tiered languages (Spanish).
  // it/fr/de have a single tutor, so their flow is two steps — no persona step.
  const tiered = langHasTiers(lang);
  const lastStep = tiered ? 2 : 1;
  const stepIndices = tiered ? [0, 1, 2] : [0, 1];

  const next = (e) => {
    e.preventDefault();
    if (step < lastStep) { setStep((s) => s + 1); return; }
    update({ roast: tiered ? dial : 2, levelIdx: level, langId: lang });
    nav && nav("home");
  };
  const back = (e) => { e.preventDefault(); if (step > 0) setStep((s) => s - 1); };
  const skip = (e) => { e.preventDefault(); nav && nav("home"); };

  const ctaLabel = step < lastStep ? "Continue →" : "Start suffering →";
  const headline = { fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "#000", lineHeight: 1.14 };
  const subtitle = { fontSize: 14, fontWeight: 500, color: "#6b6b70", marginTop: 8 };
  const cardBase = { borderRadius: 20, padding: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", transition: "background 0.15s ease", border: "1px solid rgba(0,0,0,0.05)" };

  return (
    <>
      {/* CHROME · progress + back/skip */}
      <div style={{ flex: "none", padding: "56px 20px 14px", background: "#fff", borderBottom: "1px solid #e2e2e7" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div onClick={back} style={{ display: "flex", alignItems: "center", cursor: "pointer", transition: "opacity 0.15s ease", opacity: step > 0 ? 1 : 0, pointerEvents: step > 0 ? "auto" : "none" }}>
            <ChevronLeft />
          </div>
          <div onClick={skip} style={{ fontSize: 13, fontWeight: 600, color: "#8e8e93", cursor: "pointer" }}>Skip</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {stepIndices.map((i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, transition: "background 0.2s ease", background: i <= step ? "#000" : "#d1d1d6" }} />
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 20px 20px", display: "flex", flexDirection: "column" }}>
        {/* STEP 1 · LANGUAGE */}
        {step === 0 && (
          <div key="s0" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={headline}>What are you butchering?</div>
              <div style={subtitle}>Pick one. You can barely handle this many.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {LANGS.map((l) => {
                const on = l.id === lang;
                return (
                  <div
                    key={l.id}
                    onClick={(e) => { e.preventDefault(); setLang(l.id); }}
                    style={{ ...cardBase, cursor: "pointer", background: on ? SELECTED_FILL : "#fff", display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{l.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "#000" }}>{l.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 2 }}>{l.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 · LEVEL */}
        {step === 1 && (
          <div key="s1" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={headline}>How bad is it?</div>
              <div style={subtitle}>Be honest. I'll find out in ten seconds anyway.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {LEVELS.map((lv, i) => {
                const on = i === level;
                return (
                  <div
                    key={lv.label}
                    onClick={(e) => { e.preventDefault(); setLevel(i); }}
                    style={{ ...cardBase, cursor: "pointer", background: on ? SELECTED_FILL : "#fff" }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 11, fontFamily: MONO, fontWeight: 600, letterSpacing: "0.02em", color: "#8e8e93" }}>{lv.cefr}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#000", textTransform: "uppercase" }}>{lv.label}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "#000", marginTop: 6 }}>{lv.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 · PERSONALITY — pick your tier (Spanish only; Nice locked) */}
        {step === 2 && (
          <div key="s2" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={headline}>How much mercy do you want?</div>
              <div style={subtitle}>Pick who you're stuck with. You can change it later.</div>
            </div>
            <PersonaCards value={dial} onChange={setDial} />
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ flex: "none", padding: "12px 20px 30px", background: "linear-gradient(to top,#F2F2F7 60%,rgba(242,242,247,0))" }}>
        <button onClick={next} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#39FF14", border: "none", borderRadius: 999, padding: "17px 0", cursor: "pointer", boxShadow: "0 8px 20px -5px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.12)", outline: "none", WebkitTapHighlightColor: "transparent" }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.04em", color: "#000", textTransform: "uppercase" }}>{ctaLabel}</span>
        </button>
      </div>
    </>
  );
}
