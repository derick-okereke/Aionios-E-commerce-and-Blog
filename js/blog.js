/* =============================================================
   blog.js — Blog page: article filter + Contentful "Load More"
   Runs only on blog.html.

   Architecture:
   The page ships with static placeholder article cards in the
   HTML. This script layers two features on top of that:

   PART A — Filter bar
     Works entirely on the static HTML cards. No API needed.
     Clicking a filter button shows/hides .article-card and
     .featured-article elements by their data-tag attribute.

   PART B — "Load More" button (Contentful CDA REST API)
     Fetches the next batch of real articles from Contentful
     and appends new .article-card elements to #articlesGrid.

   ── Contentful setup ──────────────────────────────────────
   1. Sign up at contentful.com and create a Space.
   2. Create a Content Type called "blogPost" with these fields:
        - title       (Short Text, required)
        - slug        (Short Text, required, unique)
        - excerpt     (Long Text — shown on cards)
        - body        (Rich Text — full article content)
        - coverImage  (Media — single image asset)
        - tags        (Short Text, List — e.g. "bible-study")
        - readTime    (Integer — minutes, optional)
        - publishedAt (Date and Time)
   3. Go to Settings > API Keys > Add API Key.
      Copy your Space ID and Content Delivery API access token.
   4. Set CONTENTFUL_ENABLED = true below and fill in the two
      config values. The CDA access token is read-only — safe
      to embed in front-end JavaScript.
   ============================================================= */

(function () {
  'use strict';

  // ── Contentful configuration ────────────────────────────────
  // Set CONTENTFUL_ENABLED to true once the account is ready.
  const CONTENTFUL_ENABLED      = true;
  const CONTENTFUL_SPACE_ID     = 'gplqn5xuzqhx';      // ← from Settings > API Keys
  const CONTENTFUL_ACCESS_TOKEN = 'CAOanbYtUsvyzxdIJbygr4i1YVSbaOl-w6BUpk23WLI';  // ← CDA token (read-only)
  const CONTENT_TYPE_ID         = 'blogPost';           // ← must match your Content Type ID
  const POSTS_PER_PAGE          = 9;

  // ── CDA base URL ────────────────────────────────────────────
  const CDA_BASE = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries`;

  // ── ─────────────────────────────────────────────────────── ─
  //    PART A — Article filter (disabled — tags not in use)
  // ── ─────────────────────────────────────────────────────── ─
  // Uncomment and restore filter bar in blog.html when categories are needed.

  // ── ─────────────────────────────────────────────────────── ─
  //    PART B — Load More (Contentful CDA REST API)
  // ── ─────────────────────────────────────────────────────── ─


  const loadMoreBtn  = document.getElementById('loadMoreBtn');
  const articlesGrid = document.getElementById('articlesGrid');

  // Pagination state — Contentful uses offset-based skip/limit
  let currentSkip = 0;
  let totalItems  = Infinity; // updated after the first fetch
  let isLoading   = false;

  // Hide the Load More button entirely if Contentful is not yet configured
  if (!CONTENTFUL_ENABLED && loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }

  // ── Build the fetch URL ────────────────────────────────────
  // Contentful CDA REST endpoint with query parameters:
  //   content_type  — filters to only your blogPost entries
  //   order         — newest first (-fields.publishedAt)
  //   limit / skip  — pagination
  //   select        — fetch only the fields we need (saves bandwidth)
  //   include       — depth=1 resolves the linked coverImage asset
  //   access_token  — CDA key (read-only, safe in client-side JS)
  function buildFetchUrl(skip) {
    const params = new URLSearchParams({
      content_type:  CONTENT_TYPE_ID,
      order:         '-fields.publishedAt',
      limit:         POSTS_PER_PAGE,
      skip:          skip,
      include:       1,
      select: [
        'sys.id',
        'fields.title',
        'fields.slug',
        'fields.excerpt',
        'fields.coverImage',
        'fields.publishedAt',
        'fields.readTime'
      ].join(','),
      access_token: CONTENTFUL_ACCESS_TOKEN
    });
    return `${CDA_BASE}?${params.toString()}`;
  }

  // ── Resolve a linked asset from the includes block ─────────
  // Contentful returns linked assets in response.includes.Asset[].
  // Each entry's coverImage field is a link: { sys: { id: "abc" } }
  // We match that id against includes.Asset to get the actual URL.
  function resolveAssetUrl(linkObj, includes) {
    if (!linkObj || !includes?.Asset) return null;
    const assetId = linkObj.sys?.id;
    if (!assetId) return null;
    const asset = includes.Asset.find(a => a.sys.id === assetId);
    // Contentful image URLs are protocol-relative (//images.ctfassets.net/…)
    return asset?.fields?.file?.url
      ? 'https:' + asset.fields.file.url
      : null;
  }

  // ── Fetch a page of articles from Contentful ──────────────
  async function fetchArticles() {
    if (isLoading) return;

    // Don't fetch if we've already loaded all items
    if (currentSkip >= totalItems) {
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    isLoading = true;
    if (loadMoreBtn) {
      loadMoreBtn.disabled    = true;
      loadMoreBtn.textContent = 'Loading…';
    }

    try {
      const res = await fetch(buildFetchUrl(currentSkip), {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      totalItems  = data.total;
      const isInitialFetch = (currentSkip === 0);
      currentSkip += data.items.length;

      let gridItems = data.items;

      // On initial page load: clear static placeholders & populate featured card
      if (isInitialFetch) {
        if (articlesGrid) articlesGrid.innerHTML = '';

        if (data.items.length > 0) {
          const featuredEntry = data.items[0];
          const featuredCover = resolveAssetUrl(featuredEntry.fields.coverImage, data.includes);
          populateFeaturedCard(featuredEntry.fields, featuredCover);

          // Grid gets items starting from index 1 (older articles)
          gridItems = data.items.slice(1);
        }
      }

      // Render grid articles
      gridItems.forEach(entry => {
        const coverUrl = resolveAssetUrl(entry.fields.coverImage, data.includes);
        const card     = buildArticleCard(entry.fields, coverUrl);
        articlesGrid.appendChild(card);

        // Register with reveal observer for entrance animation
        if (window.revealObserver) {
          window.revealObserver.observe(card);
        } else {
          card.classList.add('is-revealed');
        }
      });

      // Hide or update the Load More button
      if (loadMoreBtn) {
        if (currentSkip >= totalItems) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = '';
          loadMoreBtn.disabled      = false;
          loadMoreBtn.textContent   = 'Load More Articles';
        }
      }

    } catch (err) {
      console.error('Failed to load articles from Contentful:', err);
      if (loadMoreBtn) {
        loadMoreBtn.disabled    = false;
        loadMoreBtn.textContent = 'Failed to load — try again';
      }
    }

    isLoading = false;
  }

  // ── Populate the Featured Article card (latest post) ────────
  function populateFeaturedCard(fields, coverUrl) {
    const featuredCard = document.querySelector('.featured-article');
    if (!featuredCard) return;

    const date = fields.publishedAt
      ? new Date(fields.publishedAt).toLocaleDateString('en-GB', {
          day:   'numeric',
          month: 'long',
          year:  'numeric'
        })
      : '';
    const readTimePart = fields.readTime ? ` · ${fields.readTime} min read` : '';

    const cleanSlug = encodeURIComponent((fields.slug || '').trim());
    featuredCard.href = `article.html?slug=${cleanSlug}`;
    featuredCard.setAttribute('aria-label', `Featured article: ${fields.title}`);

    const imageEl = featuredCard.querySelector('.featured-article-image');
    if (imageEl && coverUrl) {
      imageEl.innerHTML = `<img src="${coverUrl}" alt="" loading="eager">`;
    }

    // Hide tag badge if present
    const tagEl = featuredCard.querySelector('.article-card-tag');
    if (tagEl) tagEl.style.display = 'none';

    const titleEl = featuredCard.querySelector('.featured-article-title');
    if (titleEl) titleEl.textContent = fields.title;

    const excerptEl = featuredCard.querySelector('.featured-article-excerpt');
    if (excerptEl) excerptEl.textContent = fields.excerpt ?? '';

    const metaEl = featuredCard.querySelector('.featured-article-meta');
    if (metaEl) metaEl.textContent = `${date}${readTimePart}`;

    featuredCard.style.display = '';
  }

  // ── Build an article card element from a Contentful entry ──
  function buildArticleCard(fields, coverUrl) {
    const date = fields.publishedAt
      ? new Date(fields.publishedAt).toLocaleDateString('en-GB', {
          day:   'numeric',
          month: 'long',
          year:  'numeric'
        })
      : '';

    const readTimePart = fields.readTime ? ` · ${fields.readTime} min read` : '';

    const imageHtml = coverUrl
      ? `<img src="${coverUrl}" alt="" loading="lazy">`
      : '';

    const cleanSlug = encodeURIComponent((fields.slug || '').trim());
    const card     = document.createElement('a');
    card.href      = `article.html?slug=${cleanSlug}`;
    card.className = 'article-card reveal-child page-link';

    card.innerHTML = `
      <div class="article-card-image" aria-hidden="true">${imageHtml}</div>
      <div class="article-card-body">
        <h3 class="article-card-title">${fields.title}</h3>
        <p class="article-card-meta">${date}${readTimePart}</p>
      </div>`;

    return card;
  }

  // ── Initial load & Load More button ────────────────────────
  if (CONTENTFUL_ENABLED) {
    // Automatically load articles on page visit
    fetchArticles();

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', fetchArticles);
    }
  } else if (loadMoreBtn) {
    loadMoreBtn.style.display = 'none';
  }

})();
