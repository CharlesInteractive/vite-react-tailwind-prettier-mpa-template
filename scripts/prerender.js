// Build pass 3: render every page to HTML and write it into dist/.
//
// Run after `vite build` (client) and `vite build --config vite.ssr.config.js`
// (server). See CLAUDE.md "Rendering" for the full pipeline.
//
// Any failure here fails the build on purpose. The most valuable one is a page
// throwing during renderToString: that means something in its module graph
// touched `window`/`document` at module scope or during render, which is exactly
// the regression that would silently turn SSR back off.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import clientConfig from "../vite.config.js";
import {
  collectAssetUrls,
  prerenderHtml,
  validateMeta,
} from "./prerenderHtml.js";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist");
const serverDir = resolve(distDir, "server");
const srcDir = resolve(rootDir, "src");

const input = clientConfig.build.rollupOptions.input;

// Optional. Set SITE_URL=https://example.com at build time to get absolute
// og:url / og:image tags, which crawlers need. Without it those tags are omitted
// rather than emitted as relative URLs that most crawlers ignore.
const siteUrl = process.env.SITE_URL ?? "";

const SSR_HINT =
  "check for `window`/`document` used at module scope or during render " +
  "(browser-only code belongs in main.jsx or an effect).";

function fail(page, message) {
  throw new Error(`[prerender] ${page}: ${message}`);
}

// dist mirrors src's layout, so src/routea/index.html -> dist/routea/index.html.
function distHtmlPath(srcHtmlPath) {
  return resolve(distDir, relative(srcDir, srcHtmlPath));
}

// "main" is the root page; every other entry key is its own path segment.
function routeFor(key) {
  return key === "main" ? "/" : `/${key}/`;
}

async function loadServerModule(name) {
  const file = resolve(serverDir, `${name}.js`);
  if (!existsSync(file)) {
    throw new Error(
      `[prerender] missing ${relative(rootDir, file)} — run \`npm run build:ssr\` first`,
    );
  }
  try {
    return await import(pathToFileURL(file).href);
  } catch (error) {
    // A module-scope `window`/`document` access anywhere in the page's import
    // graph blows up here, before render() is ever reached.
    fail(
      name,
      `failed to load — ${SSR_HINT}\n  ${error.stack ?? error.message}`,
    );
  }
}

const { render } = await loadServerModule("entryServer");

for (const [key, srcHtmlPath] of Object.entries(input)) {
  const route = routeFor(key);
  const htmlPath = distHtmlPath(srcHtmlPath);

  if (!existsSync(htmlPath)) {
    fail(
      key,
      `${relative(rootDir, htmlPath)} not found — run \`npm run build:client\` first`,
    );
  }

  const { default: App, meta } = await loadServerModule(key);
  if (typeof App !== "function") {
    fail(key, "App.jsx must default-export a component");
  }
  const metaError = validateMeta(meta);
  if (metaError) fail(key, metaError);
  const pageMeta = { siteUrl, ...meta };

  let appHtml;
  try {
    appHtml = render(App, route);
  } catch (error) {
    fail(key, `render failed — ${SSR_HINT}\n  ${error.stack ?? error.message}`);
  }

  // The client and SSR passes hash static assets by content, so both should
  // produce identical /assets/ URLs. Verify rather than trust.
  for (const url of collectAssetUrls(appHtml)) {
    if (!existsSync(resolve(distDir, url.slice(1)))) {
      fail(
        key,
        `rendered markup references ${url}, which the client build did not emit`,
      );
    }
  }

  try {
    writeFileSync(
      htmlPath,
      prerenderHtml(readFileSync(htmlPath, "utf8"), appHtml, pageMeta, route),
    );
  } catch (error) {
    fail(key, error.message);
  }

  console.log(`[prerender] ${route} -> ${relative(rootDir, htmlPath)}`);
}

// Node-only bundle; nothing should deploy it.
rmSync(serverDir, { recursive: true, force: true });
