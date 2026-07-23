/**
 * Simon Adhikari Portfolio — Combined & Minified JS
 * main.js + portfolio.js + animations.js
 */
(function() {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  function setupThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var saved = localStorage.getItem('theme');
    var dark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', 'Toggle Light Mode');
    } else {
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Toggle Dark Mode');
    }
    btn.addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Toggle Dark Mode');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Toggle Light Mode');
      }
    });
  }

  /* ── Navigation ───────────────────────────────────────────────────────── */
  function setupNavigation() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__menu');
    var allLinks = document.querySelectorAll('.nav__menu a, .nav__links a');
    var sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!toggle || !menu) return;

    function openMenu() {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      var first = menu.querySelector('a');
      if (first) first.focus();
    }

    function closeMenu() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function() {
      closeMenu(), openMenu();
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMenu(), toggle.focus();
      }
    });

    document.addEventListener('click', function(e) {
      if (document.body.classList.contains('nav-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    var lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
      if (!header) return;
      var y = window.scrollY;
      if (!document.body.classList.contains('nav-open')) {
        if (y > lastScrollY && y > header.offsetHeight) {
          header.classList.add('is-hidden');
        } else {
          header.classList.remove('is-hidden');
        }
      }
      lastScrollY = y;
    }, { passive: true });

    if (!sections.length) return;
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        allLinks.forEach(function(link) {
          var isCurrent = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', isCurrent);
          if (isCurrent) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(function(s) { obs.observe(s); });
  }

  /* ── Loader ────────────────────────────────────────────────────────────── */
  function hidePageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('loader--hidden');
    loader.addEventListener('transitionend', function() { loader.remove(); }, { once: true });
  }

  /* ── Scroll Reveal ─────────────────────────────────────────────────────── */
  var revealed = new WeakSet();
  var revealObs = null;

  function setupRevealAnimations() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }
    if (!revealObs) {
      revealObs = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          requestAnimationFrame(function() {
            entry.target.classList.add('is-visible');
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }
    document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el) {
      if (!revealed.has(el)) {
        revealed.add(el);
        revealObs.observe(el);
      }
    });
  }

  /* ── Portfolio ─────────────────────────────────────────────────────────── */
  var PROJECTS = [
    { title: 'Student Management System', type: 'C++ Console App', icon: 'C++', description: 'A high-performance, CLI-based record management system engineered in C++. Features memory-safe data structures and secure file I/O operations.', tags: ['C++', 'Records', 'CLI', 'File I/O'], link: 'https://github.com/simonadhikari' },
    { title: 'Networking Notes App', type: 'Study Tool', icon: 'NET', description: 'A specialized knowledge-base application designed for network analysis and security protocols. Built with vanilla JavaScript focusing on zero-dependency performance.', tags: ['Networking', 'Security', 'JavaScript'], link: 'https://github.com/simonadhikari' },
    { title: 'Terminal Chat UI', type: 'C++ Interface', icon: 'CLI', description: 'A secure, multi-threaded terminal chat interface utilizing robust socket programming for real-time encrypted communication.', tags: ['Sockets', 'Threads', 'C++'], link: 'https://github.com/simonadhikari' },
    { title: 'Basic Port Scanner', type: 'Python Script', icon: 'PY', description: 'A rapid, multithreaded port scanner written in Python for network auditing. Identifies open ports and banners efficiently.', tags: ['Python', 'Network', 'Audit'], link: 'https://github.com/simonadhikari' }
  ];

  var lastFocused = null;

  function createTag(label) {
    var tag = document.createElement('span');
    tag.textContent = label;
    return tag;
  }

  function getFallbackCard() {
    return '<article class="project-card reveal"><div class="project-card__image" style="width:100%;aspect-ratio:16/9;background:var(--color-surface);border-radius:var(--border-radius);margin-bottom:var(--space-4);display:flex;align-items:center;justify-content:center;border:1px solid var(--color-line-light);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><div class="project-card__body"><p class="project-card__type eyebrow" data-card-type></p><h3 data-card-title></h3><p data-card-description></p></div><div class="project-card__meta" data-card-tags></div><button class="project-card__button button button--outline" type="button" data-card-open>Case Study</button></article>';
  }

  async function renderProjectCards() {
    var grid = document.querySelector('[data-project-grid]');
    if (!grid) return;
    var template = '';
    try {
      var res = await fetch('components/portfolio-card.html');
      if (res.ok) template = await res.text();
    } catch (e) {}
    var frag = document.createDocumentFragment();
    PROJECTS.forEach(function(p, i) {
      var wrap = document.createElement('div');
      wrap.innerHTML = template || getFallbackCard();
      var card = wrap.firstElementChild;
      var num = card.querySelector('[data-card-number]');
      var icon = card.querySelector('[data-card-icon]');
      var type = card.querySelector('[data-card-type]');
      var title = card.querySelector('[data-card-title]');
      var desc = card.querySelector('[data-card-description]');
      var openBtn = card.querySelector('[data-card-open]');
      var tags = card.querySelector('[data-card-tags]');
      if (num) num.textContent = String(i + 1).padStart(2, '0');
      if (icon) icon.textContent = p.icon;
      if (type) type.textContent = p.type;
      if (title) {
        title.textContent = p.title;
        title.id = 'project-title-' + i;
        card.setAttribute('aria-labelledby', title.id);
      }
      if (desc) desc.textContent = p.description;
      if (openBtn) openBtn.dataset.projectIndex = i;
      if (tags) tags.append.apply(tags, p.tags.map(createTag));
      frag.appendChild(card);
    });
    grid.appendChild(frag);
    document.dispatchEvent(new CustomEvent('portfolio:rendered'));
  }

  function setupProjectModal() {
    var dialog = document.getElementById('project-modal');
    if (!dialog) return;
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-card-open]');
      if (btn) openModal(Number(btn.dataset.projectIndex));
    });
    dialog.addEventListener('close', function() {
      document.body.classList.remove('modal-open');
      if (lastFocused) lastFocused.focus();
      lastFocused = null;
    });
    dialog.addEventListener('click', function(e) {
      if (e.target === dialog) dialog.close();
    });
  }

  function openModal(index) {
    var p = PROJECTS[index];
    var dialog = document.getElementById('project-modal');
    if (!p || !dialog) return;
    lastFocused = document.activeElement;
    var type = dialog.querySelector('[data-modal-type]');
    var title = dialog.querySelector('[data-modal-title]');
    var desc = dialog.querySelector('[data-modal-description]');
    var tags = dialog.querySelector('[data-modal-tags]');
    var link = dialog.querySelector('[data-modal-link]');
    if (type) type.textContent = p.type;
    if (title) title.textContent = p.title;
    if (desc) desc.textContent = p.description;
    if (tags) tags.replaceChildren.apply(tags, p.tags.map(createTag));
    if (link) {
      link.href = p.link || '#';
      link.style.display = p.link ? '' : 'none';
    }
    document.body.classList.add('modal-open');
    dialog.showModal();
  }

  async function setupPortfolio() {
    await renderProjectCards();
    setupProjectModal();
  }

  /* ── Init ──────────────────────────────────────────────────────────────── */
  function loadComponents() {
    setupNavigation();
    setupThemeToggle();
    document.querySelectorAll('[data-current-year]').forEach(function(el) {
      el.textContent = new Date().getFullYear();
    });
    document.dispatchEvent(new CustomEvent('components:ready'));
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    setupRevealAnimations();
  });
  document.addEventListener('components:ready', function() {
    hidePageLoader();
    setupRevealAnimations();
    setupPortfolio();
  });
  document.addEventListener('portfolio:rendered', setupRevealAnimations);
})();