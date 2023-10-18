import RecordVoice from "./RecordVoice";
import AddPerson from "./AddPerson";
import GoToHomePage from "./GoToHomePage";

import React, { useState, useEffect } from "react";

function NewRecord(props) {
  const [showAddPerson, setShowAddPerson] = useState(0); // 0 = žádná nahravka, číslo = index nahrávky
  const [personAdded, setPersonAdded] = useState(false); // nastaveno do true po úspěšném přidání osoby do databáze
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [uploadRecordsID, setUploadRecordsID] = useState(0);

  const recordVoiceRef = React.createRef(); // reference na volání resetu

  // Zde zavolá metodu resetRecordVoice na instanci komponenty RecordVoice
  const resetRecordVoice = () => {
    recordVoiceRef.current.resetRecordVoice();
  };

  const buttonPressedSelect = (index, rec) => {
    setShowAddPerson(index); // 0 = žádná nahravka, číslo = index nahrávky
    setSelectedRecordings(rec);
  };

  const uploadRecording = async (name, blobUrl) => {
    const responseBlob = await fetch(blobUrl);
    const blob = await responseBlob.blob();

    const formData = new FormData();
    formData.append("first_name", name.firstName);
    formData.append("last_name", name.lastName);
    formData.append("record_number", showAddPerson);
    formData.append("recorded_file", new File([blob], "recording.mp3"));

    // JSON.stringify({first_name: name.firstName,last_name: name.lastName,record_number: showAddPerson,})
    //headers: { "Content-Type": "application/json" },

    const requestOptions = {
      method: "POST",
      body: formData,
    };

    const response = await fetch("/api/create-record", requestOptions);
    if (response.status === 201) {
      const data = await response.json();
      console.log("Nahrávka byla úspěšně nahrána:", data);
      setUploadRecordsID(data.id);
      // Nahrávka byla úspěšně uložena
      setPersonAdded(true); // osoba úspěšně přidaná
    }
  };

  const uploadRecordingOld = async (blobUrl) => {
    console.log(blobUrl);
    try {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw new Error("Nahrávání selhalo");
      }
      const blob = await response.blob();
      // Zde máte nahrávaný soubor jako blob, který můžete odeslat na server
      // Vytvořte FormData objekt a přidejte blob soubor do formuláře
      const formData = new FormData();
      //const file = new File([blob], "filename.mp3", { type: blob.type });
      //file.src = blobUrl;

      //formData.append("file[]", blobUrl, "record.mp3");
      formData.append("audio", blob, "filename.mp3");

      try {
        const uploadResponse = await fetch("http://localhost:8000/audio/", {
          method: "POST",
          body: formData,
        });

        if (uploadResponse.status === 201) {
          const data = await uploadResponse.json();
          console.log("Nahrávka byla úspěšně nahrána:", data);
          // Nahrávka byla úspěšně uložena
          //resetRecordVoice(); //resetování RecordVoice
          setPersonAdded(true); // osoba úspěšně přidaná
        } else {
          // Zpracování chyby
          throw new Error("Nahrávání selhalo");
        }
      } catch (error) {
        // Chyba komunikace
        console.log("chyba komunikace");
        throw new Error(error);
      }
    } catch (error) {
      console.error("Chyba při nahrávání:", error);
    }
  };

  // přidá danou nahrávku do databáze
  const addPersonToData = (name) => {
    // tady se přidá do databáze a až databáze potvrdí, že přijala, tak:
    uploadRecording(name, selectedRecordings);
    setShowAddPerson(0); // již není třeba zobrazovat rozhraní pro přidání do databáze
  };

  // při změně personAdded je volán tento effect, který zobrazí na 5s alert se statusem přidání nahrávky
  useEffect(() => {
    if (personAdded) {
      resetRecordVoice(); //resetování RecordVoice
      const timeout = setTimeout(() => {
        setPersonAdded(false);
      }, 8000); // Alert zmizí po 8 sekundách (personAdded se vrátí ndo stavu FALSE)
      // Zrušení timeoutu, pokud komponenta je odstraněna před uplynutím timeoutu
      return () => clearTimeout(timeout);
    }
  }, [personAdded]);

  // vykreslení komponenty
  return (
    <div>
      <GoToHomePage />
      <div className="mt-4">
        <div className="shadow-lg custom-card">
          <div className="row mt-3">
            <h4>Make a new record of a person</h4>
          </div>
          <div className="row mt-2">
            <p>Read following sentence:</p>
          </div>
          <div className="row">
            <h5 id="sentance">
              Toto je věta, kterou je potřeba přečíst pro nahrání dostatečně
              dlouhé nahrávky hlasu.
            </h5>
          </div>

          <div className="mt-4">
            <RecordVoice
              newRecordIsDone={buttonPressedSelect}
              ref={recordVoiceRef}
            />{" "}
          </div>
        </div>
      </div>

      {showAddPerson ? (
        <div className="mt-5">
          <AddPerson
            addPersonInfo={addPersonToData}
            showAddPerson={showAddPerson}
          />{" "}
        </div>
      ) : (
        <div />
      )}

      {personAdded && (
        <div
          className="alert alert-success alert-dismissible fade show text-center custom-success shadow-lg mt-5 "
          role="alert"
        >
          <h4 className="alert-heading">Well done!</h4>
          <p>
            You have successfully added your recording to the database. ID of
            your recording is {uploadRecordsID}.
          </p>
          <button
            type="button"
            className="btn-close position-absolute top-50 translate-middle"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setPersonAdded(false)} // Zavření alertu kliknutím na tlačítko Zavřít
          ></button>
        </div>
      )}
    </div>
  );
}

export default NewRecord;
