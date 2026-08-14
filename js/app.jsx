const { useState, useEffect, useCallback } = React;

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
            <img
              src="./images/logo.png"
              alt="Valkaya Studio"
              className="logo-img"
            />
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
          © {new Date().getFullYear()} Valkaya Studio
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
