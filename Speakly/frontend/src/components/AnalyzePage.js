import React, { Component } from "react";
import GoTo from "./GoTo";
import Footer from "./footer";
import { url_basename, url_pageAddRecord } from "./url_sredemo";

// komponent vykreslující stránku pro analýzu řečníka
function AnalyzePage() {
  return (
    <div className="container custom-container custom-container-flex">
      <div className="costum-body-flex">
        <div className="mt-1">
          <h1 className="display-4 text-center custom-font-size">
            Webové rozhraní pro rozpoznání řečníka
          </h1>
        </div>
        <GoTo
          GoToPage={{
            name: "Go Back To Home Page",
            href: url_basename,
            blue: false,
          }}
        />
        <GoTo
          GoToPage={{
            name: "Add a New Recording To The Database",
            href: url_pageAddRecord,
            blue: false,
          }}
        />
      </div>
      <Footer />
    </div>
  );
}

export default AnalyzePage;
