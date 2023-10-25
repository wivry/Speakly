import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./HomePage";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import { BrowserRouter } from "react-router-dom";

// komponent vykreslující stránku Reactu do šablony pro Django

/*ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById("root")
);
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
