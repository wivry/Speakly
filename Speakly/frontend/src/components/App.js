import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./HomePage";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

// komponent vykreslující stránku Reactu do šablony pro Django

const root = ReactDOM.createRoot(document.getElementById("main"));

root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
