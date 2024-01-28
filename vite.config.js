import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
