// Server-side render entry, used only by the build-time prerender step
// (scripts/prerender.js). It is deliberately generic: every page's App.jsx is
// built as its own SSR entry and handed to render() here, so adding a page needs
// no new server file.
//
// Note this imports App components, never a main.jsx — main.jsx is client-only
// (it touches `document` and imports reloadOnChunkError.js, which registers
// window listeners at module scope).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { PathnameContext } from "./components/pathname.js";

// Mirrors what each main.jsx hydrates on the client. The two trees must match,
// StrictMode included, or hydration will warn.
export function render(App, pathname) {
  return renderToString(
    <StrictMode>
      <PathnameContext.Provider value={pathname}>
        <App />
      </PathnameContext.Provider>
    </StrictMode>,
  );
}
