// Template invariant guard. Adding a page means updating three places in sync
// (CLAUDE.md "MPA structure"): the src/<name>/ folder, the input map in
// vite.config.js, and the navLinks array in Header.jsx. This test fails if any
// of the three drift out of sync.
//
// It also guards what the build-time prerender needs from every page: the two
// HTML markers scripts/prerender.js substitutes into, and a `meta` export whose
// title agrees with the <title> the dev server shows.
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import viteConfig from "../vite.config.js";
import { navLinks } from "../src/components/navLinks.js";
import { APP_MARKER, HEAD_MARKER } from "../scripts/prerenderHtml.js";

const rootDir = dirname(fileURLToPath(import.meta.url)) + "/..";
const input = viteConfig.build.rollupOptions.input;

// The "main" entry is the root page (src/index.html); the rest live in
// src/<name>/. Map each non-main input key to its route folder name.
const routeKeys = Object.keys(input).filter((key) => key !== "main");

describe("MPA entry points", () => {
  it.each(Object.entries(input))(
    "entry '%s' has index.html, main.jsx and App.jsx",
    (_key, htmlPath) => {
      const dir = dirname(htmlPath);
      expect(basename(htmlPath)).toBe("index.html");
      for (const file of ["index.html", "main.jsx", "App.jsx"]) {
        expect(existsSync(resolve(dir, file))).toBe(true);
      }
    },
  );
});

describe("navLinks <-> routes are in sync", () => {
  const linkMatches = navLinks.map((l) => l.match).filter(Boolean);

  it("every route entry has a matching nav link", () => {
    for (const key of routeKeys) {
      expect(linkMatches).toContain(key);
    }
  });

  it("every non-root nav link points at a real route folder", () => {
    for (const match of linkMatches) {
      expect(existsSync(resolve(rootDir, "src", match, "index.html"))).toBe(
        true,
      );
      // …and that folder is registered as a build entry.
      expect(routeKeys).toContain(match);
    }
  });
});

describe("pages are prerenderable", () => {
  it.each(Object.entries(input))(
    "entry '%s' has the prerender markers in its index.html",
    (_key, htmlPath) => {
      const html = readFileSync(htmlPath, "utf8");
      expect(html).toContain(APP_MARKER);
      expect(html).toContain(HEAD_MARKER);
    },
  );

  it.each(Object.entries(input))(
    "entry '%s' exports meta matching its <title>",
    async (_key, htmlPath) => {
      const { default: App, meta } = await import(
        resolve(dirname(htmlPath), "App.jsx")
      );

      expect(typeof App).toBe("function");
      expect(meta?.title?.trim()).toBeTruthy();
      expect(meta?.description?.trim()).toBeTruthy();

      const title = readFileSync(htmlPath, "utf8").match(
        /<title>([\s\S]*?)<\/title>/,
      )?.[1];
      expect(title).toBe(meta.title);
    },
  );
});
