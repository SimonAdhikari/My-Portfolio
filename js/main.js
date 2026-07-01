/**
 * main.js — Component loader & navigation controller
 * Simon Adhikari Portfolio
 */

/** Map of data-component names to their HTML partial paths */
const COMPONENT_MAP = {
  navbar: "components/navbar.html",
  footer: "components/footer.html",
  modal:  "components/modal.html",
};

/**
 * Fetch and inject all [data-component] placeholders in the DOM.
 * Dispatches "components:ready" when all partials are loaded.
 */
async function loadComponents() {
  const outlets = document.querySelectorAll("[data-component]");

  await Promise.all(
    Array.from(outlets).map(async (outlet) => {
      const name = outlet.dataset.component;
      const path = COMPONENT_MAP[name];
      if (!path) return;

      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load component: ${path} (${res.status})`);
        outlet.innerHTML = await res.text();
      } catch (err) {
        console.warn("[components]", err.message);
      }
    })
  );

  setupNavigation();
  setCurrentYear();

  // Signal other scripts that the full DOM is ready
  document.dispatchEvent(new CustomEvent("components:ready"));
}

/**
 * Wire up the mobile navigation toggle and active-section highlighting.
 * Handles Escape key, outside-click, and IntersectionObserver for active links.
 */
function setupNavigation() {
  const header  = document.querySelector(".site-header");
  const toggle  = document.querySelector(".nav__toggle");
  const menu    = document.querySelector(".nav__menu");
  const allLinks = document.querySelectorAll(".nav__menu a, .nav__links a");
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (!toggle || !menu) return;

  /** Open / close the mobile menu */
  function openMenu() {
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    // Move keyboard focus to first menu item
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  /** Toggle on hamburger click */
  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    isOpen ? closeMenu() : openMenu();
  });

  /** Close on any menu link click (navigate to section) */
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /** Close on Escape key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
      toggle.focus(); // Return focus to the toggle button
    }
  });

  /** Close on click outside the nav (but not on the toggle itself) */
  document.addEventListener("click", (e) => {
    if (
      document.body.classList.contains("nav-open") &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /** Active section link highlighting via IntersectionObserver */
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        allLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isCurrent);
          if (isCurrent) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/** Inject the current 4-digit year into [data-current-year] elements */
function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", loadComponents);
