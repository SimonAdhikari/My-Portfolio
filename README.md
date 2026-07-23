# Simon Adhikari Portfolio

A responsive personal portfolio for **Simon Adhikari**, a cybersecurity and networking technology student based in Kathmandu, Nepal. Built with semantic HTML, modular CSS, reusable HTML components, and vanilla JavaScript - **optimized for maximum performance**.

## ✨ Features

- 📱 **Responsive single-page** portfolio with About, Education, Skills, Projects, and Contact sections
- 🧩 **Reusable HTML partials** for navigation, footer, project cards, and project modal
- 📊 **Data-driven project cards** rendered from JavaScript
- ♿ **Accessible project detail modal** with focus return and Escape-key close support
- 🎬 **Scroll reveal animations** and active navigation highlighting via `IntersectionObserver`
- ⚡ **Performance optimized**: Combined CSS/JS, critical CSS inlined, resource hints, non-blocking fonts
- 🚀 **Zero build step** - deploy anywhere static hosting is supported

## 📁 Project Structure

```text
My-Portfolio/
|-- index.html
|-- dev-server.mjs
|-- css/
|   |-- style.css          # Design tokens, reset, base, loader
|   |-- portfolio.css      # Component styles (hero, projects, skills, modal, etc.)
|   |-- responsive.css     # Media queries (xs -> 2xl)
|   `-- styles.css         # Combined + minified (production)
|-- js/
|   |-- main.js            # Component loader, nav, theme toggle
|   |-- portfolio.js       # Project data, card rendering, modal
|   |-- animations.js      # Scroll reveal (IntersectionObserver)
|   `-- scripts.js         # Combined + minified (production)
|-- components/
|   |-- navbar.html
|   |-- footer.html
|   |-- portfolio-card.html
|   `-- modal.html
`-- README.md
```

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Total HTML** | ~28 KB (gzipped ~7 KB) |
| **Combined CSS** | 31 KB (gzipped ~5 KB) |
| **Combined JS** | 12 KB (gzipped ~4 KB) |
| **Critical CSS (inlined)** | ~3 KB |
| **Font requests** | 2 (Inter + IBM Plex Mono, non-blocking) |
| **Total requests (first load)** | **6** (HTML, CSS, JS, 2 fonts, favicon) |
| **Lighthouse target** | 95+ Performance |

### 🎯 Optimization Summary

| Optimization | Before | After |
|--------------|--------|-------|
| CSS files | 3 | 1 |
| JS files | 3 | 1 |
| Render-blocking resources | 3 CSS + 3 JS | 0 (all async/deferred) |
| Critical path | External CSS | Inlined in `<head>` |
| Font loading | Blocking | `media="print"` + `onload` |

## 🏃 Run Locally

Reusable HTML components are loaded with `fetch`, so serve the folder through a local static server instead of opening `index.html` directly.

From the `My-Portfolio` folder, run:

```bash
node dev-server.mjs
```

Then open:

```text
http://127.0.0.1:8000/
```

You can also use Python's static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## 🚀 Deployment Guides

### △ Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. **Framework Preset**: Other
4. **Build Command**: (leave empty)
5. **Output Directory**: `.` (root)
6. Click **Deploy**.

> Vercel auto-detects static sites. The `vercel.json` below adds SPA fallback and caching headers.

**Optional `vercel.json`** (place in project root):

```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "devCommand": "node dev-server.mjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/css/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/js/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/components/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### 🌐 Netlify

1. Push to GitHub/GitLab/Bitbucket.
2. Go to [app.netlify.com/start](https://app.netlify.com/start) and import the repository.
3. **Build command**: (leave empty)
4. **Publish directory**: `.` (root)
5. Click **Deploy site**.

**Optional `netlify.toml`** (place in project root):

```toml
[build]
  command = ""
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/components/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 📄 GitHub Pages

1. Push to a GitHub repository.
2. Go to **Settings -> Pages**.
3. **Source**: Deploy from a branch.
4. **Branch**: `main` (or `gh-pages`), folder `/ (root)`.
5. Click **Save**.

> GitHub Pages serves from root by default. No build step needed.

**Optional: Custom domain**
- Add `CNAME` file to root with your domain (e.g., `simonadhikari.com`).
- Configure DNS: `CNAME` -> `<username>.github.io` or `A` records -> GitHub Pages IPs.

**Optional: GitHub Actions for auto-deploy** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
```

---

### ☁️ Cloudflare Pages

1. Push to GitHub/GitLab.
2. Go to [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages) -> **Create a project**.
3. Connect your Git repository.
4. **Framework preset**: None
5. **Build command**: (leave empty)
6. **Build output directory**: `.` (root)
7. Click **Save and Deploy**.

**Optional `_headers` file** (place in project root):

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/components/*
  Cache-Control: public, max-age=31536000, immutable
```

**Optional `_redirects` file** (place in project root):

```
/*    /index.html   200
```

---

## 🛠 Tech Stack

- 🏷 **HTML5** - semantic, accessible, SEO-optimized
- 🎨 **CSS3** - custom properties, fluid typography, grid/flexbox
- ⚡ **Vanilla JavaScript** - ES6+, modules pattern, IntersectionObserver
- 🟢 **Node.js** - static server for local development

## 📝 Notes

- **No frontend framework or build step required** - pure static files.
- **Production files**: `css/styles.css` and `js/scripts.js` are the combined/minified versions used in `index.html`.
- **Development files**: `css/style.css`, `css/portfolio.css`, `css/responsive.css` and `js/main.js`, `js/portfolio.js`, `js/animations.js` are kept for readability.
- Component loading/navigation, project rendering/modal behavior, and scroll animations are split across separate JavaScript files in development.
- Global styling, portfolio-specific styling, and responsive rules are split across separate CSS files in development.
- All external requests (fonts, GA) use `preconnect`/`dns-prefetch` and are non-blocking.
