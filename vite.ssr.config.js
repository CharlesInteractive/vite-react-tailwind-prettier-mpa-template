import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import clientConfig from "./vite.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "src");

// Second build pass: a Node-loadable build of every page, used only by
// scripts/prerender.js and deleted from dist/ once prerendering is done.
//
// The entry for each page is its App.jsx, not its main.jsx — main.jsx is
// client-only. The page list is derived from the client config's input map so
// registering a page stays a one-place change (see CLAUDE.md "MPA structure").
const input = Object.fromEntries(
  Object.entries(clientConfig.build.rollupOptions.input).map(([key, html]) => [
    key,
    resolve(dirname(html), "App.jsx"),
  ]),
);
input.entryServer = resolve(root, "entry-server.jsx");

export default defineConfig({
  root,
  // A fresh plugin instance: reusing the one held by clientConfig across two
  // builds is not safe.
  plugins: [react()],
  build: {
    ssr: true,
    outDir: resolve(__dirname, "dist", "server"),
    // dist/ already holds the finished client build at this point.
    emptyOutDir: false,
    // Assets are emitted by the client build; the SSR pass only needs the URLs.
    ssrEmitAssets: false,
    rollupOptions: {
      input,
      // No content hashes, so prerender.js can import dist/server/<key>.js.
      output: { entryFileNames: "[name].js" },
    },
  },
});
