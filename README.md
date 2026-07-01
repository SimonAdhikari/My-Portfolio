# Simon Adhikari Portfolio

A responsive personal portfolio for Simon Adhikari, a cybersecurity and networking technology student based in Kathmandu, Nepal. The site is built with semantic HTML, modular CSS, reusable HTML components, and vanilla JavaScript.

## Features

- Responsive single-page portfolio with About, Education, Skills, Projects, and Contact sections.
- Reusable HTML partials for the navigation, footer, project cards, and project modal.
- Data-driven project cards rendered from JavaScript.
- Accessible project detail modal with focus return and Escape-key close support.
- Scroll reveal animations and active navigation highlighting powered by `IntersectionObserver`.

## Project Structure

```text
My-Portfolio/
|-- index.html
|-- dev-server.mjs
|-- css/
|   |-- style.css
|   |-- portfolio.css
|   `-- responsive.css
|-- js/
|   |-- main.js
|   |-- portfolio.js
|   `-- animations.js
|-- components/
|   |-- navbar.html
|   |-- footer.html
|   |-- portfolio-card.html
|   `-- modal.html
`-- README.md
```

## Run Locally

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

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js static server for local development

## Notes

- No frontend framework or build step is required.
- Global styling, portfolio-specific styling, and responsive rules are split across separate CSS files.
- Component loading/navigation, project rendering/modal behavior, and scroll animations are split across separate JavaScript files.
