// Root page (/) component. Each MPA page has its own App.jsx; this one doubles as
// the template's landing/docs page.
import { useState } from "react";
import Header from "./components/Header";

// Page metadata, injected into this page's <head> at build time by
// scripts/prerender.js. `title` must match the <title> in the sibling
// index.html (which is what the dev server shows); tests/routes.test.js
// enforces that. `image` and `siteUrl` are optional additions for og: tags.
export const meta = {
  title: "Vite + React + Tailwind CSS",
  description:
    "A boilerplate template for building multi-page applications with React, Vite, Tailwind CSS and Prettier.",
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <div className="container mx-auto mt-12 p-2">
        <h1 className="text-center">Vite + React + Tailwind CSS</h1>
        <h2 className="mb-5 text-center">
          Multi Page React Application using Tailwind CSS with Vite
        </h2>
        <button
          className="mx-auto mb-8 block"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <div className="mx-auto max-w-xl">
          <p className="mb-24 text-center">
            Edit <code>src/App.jsx</code> and save to test HMR.
            <br />
            Click on the Vite, React and Tailwind CSS logos to learn more.
          </p>
          <h3>Setup</h3>
          <ol>
            <li>
              <code>
                git clone
                https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template.git
              </code>
            </li>
            <li>
              Use the Node version pinned in <code>.nvmrc</code>, e.g.{" "}
              <code>nvm use</code>
            </li>
            <li>
              Run <code>npm install</code> to install all of the project&apos;s
              dependencies
            </li>
            <li>
              Run the local development server: <code>npm run dev</code>
            </li>
            <li>
              Build the project for production: <code>npm run build</code>
            </li>
          </ol>
          <h3>Dev Loop</h3>
          <ul>
            <li>
              <code>npm run dev</code> - dev server with HMR. Client-only, so
              pages are not prerendered here
            </li>
            <li>
              <code>npm test</code> / <code>npm run test:watch</code> - run the
              suite once, or re-run it as you edit
            </li>
            <li>
              <code>npm run lint</code> - ESLint at{" "}
              <code>--max-warnings 0</code>, so a warning fails the run
            </li>
            <li>
              <code>npm run format</code> - format with Prettier, which also
              sorts Tailwind classes
            </li>
            <li>
              <code>npm run build</code> - full production build to{" "}
              <code>dist/</code>: client, then SSR, then prerender
            </li>
            <li>
              <code>npm run preview</code> - serve the production build locally
            </li>
          </ul>
          <p>
            The three build passes also run on their own as{" "}
            <code>build:client</code>, <code>build:ssr</code> and{" "}
            <code>prerender</code>, which is what you want when debugging a
            build. CI runs lint, test and build but does not check formatting,
            so run <code>npm run format</code> before committing.
          </p>
          <h3>Testing</h3>
          <p>
            Vitest and Testing Library run in a jsdom environment. Beyond the
            component tests, the suite guards this template&apos;s invariants:
            routes stay in sync with the nav and the build entries, every
            page&apos;s prerendered markup hydrates without a mismatch, and the
            prerender escapes the metadata it injects.
          </p>
          <h3>Multi Page Application</h3>
          <p>
            Each page is a folder in <code>/src</code> with its own{" "}
            <code>index.html</code>, <code>main.jsx</code> and{" "}
            <code>App.jsx</code>, mounting its own React root — there is no
            client-side router, so navigation is a full page load. To add one,
            copy an existing route folder, register it in{" "}
            <code>vite.config.js</code>, and add a nav link in{" "}
            <code>src/components/navLinks.js</code>. A test fails if those three
            drift apart.
          </p>
          <h3>Prerendering</h3>
          <p>
            This page is static HTML: <code>npm run build</code> renders every
            page to real markup and the browser hydrates it, so crawlers and
            link previews see content rather than an empty root element. The
            build output is still fully static — no server required. Each page
            exports a <code>meta</code> object from its <code>App.jsx</code> for
            its title, description and Open Graph tags.
          </p>
          <p>
            Anything reachable from an <code>App.jsx</code> also runs in Node at
            build time, so avoid <code>window</code> and <code>document</code>{" "}
            at module scope or during render. If a page cannot be rendered the
            build fails, rather than quietly shipping a blank one.
          </p>
          <h3>Tailwind CSS</h3>
          <p>
            The default project is styled with preconfigured Tailwind directives
            and layers. Learn more about Tailwind CSS{" "}
            <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
              here
            </a>
            .
          </p>
          <p>
            A font pack is also included (Nunito Sans) along with its Open Font
            License.
          </p>
          <h3>Deployment</h3>
          <p>
            The output in <code>dist/</code> is fully static, so any static host
            will serve it. Serve the HTML entries with{" "}
            <code>Cache-Control: no-cache</code> so browsers always get markup
            that matches the current asset hashes; the hashed files under{" "}
            <code>dist/assets/</code> can be cached indefinitely.
          </p>
          <h3>Contributing</h3>
          <p>
            Feel free to{" "}
            <a
              href="https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template/issues/new"
              target="_blank"
              rel="noreferrer"
            >
              open an issue
            </a>{" "}
            or create a PR if you&apos;d like to contribute.
          </p>
          <h3>License</h3>
          <p>
            The project is available as open source under the terms of the MIT
            License.
          </p>
          <p className="mb-24 text-center text-2xl">
            <a
              href="https://github.com/CharlesInteractive/vite-react-tailwind-prettier-mpa-template/"
              target="_blank"
              rel="noreferrer"
            >
              View Project on GitHub
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
