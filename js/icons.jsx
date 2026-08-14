// ─────────────────────────────────────────────
// ICONS (inline SVG components)
// ─────────────────────────────────────────────
const Icon = ({ d, size = 20, strokeWidth = 1.75, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} />)
      : <path d={d} />}
  </svg>
);

const icons = {
  about:    ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  games:    ["M21 6H3", "M10 12H3", "M10 18H3", "M14 8l4 4-4 4"],
  contact:  ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  menu:     ["M3 12h18", "M3 6h18", "M3 18h18"],
  close:    ["M18 6L6 18", "M6 6l12 12"],
  chevron:  "M15 18l-6-6 6-6",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  arrow:    "M5 12h14M12 5l7 7-7 7",
  gamepad:  ["M6 12h4", "M8 10v4", "M15 11h.01", "M18 11h.01", "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"],
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  zap:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};
