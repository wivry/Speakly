import React, { Component } from "react";
import GoTo from "./GoTo";

// komponent vykreslující stránku pro analýzu řečníka
function AnalyzePage() {
  return (
    <div className="container custom-container">
      <div className="mt-3">
        <h1 className="display-4 text-center custom-font-size">
          Webové rozhraní pro rozpoznání řečníka
        </h1>
      </div>
      <GoTo
        GoToPage={{
          name: "Go Back To Home Page",
          href: "/sredemo/",
          blue: false,
        }}
      />
      <GoTo
        GoToPage={{
          name: "Add a New Recording To The Database",
          href: "/sredemo/addrecord/",
          blue: false,
        }}
      />
    </div>
  );
}

export default AnalyzePage;
