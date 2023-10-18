import React, { Component } from "react";
import AddRecordPage from "./AddRecordPage";
import AnalyzePage from "./AnalyzePage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";

function HomePage() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<p>This is a home page.</p>}></Route>
        <Route path="/addrecord/" element={<AddRecordPage />} />
        <Route path="/analyze/" element={<AnalyzePage />} />
      </Routes>
    </Router>
  );
}

export default HomePage;
