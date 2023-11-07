import React from "react";
import NewRecord from "./NewRecord";
import GoTo from "./GoTo";
import Footer from "./footer";
import { url_basename, url_pageAnalyze } from "./url_sredemo";

// komponent vykreslující stránku pro nahrávání nových zápisů do databáze
function AddRecordPage() {
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

        <NewRecord />
      </div>

      <Footer />
    </div>
  );
}

export default AddRecordPage;
