/**
 * portfolio.js — Project data, card rendering, and modal controller
 * Simon Adhikari Portfolio
 */

/** ── Project data ─────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    title:       "Student Management System",
    type:        "C++ Console App",
    icon:        "C++",
    description: "A high-performance, CLI-based record management system engineered in C++. Features memory-safe data structures and secure file I/O operations.",
    tags:        ["C++", "Records", "CLI", "File I/O"],
    link:        "https://github.com/simonadhikari",
  },
  {
    title:       "Networking Notes App",
    type:        "Study Tool",
    icon:        "NET",
    description: "A specialized knowledge-base application designed for network analysis and security protocols. Built with vanilla JavaScript focusing on zero-dependency performance.",
    tags:        ["Networking", "Security", "JavaScript"],
    link:        "https://github.com/simonadhikari",
  },
  {
    title:       "Terminal Chat UI",
    type:        "C++ Interface",
    icon:        "CLI",
    description: "A secure, multi-threaded terminal chat interface utilizing robust socket programming for real-time encrypted communication.",
    tags:        ["Sockets", "Threads", "C++"],
    link:        "https://github.com/simonadhikari",
  },
  {
    title:       "Basic Port Scanner",
    type:        "Python Script",
    icon:        "PY",
    description: "A rapid, multithreaded port scanner written in Python for network auditing. Identifies open ports and banners efficiently.",
    tags:        ["Python", "Network", "Audit"],
    link:        "https://github.com/simonadhikari",
  }
];

/** Track the element that opened the modal, so we can restore focus on close */
let lastFocusedElement = null;

/** ── Entry point ──────────────────────────────────────────────────────────── */
async function setupPortfolio() {
  await renderProjectCards();
  setupProjectModal();
}

/** ── Card rendering ───────────────────────────────────────────────────────── */
async function renderProjectCards() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  // Fetch the card HTML template
  let template = "";
  try {
    const res = await fetch("components/portfolio-card.html");
    if (!res.ok) throw new Error(`Card template fetch failed: ${res.status}`);
    template = await res.text();
  } catch (err) {
    console.warn("[portfolio] Using fallback card markup.", err.message);
  }

  const fragment = document.createDocumentFragment();

  PROJECTS.forEach((project, index) => {
    const wrapper = document.createElement("div");
    // Use fetched template if available, otherwise use identical fallback
    wrapper.innerHTML = template || getFallbackCardMarkup();
    const card = wrapper.firstElementChild;

    // Populate all data slots
    const numberEl      = card.querySelector("[data-card-number]");
    const iconEl        = card.querySelector("[data-card-icon]");
    const typeEl        = card.querySelector("[data-card-type]");
    const titleEl       = card.querySelector("[data-card-title]");
    const descriptionEl = card.querySelector("[data-card-description]");
    const openBtn       = card.querySelector("[data-card-open]");
    const tagsEl        = card.querySelector("[data-card-tags]");

    if (numberEl)      numberEl.textContent  = String(index + 1).padStart(2, "0");
    if (iconEl)        iconEl.textContent    = project.icon;
    if (typeEl)        typeEl.textContent    = project.type;
    if (titleEl) {
      titleEl.textContent = project.title;
      // Link the card's aria-labelledby to the title
      const titleId = `project-title-${index}`;
      titleEl.id = titleId;
      card.setAttribute("aria-labelledby", titleId);
    }
    if (descriptionEl) descriptionEl.textContent = project.description;
    if (openBtn)       openBtn.dataset.projectIndex = index;
    if (tagsEl)        tagsEl.append(...project.tags.map(createTag));

    fragment.append(card);
  });

  grid.append(fragment);
  document.dispatchEvent(new CustomEvent("portfolio:rendered"));
}

/** ── Modal controller ─────────────────────────────────────────────────────── */
function setupProjectModal() {
  const dialog = document.getElementById("project-modal");
  if (!dialog) return;

  // Event delegation: any [data-card-open] button in the document opens the modal
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-card-open]");
    if (btn) openModal(Number(btn.dataset.projectIndex));
  });

  // Native <dialog> handles ESC and form[method="dialog"] submission automatically.
  // We just clean up state when it closes.
  dialog.addEventListener("close", onModalClose);

  // Close on backdrop click (click on the <dialog> element itself, not its content)
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
}

function openModal(index) {
  const project = PROJECTS[index];
  const dialog  = document.getElementById("project-modal");
  if (!project || !dialog) return;

  // Remember focus so we can restore it on close
  lastFocusedElement = document.activeElement;

  // Populate modal content
  const typeEl  = dialog.querySelector("[data-modal-type]");
  const titleEl = dialog.querySelector("[data-modal-title]");
  const descEl  = dialog.querySelector("[data-modal-description]");
  const tagsEl  = dialog.querySelector("[data-modal-tags]");
  const linkEl  = dialog.querySelector("[data-modal-link]");

  if (typeEl)  typeEl.textContent  = project.type;
  if (titleEl) titleEl.textContent = project.title;
  if (descEl)  descEl.textContent  = project.description;
  if (tagsEl)  tagsEl.replaceChildren(...project.tags.map(createTag));
  if (linkEl) {
    linkEl.href = project.link || "#";
    linkEl.style.display = project.link ? "" : "none";
  }

  document.body.classList.add("modal-open");
  dialog.showModal(); // Native: handles focus trap + backdrop
}

function onModalClose() {
  document.body.classList.remove("modal-open");
  // Restore focus to the element that triggered the modal
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

/** ── Helpers ──────────────────────────────────────────────────────────────── */

/** Create a <span> tag element */
function createTag(label) {
  const tag = document.createElement("span");
  tag.textContent = label;
  return tag;
}

/**
 * Fallback card markup — mirrors portfolio-card.html exactly.
 * Used if the template fetch fails (e.g., opened as file://).
 */
function getFallbackCardMarkup() {
  return `
    <article class="project-card reveal" aria-labelledby="">
      <div class="project-card__image" style="width: 100%; aspect-ratio: 16/9; background: var(--color-surface); border-radius: var(--border-radius); margin-bottom: var(--space-4); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--color-line-light);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      </div>
      <div class="project-card__body">
        <p class="project-card__type eyebrow" data-card-type></p>
        <h3 data-card-title></h3>
        <p data-card-description></p>
      </div>
      <div class="project-card__meta" data-card-tags aria-label="Technologies"></div>
      <button class="project-card__button button button--outline" type="button" data-card-open aria-label="View project details">Case Study</button>
    </article>
  `;
}

document.addEventListener("components:ready", setupPortfolio);
