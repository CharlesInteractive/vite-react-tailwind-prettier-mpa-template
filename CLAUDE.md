# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A boilerplate template for building simple **Multi-Page Applications (MPA)** with
React, Vite, and Tailwind CSS. Each "page"/route is a fully independent HTML entry
point with its own React root — there is no client-side router. Navigation between
pages is plain `<a href>` links that trigger full page loads.

## Stack

- **Vite 8** — dev server + build (`@vitejs/plugin-react` 6)
- **React 19** (`react` / `react-dom`)
- **Tailwind CSS 4** — via `@tailwindcss/postcss` (PostCSS plugin)
- **ESLint 9** — flat config (`eslint.config.js`)
- **Prettier 3** — with `prettier-plugin-tailwindcss` (auto-sorts class names)

Node version is pinned in `.nvmrc`.

## Commands

- `npm run dev` — start the local dev server (HMR)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint (`--max-warnings 0`, so warnings fail)

## MPA structure

Source lives in `src/` (Vite `root` is set to `src/` in `vite.config.js`).

- `src/index.html` + `src/main.jsx` + `src/App.jsx` — the root page (`/`)
- `src/routea/`, `src/routeb/`, `src/routec/` — each is one page, mirroring the root
  layout (`index.html` + `main.jsx` + `App.jsx`). Each `main.jsx` mounts its own
  React root into `#root` and imports the shared `../index.css`.
- `src/components/Header.jsx` — shared nav; highlights the active link by comparing
  `window.location.pathname`.

Every entry point must be registered in `vite.config.js` under
`build.rollupOptions.input`. **To add a new page:**

1. Create `src/<name>/` with `index.html`, `main.jsx`, `App.jsx` (copy an existing route).
2. Add `<name>: resolve(root, "<name>", "index.html")` to the `input` map in `vite.config.js`.
3. Add a nav link in `src/components/Header.jsx`.

## Styling (Tailwind 4)

- `src/index.css` is the single stylesheet, imported by every page. It starts with
  `@import "tailwindcss";` and `@config "../tailwind.config.js";`.
- Global element styles (`h1`, `p`, `button`, nav, etc.) are defined with `@apply`
  inside `@layer base` in `src/index.css`.
- The theme (custom `colors`, `fontFamily` — `NunFont`/`PlayFont`, container `screens`,
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
