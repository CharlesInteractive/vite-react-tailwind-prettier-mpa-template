# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A boilerplate template for building simple **Multi-Page Applications (MPA)** with
React, Vite, and Tailwind CSS. Each "page"/route is a fully independent HTML entry
point with its own React root — there is no client-side router. Navigation between
pages is plain `<a href>` links that trigger full page loads.

Every page is **prerendered to static HTML at build time** and hydrated in the
browser, so crawlers and users get real markup instead of an empty `<div id="root">`.
See "Rendering" below. Output is still 100% static — no server to run.

## Stack

- **Vite 8** — dev server + build (`@vitejs/plugin-react` 6)
- **React 19** (`react` / `react-dom`)
- **Tailwind CSS 4** — via `@tailwindcss/postcss` (PostCSS plugin)
- **ESLint 9** — flat config (`eslint.config.js`)
- **Prettier 3** — with `prettier-plugin-tailwindcss` (auto-sorts class names)

Node version is pinned in `.nvmrc`.

## Commands

- `npm run dev` — start the local dev server (HMR; **not** prerendered, see "Rendering")
- `npm run build` — full production build to `dist/`: client, then SSR, then prerender
- `npm run build:client` — pass 1 only (`vite build`)
- `npm run build:ssr` — pass 2 only (`vite build --config vite.ssr.config.js`)
- `npm run prerender` — pass 3 only (`node scripts/prerender.js`); needs passes 1 and 2
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint (`--max-warnings 0`, so warnings fail)
- `npm run test` — run the Vitest suite once
- `npm run test:watch` — Vitest in watch mode

## MPA structure

Source lives in `src/` (Vite `root` is set to `src/` in `vite.config.js`).

- `src/index.html` + `src/main.jsx` + `src/App.jsx` — the root page (`/`)
- `src/routea/`, `src/routeb/`, `src/routec/` — each is one page, mirroring the root
  layout (`index.html` + `main.jsx` + `App.jsx`). Each `main.jsx` mounts its own
  React root into `#root` and imports the shared `../index.css`.
- `src/components/Header.jsx` — shared nav; highlights the active link from
  `usePathname()` (`src/components/pathname.js`), which reads
  `window.location.pathname` in the browser and `PathnameContext` during the
  prerender. The link list lives in `src/components/navLinks.js` (its own module so
  it can be shared with the route-integrity test without tripping
  `react-refresh/only-export-components`).
- `src/entry-server.jsx` — the shared SSR entry; the only render path the prerender
  uses. Not shipped to the browser.

Every entry point must be registered in `vite.config.js` under
`build.rollupOptions.input`. **To add a new page:**

1. Create `src/<name>/` with `index.html`, `main.jsx`, `App.jsx` (copy an existing route).
2. Add `<name>: resolve(root, "<name>", "index.html")` to the `input` map in `vite.config.js`.
3. Add a nav link to the `navLinks` array in `src/components/navLinks.js`.

`tests/routes.test.js` enforces that these three stay in sync, so a missed step fails
the test suite. Copying an existing route also carries the two things the prerender
needs, both likewise enforced by that test:

- `index.html` must keep the `<!--app-html-->` marker inside `<div id="root">` and the
  `<!--app-head-->` marker in `<head>`.
- `App.jsx` must `export const meta = { title, description }`, with `title` matching
  the `<title>` in the sibling `index.html`.

The SSR build derives its entry list from the same `input` map, so there is no fourth
place to register.

## Rendering

`npm run build` runs three passes:

| Pass         | Command                                  | Output                                                          |
| ------------ | ---------------------------------------- | --------------------------------------------------------------- |
| 1. Client    | `vite build`                             | `dist/**/index.html` + hashed `dist/assets/*`                   |
| 2. Server    | `vite build --config vite.ssr.config.js` | `dist/server/{main,routea,…}.js`                                |
| 3. Prerender | `node scripts/prerender.js`              | rewrites each `dist/**/index.html`, then deletes `dist/server/` |

Pass 2 builds each page's **`App.jsx`** as a Node-loadable module — deliberately not
`main.jsx`, which is client-only. That is why `src/reloadOnChunkError.js` (it registers
`window` listeners at module scope) needs no SSR guard: only `main.jsx` imports it, so
it is never in the server module graph.

Pass 3 (`scripts/prerender.js`) renders each page through `src/entry-server.jsx`,
substitutes the markup at `<!--app-html-->`, replaces the `<title>` with `meta.title`,
and injects description/Open Graph/Twitter tags at `<!--app-head-->`. Pure string
helpers live in `scripts/prerenderHtml.js` so they can be unit tested without a build.
Set `SITE_URL=https://example.com` at build time to get absolute `og:url` / `og:image`.

**The prerender fails the build** — on purpose — if a page throws while rendering, if
a marker or `meta` export is missing, or if rendered markup references an
`/assets/…` file the client build did not emit.

### Writing SSR-safe components

Anything reachable from an `App.jsx` runs in Node during the build:

- Never touch `window`, `document`, `localStorage`, or `navigator` at module scope or
  during render. Put browser-only work in `useEffect`, or in `main.jsx`.
- For the current path, use `usePathname()` from `src/components/pathname.js`.
- The client and server trees must match exactly, `React.StrictMode` included, or
  hydration mismatches. `tests/hydration.test.jsx` renders every page server-side and
  hydrates it, failing if React logs anything.

The dev server does **not** prerender, so `#root` is empty there. Each `main.jsx`
branches on `import.meta.env.DEV` — `createRoot` in dev, `hydrateRoot` in production.
Vite inlines that flag, so the unused branch is dropped from the production bundle.
The practical consequence: `<title>` and meta tags in dev come from the static
`index.html`, not from `meta`, and the route test keeps the two in sync.

## Testing

- **Vitest** + **Testing Library** in a `jsdom` environment. `vitest.config.js` runs from
  the project root (not `src/`, unlike the build) and loads `vitest.setup.js` (jest-dom
  matchers + `cleanup`). Tests import from `vitest` explicitly (no globals) so ESLint stays
  clean at `--max-warnings 0`.
- Tests are colocated as `*.test.jsx`/`*.test.js` next to the code, plus
  `tests/routes.test.js` (the MPA "three places" invariant plus the prerender
  prerequisites), `tests/hydration.test.jsx` (server markup hydrates warning-free),
  and `scripts/prerenderHtml.test.js` (the prerender's string transforms).

## Styling (Tailwind 4)

- `src/index.css` is the single stylesheet, imported by every page. It starts with
  `@import "tailwindcss";` and `@config "../tailwind.config.js";`.
- Global element styles (`h1`, `p`, `button`, nav, etc.) are defined with `@apply`
  inside `@layer base` in `src/index.css`.
- The theme (custom `colors`, `fontFamily` — `NunFont`, container `screens`,
  etc.) lives in `tailwind.config.js`, loaded via the `@config` directive (JS config
  is still supported in v4; the theme was not migrated to CSS `@theme`).
- Nunito Sans font pack is in `src/public/fonts/` and declared via `@font-face`.

## Deployment

Assets are emitted with content-hashed filenames (Vite default). On each deploy the
hashes change and old chunks are removed. To avoid the "white screen after deploy"
problem (a stale, cached `index.html` requesting chunk hashes that no longer exist):

1. **Serve HTML with `Cache-Control: no-cache`** (or a very short max-age) so browsers
   always fetch fresh HTML pointing at current asset hashes. Hashed assets under
   `dist/assets/` can be cached long-term (`immutable`). Configure this at your host/CDN
   (e.g. Netlify `_headers`, Vercel `headers`, nginx, CloudFront behaviors).
2. **`src/reloadOnChunkError.js`** is a client-side safety net imported first by every
   entry (`main.jsx`). It listens for Vite's `vite:preloadError` event and does a
   one-time `location.reload()` (guarded via `sessionStorage`) so a user on a stale tab
   recovers automatically instead of seeing a blank page.

## Conventions

- Formatting is Prettier-enforced; Tailwind classes are auto-sorted by the plugin.
- Lint config is flat (`eslint.config.js`) with recommended JS + React + React Hooks
  rules and the `react-refresh` plugin. Keep it passing with zero warnings.
- `dist/` is build output and is git-ignored from linting.
