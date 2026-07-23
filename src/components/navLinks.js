// The MPA nav links, in their own module so they can be shared between Header.jsx
// and the route-integrity test without tripping react-refresh's
// "only export components" rule.
//
// Adding a page updates three places in sync (see CLAUDE.md "MPA structure"): the
// src/<name>/ folder, the input map in vite.config.js, and this array. `href` is
// the URL; `match` is the first path segment used to highlight the active link.
export const navLinks = [
  { href: "/", label: "Root", match: "" },
  { href: "/routea/", label: "Route A", match: "routea" },
  { href: "/routeb/", label: "Route B", match: "routeb" },
  { href: "/routec/", label: "Route C", match: "routec" },
];
