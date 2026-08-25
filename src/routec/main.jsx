// Entry point for the Route C page. reloadOnChunkError is imported first so the
// stale-deploy safety net is installed before anything else runs.
//
// This file is client-only — it touches `document`, and the prerender never
// imports it (scripts/prerender.js builds App.jsx directly instead).
import "../reloadOnChunkError.js";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "../index.css";

const container = document.getElementById("root");

// Must match the tree src/entry-server.jsx renders, StrictMode included, or
// hydration will mismatch.
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// `npm run build` prerenders this page (see scripts/prerender.js), so in
// production there is real markup in #root to hydrate. The dev server does not
// prerender — #root is empty there, and hydrating nothing is a mismatch — so dev
// mounts a fresh root instead. Vite inlines import.meta.env.DEV, so the unused
// branch is dropped from the production bundle.
if (import.meta.env.DEV) {
  createRoot(container).render(tree);
} else {
  hydrateRoot(container, tree);
}
