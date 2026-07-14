// Single source of truth for the user's tutor configuration.
// Holds roast level, learning level, and language; persisted to localStorage so
// it survives reload. Shared across every screen via React context.
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nto.settings";

// Roast tiers, in slider order. Each maps to a persona + its heat color
// (matching the app's green → amber → orange → red scale).
export const TUTORS = [
  { tier: "Nice", name: "Profe", heat: "#34c759" },
  { tier: "Harsh", name: "La Tía", heat: "#f5a623" },
  { tier: "Brutal", name: "El Vecino", heat: "#ff7a1a" },
  { tier: "Merciless", name: "El Patrón", heat: "#ff3b30" },
];

export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const LANGS = {
  es: { name: "Spanish", flag: "🇪🇸" },
  fr: { name: "French", flag: "🇫🇷" },
  it: { name: "Italian", flag: "🇮🇹" },
  de: { name: "German", flag: "🇩🇪" },
  pt: { name: "Portuguese", flag: "🇵🇹" },
};

const DEFAULTS = { roast: 2, levelIdx: 2, langId: "es", showTranslations: true }; // Brutal · Advanced · Spanish

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...DEFAULTS, ...saved };
  } catch {
    return { ...DEFAULTS };
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore quota/availability errors */
    }
  }, [settings]);

  const update = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within <SettingsProvider>");
  return ctx;
}

// Convenience: resolve the full tutor/level/language view for the current settings.
export function useTutorView() {
  const { settings } = useSettings();
  return {
    ...settings,
    tutor: TUTORS[settings.roast],
    levelName: LEVELS[settings.levelIdx],
    lang: LANGS[settings.langId] || LANGS.es,
  };
}
