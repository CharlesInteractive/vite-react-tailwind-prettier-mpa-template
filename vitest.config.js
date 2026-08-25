import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Dedicated Vitest config. Unlike vite.config.js (whose `root` is `src/` for the
// MPA build), tests run from the project root so test globs and the relative
// import of vite.config.js in tests/routes.test.js resolve cleanly.
export default defineConfig({
  plugins: [react()],
  // Header.jsx imports logos from the public root ("/vite.svg"). Point publicDir
  // at the same folder the build uses (vite.config.js) so those resolve in tests.
  publicDir: "src/public",
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    include: [
      "src/**/*.test.{js,jsx}",
      "tests/**/*.test.{js,jsx}",
      "scripts/**/*.test.js",
    ],
  },
});
