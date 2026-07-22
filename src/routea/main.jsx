// Entry point for the Route A page. Mounts this page's App into #root.
// reloadOnChunkError is imported first to install the stale-deploy safety net.
import "../reloadOnChunkError.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
