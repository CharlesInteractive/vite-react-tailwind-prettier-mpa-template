import { useState } from "react";
import Header from "../components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <div className="container mx-auto mt-12 p-2 text-center">
        <h1>Route C</h1>
        <button className="mb-8" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/routec/App.jsx</code> and save to test HMR.
          <br />
          Click on the Vite, React and Tailwind CSS logos to learn more.
        </p>
      </div>
    </>
  );
}

export default App;
