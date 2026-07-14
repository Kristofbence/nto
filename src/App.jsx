// NOT THE OWL · app router shell.
// Holds one piece of state (which screen is showing) and mounts exactly one
// screen at a time. `navigate(id)` is handed to every screen, which forwards it
// to the tab bar and its own controls.
//
// Onboarding shows on first launch (persisted in localStorage); finishing or
// skipping it lands on Home. It can be replayed from Settings → "Replay intro".
import { useState } from "react";
import PhoneFrame from "./components/PhoneFrame";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Talk from "./screens/Talk";
import Scenarios from "./screens/Scenarios";
import Wrapped from "./screens/Wrapped";
import Dictionary from "./screens/Dictionary";
import Settings from "./screens/Settings";
import Language from "./screens/Language";

const ALLOWED = [
  "onboarding",
  "home",
  "talk",
  "scenarios",
  "stats",
  "dictionary",
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

  const screens = {
    onboarding: <Onboarding nav={navigate} />,
    home: <Home nav={navigate} />,
    talk: <Talk nav={navigate} />,
    scenarios: <Scenarios nav={navigate} />,
    stats: <Wrapped nav={navigate} />,
    dictionary: <Dictionary nav={navigate} />,
    settings: <Settings nav={navigate} />,
    language: <Language nav={navigate} />,
  };

  return <PhoneFrame>{screens[screen]}</PhoneFrame>;
}
