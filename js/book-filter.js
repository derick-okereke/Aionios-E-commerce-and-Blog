/* =============================================================
   book-filter.js — Category filter bar on books.html
   Runs only on books.html.

   What it does:
   1. Wires up the three filter buttons (All / Christian Books /
      Children's Books) so clicking one shows only matching cards.
   2. Reads the URL hash on page load so that links like
      books.html#adult-books or books.html#childrens-books
      automatically activate the correct filter.
   ============================================================= */

(function () {
  'use strict';

  // ── Grab the filter buttons and book cards ─────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const bookCards  = document.querySelectorAll('.book-card');

  // Guard: if neither exists on this page, do nothing.
  if (!filterBtns.length || !bookCards.length) return;

  // ── Core filter function ───────────────────────────────────
  /**
   * Show/hide book cards based on a category string.
   * @param {string} filter  "all" | "adult" | "children"
   */
  function applyFilter(filter) {
    bookCards.forEach(card => {
      // Show this card if "all" is selected, or if its
      // data-category attribute matches the chosen filter.
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.style.display = '';     // restore natural display value
        card.removeAttribute('aria-hidden');
      } else {
        card.style.display = 'none'; // hide it
        card.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // ── Update active button state ─────────────────────────────
  /**
   * Remove active styling from all buttons, then mark the
   * clicked one as active. Also updates aria-pressed for
   * screen readers.
   * @param {Element} activeBtn  the button that was clicked
   */
  function setActiveBtn(activeBtn) {
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }

  // ── Attach click listeners to every filter button ──────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter; // "all" | "adult" | "children"
      setActiveBtn(btn);
      applyFilter(filter);

      // Smooth-scroll to the matching section heading so the
      // user's eye is taken straight to the filtered content.
      if (filter === 'adult') {
        document.getElementById('adult-books')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (filter === 'children') {
        document.getElementById('childrens-books')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Deep-link support: read URL hash on load ───────────────
  //
  // The home page links to books.html#adult-books and
  // books.html#childrens-books. When those links are followed,
  // we want the correct filter to already be active so the user
  // sees only the relevant books immediately.
  //
  function applyHashFilter() {
    const hash = window.location.hash; // e.g. "#adult-books"

    const hashToFilter = {
      '#adult-books':     'adult',
      '#childrens-books': 'children'
    };

    const filter = hashToFilter[hash];

    if (filter) {
      const matchingBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
      if (matchingBtn) {
        setActiveBtn(matchingBtn);
        applyFilter(filter);
        // No scrollIntoView here — the browser's native hash
        // scroll already handles jumping to the section anchor.
      }
    }
  }

  // Run once on page load.
  applyHashFilter();

})();
