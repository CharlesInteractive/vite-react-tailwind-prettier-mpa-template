# Vite React Tailwind Prettier MPA Template

<p align="center">
    <a href="https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template/actions/workflows/ci.yml">
        <img src="https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template/actions/workflows/ci.yml/badge.svg" alt="CI status">
    </a>
</p>

<p align="center">
    <img src="./src/public/vite.svg" width="110" height="110" alt="vite">
    <img src="./src/assets/react.svg" width="110" height="110" alt="react">
    <img src="./src/public/tailwindcss.svg" width="110" height="110" alt="tailwindcss">
    <br>
    <br>
</p>

This template has been configured with all of the tools required to create a Multi Page React Application using TailwindCSS with Vite.

Each "page"/route is a fully independent HTML entry point with its own React root — there
is no client-side router. Navigation between pages is plain `<a href>` links that trigger
full page loads.

## Screenshot

<p align="center">
    <img src="screenshot.jpg" alt="screenshot" style="width: 100%; max-width: 900px; height: auto;">
    <br>
    <br>
</p>

## Technologies

![React](https://img.shields.io/badge/frontend-react-61DBFB?style=flat&logo=react)
![Tailwind](https://img.shields.io/badge/frontend-tailwind-00C4C4?style=flat&logo=tailwindcss)
![ESLint](https://img.shields.io/badge/linter-eslint-4B32C3?style=flat&logo=eslint)
![Prettier](https://img.shields.io/badge/formatter-prettier-F8BC45?style=flat&logo=prettier)
![Vite](https://img.shields.io/badge/build-vite-A855F7?style=flat&logo=vite)

- [React](https://react.dev/) 19
- [TailwindCSS](https://tailwindcss.com/) v4 for utility CSS classes (via `@tailwindcss/postcss`)
- [ESLint](https://eslint.org/) 9 (flat config) configured with some initial rules
- [Prettier](https://prettier.io/) 3 to enforce consistent code style (auto-sorts Tailwind classes)
- [Vite](https://vite.dev/) 8 to build the project for development or production
- [Vitest](https://vitest.dev/) 4 with [Testing Library](https://testing-library.com/) for the test suite
- Build-time prerendering: every page is rendered to static HTML and hydrated in the
  browser, so the output is SEO-friendly while staying entirely static

## Development

### Setup

1. `git clone https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template.git`
2. Use the Node version pinned in `.nvmrc` (`v22`), e.g. `nvm use`
3. Run `npm install` to install all of the project's dependencies
4. Run the local development server: `npm run dev`
5. Build the project for production: `npm run build`

### Dev Loop

Day to day:

| Command              | What it does                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`        | Dev server with HMR. Client-only — pages are **not** prerendered here, so `#root` starts empty and `<title>` comes from the static `index.html`. |
| `npm run test:watch` | Re-run the affected tests as you edit                                                                                                            |
| `npm test`           | Run the whole suite once                                                                                                                         |
| `npm run lint`       | ESLint at `--max-warnings 0` — a warning fails the run                                                                                           |
| `npm run format`     | Rewrite files with Prettier (also sorts Tailwind classes)                                                                                        |

Shipping:

| Command           | What it does                                                                     |
| ----------------- | -------------------------------------------------------------------------------- |
| `npm run build`   | Full production build to `dist/` — client, then SSR, then prerender              |
| `npm run preview` | Serve `dist/` locally: prerendered HTML, real asset hashes, exactly what deploys |

The three build passes are also runnable on their own, which is what you want when
debugging a build failure:

| Command                | Pass                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `npm run build:client` | 1 — the normal Vite build                                      |
| `npm run build:ssr`    | 2 — a Node-loadable build of each page's `App.jsx`             |
| `npm run prerender`    | 3 — renders the pages into `dist/` (needs 1 and 2 to have run) |

`SITE_URL=https://example.com npm run build` adds absolute `og:url` / `og:image` tags.

> CI does not check formatting — only `lint`, `test` and `build`. Run `npm run format`
> before committing, or wire `prettier --check .` into your own pre-commit hook.

### Testing

Tests run on [Vitest](https://vitest.dev/) with
[Testing Library](https://testing-library.com/) in a `jsdom` environment. Run them with
`npm test` (or `npm run test:watch`). What's covered:

- **`src/components/Header.test.jsx`** - the active-link logic (the current path drives
  which nav link is highlighted, since there is no router).
- **`src/reloadOnChunkError.test.js`** - the stale-deploy safety net reloads once and is
  guarded against reload loops.
- **`tests/routes.test.js`** - the "add a page = update three places" invariant: every
  `vite.config.js` entry has its folder, `navLinks` stays in sync with the routes, and
  every page carries what the prerender needs (the HTML markers and a `meta` export
  whose title matches its `<title>`).
- **`tests/hydration.test.jsx`** - every page's server-rendered markup hydrates in the
  browser without React logging a mismatch.
- **`scripts/prerenderHtml.test.js`** - the prerender's HTML transforms, including
  escaping of injected metadata.

CI (`.github/workflows/ci.yml`) runs `lint`, `test` and `build` on every push and pull
request using the Node version from `.nvmrc`, then asserts each built page actually got
prerendered — a page that silently shipped an empty `#root` would otherwise pass every
other check.

### Project structure

```
src/
├── index.html            # root page (/) — carries the prerender markers
├── main.jsx              #   its client entry (hydrates the prerendered markup)
├── App.jsx               #   its component, plus the page's `meta` export
├── routea/               # example page: index.html + main.jsx + App.jsx
├── routeb/               #   self-contained — copy, edit, or delete them
├── routec/
├── components/
│   ├── Header.jsx        # shared nav + logo bar
│   ├── navLinks.js       # the nav link list (one of the "three places")
│   └── pathname.js       # usePathname() — works in the browser and the prerender
├── entry-server.jsx      # SSR render entry; build-time only, never shipped
├── reloadOnChunkError.js # stale-deploy reload guard; client-only
├── index.css             # the single stylesheet, imported by every page
├── assets/               # imported assets (content-hashed at build)
└── public/               # copied verbatim into dist/ (favicons, fonts)

scripts/
├── prerender.js          # build pass 3 — renders pages into dist/
└── prerenderHtml.js      #   its pure HTML transforms (unit tested)

tests/
├── routes.test.js        # the MPA invariants
└── hydration.test.jsx    # server markup hydrates without a mismatch

vite.config.js            # client build — the page registry lives here
vite.ssr.config.js        # SSR build — derives its entries from vite.config.js
vitest.config.js          # tests run from the repo root, unlike the build
tailwind.config.js        # theme, loaded via @config in src/index.css
```

`dist/` is build output: it is git-ignored and wiped on every build, so never edit it
by hand — React will overwrite anything you change inside `#root` when it hydrates.

### Multi Page Application

Source lives in `src/` (Vite's `root` is set to `src/`). Example pages `routea`, `routeb`,
and `routec` are self-contained and meant to be copied, edited, or deleted. Each page is a
folder with its own `index.html` + `main.jsx` + `App.jsx`.

To add your own page, update **three** places:

1. Create `src/<name>/` with `index.html`, `main.jsx`, `App.jsx` (copy an existing route).
2. Register the entry in `vite.config.js` under `build.rollupOptions.input`. The SSR
   build reads the same map, so there is nothing extra to register for prerendering.
3. Add a nav link to the `navLinks` array in `src/components/navLinks.js`.

```js
build: {
  outDir,
  emptyOutDir: true,
  rollupOptions: {
    input: {
      main: resolve(root, "index.html"),
      routea: resolve(root, "routea", "index.html"),
      routeb: resolve(root, "routeb", "index.html"),
      routec: resolve(root, "routec", "index.html"),
    },
  },
},
```

### Prerendering (SSR at build time)

Every page is rendered to real HTML during `npm run build` and hydrated in the browser,
so search engines, link-preview bots and users get content immediately instead of an
empty `<div id="root">`. The output is still entirely static — deploy it to Netlify,
Vercel, S3, GitHub Pages or any static host, with no server to run.

`npm run build` is three passes:

1. `npm run build:client` — the normal Vite build.
2. `npm run build:ssr` — a Node-loadable build of every page's `App.jsx`.
3. `npm run prerender` — renders each page and writes the HTML into `dist/`.

Each page's `App.jsx` exports its own metadata, which the prerender injects into that
page's `<head>`:

```jsx
export const meta = {
  title: "Route A · Vite + React + Tailwind CSS",
  description:
    "Route A — an example page in the Vite + React + Tailwind CSS multi-page template.",
};
```

That produces `<title>`, `<meta name="description">` and Open Graph / Twitter card
tags. Set `SITE_URL=https://example.com` at build time to also get absolute `og:url`
and `og:image`.

Two things to know when writing pages:

- **Anything reachable from `App.jsx` also runs in Node**, so don't touch `window`,
  `document` or `localStorage` at module scope or during render — use `useEffect`, or
  put the code in `main.jsx`. For the current path, use `usePathname()` from
  `src/components/pathname.js`. If a page can't be rendered, the build fails rather
  than silently shipping a blank one.
- **The dev server doesn't prerender**, so `npm run dev` behaves exactly as before
  (fast HMR, client-only). The `<title>` in each `index.html` is what dev shows; a test
  keeps it in sync with `meta.title`.

### Tailwind CSS

The default project is styled with preconfigured Tailwind directives and layers. Learn more about Tailwind CSS [here](https://tailwindcss.com/).

A font pack is also included (Nunito Sans) along with its [Open Font License](./src/public/fonts/Nunito_Sans/OFL.txt).

## Deployment

Assets are emitted with content-hashed filenames, so old chunks disappear on each deploy.
To avoid the "white screen after deploy" problem (a stale, cached `index.html` requesting
chunk hashes that no longer exist):

- Serve the HTML entries with `Cache-Control: no-cache` (hashed assets under `dist/assets/`
  can be cached long-term). Configure this at your host/CDN.
- `src/reloadOnChunkError.js` (imported first by every entry) is a client-side safety net
  that does a one-time reload if a stale chunk fails to load after a deploy.

Prerendered HTML makes fresh-HTML serving more important, not less: the markup in each
`index.html` is tied to the asset hashes referenced alongside it.

See [`CLAUDE.md`](./CLAUDE.md) for the full details.

## Contributing

Feel free to [open an issue](https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template/issues/new) or create a PR if you'd like to contribute.

## License

The project is available as open source under the terms of the [MIT License](LICENSE).
