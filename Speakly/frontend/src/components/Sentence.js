import React, { useState, useEffect } from "react";
import { url_sentence } from "./url_sredemo";

function Sentence(props) {
  const [randomSentence, setRandomSentence] = useState("");

  // Vytvořte funkci pro načtení náhodné věty z Django pohledu
  const fetchRandomSentence = async () => {
    try {
      const response = await fetch(url_sentence); // Nahraďte URL podle vaší konfigurace
      if (response.ok) {
        const data = await response.json();
        setRandomSentence(data.sentence);
        props.currentSentence(data.sentence);
      } else {
        console.error("Chyba při načítání náhodné věty.");
        setRandomSentence("Chyba při načítání náhodné věty...");
      }
    } catch (error) {
      console.error("Chyba při provádění HTTP požadavku:", error);
      setRandomSentence("Chyba při provádění HTTP požadavku...");
    }
  };

  useEffect(() => {
    fetchRandomSentence();
  }, []);

  return (
    <div className="">
      <div className="row">
        <div className="col-8">
          <div className="ms-2">{props.info}</div>
        </div>
        <div className="col-2" />
        <div className="col-2">
          <button
            className="btn btn-sm shadow-lg btn-primary custom-rounded mr-3"
            onClick={fetchRandomSentence}
          >
            Change the sentence
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          {randomSentence}
        </div>
      </div>
    </div>
  );
}

export default Sentence;
