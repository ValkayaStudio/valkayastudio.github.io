const { useState, useEffect, useRef, useCallback } = React;

// ─────────────────────────────────────────────
// ICONS (inline SVG components)
// ─────────────────────────────────────────────
const Icon = ({ d, size = 20, strokeWidth = 1.75 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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

// ─────────────────────────────────────────────
// STYLES (CSS-in-JS as template literal injected once)
// ─────────────────────────────────────────────
const CSS = `
/* ── Layout ── */
.layout { display: flex; min-height: 100vh; }

/* ── Sidebar ── */
.sidebar {
  position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  width: var(--sidebar-w);
  background: var(--panel);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  transition: width var(--transition);
  overflow: hidden;
}
.sidebar.collapsed { width: var(--sidebar-collapsed); }

.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 16px 20px 20px;
  border-bottom: 1px solid var(--border);
  min-height: 72px;
  flex-shrink: 0;
}
.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; overflow: hidden; white-space: nowrap;
}
.logo-mark {
  width: 32px; height: 32px; flex-shrink: 0;
  background: var(--accent);
  border-radius: 8px;
  display: grid; place-items: center;
  font-family: 'Orbitron', monospace;
  font-size: 13px; font-weight: 900;
  color: #fff; letter-spacing: -1px;
}
.logo-text {
  font-family: 'Orbitron', monospace;
  font-size: 11px; font-weight: 700;
  color: var(--text);
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-transform: uppercase;
}
.logo-text span { display: block; color: var(--lavender); font-weight: 400; }

.toggle-btn {
  background: none; border: none; cursor: pointer;
  color: var(--text-muted); padding: 4px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 6px; flex-shrink: 0;
  transition: color 0.2s, background 0.2s;
}
.toggle-btn:hover { color: var(--text); background: var(--panel2); }
.toggle-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* ── Nav ── */
.nav { flex: 1; padding: 16px 10px; overflow-y: auto; }
.nav-label {
  font-size: 9px; font-weight: 600; letter-spacing: 0.15em;
  color: var(--text-muted); text-transform: uppercase;
  padding: 0 10px; margin-bottom: 6px; margin-top: 8px;
  white-space: nowrap; overflow: hidden;
  opacity: 1; transition: opacity var(--transition);
}
.sidebar.collapsed .nav-label { opacity: 0; }

.nav-item {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 14px; font-weight: 500;
  margin-bottom: 2px;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  border: none; background: none; width: 100%; text-align: left;
}
.nav-item:hover { background: var(--panel2); color: var(--text); }
.nav-item.active {
  background: var(--accent-dim);
  color: var(--accent-glow);
}
.nav-item.active::before {
  content: '';
  position: absolute; left: 0; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 60%;
  background: var(--accent-glow);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px var(--accent-glow);
}
.nav-item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.nav-icon { flex-shrink: 0; }
.nav-text {
  opacity: 1; transition: opacity var(--transition);
  overflow: hidden;
}
.sidebar.collapsed .nav-text { opacity: 0; width: 0; }

/* Tooltip for collapsed state */
.nav-tooltip {
  position: absolute; left: calc(var(--sidebar-collapsed) + 8px); top: 50%;
  transform: translateY(-50%);
  background: var(--panel2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 13px; font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 200;
}
.sidebar.collapsed .nav-item:hover .nav-tooltip { opacity: 1; }

/* ── Sidebar footer ── */
.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap; overflow: hidden;
  opacity: 1; transition: opacity var(--transition);
}
.sidebar.collapsed .sidebar-footer { opacity: 0; }

/* ── Main ── */
.main {
  flex: 1;
  margin-left: var(--sidebar-w);
  transition: margin-left var(--transition);
  min-height: 100vh;
  display: flex; flex-direction: column;
}
.main.sidebar-collapsed { margin-left: var(--sidebar-collapsed); }

/* ── Top bar (mobile) ── */
.topbar {
  display: none;
  align-items: center; gap: 12px;
  padding: 0 20px;
  height: 60px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 90;
}
.topbar-title {
  font-family: 'Orbitron', monospace;
  font-size: 13px; font-weight: 700;
  color: var(--text);
  letter-spacing: 0.06em;
}

/* ── Page content ── */
.page {
  flex: 1;
  padding: 48px 48px 64px;
  max-width: 1000px;
  width: 100%;
  animation: pageIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes pageIn {
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Section heading ── */
.eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
  color: var(--accent-glow); text-transform: uppercase;
  margin-bottom: 10px;
}
.page-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 900;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.page-title em {
  font-style: normal;
  color: transparent;
  background: linear-gradient(135deg, var(--accent-glow), var(--lavender));
  -webkit-background-clip: text; background-clip: text;
}
.page-subtitle {
  font-size: 17px; font-weight: 400;
  color: var(--text-muted);
  max-width: 560px;
  margin-bottom: 40px;
  line-height: 1.7;
}
.divider {
  height: 1px;
  background: linear-gradient(90deg, var(--accent-dim), transparent);
  margin: 40px 0;
}

/* ── About page ── */
.about-hero {
  background: linear-gradient(135deg, var(--panel) 0%, #1A1040 100%);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}
.about-hero::before {
  content: 'VP';
  position: absolute; right: -20px; top: -20px;
  font-family: 'Orbitron', monospace;
  font-size: 140px; font-weight: 900;
  color: var(--accent);
  opacity: 0.05;
  line-height: 1;
  pointer-events: none;
}
.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 32px;
}
.stat-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  transition: border-color 0.2s, transform 0.2s;
}
.stat-card:hover { border-color: var(--accent-dim); transform: translateY(-2px); }
.stat-num {
  font-family: 'Orbitron', monospace;
  font-size: 32px; font-weight: 900;
  color: var(--accent-glow);
  line-height: 1;
  margin-bottom: 6px;
}
.stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

.value-list { list-style: none; margin-top: 24px; display: flex; flex-direction: column; gap: 14px; }
.value-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 18px 20px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.value-icon {
  width: 36px; height: 36px; flex-shrink: 0;
  background: var(--accent-dim);
  border-radius: 8px;
  display: grid; place-items: center;
  color: var(--accent-glow);
}
.value-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
.value-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

/* ── Games page ── */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 8px;
}
.game-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  cursor: default;
}
.game-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(124, 58, 237, 0.2);
}
.game-thumb {
  width: 100%; aspect-ratio: 16/9;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.game-thumb-icon { position: relative; z-index: 1; opacity: 0.9; }
.game-body { padding: 20px; }
.game-badges { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
.badge {
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid;
}
.badge-genre { color: var(--lavender); border-color: var(--accent-dim); background: rgba(124,58,237,0.12); }
.badge-rating { color: #86efac; border-color: #14532d; background: rgba(20,83,45,0.3); }
.badge-status-live { color: #6ee7b7; border-color: #065f46; background: rgba(6,95,70,0.3); }
.badge-status-coming { color: var(--lavender); border-color: var(--accent-dim); background: rgba(124,58,237,0.15); }
.game-name {
  font-family: 'Orbitron', monospace;
  font-size: 16px; font-weight: 700;
  color: var(--text); margin-bottom: 6px;
}
.game-desc { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
.game-actions { display: flex; gap: 8px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px; font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  text-decoration: none;
  border: none;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover { background: var(--accent-glow); box-shadow: 0 0 20px rgba(124,58,237,0.4); }
.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.btn-ghost:hover { border-color: var(--accent-dim); color: var(--text); }
.btn:focus-visible { outline: 2px solid var(--accent-glow); outline-offset: 2px; }
.btn-lg { padding: 13px 28px; font-size: 15px; border-radius: 10px; }

/* ── Contact page ── */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 32px;
  align-items: start;
}
.contact-info { display: flex; flex-direction: column; gap: 16px; }
.contact-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex; align-items: flex-start; gap: 14px;
  transition: border-color 0.2s;
}
.contact-card:hover { border-color: var(--accent-dim); }
.contact-card-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  background: var(--accent-dim);
  border-radius: 10px;
  display: grid; place-items: center;
  color: var(--accent-glow);
}
.contact-card-label { font-size: 11px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
.contact-card-value { font-size: 14px; color: var(--text); font-weight: 500; }
.contact-card-value a { color: var(--lavender); text-decoration: none; }
.contact-card-value a:hover { color: var(--accent-glow); text-decoration: underline; }

/* ── Form ── */
.form-panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 32px;
}
.form-title {
  font-family: 'Orbitron', monospace;
  font-size: 18px; font-weight: 700;
  color: var(--text); margin-bottom: 24px;
}
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
label {
  display: block;
  font-size: 12px; font-weight: 600;
  color: var(--text-muted); letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
input, textarea, select {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 14px;
  color: var(--text);
  font-family: 'Inter', sans-serif;
  transition: border-color 0.18s, box-shadow 0.18s;
  outline: none;
  -webkit-appearance: none;
}
input::placeholder, textarea::placeholder { color: var(--text-muted); }
input:focus, textarea:focus, select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
}
textarea { resize: vertical; min-height: 120px; }
select option { background: var(--panel2); }
.form-success {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 24px; text-align: center; gap: 12px;
}
.success-icon {
  width: 56px; height: 56px;
  background: var(--accent-dim);
  border-radius: 50%;
  display: grid; place-items: center;
  color: var(--accent-glow);
  margin-bottom: 8px;
}
.success-title { font-family: 'Orbitron', monospace; font-size: 18px; font-weight: 700; color: var(--text); }
.success-sub { font-size: 14px; color: var(--text-muted); }

/* ── Mobile overlay ── */
.sidebar-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 99;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .topbar { display: flex; }
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition), width var(--transition);
    width: var(--sidebar-w) !important;
  }
  .sidebar.mobile-open { transform: translateX(0); }
  .sidebar-overlay.active { display: block; }
  .main { margin-left: 0 !important; }
  .page { padding: 28px 20px 48px; }
  .contact-layout { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .about-hero { padding: 28px 24px; }
  .toggle-btn.desktop-only { display: none; }
}
@media (max-width: 480px) {
  .games-grid { grid-template-columns: 1fr; }
  .about-grid { grid-template-columns: 1fr 1fr; }
}
`;

// Inject CSS once
if (!document.getElementById('app-styles')) {
  const style = document.createElement('style');
  style.id = 'app-styles';
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const GAMES = [
  {
    id: 1,
    name: "APEX DRIFT",
    genre: "Racing",
    rating: "PEGI 3+",
    status: "live",
    desc: "High-speed street racing across neon-lit city circuits. Master drift mechanics to dominate leaderboards worldwide.",
    gradient: "linear-gradient(135deg, #1a0533 0%, #2d1052 50%, #0d1a3d 100%)",
    iconColor: "#A78BFA",
    store: "#",
    trailer: "#",
  },
  {
    id: 2,
    name: "VOID RUNNER",
    genre: "Endless Runner",
    rating: "PEGI 3+",
    status: "live",
    desc: "Sprint through an endless procedural void. Dodge obstacles, collect relics, and survive as long as you can.",
    gradient: "linear-gradient(135deg, #0d2733 0%, #0a3d2e 100%)",
    iconColor: "#6EE7B7",
    store: "#",
    trailer: "#",
  },
  {
    id: 3,
    name: "STELLAR SIEGE",
    genre: "Strategy",
    rating: "PEGI 7+",
    status: "coming",
    desc: "Command fleets across the galaxy. Build alliances, research tech, and outmaneuver rival commanders in real-time battles.",
    gradient: "linear-gradient(135deg, #1a1a0d 0%, #2d2a0d 100%)",
    iconColor: "#FCD34D",
    store: null,
    trailer: "#",
  },
];

// ─────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────
function AboutPage() {
  return (
    <main className="page">
      <p className="eyebrow">Who we are</p>
      <h1 className="page-title">We build games<br /><em>players remember</em></h1>
      <p className="page-subtitle">
        Void Pixel Studio is an independent mobile game developer focused on tight mechanics,
        deep progression, and worlds worth exploring. We're a small team with a big appetite.
      </p>

      <div className="about-hero">
        <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.8, maxWidth: 560 }}>
          Founded in 2021, we set out to prove that mobile games don't have to feel disposable.
          Every title we ship is built around one question: <strong style={{ color: 'var(--lavender)' }}>
          "Is this worth picking up at 11pm?"</strong> If the answer isn't a clear yes, we go back to the drawing board.
        </p>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 16, maxWidth: 520 }}>
          Our team spans game design, engineering, and live-ops — all working under one roof with one goal:
          games that respect your time and reward your skill.
        </p>
      </div>

      <div className="about-grid">
        {[
          { num: "3", label: "Games shipped" },
          { num: "2M+", label: "Players worldwide" },
          { num: "4.7★", label: "Average store rating" },
          { num: "2021", label: "Founded" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <p className="eyebrow">How we work</p>
      <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
        Our values
      </h2>

      <ul className="value-list">
        {[
          { icon: icons.gamepad, title: "Player first", desc: "Monetisation never compromises fun. We design experiences before revenue streams." },
          { icon: icons.shield, title: "Privacy by default", desc: "Every game we ship meets COPPA and GDPR standards without cutting corners." },
          { icon: icons.zap, title: "Ship, iterate, improve", desc: "We launch lean, listen to players, and push meaningful updates on a tight cadence." },
        ].map(v => (
          <li className="value-item" key={v.title}>
            <div className="value-icon"><Icon d={v.icon} size={18} /></div>
            <div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

function GamesPage() {
  return (
    <main className="page">
      <p className="eyebrow">Our portfolio</p>
      <h1 className="page-title">Our <em>games</em></h1>
      <p className="page-subtitle">
        From frantic racers to cosmic strategy — every title is built to be played in short sessions
        and remembered for long ones.
      </p>

      <div className="games-grid">
        {GAMES.map(game => (
          <div className="game-card" key={game.id}>
            <div className="game-thumb" style={{ background: game.gradient }}>
              <div className="game-thumb-icon">
                <Icon d={game.id === 1 ? icons.zap : game.id === 2 ? icons.arrow : icons.star}
                  size={48} strokeWidth={1.5}
                  style={{ color: game.iconColor, filter: `drop-shadow(0 0 12px ${game.iconColor}66)` }} />
              </div>
            </div>
            <div className="game-body">
              <div className="game-badges">
                <span className="badge badge-genre">{game.genre}</span>
                <span className="badge badge-rating">{game.rating}</span>
                <span className={`badge ${game.status === 'live' ? 'badge-status-live' : 'badge-status-coming'}`}>
                  {game.status === 'live' ? '● Live' : '◎ Coming soon'}
                </span>
              </div>
              <div className="game-name">{game.name}</div>
              <div className="game-desc">{game.desc}</div>
              <div className="game-actions">
                {game.store
                  ? <a className="btn btn-primary" href={game.store}><Icon d={icons.download} size={14} />Download</a>
                  : <a className="btn btn-ghost" href={game.trailer}><Icon d={icons.arrow} size={14} />Watch trailer</a>
                }
                {game.store && <a className="btn btn-ghost" href={game.trailer}><Icon d={icons.arrow} size={14} />Trailer</a>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
        More titles in development.{' '}
        <button onClick={() => {}} style={{ color: 'var(--lavender)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
          Follow us for updates.
        </button>
      </p>
    </main>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    // Simulate async send — replace with your real endpoint / EmailJS / Formspree
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  return (
    <main className="page">
      <p className="eyebrow">Get in touch</p>
      <h1 className="page-title">Let's <em>talk</em></h1>
      <p className="page-subtitle">
        Whether you're a player with feedback, a publisher with a pitch, or a developer looking to join the team — we read every message.
      </p>

      <div className="contact-layout">
        <div className="contact-info">
          {[
            { icon: icons.contact, label: "General enquiries", value: <a href="mailto:hello@voidpixel.studio">hello@voidpixel.studio</a> },
            { icon: icons.shield, label: "Business & partnerships", value: <a href="mailto:biz@voidpixel.studio">biz@voidpixel.studio</a> },
            { icon: icons.star, label: "Press & media", value: <a href="mailto:press@voidpixel.studio">press@voidpixel.studio</a> },
            { icon: icons.zap, label: "Response time", value: "Typically within 2 business days" },
          ].map(c => (
            <div className="contact-card" key={c.label}>
              <div className="contact-card-icon"><Icon d={c.icon} size={18} /></div>
              <div>
                <div className="contact-card-label">{c.label}</div>
                <div className="contact-card-value">{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-panel">
          {submitted ? (
            <div className="form-success">
              <div className="success-icon"><Icon d={icons.star} size={24} /></div>
              <div className="success-title">Message received</div>
              <div className="success-sub">We'll get back to you within 2 business days.</div>
              <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => setSubmitted(false)}>
                Send another
              </button>
            </div>
          ) : (
            <>
              <div className="form-title">Send a message</div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" type="text" placeholder="Alex Chen"
                      value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" placeholder="alex@example.com"
                      value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="general">General enquiry</option>
                    <option value="partnership">Business / partnership</option>
                    <option value="press">Press / media</option>
                    <option value="support">Player support</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Tell us what's on your mind…"
                    value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Sending…' : <><Icon d={icons.arrow} size={16} />Send message</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'about',   label: 'About Us',   icon: icons.about,   Page: AboutPage },
  { id: 'games',   label: 'Our Games',  icon: icons.games,   Page: GamesPage },
  { id: 'contact', label: 'Contact',    icon: icons.contact, Page: ContactPage },
];

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
function App() {
  const [active, setActive] = useState('about');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  // Close mobile sidebar on resize to desktop
  useEffect(() => { if (!isMobile) setMobileOpen(false); }, [isMobile]);

  // Handle hash routing for direct links (optional)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (NAV_ITEMS.find(n => n.id === hash)) setActive(hash);
  }, []);

  const navigate = useCallback((id) => {
    setActive(id);
    setMobileOpen(false);
    window.location.hash = id;
  }, []);

  const ActivePage = NAV_ITEMS.find(n => n.id === active)?.Page || AboutPage;
  const activeLabel = NAV_ITEMS.find(n => n.id === active)?.label || '';

  return (
    <div className="layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar ${collapsed && !isMobile ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <a className="sidebar-logo" href="#about" onClick={e => { e.preventDefault(); navigate('about'); }}>
            <div className="logo-mark">VP</div>
            <div className="logo-text">
              Void Pixel<span>Studio</span>
            </div>
          </a>
          {/* Desktop collapse toggle */}
          {!isMobile && (
            <button
              className="toggle-btn desktop-only"
              onClick={() => setCollapsed(c => !c)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <Icon d={collapsed ? icons.menu : icons.chevron} size={18} />
            </button>
          )}
          {/* Mobile close */}
          {isMobile && (
            <button className="toggle-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <Icon d={icons.close} size={18} />
            </button>
          )}
        </div>

        <nav className="nav" role="navigation">
          <div className="nav-label">Menu</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              title={item.label}
            >
              <span className="nav-icon"><Icon d={item.icon} size={18} /></span>
              <span className="nav-text">{item.label}</span>
              <span className="nav-tooltip" aria-hidden="true">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          © {new Date().getFullYear()} Void Pixel Studio
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={`main ${collapsed && !isMobile ? 'sidebar-collapsed' : ''}`}>
        {/* Mobile topbar */}
        {isMobile && (
          <header className="topbar">
            <button className="toggle-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Icon d={icons.menu} size={20} />
            </button>
            <div className="topbar-title">{activeLabel}</div>
          </header>
        )}

        {/* Page — key forces re-mount animation on nav */}
        <ActivePage key={active} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
