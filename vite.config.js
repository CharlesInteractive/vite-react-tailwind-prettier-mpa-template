import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

// https://vitejs.dev/config/
//
// Deploy note: JS/CSS assets are emitted with content hashes in their filenames
// (Vite default) for long-term caching + cache busting. For this to work safely,
// the HTML entry files MUST be served with `Cache-Control: no-cache` so browsers
// always fetch fresh HTML referencing the current asset hashes. As a client-side
// safety net, src/reloadOnChunkError.js reloads once if a stale chunk fails to
// load after a new deploy. See CLAUDE.md "Deployment".
export default defineConfig({
  root,
  plugins: [react()],
  publicDir: resolve(root, "public"),
  cssCodeSplit: true,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      // One entry per page. Adding a page = update three places: create the
      // src/<name>/ folder, add it here, and add a nav link in
      // src/components/navLinks.js. (See CLAUDE.md "MPA structure".)
      input: {
        main: resolve(root, "index.html"),
        routea: resolve(root, "routea", "index.html"),
        routeb: resolve(root, "routeb", "index.html"),
        routec: resolve(root, "routec", "index.html"),
      },
    },
  },
});
