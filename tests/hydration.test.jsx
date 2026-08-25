// Guards the SSR <-> client contract: the markup scripts/prerender.js writes must
// hydrate cleanly. A hydration mismatch is silent in production (React just
// re-renders and the user sees a flicker), so it is worth failing a test over.
//
// This renders each page the same way src/entry-server.jsx does, drops the result
// into a #root div, then hydrates it exactly the way each main.jsx does, failing
// if React logs anything.
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "../src/entry-server.jsx";
import RootApp from "../src/App.jsx";
import RouteAApp from "../src/routea/App.jsx";
import RouteBApp from "../src/routeb/App.jsx";
import RouteCApp from "../src/routec/App.jsx";

const pages = [
  ["/", RootApp],
  ["/routea/", RouteAApp],
  ["/routeb/", RouteBApp],
  ["/routec/", RouteCApp],
];

let errorSpy;
let warnSpy;

beforeEach(() => {
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(pages)("prerendered %s hydrates cleanly", (route, App) => {
  it("matches the server markup", async () => {
    window.history.pushState({}, "", route);

    const container = document.createElement("div");
    container.id = "root";
    container.innerHTML = render(App, route);
    document.body.appendChild(container);

    let root;
    await act(async () => {
      root = hydrateRoot(
        container,
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
    });

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    container.remove();
  });
});
