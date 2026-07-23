// Verifies the stale-deploy safety net: on a `vite:preloadError` the app reloads
// exactly once, and a sessionStorage guard prevents an infinite reload loop if
// the failure persists.
import { describe, it, expect, beforeEach, vi } from "vitest";

const RELOAD_FLAG = "vite:reloaded-after-chunk-error";

describe("reloadOnChunkError", () => {
  let reload;

  beforeEach(async () => {
    sessionStorage.clear();
    reload = vi.fn();
    // jsdom's location.reload is non-writable; redefine it as a spy.
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload },
    });
    // Re-import so the module attaches its listeners against these fresh globals.
    vi.resetModules();
    await import("./reloadOnChunkError.js");
  });

  it("reloads once on the first preloadError and sets the guard", () => {
    window.dispatchEvent(new Event("vite:preloadError"));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(RELOAD_FLAG)).toBe("1");
  });

  it("does not reload again while the guard is set", () => {
    window.dispatchEvent(new Event("vite:preloadError"));
    window.dispatchEvent(new Event("vite:preloadError"));

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
