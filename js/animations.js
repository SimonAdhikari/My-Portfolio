/**
 * animations.js — Scroll-reveal using IntersectionObserver
 * Simon Adhikari Portfolio
 *
 * Uses a WeakSet to track already-observed elements, preventing
 * duplicate observations when this function is called multiple times
 * (on DOMContentLoaded, components:ready, and portfolio:rendered).
 */

/** Track elements already registered with the observer */
const observedElements = new WeakSet();

/** Single shared observer instance */
let revealObserver = null;

function setupRevealAnimations() {
  // Respect user's motion preferences — immediately show all items
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  // Create the observer once and reuse it
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // rAF ensures the class addition happens in the next paint frame
          requestAnimationFrame(() => {
            entry.target.classList.add("is-visible");
          });
          // Unobserve — each element reveals only once
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );
  }

  // Only observe elements that haven't been registered yet
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    if (!observedElements.has(el)) {
      observedElements.add(el);
      revealObserver.observe(el);
    }
  });
}

// Register on all three lifecycle events — deduplication is handled by WeakSet
document.addEventListener("DOMContentLoaded", setupRevealAnimations);
document.addEventListener("components:ready", setupRevealAnimations);
document.addEventListener("portfolio:rendered", setupRevealAnimations);
