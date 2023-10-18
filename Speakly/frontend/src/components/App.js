import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./HomePage";
//import "bootstrap";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);
