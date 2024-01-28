/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,jsx}"],
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
        blackx: "#1a1a1a",
        white: "#f2f2f2",
        whitex: "#e6e6e6",
        purple: "#646cff",
        purplex: "#535bf2",
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
  variants: {
    extend: {
      margin: ["last"],
    },
  },
  plugins: [],
};
