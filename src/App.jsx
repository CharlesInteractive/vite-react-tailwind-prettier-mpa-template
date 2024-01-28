import { useState } from "react";
import Nav from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Nav />
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
              <code>lint</code> - run the linter
            </li>
            <li>
              <code>dev</code> - run the local development server
            </li>
            <li>
              <code>build</code> - build the project files for distribution
            </li>
            <li>
              <code>preview</code> - preview the build locally
            </li>
          </ul>
          <h3>Multi Page Application</h3>
          <p>
            Example pages have been added. To add your own, create the necessary
            folder inside <code>/src</code> and at it to your vite.config.js.
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
