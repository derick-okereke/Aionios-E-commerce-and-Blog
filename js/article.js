/* =============================================================
   article.js — Single article page (article.html)
   Runs only on article.html.

   What it does:
   1. Reads the slug from the URL  (?slug=my-article-slug)
   2. Fetches the full article from the Contentful CDA REST API
   3. Populates every [data-article-field] element on the page
   4. Updates <title> and <meta name="description">
   5. Wires up the WhatsApp share and Copy Link buttons

   Like blog.js, the Contentful integration is gated behind a flag.
   When CONTENTFUL_ENABLED = false, the static placeholder content
   in the HTML stays visible — nothing breaks.
   When CONTENTFUL_ENABLED = true, the placeholder is replaced
   with the real article data fetched from Contentful.

   ── About Contentful Rich Text ────────────────────────────
   Contentful's "body" field (Rich Text) is stored and returned
   as a JSON Abstract Syntax Tree (AST) — not as HTML. This file
   includes a lightweight recursive renderer (richTextToHtml)
   that converts that AST into semantic HTML. The resulting tags
   (p, h2, h3, blockquote, ul, ol, li, strong, em, a, img) all
   match what our style.css already styles for .article-body.
   ============================================================= */

(function () {
  'use strict';

  // ── Contentful configuration ────────────────────────────────
  // Set CONTENTFUL_ENABLED to true once the account is ready.
  const CONTENTFUL_ENABLED      = true;
  const CONTENTFUL_SPACE_ID     = 'gplqn5xuzqhx';                             // ← from Settings > API Keys
  const CONTENTFUL_ACCESS_TOKEN = 'CAOanbYtUsvyzxdIJbygr4i1YVSbaOl-w6BUpk23WLI';  // ← CDA token (read-only)
  const CONTENT_TYPE_ID         = 'blogPost';                                  // ← must match your Content Type ID

  // ── CDA base URL ────────────────────────────────────────────
  const CDA_BASE = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/master/entries`;

  // ── Read the slug from the URL ──────────────────────────────
  const slug = new URLSearchParams(window.location.search).get('slug');

  // If there is no slug at all, redirect to the blog listing page.
  if (!slug) {
    window.location.href = 'blog.html';
    return;
  }

  // ── Build the fetch URL ────────────────────────────────────
  // Fetch the single blogPost entry whose slug field matches.
  // include=2 resolves linked assets nested inside the Rich Text body
  // (e.g. embedded images), as well as the top-level coverImage.
  function buildFetchUrl() {
    const params = new URLSearchParams({
      content_type:        CONTENT_TYPE_ID,
      'fields.slug':       slug,
      include:             2,
      access_token:        CONTENTFUL_ACCESS_TOKEN
    });
    return `${CDA_BASE}?${params.toString()}`;
  }

  // ── Resolve a linked asset URL from the includes block ─────
  // Contentful's Rich Text embeds images as link objects with an asset ID.
  // We look up the ID in the includes.Asset array to get the real URL.
  function resolveAssetUrl(assetId, includes) {
    if (!assetId || !includes?.Asset) return null;
    const asset = includes.Asset.find(a => a.sys.id === assetId);
    return asset?.fields?.file?.url
      ? 'https:' + asset.fields.file.url
      : null;
  }

  // ── Rich Text → HTML renderer ──────────────────────────────
  // Contentful returns the article body as a JSON AST.
  // This function walks the tree recursively and emits HTML strings.
  // The output tags match what style.css already styles under .article-body.
  //
  // Supported node types:
  //   Block:  paragraph, heading-1…6, blockquote, hr,
  //           unordered-list, ordered-list, list-item,
  //           embedded-asset-block (images)
  //   Inline: hyperlink, asset-hyperlink
  //   Text:   with marks: bold, italic, underline, code
  //
  function richTextToHtml(node, includes) {
    if (!node) return '';

    // ── Text node (leaf) ────────────────────────────────────
    if (node.nodeType === 'text') {
      let text = escapeHtml(node.value ?? '');
      // Apply formatting marks, innermost first
      if (node.marks) {
        node.marks.forEach(mark => {
          switch (mark.type) {
            case 'bold':      text = `<strong>${text}</strong>`; break;
            case 'italic':    text = `<em>${text}</em>`;         break;
            case 'underline': text = `<u>${text}</u>`;           break;
            case 'code':      text = `<code>${text}</code>`;     break;
          }
        });
      }
      return text;
    }

    // ── Recursively render child nodes ───────────────────────
    const children = (node.content ?? [])
      .map(child => richTextToHtml(child, includes))
      .join('');

    // ── Block / inline node ─────────────────────────────────
    switch (node.nodeType) {
      case 'document':
        return children;

      case 'paragraph':
        // Skip completely empty paragraphs (Contentful sometimes adds them)
        return children.trim() ? `<p>${children}</p>` : '';

      case 'heading-1': return `<h2>${children}</h2>`;  // h1 is reserved for the page title
      case 'heading-2': return `<h2>${children}</h2>`;
      case 'heading-3': return `<h3>${children}</h3>`;
      case 'heading-4': return `<h4>${children}</h4>`;
      case 'heading-5': return `<h5>${children}</h5>`;
      case 'heading-6': return `<h6>${children}</h6>`;

      case 'blockquote':
        return `<blockquote>${children}</blockquote>`;

      case 'hr':
        return '<hr>';

      case 'unordered-list':
        return `<ul>${children}</ul>`;

      case 'ordered-list':
        return `<ol>${children}</ol>`;

      case 'list-item':
        return `<li>${children}</li>`;

      case 'hyperlink': {
        const href = node.data?.uri ?? '#';
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${children}</a>`;
      }

      case 'asset-hyperlink': {
        // Link whose target is an uploaded Contentful asset
        const assetId = node.data?.target?.sys?.id;
        const url     = resolveAssetUrl(assetId, includes) ?? '#';
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
      }

      case 'embedded-asset-block': {
        // Inline image embedded in the article body
        const assetId  = node.data?.target?.sys?.id;
        const imgUrl   = resolveAssetUrl(assetId, includes);
        const asset    = includes?.Asset?.find(a => a.sys.id === assetId);
        const altText  = escapeHtml(asset?.fields?.title ?? '');
        if (!imgUrl) return '';
        return `<figure><img src="${imgUrl}" alt="${altText}" loading="lazy"></figure>`;
      }

      default:
        // Unknown node — just render its children so content isn't silently lost
        return children;
    }
  }

  // ── Simple HTML escaper (prevents XSS from text node values) ─
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  // ── Fetch and render the article ───────────────────────────
  async function loadArticle() {
    // Show a subtle loading state in the title area while fetching
    const titleEl = document.querySelector('[data-article-field="title"]');
    if (titleEl) titleEl.textContent = 'Loading…';

    try {
      const res = await fetch(buildFetchUrl(), {
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // data.items[0] is the matching blogPost entry (filtered by slug)
      if (!data.items || data.items.length === 0) {
        showError('This article could not be found.');
        return;
      }

      const entry    = data.items[0];
      const fields   = entry.fields;
      const includes = data.includes; // contains resolved Asset links

      populateArticle(fields, includes);

    } catch (err) {
      console.error('Failed to load article from Contentful:', err);
      showError('This article failed to load. Please try again later.');
    }
  }

  // ── Populate the page with article data ────────────────────
  // fields shape (from Contentful entry.fields):
  //   title:       string
  //   slug:        string
  //   excerpt:     string  (used for meta description)
  //   body:        Rich Text JSON AST
  //   coverImage:  asset link (resolved via includes)
  //   tags:        string[]
  //   readTime:    number (minutes)
  //   publishedAt: ISO 8601 string
  //
  function populateArticle(fields, includes) {

    // 1. <title> and meta description
    document.title = `${fields.title} — Aionios Life Blog`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', (fields.excerpt ?? '').substring(0, 155));
    }

    // 2. Breadcrumb — truncate long titles so it doesn't wrap on small screens
    const breadcrumb = document.querySelector('[data-article-field="breadcrumb"]');
    if (breadcrumb) {
      breadcrumb.textContent = fields.title.length > 48
        ? fields.title.substring(0, 48) + '…'
        : fields.title;
    }

    // 3. Tag badge — hidden while tags are not in use.
    // To re-enable: restore tags field in Contentful and uncomment below.
    const tagEl = document.querySelector('[data-article-field="tag"]');
    if (tagEl) tagEl.style.display = 'none';


    // 4. Title
    const titleEl = document.querySelector('[data-article-field="title"]');
    if (titleEl) titleEl.textContent = fields.title;

    // 5. Date — format to "14 June 2026"
    if (fields.publishedAt) {
      const dateObj = new Date(fields.publishedAt);
      const dateEl  = document.querySelector('[data-article-field="date"]');
      if (dateEl) {
        dateEl.textContent = dateObj.toLocaleDateString('en-GB', {
          day:   'numeric',
          month: 'long',
          year:  'numeric'
        });
        dateEl.setAttribute('datetime', dateObj.toISOString().split('T')[0]);
      }
    }

    // 6. Read time
    const readTimeEl = document.querySelector('[data-article-field="readTime"]');
    if (readTimeEl) {
      readTimeEl.textContent = fields.readTime ? `${fields.readTime} min read` : '';
    }

    // 7. Author name — Contentful doesn't have a built-in author field like Hashnode.
    //    Either hardcode the site name, or add an "authorName" Short Text field to
    //    your Content Type and reference it here as fields.authorName.
    const authorNameEl = document.querySelector('[data-article-field="authorName"]');
    if (authorNameEl) {
      authorNameEl.textContent = fields.authorName ?? 'Aionios Life';
    }

    // 8. Author avatar — if you add a "authorPhoto" Media field to your Content Type,
    //    uncomment the block below and it will populate the avatar div.
    // const authorPhotoLink = fields.authorPhoto;
    // if (authorPhotoLink) {
    //   const photoUrl = resolveAssetUrl(authorPhotoLink.sys?.id, includes);
    //   if (photoUrl) {
    //     const avatarDiv = document.querySelector('.article-author-avatar');
    //     if (avatarDiv) {
    //       avatarDiv.innerHTML = `<img src="${photoUrl}" alt=""
    //         style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    //     }
    //   }
    // }

    const bodyEl = document.getElementById('articleBody');
    if (bodyEl && fields.body) {
      bodyEl.innerHTML = richTextToHtml(fields.body, includes);
    }

    // Load related articles at the bottom of the page
    loadRelatedArticles(fields.slug);
  }

  // ── Fetch Related Articles for bottom of article page ───────
  async function loadRelatedArticles(currentSlug) {
    const relatedSection = document.querySelector('.related-section');
    const relatedGrid    = document.getElementById('relatedArticlesGrid');
    if (!relatedGrid) return;

    try {
      const params = new URLSearchParams({
        content_type:  CONTENT_TYPE_ID,
        order:         '-fields.publishedAt',
        limit:         4,
        include:       1,
        select:        'sys.id,fields.title,fields.slug,fields.coverImage,fields.publishedAt,fields.readTime',
        access_token:  CONTENTFUL_ACCESS_TOKEN
      });

      const res = await fetch(`${CDA_BASE}?${params.toString()}`);
      if (!res.ok) {
        if (relatedSection) relatedSection.style.display = 'none';
        return;
      }

      const data = await res.json();
      const items = (data.items ?? []).filter(item => item.fields?.slug !== currentSlug).slice(0, 3);

      if (items.length === 0) {
        if (relatedSection) relatedSection.style.display = 'none';
        return;
      }

      relatedGrid.innerHTML = '';
      items.forEach(entry => {
        const coverUrl = resolveAssetUrl(entry.fields.coverImage?.sys?.id, data.includes);
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
        relatedGrid.appendChild(card);

        if (window.revealObserver) {
          window.revealObserver.observe(card);
        } else {
          card.classList.add('is-revealed');
        }
      });

      if (relatedSection) relatedSection.style.display = '';
    } catch (err) {
      if (relatedSection) relatedSection.style.display = 'none';
    }
  }

  // ── Show an error state ─────────────────────────────────────
  function showError(message) {
    const article = document.querySelector('.article-page');
    if (article) {
      article.innerHTML = `
        <div style="text-align:center; padding: 6rem 1rem;">
          <h1 style="font-size:2rem; margin-bottom:1rem;">Oops!</h1>
          <p style="margin-bottom:2rem;">${message}</p>
          <a href="blog.html" class="btn btn-primary">← Back to Blog</a>
        </div>`;
    }
  }

  // ── Only fetch from Contentful when it is enabled ──────────
  if (CONTENTFUL_ENABLED) {
    loadArticle();
  }
  // When CONTENTFUL_ENABLED is false, the static placeholder content
  // in article.html stays visible. Nothing is cleared or overwritten.

  // ── Share buttons ───────────────────────────────────────────
  // These work regardless of whether CONTENTFUL_ENABLED is true or
  // false — the share URL is always the current page URL, and the
  // article title is taken from whatever is visible in the <h1>.

  const whatsappBtn = document.getElementById('shareWhatsapp');
  const copyLinkBtn = document.getElementById('shareCopyLink');

  whatsappBtn?.addEventListener('click', () => {
    const title = document.getElementById('articleTitle')?.textContent ?? '';
    const url   = window.location.href;
    const text  = title ? `${title}\n${url}` : url;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  });

  copyLinkBtn?.addEventListener('click', async () => {
    const url = window.location.href;

    try {
      // Modern clipboard API — requires HTTPS (works fine on Vercel)
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for HTTP or older browsers
      const input         = document.createElement('input');
      input.value         = url;
      input.style.cssText = 'position:fixed;top:-999px;opacity:0;';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    // Brief visual confirmation on the button
    const original = copyLinkBtn.textContent;
    copyLinkBtn.textContent = '✅ Copied!';
    setTimeout(() => { copyLinkBtn.textContent = original; }, 2000);
  });

})();


