// Entry point for the root page (/). Every page has its own main.jsx that mounts
// its App into #root. reloadOnChunkError is imported first so the stale-deploy
// safety net is installed before anything else runs.
import "./reloadOnChunkError.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
