// NOT THE OWL — centralized design tokens.
// Single source of truth for every "magic value" the screens share, so the
// pixel-perfect ports don't repeat literals. Mirrors tailwind.config.js.

export const colors = {
  bg: "#F2F2F7",
  card: "#FFFFFF",
  cardGrey: "#E5E5EA",
  ink: "#000000",
  secondary: "#6b6b70",
  muted: "#8e8e93",
  label: "#a1a1a6",
  hairline: "#e2e2e7",
  divider: "#ececef",
  red: "#ff3b30",
  green: "#34c759",
  acidGreen: "#39FF14",
  utility: "#dcdce1",
  tick: "#c7c7cc",
  dotEmpty: "#d1d1d6",
};

export const fonts = {
  sans: "Inter,-apple-system,system-ui,sans-serif",
  mono: "'SF Mono',ui-monospace,Menlo,monospace",
};

// The core white card component.
export const cardStyle = {
  background: colors.card,
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
};

// The ambient grey card (greeting / streak / scenario-of-the-day).
export const greyCardStyle = {
  background: colors.cardGrey,
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "20px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
};

// Softer card shadow used on Chat/Stats.
export const cardStyleSoft = {
  background: colors.card,
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

// Tiny uppercase eyebrow label.
export const eyebrow = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: colors.label,
};

export const mono = {
  fontFamily: fonts.mono,
  fontVariantNumeric: "tabular-nums",
};

// Acid-green primary action shadow.
export const primaryShadow =
  "0 8px 20px -5px rgba(0,0,0,0.22),0 2px 6px rgba(0,0,0,0.12)";
