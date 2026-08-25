import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        // `meta` is the per-page SEO metadata each App.jsx exports for the
        // build-time prerender (see scripts/prerender.js). It is never read at
        // runtime, so it does not affect fast refresh.
        { allowConstantExport: true, allowExportNames: ["meta"] },
      ],
    },
  },
  {
    // Build tooling and tests run in Node, not the browser: they need `process`,
    // `console` and friends.
    files: ["scripts/**/*.js", "*.config.js", "tests/**/*.js"],
    languageOptions: { globals: globals.node },
  },
];
