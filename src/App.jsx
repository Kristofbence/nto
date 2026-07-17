// NOT THE OWL · app router shell.
// Holds one piece of state (which screen is showing) and mounts exactly one
// screen at a time. `navigate(id)` is handed to every screen, which forwards it
// to the tab bar and its own controls.
//
// Onboarding shows on first launch (persisted in localStorage); finishing or
// skipping it lands on Home. It can be replayed from Settings → "Replay intro".
import { useState } from "react";
import { SettingsProvider, useSettings, langHasTiers } from "./settings";
import PhoneFrame from "./components/PhoneFrame";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Talk from "./screens/Talk";
import Scenarios from "./screens/Scenarios";
import Wrapped from "./screens/Wrapped";
import Vocabulary from "./screens/Vocabulary";
import Settings from "./screens/Settings";
import Language from "./screens/Language";

const ALLOWED = [
  "onboarding",
  "home",
  "talk",
  "scenarios",
  "stats",
  "vocabulary",
  "settings",
  "language",
];

const ONBOARDED_KEY = "nto.onboarded";

export default function App() {
  const [screen, setScreen] = useState(() =>
    localStorage.getItem(ONBOARDED_KEY) === "1" ? "home" : "onboarding"
  );

  const navigate = (id) => {
    if (!ALLOWED.includes(id)) return;
    // Leaving onboarding for anywhere means it's been seen.
    if (screen === "onboarding" && id !== "onboarding") {
      localStorage.setItem(ONBOARDED_KEY, "1");
    }
    if (id === "onboarding") localStorage.removeItem(ONBOARDED_KEY);
    setScreen(id);
  };

  return (
    <SettingsProvider>
      <PhoneFrame>
        <ScreenHost screen={screen} navigate={navigate} />
      </PhoneFrame>
    </SettingsProvider>
  );
}

// Resolves which screen to render. Scenarios is Spanish-only content and its tab
// is hidden for other languages; if we ever land on it while non-Spanish (a stale
// screen, a future in-place switcher), fall back to Home so nothing orphans.
function ScreenHost({ screen, navigate }) {
  const { settings } = useSettings();
  const effective =
    screen === "scenarios" && !langHasTiers(settings.langId) ? "home" : screen;

  const screens = {
    onboarding: <Onboarding nav={navigate} />,
    home: <Home nav={navigate} />,
    talk: <Talk nav={navigate} />,
    scenarios: <Scenarios nav={navigate} />,
    stats: <Wrapped nav={navigate} />,
    vocabulary: <Vocabulary nav={navigate} />,
    settings: <Settings nav={navigate} />,
    language: <Language nav={navigate} />,
  };

  return screens[effective];
}
