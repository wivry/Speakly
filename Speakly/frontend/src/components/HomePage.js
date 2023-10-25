import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Redirect,
} from "react-router-dom";
// import vlastních komponent
import AddRecordPage from "./AddRecordPage";
import AnalyzePage from "./AnalyzePage";
import GoTo from "./GoTo";

function HomePage() {
  return (
    <Router basename="/sredemo">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <div className="container custom-container">
              <div className="mt-3">
                <h1 className="display-4 text-center custom-font-size">
                  Webové rozhraní pro rozpoznání řečníka
                </h1>
              </div>
              <GoTo
                GoToPage={{
                  name: "Add a New Recording To The Database",
                  href: "/addrecord/",
                  blue: true,
                }}
              />
              <GoTo
                GoToPage={{
                  name: "Analyze a Speaker",
                  href: "/analyze/",
                  blue: true,
                }}
              />
            </div>
          }
        ></Route>
        <Route path="/addrecord/" element={<AddRecordPage />} />
        <Route path="/analyze/" element={<AnalyzePage />} />
      </Routes>
    </Router>
  );
}

export default HomePage;
