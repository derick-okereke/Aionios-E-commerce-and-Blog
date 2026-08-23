/* =============================================================
   home.js — Homepage blog preview renderer
   Runs only on index.html.
   Fetches top 3 latest published articles from Contentful.
   ============================================================= */

(function () {
  'use strict';

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
