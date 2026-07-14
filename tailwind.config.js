/** @type {import('tailwindcss').Config} */
// Design tokens are centralized here and mirrored in src/tokens.js for use in
// inline style objects (the screens are ported pixel-for-pixel from the
// Claude Design prototypes, which are inline-style heavy).
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F2F2F7",
        card: "#FFFFFF",
        "card-grey": "#E5E5EA",
        ink: "#000000",
        secondary: "#6B6B70",
        muted: "#8E8E93",
        label: "#A1A1A6",
        red: "#FF3B30",
        amber: "#F5A623",
        green: "#34C759",
        "acid-green": "#39FF14",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "system-ui", "sans-serif"],
        mono: ["SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        card: "20px",
        phone: "44px",
      },
      boxShadow: {
        card: "0 2px 6px rgba(0,0,0,0.09)",
        "card-sm": "0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
