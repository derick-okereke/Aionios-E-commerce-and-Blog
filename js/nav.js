/* =============================================================
   nav.js — Mobile navigation + sticky header scroll behaviour
   Runs on every page.
   ============================================================= */

(function () {
  'use strict';

  // ── Grab elements ──────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  const header = document.querySelector('.site-header');

  // Guard: if the toggle doesn't exist on this page, bail out.
  if (!toggle || !menu) return;

  // ── Helpers ────────────────────────────────────────────────

  /** Returns true when the mobile menu is currently open. */
  function isMenuOpen() {
    return !menu.classList.contains('closed');
  }

  /** Open the mobile menu. */
  function openMenu() {
    menu.classList.add('open');           // .open triggers max-height in CSS
    menu.classList.remove('closed');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }

  /** Close the mobile menu. */
  function closeMenu() {
    menu.classList.remove('open');
    menu.classList.add('closed');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ── Hamburger button click ─────────────────────────────────
  toggle.addEventListener('click', () => {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // ── Close when any mobile nav link is tapped ───────────────
  menu.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Close the "Shop Books" CTA inside the drawer too ───────
  const mobileCta = menu.querySelector('.btn');
  if (mobileCta) {
    mobileCta.addEventListener('click', closeMenu);
  }

  // ── Close when clicking outside the menu & toggle ──────────
  document.addEventListener('click', e => {
    if (isMenuOpen() && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // ── Close on Escape key ────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
      toggle.focus(); // return focus to the button
    }
  });

  // ── Sticky header: add .scrolled class after 60 px ─────────
  // The CSS uses .site-header.scrolled to apply a shadow that
  // signals depth to the user.
  if (header) {
    window.addEventListener(
      'scroll',
      () => header.classList.toggle('scrolled', window.scrollY > 60),
      { passive: true } // never blocks scroll
    );
  }

})();
