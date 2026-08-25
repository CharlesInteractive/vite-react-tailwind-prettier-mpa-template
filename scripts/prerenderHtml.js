// Pure string transforms used by scripts/prerender.js. Kept separate from the
// file I/O so they can be unit tested without running a build.

export const APP_MARKER = "<!--app-html-->";
export const HEAD_MARKER = "<!--app-head-->";

// Escapes text destined for an HTML text node or a double-quoted attribute.
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Replaces the placeholder <title> that index.html carries for the dev server
// with the page's own meta.title.
export function replaceTitle(html, title) {
  if (!/<title>[\s\S]*?<\/title>/.test(html)) {
    throw new Error("no <title> element to replace");
  }
  return html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  );
}

// Builds the SEO/social tags injected at HEAD_MARKER. `meta.image` and
// `meta.siteUrl` are optional; absolute URLs are only emitted when siteUrl is set,
// since relative og:image/og:url values are ignored by most crawlers.
export function renderHeadTags(meta, route) {
  const tags = [
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  ];

  if (meta.siteUrl) {
    const url = new URL(route, meta.siteUrl).href;
    tags.push(`<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  if (meta.image) {
    const image = meta.siteUrl
      ? new URL(meta.image, meta.siteUrl).href
      : meta.image;
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
  }

  tags.push(
    `<meta name="twitter:card" content="${meta.image ? "summary_large_image" : "summary"}" />`,
  );

  return tags.join("\n    ");
}

// Substitutes the rendered markup into <div id="root">.
export function injectApp(html, appHtml) {
  if (!html.includes(APP_MARKER)) {
    throw new Error(
      `missing ${APP_MARKER} marker — add it inside <div id="root"> in index.html`,
    );
  }
  return html.replace(APP_MARKER, appHtml);
}

// Applies every transform to one built index.html.
export function prerenderHtml(html, appHtml, meta, route) {
  const withApp = injectApp(html, appHtml);
  const withTitle = replaceTitle(withApp, meta.title);
  return withTitle.includes(HEAD_MARKER)
    ? withTitle.replace(HEAD_MARKER, renderHeadTags(meta, route))
    : withTitle;
}

// Validates a page's `meta` export. Returns an error string, or null if it is ok.
export function validateMeta(meta) {
  if (!meta || typeof meta !== "object") {
    return "App.jsx must `export const meta = { title, description }`";
  }
  for (const field of ["title", "description"]) {
    if (typeof meta[field] !== "string" || meta[field].trim() === "") {
      return `meta.${field} must be a non-empty string`;
    }
  }
  return null;
}

// Pulls every /assets/... URL out of rendered markup so the caller can check the
// client build actually emitted those files. A mismatch between the two build
// passes would otherwise surface as a broken image plus a hydration warning.
export function collectAssetUrls(appHtml) {
  const urls = new Set();
  for (const match of appHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    urls.add(match[1]);
  }
  return [...urls];
}
