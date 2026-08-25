// The current URL path, made available to components in a way that works both in
// the browser and during the build-time prerender (see scripts/prerender.js).
//
// Header uses this to highlight the active nav link. Reading `window.location`
// directly would throw under renderToString, so the server entry
// (src/entry-server.jsx) wraps each page in PathnameContext with the route it is
// rendering. In the browser no provider is needed: the fallback below reads
// `window.location.pathname`, which is the same value the server was given, so
// the hydrated markup matches.
import { createContext, useContext } from "react";

export const PathnameContext = createContext(null);

export function usePathname() {
  const fromContext = useContext(PathnameContext);
  if (fromContext !== null) return fromContext;
  return typeof window === "undefined" ? "/" : window.location.pathname;
}
