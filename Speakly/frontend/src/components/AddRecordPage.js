import React from "react";
import NewRecord from "./NewRecord";

// komponent vykreslující stránku pro nahrávání nových zápisů do databáze
function AddRecordPage() {
  return (
    <div className="container custom-container">
      <div className="mt-3">
        <h1 className="display-4 text-center custom-font-size">
          Webové rozhraní pro rozpoznání řečníka
        </h1>
      </div>
      <NewRecord />
    </div>
  );
}

export default AddRecordPage;
