// Thin-line monochrome icon set, ported from the design prototypes.
// Every icon takes size/stroke/style so callers match the source exactly.

const base = (size, stroke, strokeWidth, style) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke,
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style,
});

export const MicIcon = ({ size = 24, stroke = "#000", strokeWidth = 2.2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

export const SettingsIcon = ({ size = 21, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const FlameIcon = ({ size = 22, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const BookIcon = ({ size = 20, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

export const ChartIcon = ({ size = 20, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
  </svg>
);

export const ArrowRight = ({ size = 14, stroke = "#fff", strokeWidth = 2.4, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const ArrowUp = ({ size = 12, stroke = "#000", strokeWidth = 3.2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const SpinArrows = ({ size = 24, stroke = "#000", strokeWidth = 2.2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

export const CloseIcon = ({ size = 20, stroke = "#8e8e93", strokeWidth = 2.4, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const ChevronLeft = ({ size = 18, stroke = "#8e8e93", strokeWidth = 2.6, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 16, stroke = "#c7c7cc", strokeWidth = 2.4, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ShareIcon = ({ size = 18, stroke = "#8e8e93", strokeWidth = 2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);

export const SkipIcon = ({ size = 21, stroke = "#000", strokeWidth = 2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" x2="19" y1="5" y2="19" />
  </svg>
);

export const LockIcon = ({ size = 10, stroke = "#a1a1a6", strokeWidth = 2.4, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const CheckIcon = ({ size = 14, stroke = "#fff", strokeWidth = 3, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const TrophyIcon = ({ size = 20, stroke = "#ff3b30", strokeWidth = 2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export const WineIcon = ({ size = 20, stroke = "#8e8e93", strokeWidth = 2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M8 22h8" />
    <path d="M7 10h10" />
    <path d="M12 15v7" />
    <path d="M12 15a5 5 0 0 0 5-5c0-2-.4-4-1-6H8c-.6 2-1 4-1 6a5 5 0 0 0 5 5Z" />
  </svg>
);

export const LanguagesIcon = ({ size = 13, stroke = "#8e8e93", strokeWidth = 2, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

// Tab bar icons
export const HomeIcon = ({ size = 24, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const FightIcon = ({ size = 24, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
    <path d="m13 19 6-6" />
    <path d="m16 16 4 4" />
    <path d="M19 21h2v-2" />
    <path d="M14.5 6.5 18 3h3v3l-3.5 3.5" />
    <path d="m5 14 6 6" />
    <path d="M3 21v-2h2" />
    <path d="m9.5 9.5 1 1" />
  </svg>
);

export const BarsIcon = ({ size = 24, stroke = "#8e8e93", strokeWidth = 1.8, style }) => (
  <svg {...base(size, stroke, strokeWidth, style)}>
    <line x1="6" x2="6" y1="20" y2="12" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="18" x2="18" y1="20" y2="14" />
  </svg>
);

// Scenario list icons (thin-line)
export const PersonIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
);
export const ChatBubblesIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
  </svg>
);
export const ShieldIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </svg>
);
export const DoorIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M18 20V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v16" />
    <path d="M4 20h16" />
    <circle cx="14" cy="12" r="0.9" />
  </svg>
);
export const CarIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
    <circle cx="6.5" cy="16.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </svg>
);
export const TagIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
);
export const MugIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" x2="6" y1="2" y2="4" />
    <line x1="10" x2="10" y1="2" y2="4" />
    <line x1="14" x2="14" y1="2" y2="4" />
  </svg>
);
export const PlateIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <path d="M3 2v7c0 1.1.9 2 2 2a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);
export const CompassIcon = (p) => (
  <svg {...base(p.size ?? 21, p.stroke ?? "#8e8e93", p.strokeWidth ?? 2, p.style)}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);
