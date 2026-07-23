/**
 * main.js — Component loader & navigation controller
 * Simon Adhikari Portfolio
 */

/**
 * Initialize components
 * Dispatches "components:ready" when initialized.
 */
function loadComponents() {
  setupNavigation();
  setupThemeToggle();
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
    menu.setAttribute("aria-hidden", "false");
    // Move keyboard focus to first menu item
    const firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
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

  /** Hide header on scroll down, show on scroll up */
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (!header) return;
    const currentScrollY = window.scrollY;
    
    // Don't hide if menu is open
    if (document.body.classList.contains("nav-open")) {
      return;
    }

    if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
      // Scrolling down
      header.classList.add("is-hidden");
    } else {
      // Scrolling up
      header.classList.remove("is-hidden");
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

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

/** Theme toggle logic */
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleBtn.setAttribute('aria-pressed', 'true');
    toggleBtn.setAttribute('aria-label', 'Toggle Light Mode');
  } else {
    toggleBtn.setAttribute('aria-pressed', 'false');
    toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.setAttribute('aria-label', 'Toggle Light Mode');
    }
  });
}

/** Hide page loader once all components are initialized */
function hidePageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  loader.classList.add("loader--hidden");
  loader.addEventListener(
    "transitionend",
    () => loader.remove(),
    { once: true }
  );
}

document.addEventListener("components:ready", hidePageLoader);

document.addEventListener("DOMContentLoaded", loadComponents);
