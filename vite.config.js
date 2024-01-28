import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
  publicDir: resolve(root, "public"),
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
});
