import React, { useState, useEffect } from "react";
import { url_sentence } from "./url_sredemo";

function Sentence() {
  const [randomSentence, setRandomSentence] = useState("");

  useEffect(() => {
    // Vytvořte funkci pro načtení náhodné věty z Django pohledu
    const fetchRandomSentence = async () => {
      try {
        const response = await fetch(url_sentence); // Nahraďte URL podle vaší konfigurace
        if (response.ok) {
          const data = await response.json();
          setRandomSentence(data.sentence);
        } else {
          console.error("Chyba při načítání náhodné věty.");
          setRandomSentence("Chyba při načítání náhodné věty...");
        }
      } catch (error) {
        console.error("Chyba při provádění HTTP požadavku:", error);
        setRandomSentence("Chyba při provádění HTTP požadavku...");
      }
    };

    fetchRandomSentence();
  }, []);

  return (
    <div>
      <div>Read following sentence:</div>
      <div className="d-flex align-items-center justify-content-center">
        {randomSentence}
      </div>
    </div>
  );
}

export default Sentence;