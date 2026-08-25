// Example page (Route A). The routea/routeb/routec folders are self-contained
// example pages meant to be copied, edited, or deleted — each has its own
// index.html + main.jsx + App.jsx. See CLAUDE.md for how to add a page.
import { useState } from "react";
import Header from "../components/Header";

// Page metadata, injected into this page's <head> at build time by
// scripts/prerender.js. `title` must match the <title> in the sibling
// index.html (which is what the dev server shows); tests/routes.test.js
// enforces that. `image` and `siteUrl` are optional additions for og: tags.
export const meta = {
  title: "Route A · Vite + React + Tailwind CSS",
  description:
    "Route A — an example page in the Vite + React + Tailwind CSS multi-page template.",
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <div className="container mx-auto mt-12 p-2 text-center">
        <h1>Route A</h1>
        <button className="mb-8" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/routea/App.jsx</code> and save to test HMR.
          <br />
          Click on the Vite, React and Tailwind CSS logos to learn more.
        </p>
      </div>
    </>
  );
}

export default App;
