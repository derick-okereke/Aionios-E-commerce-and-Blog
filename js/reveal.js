/* =============================================================
   reveal.js — Scroll-reveal animations using IntersectionObserver
   Runs on every page.

   How it works:
   - Elements marked with class="reveal" (sections) or
     class="reveal-child" (cards inside grids) start invisible
     via CSS (opacity: 0; transform: translateY(...)).
   - When they scroll into the viewport, this script adds
     the class "visible", which triggers the CSS transition
     to fade and slide them into place.
   - Each element is only animated once (observer.unobserve).
   - The CSS already handles stagger delays for .reveal-child
     via nth-child selectors, so no JS delay logic is needed.
   - Respects prefers-reduced-motion: if the user has requested
     reduced motion, the CSS nukes all transitions anyway.
   ============================================================= */

(function () {
  'use strict';

  // If the browser doesn't support IntersectionObserver (very old),
  // just make everything visible immediately and bail out.
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-child').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  // ── Create the observer ────────────────────────────────────
  //
  // threshold: 0.12 means the animation fires when 12% of the
  // element has entered the viewport — early enough to feel
  // responsive, late enough that nothing flashes on load.
  //
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Unobserve immediately — we only want the entrance
        // animation to play once, not reverse on scroll-up.
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // ── Observe all reveal elements currently in the DOM ──────
  //
  // .reveal       — section-level blocks (scripture quotes,
  //                 newsletter panels, category cards, etc.)
  // .reveal-child — individual book cards, article cards, etc.
  //                 inside a grid; CSS staggers them with
  //                 nth-child transition-delay rules.
  //
  document.querySelectorAll('.reveal, .reveal-child').forEach(el => {
    observer.observe(el);
  });

  // ── Expose the observer for other scripts to reuse ────────
  //
  // blog.js and article.js will dynamically add new .reveal-child
  // cards to the DOM when fetching more posts from Hashnode.
  // They need to call revealObserver.observe(newCard) on each
  // newly created element so it gets the entrance animation too.
  //
  window.revealObserver = observer;

})();
