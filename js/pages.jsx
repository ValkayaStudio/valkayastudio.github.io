const { useState } = React;

// ─────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────
function AboutPage() {
    return (
        <main className="page">
            <p className="eyebrow">Who we are</p>
            <h1 className="page-title">We build games<br /><em>players remember</em></h1>
            <p className="page-subtitle">
                Valkaya Studio is an independent mobile game developer focused on tight mechanics,
                deep progression, and worlds worth exploring. We're a small team with a big appetite.
            </p>

            <div className="about-hero">
                <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.8, maxWidth: 560 }}>
                    Founded in 2026, we set out to prove that mobile games don't have to feel disposable.
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
                    { num: "2", label: "Games shipped" },
                    // { num: "2M+", label: "Players worldwide" },
                    // { num: "4.7★", label: "Average store rating" },
                    { num: "2026", label: "Founded" },
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

// ─────────────────────────────────────────────
// GAME THUMB ICON
// Reads a 64x64 png from /images/games; falls back to
// an inline SVG glyph (from icons.jsx) if the file is missing.
// ─────────────────────────────────────────────
function GameThumbIcon({ game }) {
    const [failed, setFailed] = useState(false);

    if (failed || !game.icon) {
        return (
            <Icon d={icons[game.iconFallback] || icons.star}
                size={48} strokeWidth={1.5}
                style={{ color: game.iconColor, filter: `drop-shadow(0 0 12px ${game.iconColor}66)` }} />
        );
    }

    return (
        <img
            src={game.icon}
            alt={`${game.name} icon`}
            width={64}
            height={64}
            loading="lazy"
            style={{ filter: `drop-shadow(0 0 12px ${game.iconColor}66)` }}
            onError={() => setFailed(true)}
        />
    );
}

// ─────────────────────────────────────────────
// GAMES PAGE
// ─────────────────────────────────────────────
function GamesPage() {
    return (
        <main className="page">
            <p className="eyebrow">Our portfolio</p>
            <h1 className="page-title">Our <em>games</em></h1>
            <p className="page-subtitle">
                Our first racing game is built to be played in short sessions
                and remembered for long ones — with more titles on the way.
            </p>

            <div className="games-grid">
                {GAMES.map(game => (
                    <div className="game-card" key={game.id}>
                        <div className="game-thumb" style={{ background: game.gradient }}>
                            <div className="game-thumb-icon">
                                <GameThumbIcon game={game} />
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
                <button onClick={() => { }} style={{ color: 'var(--lavender)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
                    Follow us for updates.
                </button>
            </p>
        </main>
    );
}

// ─────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────
function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('https://formspree.io/f/xpqgyeyn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            console.error('Form submission failed:', err);
        } finally {
            setLoading(false);
        }
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
                        { icon: icons.contact, label: "General enquiries", value: <a href="mailto:dev@indvalkayastudios.com">dev@indvalkayastudios.com</a> },
                        // { icon: icons.shield, label: "Business & partnerships", value: <a href="mailto:biz@voidpixel.studio">biz@voidpixel.studio</a> },
                        // { icon: icons.star, label: "Press & media", value: <a href="mailto:press@voidpixel.studio">press@voidpixel.studio</a> },
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
// PRIVACY POLICY PAGE
// ─────────────────────────────────────────────
const PRIVACY_COMPANY = "Valkaya Studio";
const PRIVACY_EMAIL = "dev@indvalkayastudios.com";
// Update this date every time the policy text changes
const PRIVACY_LAST_UPDATED = "October 23, 2026";

const PRIVACY_GAMES = [
    {
        id: "rush-to-race",
        name: "Rush to Race : Hill Racing",
    },
    {
        id: "race-riot",
        name: "Race Riot : Car Crash",
    },
];

// VERIFY: keep this list identical to the SDKs inside each build (and to your Play Data safety form).
// A game can override it by adding its own `sdks` array in PRIVACY_GAMES.
const PRIVACY_SDKS = [
    {
        name: "Google Firebase",
        purpose: "analytics and crash/performance diagnostics",
        url: "https://firebase.google.com/support/privacy",
    },
    {
        name: "Google AdMob",
        purpose: "showing and measuring ads",
        url: "https://policies.google.com/technologies/partner-sites",
    },
    {
        name: "Unity Ads",
        purpose: "showing and measuring ads",
        url: "https://unity.com/legal/privacy-policy",
    },
];

function PrivacyPolicyBody({ game }) {
    const subject = game ? <strong>{game.name}</strong> : "our mobile games";
    const sdks = (game && game.sdks) || PRIVACY_SDKS;
    const mail = <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

    return (
        <>
            <p><em>Last updated: {PRIVACY_LAST_UPDATED}</em></p>

            <h2>Introduction and Scope</h2>
            <p>
                This Privacy Policy explains how {PRIVACY_COMPANY} ("we", "us", "our") collects, uses, shares, and protects
                information when you play {subject}, and when you contact us through this website. By using the game you
                acknowledge this policy. Where the law requires your consent, we ask for it separately (see "Consent and Your
                Choices" below).
            </p>

            <h2>Information We Collect</h2>
            <h3>Collected automatically when you play</h3>
            <ul>
                <li>
                    <strong>Device and app information:</strong> device model, operating system and version, language,
                    app version, screen settings, and network type.
                </li>
                <li>
                    <strong>Identifiers:</strong> your device's advertising identifier (Google Advertising ID on Android,
                    IDFA on iOS, where you allow it) and an app or installation identifier generated by our analytics service.
                </li>
                <li>
                    <strong>Usage data:</strong> gameplay events, levels played, session length, settings chosen, and
                    in-game actions.
                </li>
                <li>
                    <strong>Ad interaction data:</strong> ads shown, ad views, and clicks.
                </li>
                <li>
                    <strong>Approximate location:</strong> your country or region, derived from your IP address. We do not
                    collect precise (GPS) location.
                </li>
                <li>
                    <strong>Crash and performance data:</strong> crash logs and diagnostics that help us fix bugs.
                </li>
            </ul>

            <h3>Information you give us</h3>
            <p>
                If you contact us through our website form or by email, we receive the details you send us, such as your name,
                email address, and message. The website form is processed by our form provider, Formspree.
            </p>

            <h3>Information we do not collect</h3>
            {/* VERIFY every sentence in this block against what the game really does */}
            <p>
                The game does not require an account, and we do not ask for your name, email address, contacts, photos,
                microphone, or precise location in order to play.
            </p>

            <h2>How We Use Information</h2>
            <ul>
                <li>To provide, operate, and maintain the game.</li>
                <li>To understand how the game is used and to improve gameplay, balance, and performance.</li>
                <li>To find and fix crashes, bugs, and security problems.</li>
                <li>To show ads and measure how well they perform.</li>
                <li>To respond to your messages and support requests.</li>
                <li>To comply with legal obligations and to enforce our rights.</li>
            </ul>

            <h2>Legal Bases (EEA, UK, and Similar Regions)</h2>
            <p>
                Where laws such as the GDPR apply, we rely on: <strong>your consent</strong> for analytics, advertising
                identifiers, and personalized ads; <strong>our legitimate interests</strong> in keeping the game secure and
                working properly (for example, crash reports); <strong>performance of a contract</strong> to provide the game
                you chose to play; and <strong>legal obligation</strong> where we must keep or disclose information by law.
            </p>

            <h2>Consent and Your Choices</h2>
            <ul>
                <li>
                    <strong>In-game choice:</strong> when you first open the game we ask whether you agree to analytics and
                    advertising data use. The game does not start that collection until you answer. You can turn these
                    privacy options on or off at any time in the game's Settings screen.
                </li>
                <li>
                    <strong>Android:</strong> you can reset your advertising ID or opt out of ad personalization in
                    Settings &gt; Google &gt; Ads.
                </li>
                <li>
                    <strong>iOS:</strong> you can turn off tracking per app in Settings &gt; Privacy &amp; Security &gt; Tracking.
                </li>
                <li>
                    Opting out of personalized ads does not remove ads from the game; the ads you see will just be less relevant.
                </li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
                We use third-party services that may collect information directly from your device. They process it under
                their own privacy policies:
            </p>
            <ul>
                {sdks.map((sdk) => (
                    <li key={sdk.name}>
                        <strong>{sdk.name}</strong> for {sdk.purpose}. {" "}
                        <a href={sdk.url} target="_blank" rel="noopener noreferrer">Privacy information</a>
                    </li>
                ))}
                <li>
                    <strong>Formspree</strong> for processing messages sent through our website form.{" "}
                    <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy information</a>
                </li>
            </ul>
            <p>
                Google's general privacy policy is available at{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
                We are not responsible for the privacy practices of third parties.
            </p>
            {/* VERIFY: if Essential Kit's billing, game-services, cloud or notification features are enabled,
                add the underlying platform services (Google Play, Game Center, etc.) to this section */}
            <p>
                The game also uses VoxelBusters Essential Kit, a Unity plugin that gives the game access to native device
                features. It is not an analytics or advertising service.
            </p>

            <h2>How We Share Information</h2>
            <ul>
                <li><strong>Service providers</strong> that help us run analytics, crash reporting, advertising, and communications, as listed above.</li>
                <li><strong>Advertising partners</strong>, which receive advertising identifiers and ad interaction data so ads can be served and measured.</li>
                <li><strong>Legal and safety reasons:</strong> when required by law or to protect rights, safety, and security.</li>
                <li><strong>Business changes:</strong> if we merge with, or sell part of our business to, another company, information may be transferred as part of that deal.</li>
            </ul>
            <p>
                We do not sell your personal information in exchange for money. Sharing advertising identifiers with ad partners
                may count as a "sale" or "sharing" under some laws (such as California's); you can opt out as described in
                "Consent and Your Choices" and "Your Rights".
            </p>

            <h2>International Data Transfers</h2>
            <p>
                Our service providers may process information in countries other than yours, including countries that may have
                different data protection laws. Where required, we rely on safeguards such as standard contractual clauses or
                the providers' own transfer mechanisms.
            </p>

            <h2>Data Retention</h2>
            <ul>
                {/* VERIFY: set the same retention period in the Firebase console */}
                <li>Analytics and crash data are kept for up to 14 months, then automatically deleted.</li>
                <li>Messages you send us are kept for as long as needed to respond and for a reasonable period afterwards.</li>
                <li>Data held by advertising partners follows their own retention policies.</li>
                <li>We may keep information longer where the law requires it, or to resolve disputes and enforce our agreements.</li>
            </ul>

            <h2>Data Security</h2>
            <p>
                We use reasonable technical and organizational measures to protect information, including encrypted connections
                (HTTPS) for data sent from the game to our services. No method of transmission or storage is completely secure,
                so we cannot guarantee absolute security.
            </p>

            <h2>Your Rights</h2>
            <p>
                Depending on where you live, you may have the right to: know what information we hold about you; access and
                receive a copy of it; correct it; delete it; restrict or object to certain processing; withdraw consent at any
                time (without affecting processing done before you withdrew); and not be discriminated against for using
                these rights.
            </p>
            <ul>
                <li>
                    <strong>EEA and UK:</strong> you may also lodge a complaint with your local data protection authority.
                </li>
                <li>
                    <strong>California and other US states:</strong> you may opt out of the "sale" or "sharing" of personal
                    information for advertising by changing your choice in the game's Settings, or by emailing us.
                </li>
                <li>
                    <strong>Other regions:</strong> local data protection laws may give you additional rights. Contact us and
                    we will do our best to honor them.
                </li>
            </ul>
            <h3>How to make a request, including deletion</h3>
            <p>
                Email {mail} with the subject "Privacy request", the name of the game, and what you would like us to do.
                Because the game does not use accounts, we may ask for your device's advertising ID or app installation ID
                to find your data, and we may need to confirm that the request is yours. We aim to respond within 30 days,
                and in any case within the time required by applicable law.
            </p>

            <h2>Children's Privacy</h2>
            <p>
                {subject === "our mobile games" ? "Our games are" : <>{subject} is</>} suitable for players of all ages and
                is a general audience product. We do not knowingly collect personal information from children under 13 (or
                under the minimum age of digital consent in your country, which can be as high as 16) without the consent
                of a parent or guardian.
            </p>
            {/* VERIFY: keep this paragraph only if the game really has a neutral age screen and really turns off
                personalized ads and the advertising ID for players under the applicable age */}
            <p>
                Where a player tells us that they are under the applicable age, we do not show personalized ads, we do not
                use their advertising identifier, and we limit data collection to what is needed to run the game.
            </p>
            <p>
                If you are a parent or guardian and believe your child has given us personal information, please contact us
                at {mail}. We will delete it and stop any further collection.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
                We may update this policy from time to time. When we do, we will change the "Last updated" date above and, for
                significant changes, tell you in the game or on this website. Please review it periodically.
            </p>

            <h2>Contact Us</h2>
            <p>
                Questions or concerns about this policy? Email us at {mail}.
            </p>
        </>
    );
}

function PrivacyPolicyPage({ subpage }) {
    if (subpage) {
        const game = PRIVACY_GAMES.find(g => g.id === subpage);
        if (!game) {
            return (
                <main className="page">
                    <h1>Privacy Policy</h1>
                    <p>Game not found.</p>
                    <a href="#privacy">Back to Privacy Policy</a>
                </main>
            );
        }
        return (
            <main className="page">
                <h1>{game.name} Privacy Policy</h1>
                <PrivacyPolicyBody game={game} />
                <a href="#privacy">Back to Privacy Policy</a>
            </main>
        );
    }

    return (
        <main className="page">
            <h1>Privacy Policy</h1>
            <p>
                We value your privacy. This policy explains how we collect, use, and protect your information when you use
                our mobile games. For the policy of a specific game, choose it below:
            </p>
            <ul>
                {PRIVACY_GAMES.map((game) => (
                    <li key={game.id}>
                        <a href={`#privacy/${game.id}`}>{game.name} Privacy Policy</a>
                    </li>
                ))}
            </ul>
            <PrivacyPolicyBody />
        </main>
    );
}
