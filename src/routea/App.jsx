import { useState } from "react";
import Nav from "../components/Nav";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Nav />
      <div className="container mx-auto mt-12 p-2 text-center">
        <h1>Route A</h1>
        <button className="mb-8" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/routea/App.jsx</code> and save to test HMR.
        </p>
        <p className="read-the-docs">
          Click on the Vite, React and Tailwind CSS logos to learn more.
        </p>
      </div>
    </>
  );
}

export default App;
