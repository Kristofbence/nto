// ONBOARDING · 3-step first-launch flow: Language → Level → Tutor dial.
// Finishing (or Skip) navigates to Home. Ported from Not The Owl Onboarding.dc.html.
import { useRef, useState } from "react";
import { ChevronLeft, LockIcon, CheckIcon } from "../components/icons";
import { useSettings, LANG_TUTORS } from "../settings";

const LANGS = [
  { id: "es", flag: "🇪🇸", name: "Spanish", note: "500M speakers. None impressed." },
  { id: "fr", flag: "🇫🇷", name: "French", note: "The judgiest of them all." },
  { id: "it", flag: "🇮🇹", name: "Italian", note: "Talk with your hands. Won't help." },
  { id: "de", flag: "🇩🇪", name: "German", note: "Compound nouns. Compound suffering." },
  { id: "pt", flag: "🇵🇹", name: "Portuguese", note: "Basically Spanish. It is not." },
];

const LEVELS = [
  { label: "Beginner", desc: "I know 'hola' and panic." },
  { label: "Intermediate", desc: "I can order food and lie a little." },
  { label: "Advanced", desc: "I'm fluent-ish and delusional." },
];

const PERSONAS = [
  { tier: "Nice", type: "THE SWEET ONE", name: "Profe", origin: "Medellín", vibe: "warm", roast: "¡Vas muy bien, mi amor! Sigue así.", locked: true },
  { tier: "Harsh", type: "THE DISAPPOINTED AUNT", name: "La Tía", origin: "Buenos Aires", vibe: "sassy", roast: "Otra vez ese error… pero bueno, algún día aprendes.", locked: false },
  { tier: "Brutal", type: "THE DEADPAN NEIGHBOR", name: "El Vecino", origin: "Madrid", vibe: "deadpan", roast: "Dijiste eso con toda confianza. Estaba mal. Terrifying.", locked: false },
  { tier: "Merciless", type: "THE STREET BOSS", name: "El Patrón", origin: "CDMX", vibe: "savage", roast: "¿Neta, güey? Mi abuela habla mejor y está dormida.", locked: false },
];

const HEAT = ["#34c759", "#f5a623", "#ff7a1a", "#ff3b30"];
const STOP_LEFTS = ["12.5%", "37.5%", "62.5%", "87.5%"];
const LABEL_ACTIVE = ["#000000", "#f5a623", "#ff7a1a", "#ff3b30"];
const TINT = { 0: "rgba(52,199,89,0.14)", 1: "rgba(245,166,35,0.16)", 2: "rgba(255,122,26,0.16)", 3: "rgba(255,59,48,0.14)" };

export default function Onboarding({ nav }) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("es");
  const [level, setLevel] = useState(1);
  const [dial, setDial] = useState(2);
  const { update } = useSettings();
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let ratio = (clientX - r.left) / r.width;
    ratio = Math.max(0, Math.min(1, ratio));
    setDial(Math.max(0, Math.min(3, Math.round(ratio * 3))));
  };
  const dragStart = (e) => {
    dragging.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    setFromClientX(e.clientX);
  };
  const dragMove = (e) => { if (dragging.current) setFromClientX(e.clientX); };
  const dragEnd = () => { dragging.current = false; };

  const spanish = lang === "es"; // only Spanish has tiers today

  const next = (e) => {
    e.preventDefault();
    if (step < 2) { setStep((s) => s + 1); return; }
    if (spanish && dial === 0) { alert("Paywall\n\nUnlock Nice — Pro"); return; }
    // Persist the chosen tutor config to the shared store before entering the app.
    update({ roast: spanish ? dial : 2, levelIdx: level, langId: lang });
    nav && nav("home");
  };
  const back = (e) => { e.preventDefault(); if (step > 0) setStep((s) => s - 1); };
  const skip = (e) => { e.preventDefault(); nav && nav("home"); };

  const heat = HEAT[dial];
  const persona = PERSONAS[dial];
  const thumbStyle = {
    position: "absolute", top: 1, left: STOP_LEFTS[dial], transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%",
    background: "#fff", border: `4px solid ${heat}`, boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    transition: "left 0.22s cubic-bezier(0.22,1,0.36,1),border-color 0.2s ease",
    ...(dial === 2 ? { animation: "ntoKnob 2s ease-in-out infinite" } : {}),
  };
  const ctaLabel = step < 2 ? "Continue →" : spanish && dial === 0 ? "Unlock Nice · Pro" : "Start suffering →";

  const headline = { fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "#000", lineHeight: 1.14 };
  const subtitle = { fontSize: 14, fontWeight: 500, color: "#6b6b70", marginTop: 8 };

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
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, transition: "background 0.2s ease", background: i <= step ? "#000" : "#d1d1d6" }} />
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="nto-scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 20px 20px", display: "flex", flexDirection: "column" }}>
        {/* STEP 1 · LANGUAGE */}
        {step === 0 && (
          <div key="s1" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <div style={headline}>What are you butchering?</div>
              <div style={subtitle}>Pick one. You can barely handle this many.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LANGS.map((l) => {
                const on = l.id === lang;
                return (
                  <div
                    key={l.id}
                    onClick={(e) => { e.preventDefault(); setLang(l.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", cursor: "pointer", transition: "border-color 0.15s ease", background: "#fff",
                      ...(on ? { border: "2px solid #000", padding: "14px 15px" } : { border: "1px solid rgba(0,0,0,0.05)", padding: "15px 16px" }),
                    }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{l.flag}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "#000" }}>{l.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 2 }}>{l.note}</div>
                    </div>
                    <div style={{ flex: "none", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s ease", background: on ? "#000" : "transparent", border: on ? "none" : "2px solid #d1d1d6" }}>
                      {on && <CheckIcon size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", padding: "0 2px", lineHeight: 1.35 }}>One at a time. Juggling languages is a pro move.</div>
          </div>
        )}

        {/* STEP 2 · LEVEL */}
        {step === 1 && (
          <div key="s2" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 18 }}>
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
                    style={{ borderRadius: 20, padding: 16, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.09)", transition: "all 0.15s ease", background: "#fff", border: on ? "2px solid #000" : "1px solid rgba(0,0,0,0.05)" }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase" }}>{lv.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "#000", marginTop: 6 }}>{lv.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 · TUTOR — single tutor for non-Spanish languages */}
        {step === 2 && !spanish && (
          <div key="s3n" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={headline}>Meet your tutor.</div>
              <div style={subtitle}>One tutor for this language — more tiers coming.</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", padding: 18 }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#000" }}>
                {(LANG_TUTORS[lang] && LANG_TUTORS[lang].name) || "Your tutor"}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 6 }}>
                {LANGS.find((l) => l.id === lang)?.name} · your neighbor, unimpressed
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#8e8e93", marginTop: 14, lineHeight: 1.4 }}>
                Roast tiers (Harsh / Brutal / Merciless) are Spanish-only for now.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 · TUTOR DIAL (Spanish) */}
        {step === 2 && spanish && (
          <div key="s3" style={{ animation: "ntoFade 0.35s ease both", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={headline}>Choose your suffering.</div>
              <div style={subtitle}>How much roasting can you take?</div>
            </div>

            {/* LIVE PREVIEW CARD */}
            <div key={persona.type} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.09)", padding: 18, animation: "ntoFade 0.3s ease both" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#000", lineHeight: 1.1 }}>{persona.type}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: heat, background: TINT[dial], borderRadius: 6, padding: "2px 7px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{persona.tier}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8e8e93", marginTop: 6 }}>{persona.name} · {persona.origin} · {persona.vibe}</div>
              <div style={{ background: "#E5E5EA", borderRadius: "16px 16px 16px 4px", padding: "13px 15px", marginTop: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "#a1a1a6", textTransform: "uppercase", marginBottom: 5 }}>A taste:</div>
                <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.34, letterSpacing: "-0.01em", color: "#000" }}>{persona.roast}</div>
              </div>
              {persona.locked && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                  <LockIcon size={14} stroke="#ff3b30" strokeWidth={2.2} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#ff3b30", lineHeight: 1.3 }}>Unlock Nice — being treated with respect is a Pro feature.</span>
                </div>
              )}
            </div>

            {/* MEANNESS SLIDER */}
            <div style={{ padding: "8px 2px 0" }}>
              <div ref={trackRef} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={dragEnd} style={{ position: "relative", height: 30, margin: "16px 14px 0", cursor: "pointer", touchAction: "none" }}>
                <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 7, borderRadius: 4, background: "linear-gradient(90deg,#34c759 0%,#f5a623 52%,#ff3b30 100%)" }} />
                <div style={thumbStyle} />
              </div>
              <div style={{ display: "flex", marginTop: 12 }}>
                {PERSONAS.map((p, i) => {
                  const on = i === dial;
                  return (
                    <div key={p.tier} onClick={(e) => { e.preventDefault(); setDial(i); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", transition: "color 0.15s ease", color: on ? LABEL_ACTIVE[i] : "#8e8e93" }}>{p.tier}</span>
                        {p.locked && <LockIcon size={10} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
