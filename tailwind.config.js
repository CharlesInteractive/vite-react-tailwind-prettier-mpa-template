// Tailwind theme lives here (JS config, loaded via the `@config` directive in
// src/index.css) rather than in a CSS `@theme` block. Custom colors, fonts, and
// container breakpoints defined below are what the `@apply` rules in index.css use.
/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 4 auto-detects sources relative to the CSS file, so this list is
  // belt-and-braces rather than load-bearing — page `index.html` files are
  // scanned either way. Kept accurate so it documents where classes live.
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
      },
      colors: {
        black: "#242424",
        "black-muted": "#1a1a1a",
        white: "#f2f2f2",
        "white-muted": "#e6e6e6",
        purple: "#646cff",
        blue: "#06b6d4",
      },
      fontFamily: {
        NunFont: ["NunitoSans"],
      },
    },
    container: {
      screens: {
        sm: "550px",
        md: "600px",
        lg: "650px",
        xl: "900px",
        "2xl": "1000px",
      },
    },
  },
  plugins: [],
};
