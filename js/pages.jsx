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
        <button onClick={() => {}} style={{ color: 'var(--lavender)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, textDecoration: 'underline' }}>
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
