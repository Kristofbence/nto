# NOT THE OWL

The anti-Duolingo: a voice-first, deadpan-hostile AI language tutor. This is the
working React prototype implemented from the Claude Design handoff (see
`../chats/` for the full design intent and `../project/` for the source mockups).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Stack

- **Vite + React** — a single state-based screen router (`src/App.jsx`); no
  routing library, so it stays simple to maintain.
- **Tailwind CSS** — set up with the brand tokens in `tailwind.config.js`.
  The screens are ported pixel-for-pixel from the inline-styled design
  prototypes, so most styling lives in JSX `style` objects that pull shared
  values from `src/tokens.js` (the single source of truth for colors, cards,
  fonts, shadows).

## Structure

```
src/
  App.jsx              router shell — one screen visible at a time
  tokens.js            centralized design tokens
  index.css            Inter font, global styles, phone-frame + animations
  components/
    PhoneFrame.jsx     390×844 mockup on desktop, fullscreen on mobile
    TabBar.jsx         floating tab bar (Home · Talk · Scenarios · Stats)
    icons.jsx          thin-line SVG icon set
  screens/
    Onboarding.jsx     3-step first-launch flow (Language -> Level -> Tutor dial)
    Home.jsx           base camp
    Talk.jsx           full-screen voice session (chat feed)
    Scenarios.jsx      scenario picker with spin wheel
    Wrapped.jsx        weekly "Roast Wrapped" stats recap
    Dictionary.jsx     words you keep butchering
    Settings.jsx       language, roast-level slider, toggles
    Language.jsx       language selection (Spanish active, rest locked)
```

## Navigation

- Onboarding shows on first launch (persisted in `localStorage`); finishing or
  **Skip** lands on Home. Replay it any time from **Settings -> Replay intro**.
- The tab bar shows on Home / Scenarios / Stats and is **hidden on Talk**
  (session mode). Talk's X exits back to Home.
- Home: mic / scenario START -> Talk; spin wheel -> Scenarios; Dictionary tile ->
  Dictionary; This Week -> Stats; cog -> Settings; flag -> Language.
- Scenarios: any row / START / spin wheel -> Talk.
- Stats: the share icon and green SHARE button trigger the native share sheet
  (with an alert fallback).

## Not wired yet

The mic is a press-to-listen **visual stub** — real voice (Vapi) is a later
stage and needs the provider's SDK/code, per the design transcripts. Skip on the
Talk screen and the Daily-goal / subscription rows are placeholders.
