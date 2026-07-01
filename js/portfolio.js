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
    description: "A basic record-management project for practicing data structures, control flow, and file-oriented thinking.",
    tags:        ["C++", "Records", "CLI"],
    link:        "https://github.com/simonadhikari",
  },
  {
    title:       "Portfolio Website",
    type:        "Web Project",
    icon:        "WEB",
    description: "A responsive personal site built with semantic HTML, modular CSS, and vanilla JavaScript components.",
    tags:        ["HTML5", "CSS3", "JavaScript"],
    link:        "https://github.com/simonadhikari",
  },
  {
    title:       "Networking Notes App",
    type:        "Study Tool",
    icon:        "NET",
    description: "A simple concept organizer for reviewing networking fundamentals and cybersecurity learning notes.",
    tags:        ["Networking", "Study", "Security"],
    link:        "https://github.com/simonadhikari",
  },
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
      <p class="project-card__number" data-card-number aria-hidden="true"></p>
      <div class="project-card__icon" data-card-icon aria-hidden="true"></div>
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
