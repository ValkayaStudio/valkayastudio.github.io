const { useState, useEffect, useCallback } = React;

// ─────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'about', label: 'About Us', icon: icons.about, Page: AboutPage },
    { id: 'games', label: 'Our Games', icon: icons.games, Page: GamesPage },
    { id: 'contact', label: 'Contact', icon: icons.contact, Page: ContactPage },
    { id: 'privacy', label: 'Privacy Policy', icon: icons.shield, Page: PrivacyPolicyPage },
];

// ─────────────────────────────────────────────
// HASH ROUTING  (#page  or  #page/subpage)
// ─────────────────────────────────────────────
function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [page, ...rest] = raw.split('/');
    const valid = NAV_ITEMS.some(n => n.id === page);
    let subpage = null;
    if (valid && rest.length) {
        try { subpage = decodeURIComponent(rest.join('/')); }
        catch { subpage = rest.join('/'); }
    }
    return { page: valid ? page : 'about', subpage };
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
function App() {
    const [route, setRoute] = useState(parseHash);
    const active = route.page;
    const subpage = route.subpage;
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

    // Keep the route in sync with the URL hash (direct links, in-page <a href="#...">, back/forward)
    useEffect(() => {
        const onHashChange = () => {
            setRoute(parseHash());
            setMobileOpen(false);
            window.scrollTo(0, 0);
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = useCallback((id) => {
        setMobileOpen(false);
        if (window.location.hash.replace(/^#\/?/, '') === id) {
            setRoute(parseHash());          // same hash -> no hashchange event, update manually
        } else {
            window.location.hash = id;      // triggers hashchange -> setRoute
        }
    }, []);

    const current = NAV_ITEMS.find(n => n.id === active);
    const ActivePage = current?.Page || AboutPage;
    const activeLabel = current?.label || '';

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
                <ActivePage key={active + (subpage ? '-' + subpage : '')} subpage={subpage} />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MOUNT
// ─────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
