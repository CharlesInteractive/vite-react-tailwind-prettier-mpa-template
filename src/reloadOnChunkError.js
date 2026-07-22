// After a new deploy, hashed JS chunk filenames change and the old files are
// removed from the server. A browser holding a stale index.html (or an already
// open tab) then requests chunks that no longer exist, which fails and can
// leave the user staring at a white screen.
//
// Vite fires a `vite:preloadError` event when a dynamically imported chunk
// fails to load. When that happens we do a one-time full reload so the browser
// fetches the fresh index.html and the current chunk hashes. The sessionStorage
// guard prevents an infinite reload loop if the failure is genuinely persistent
// (e.g. the network is down rather than the deploy being stale).
const RELOAD_FLAG = "vite:reloaded-after-chunk-error";

window.addEventListener("vite:preloadError", (event) => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  event.preventDefault();
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
});

// Clear the guard once the app has loaded successfully so a future stale-deploy
// reload is allowed again.
window.addEventListener("load", () => {
  sessionStorage.removeItem(RELOAD_FLAG);
});
