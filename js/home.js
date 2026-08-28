/* =============================================================
   home.js — Homepage dynamic content renderer
   Runs only on index.html.

   1. Latest Releases — reads BOOKS (from books.js), sorts by
      publishedAt descending, renders the top 3 adult books.
      Adding a new book with a fresh publishedAt date automatically
      bumps it into this section and pushes the oldest one out.

   2. Blog Preview — fetches top 3 latest posts from Contentful.
   ============================================================= */

(function () {
  'use strict';

  // ── 1. LATEST RELEASES ───────────────────────────────────────
  function renderLatestReleases() {
    const grid = document.getElementById('latestReleasesGrid');
    if (!grid) return;

    // BOOKS is defined in books.js (loaded before this script)
    if (typeof BOOKS === 'undefined' || !Array.isArray(BOOKS)) return;

    // Filter to adult books, sort by publishedAt if present (newest first),
    // otherwise use the last 3 in the array (most recently added = bottom of books.js).
    const adultBooks = BOOKS.filter(b => b.genre === 'adult');

    const sorted = adultBooks.some(b => b.publishedAt)
      ? adultBooks
          .filter(b => b.publishedAt)
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      : adultBooks;

    // slice(-3) takes the last 3 entries — the most recently added books
    const latest = sorted.slice(-3).reverse();

    grid.innerHTML = '';

    latest.forEach(book => {
      const coverHtml = book.cover
        ? `<img src="${book.cover}" alt="${book.coverAlt || ''}" loading="eager">`
        : `<div class="book-cover-placeholder"
                style="background-color:${book.coverPlaceholderBg || '#1a1a2e'};">
             <div class="book-cover-placeholder-title"
                  style="color:${book.coverPlaceholderColor || '#fff'};">
               ${book.title}
             </div>
           </div>`;

      const card = document.createElement('a');
      card.href      = `book-detail.html?slug=${book.slug}`;
      card.className = 'book-card reveal-child page-link';
      card.setAttribute('data-category', book.genre);
      card.innerHTML = `
        <div class="book-card-cover">${coverHtml}</div>
        <div class="book-card-body">
          <h3 class="book-card-title">${book.title}</h3>
          <div class="book-card-footer">
            <span class="book-card-price">${book.price}</span>
            <span class="book-card-buy">View</span>
          </div>
        </div>`;

      grid.appendChild(card);

      // Hook into the reveal observer if available
      if (window.revealObserver) {
        window.revealObserver.observe(card);
      } else {
        card.classList.add('is-revealed');
      }
    });
  }

  renderLatestReleases();

  // ── 2. BLOG PREVIEW ─────────────────────────────────────────
  const CONTENTFUL_SPACE_ID     = 'gplqn5xuzqhx';
  const CONTENTFUL_ACCESS_TOKEN = 'CAOanbYtUsvyzxdIJbygr4i1YVSbaOl-w6BUpk23WLI';
  const CONTENT_TYPE_ID         = 'blogPost';
  const CDA_BASE                = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries`;

  async function loadHomeBlogPreview() {
    const grid = document.getElementById('homeArticlesGrid');
    if (!grid) return;

    try {
      const params = new URLSearchParams({
        content_type:  CONTENT_TYPE_ID,
        order:         '-fields.publishedAt',
        limit:         3,
        include:       1,
        select:        'sys.id,fields.title,fields.slug,fields.coverImage,fields.publishedAt,fields.readTime',
        access_token:  CONTENTFUL_ACCESS_TOKEN
      });

      const res = await fetch(`${CDA_BASE}?${params.toString()}`);
      if (!res.ok) return;

      const data = await res.json();
      const items = data.items ?? [];

      if (items.length === 0) {
        const blogSection = grid.closest('section');
        if (blogSection) blogSection.style.display = 'none';
        return;
      }

      grid.innerHTML = '';

      items.forEach(entry => {
        const assetId = entry.fields.coverImage?.sys?.id;
        const asset = data.includes?.Asset?.find(a => a.sys.id === assetId);
        const coverUrl = asset?.fields?.file?.url ? 'https:' + asset.fields.file.url : null;

        const date = entry.fields.publishedAt
          ? new Date(entry.fields.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
          : '';

        const readTimePart = entry.fields.readTime ? ` · ${entry.fields.readTime} min read` : '';
        const imageHtml = coverUrl ? `<img src="${coverUrl}" alt="" loading="lazy">` : '';

        const card = document.createElement('a');
        card.href = `article.html?slug=${entry.fields.slug}`;
        card.className = 'article-card reveal-child page-link';
        card.innerHTML = `
          <div class="article-card-image" aria-hidden="true">${imageHtml}</div>
          <div class="article-card-body">
            <h3 class="article-card-title">${entry.fields.title}</h3>
            <p class="article-card-meta">${date}${readTimePart}</p>
          </div>`;
        grid.appendChild(card);

        if (window.revealObserver) {
          window.revealObserver.observe(card);
        } else {
          card.classList.add('is-revealed');
        }
      });

    } catch (err) {
      console.error('Failed to load blog preview:', err);
    }
  }

  loadHomeBlogPreview();
})();
