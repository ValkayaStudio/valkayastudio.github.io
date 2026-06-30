# Void Pixel Studio — Website

A production-ready static website with a collapsing sidebar, three pages (About Us, Our Games, Contact), and full mobile support.

## Files

```
game-studio-website/
├── index.html       ← Entry point (loads React via CDN)
├── app.jsx          ← Full React app (sidebar + all pages)
├── app-ads.txt      ← Ad network verification file
├── 404.html         ← SPA redirect for GitHub Pages
└── README.md
```

---

## Customise before publishing

### 1. Studio name & branding
In `index.html`, update:
- `<title>`, `<meta name="description">`, and `<meta property="og:*">` tags

In `app.jsx`, search for `"Void Pixel Studio"` and replace with your studio name.
The logo mark `VP` is in `.logo-mark` — change both letters.

### 2. Games data
Edit the `GAMES` array near the top of `app.jsx`. Each entry has:
```js
{
  id: 1,
  name: "APEX DRIFT",
  genre: "Racing",
  rating: "PEGI 3+",
  status: "live",          // "live" or "coming"
  desc: "...",
  gradient: "linear-gradient(135deg, #1a0533, #0d1a3d)",
  iconColor: "#A78BFA",
  store: "#",              // URL to App Store / Play Store, or null
  trailer: "#",            // YouTube / trailer URL, or null
}
```

### 3. Contact emails
In `ContactPage` inside `app.jsx`, replace:
- `hello@voidpixel.studio`
- `biz@voidpixel.studio`
- `press@voidpixel.studio`

### 4. Contact form backend
The form currently simulates a send with a timeout. For real email delivery, replace the `setTimeout` in `handleSubmit` with one of:

**Formspree (free tier — easiest):**
```js
const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(form),
});
if (res.ok) setSubmitted(true);
```

**EmailJS (free tier):**
```js
await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY');
setSubmitted(true);
```

### 5. app-ads.txt
Replace the placeholder lines with the exact lines from your ad network dashboards:
- **AdMob:** Apps → App settings → app-ads.txt
- **ironSource / LevelPlay:** Monetize → Setup → app-ads.txt
- **AppLovin MAX:** Account → app-ads.txt

---

## Deploy to GitHub Pages (free, recommended)

1. Create a GitHub repo named `yourusername.github.io`
2. Upload all 4 files to the root of the repo
3. Go to Settings → Pages → Source: Deploy from branch → `main` / `root`
4. Your site is live at `https://yourusername.github.io`
5. Set this URL as your Developer Website in Google Play Console and App Store Connect
6. Your `app-ads.txt` will be at `https://yourusername.github.io/app-ads.txt` ✓

**Custom domain (optional):**
- In repo root, add a file named `CNAME` containing `yourdomain.com`
- Point your domain's DNS A records to GitHub's IPs (185.199.108-111.153)

---

## Deploy to Netlify (free, zero config)

1. Go to netlify.com → "Add new site" → "Deploy manually"
2. Drag and drop the entire `game-studio-website` folder
3. Done — instant HTTPS URL provided
4. Optional: connect a custom domain in Site settings

---

## Deploy to Cloudflare Pages (free)

1. Go to pages.cloudflare.com → Create a project → Direct upload
2. Upload all files
3. Your site is live at `yourproject.pages.dev`

---

## Performance notes

- React and Babel are loaded from CDN (unpkg). For maximum performance on a production site, consider bundling with Vite (`npm create vite@latest`) and replacing the CDN scripts with a proper build pipeline. The current setup has no build step and works perfectly for a studio site at this scale.
- All fonts are loaded from Google Fonts. To avoid the external request, download and self-host the Orbitron and Inter font files.
- The Babel `text/babel` transform runs in the browser. For a bundled build, this overhead is eliminated entirely.
