/* =============================================================
   book-detail.js — Dynamic book detail page
   Runs only on book-detail.html.

   Responsibilities:
   1. Read the slug from the URL (?slug=in-him-realities)
   2. Look up the matching book in books.js (BOOKS / getBookBySlug)
   3. Populate every [data-book-field] element on the page
   4. Build the description, excerpt, and related-books grid
   5. Update <title> and <meta name="description">
   6. Handle the purchase modal (open, close, keyboard, focus trap)
   7. Handle the "I've Made the Transfer" button:
      - Validate the buyer's email
      - POST to the Vercel serverless function /api/notify-purchase
      - Show the confirmation screen on success
   ============================================================= */

(function () {
  'use strict';

  // ── 1. Read the slug and find the book ──────────────────────

  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');
  const book   = getBookBySlug(slug); // defined in books.js

  // If there is no slug, or the slug doesn't match any book,
  // replace the page content with a friendly "not found" message.
  if (!book) {
    document.querySelector('main').innerHTML = `
      <div style="text-align:center; padding: 6rem 1rem;">
        <h1 style="font-size:2rem; margin-bottom:1rem;">Book not found</h1>
        <p style="margin-bottom:2rem;">We couldn't find the book you were looking for.</p>
        <a href="books.html" class="btn btn-primary">← Back to All Books</a>
      </div>`;
    return; // stop all further execution
  }

  // ── 2. Populate [data-book-field] elements ──────────────────
  //
  // The HTML uses data-book-field attributes as hooks.
  // We loop through them all and fill them from the book object.

  document.querySelectorAll('[data-book-field]').forEach(el => {
    const field = el.dataset.bookField;

    switch (field) {
      case 'title':
        el.textContent = book.title;
        break;

      case 'author':
        el.textContent = `By ${book.author}`;
        break;

      case 'price':
        el.textContent = book.price;
        break;

      case 'genreLabel':
        el.textContent = book.genreLabel;
        el.className = `book-detail-genre book-detail-genre--${book.genre}`;
        break;

      case 'coverImg':
        if (book.cover) {
          el.src = book.cover;
          el.alt = book.coverAlt;
          el.style.display = ''; // un-hide (was display:none in HTML to avoid flash)
        } else {
          // No photo — replace the <img> with a CSS placeholder div
          const placeholder = document.createElement('div');
          placeholder.className = 'book-cover-placeholder';
          placeholder.style.backgroundColor = book.coverPlaceholderBg;
          placeholder.innerHTML = `
            <div class="book-cover-placeholder-title"
                 style="color:${book.coverPlaceholderColor}">
              ${book.title}
            </div>`;
          el.replaceWith(placeholder);
        }
        break;
    }
  });

  // ── 3. Populate the description ─────────────────────────────
  //
  // book.description is an array of paragraph strings.
  // We convert each string to a <p> and inject them all.

  const descContainer = document.querySelector('.book-detail-desc');
  if (descContainer) {
    descContainer.innerHTML = book.description
      .map(para => `<p>${para}</p>`)
      .join('');
  }

  // ── 4. Populate the excerpt ─────────────────────────────────
  //
  // book.excerpt is an array of quote strings.
  // We clear the placeholder blockquotes and inject fresh ones.

  const excerptInner = document.querySelector('.book-excerpt-inner');
  if (excerptInner) {
    // Remove every placeholder <blockquote> the HTML ships with
    excerptInner.querySelectorAll('blockquote').forEach(bq => bq.remove());

    // Inject one <blockquote> per excerpt string
    book.excerpt.forEach(text => {
      const bq = document.createElement('blockquote');
      bq.innerHTML = `<p>${text}</p>`;
      excerptInner.appendChild(bq);
    });
  }

  // ── 5. Update the Buy Now button text and data attributes ───

  const buyNowBtn = document.getElementById('buyNowBtn');
  if (buyNowBtn) {
    buyNowBtn.textContent       = `Buy Now — ${book.price}`;
    buyNowBtn.dataset.bookTitle = book.title;
    buyNowBtn.dataset.bookPrice = book.price;
  }

  // Update the cover Buy Now button text to match
  const buyNowBtnCover = document.getElementById('buyNowBtnCover');
  if (buyNowBtnCover) {
    buyNowBtnCover.textContent = `Buy Now — ${book.price}`;
  }

  // ── 6. Populate the related books grid ─────────────────────
  //
  // book.related is an array of up to 3 slugs.
  // We look each one up and build a book card matching the
  // same HTML structure used in books.html.

  const relatedGrid = document.querySelector('.related-section .books-grid');
  if (relatedGrid && book.related?.length) {
    relatedGrid.innerHTML = ''; // clear the placeholder cards

    book.related.forEach(relSlug => {
      const rel = getBookBySlug(relSlug);
      if (!rel) return;

      // Build either an <img> or a placeholder div for the cover
      const coverHtml = rel.cover
        ? `<img src="${rel.cover}" alt="${rel.coverAlt}" loading="lazy">`
        : `<div class="book-cover-placeholder"
               style="background-color:${rel.coverPlaceholderBg}">
             <div class="book-cover-placeholder-title"
                  style="color:${rel.coverPlaceholderColor}">
               ${rel.title}
             </div>
           </div>`;

      const card = document.createElement('a');
      card.href            = `book-detail.html?slug=${rel.slug}`;
      card.className       = 'book-card reveal-child page-link';
      card.dataset.category = rel.genre;
      card.innerHTML = `
        <div class="book-card-cover">${coverHtml}</div>
        <div class="book-card-body">
          <h3 class="book-card-title">${rel.title}</h3>
          <div class="book-card-footer">
            <span class="book-card-price">${rel.price}</span>
            <span class="book-card-buy">View</span>
          </div>
        </div>`;

      relatedGrid.appendChild(card);

      // Register the new card with the reveal observer so it
      // gets the entrance animation when it scrolls into view.
      if (window.revealObserver) {
        window.revealObserver.observe(card);
      }
    });
  }

  // ── 7. Update <title> and <meta name="description"> ─────────

  document.title = `${book.title} — LOGOS HUB`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    // Use the first description paragraph, trimmed to 155 characters
    const desc = book.description[0]?.substring(0, 155) ?? '';
    metaDesc.setAttribute('content', desc);
  }

  // ── 8. Purchase modal logic ─────────────────────────────────

  const modal        = document.getElementById('purchaseModal');
  const modalClose   = document.getElementById('modalClose');
  const confirmation = document.getElementById('paymentConfirmation');

  /** Inject the current book's title and price into the modal. */
  function populateModal() {
    document.querySelectorAll('[data-modal-field="title"]').forEach(el => {
      el.textContent = book.title;
    });
    document.querySelectorAll('[data-modal-field="price"]').forEach(el => {
      el.textContent = book.price;
    });
  }

  /** Open the purchase modal. */
  function openModal() {
    populateModal();
    modal.classList.remove('hidden');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden'; // lock body scroll

    // Move focus into the modal for keyboard users
    setTimeout(() => {
      document.getElementById('buyerEmail')?.focus();
    }, 80);
  }

  /** Close the purchase modal and return focus to the trigger. */
  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    buyNowBtn?.focus(); // return focus to the "Buy Now" button
  }

  // Open modal when either "Buy Now" button is clicked
  buyNowBtn?.addEventListener('click', openModal);
  document.getElementById('buyNowBtnCover')?.addEventListener('click', openModal);

  // Close modal via the ✕ button
  modalClose?.addEventListener('click', closeModal);

  // Close modal when clicking the backdrop (outside the card)
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal?.classList.contains('hidden')) {
      closeModal();
    }
  });

  // ── 9. "I've Made the Transfer" — confirm & notify ──────────

  const confirmBtn   = document.getElementById('confirmTransferBtn');
  const emailInput   = document.getElementById('buyerEmail');

  confirmBtn?.addEventListener('click', async () => {
    const email = emailInput?.value.trim() ?? '';

    // Validate: must be non-empty and pass the browser's own
    // email validity check (handles format, @ symbol, etc.)
    if (!email || !emailInput.validity.valid) {
      emailInput.classList.add('input-error');
      emailInput.focus();
      // Remove the error class as soon as the user starts typing again
      emailInput.addEventListener('input', () => {
        emailInput.classList.remove('input-error');
      }, { once: true });
      return;
    }

    // Disable button and show loading state
    confirmBtn.disabled    = true;
    confirmBtn.textContent = 'Sending…';

    try {
      // POST the purchase notification to the Vercel serverless function.
      // The function (api/notify-purchase.js) emails the author with
      // the buyer's email, the book title, and the expected amount.
      const response = await fetch('/api/notify-purchase', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          buyerEmail: email,
          bookTitle:  book.title,
          bookPrice:  book.price
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server responded with an error');
      }

      // ── Success ──
      // Hide the modal and show the confirmation screen.
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      confirmation.classList.remove('hidden');
      confirmation.removeAttribute('aria-hidden');

      // Move focus into the confirmation for keyboard users
      confirmation.querySelector('h2')?.focus();

    } catch (err) {
      // ── Error ──
      // Re-enable the button and show an inline error message.
      confirmBtn.disabled    = false;
      confirmBtn.textContent = "I've Made the Transfer ✓";

      // Remove any existing error message first to prevent duplicates
      const existingError = document.getElementById('modalError');
      if (existingError) {
        existingError.remove();
      }

      const errMsg      = document.createElement('p');
      errMsg.id         = 'modalError';
      errMsg.textContent = `Something went wrong: ${err.message}. Please try again, or email us directly at dpriestoku@gmail.com.`;
      errMsg.style.cssText = 'color:#c0392b; font-size:0.85rem; margin-top:0.75rem;';
      confirmBtn.insertAdjacentElement('afterend', errMsg);
    }
  });

})();
