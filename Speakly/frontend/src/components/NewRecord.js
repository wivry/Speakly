import RecordVoice from "./RecordVoice";
import AddPerson from "./AddPerson";
import { url_api } from "./url_sredemo";

import React, { useState, useEffect } from "react";

const ALERT_TIMER = 8; // doba zobrazení Alertu v sekundách

function NewRecord(props) {
  const [showAddPerson, setShowAddPerson] = useState(0); // 0 = žádná nahravka, číslo = index nahrávky
  const [personAdded, setPersonAdded] = useState(false); // nastaveno do true po úspěšném přidání osoby do databáze
  const [personFailed, setPersonFailed] = useState(false); // nastaveno do true po neúspěšném přidání osoby do databáze
  const [personUploading, setPersonUploading] = useState(false); // nastaveno do true po uploadovaní na server
  const [selectedRecordings, setSelectedRecordings] = useState([]); // URL vybrané nahrávky k odeslání
  const [uploadRecordsID, setUploadRecordsID] = useState(""); // ID zápisu v databázi, které vrátí server

  const recordVoiceRef = React.createRef(); // reference na volání resetu

  // Zde zavolá metodu resetRecordVoice na instanci komponenty RecordVoice
  const resetRecordVoice = () => {
    recordVoiceRef.current.resetRecordVoice();
  };

  // tlačítko Select zmáčknuto - vibírá se jaká nahrávka bude odeslaná
  const buttonPressedSelect = (index, rec) => {
    setShowAddPerson(index); // 0 = žádná nahravka, číslo = index nahrávky
    setSelectedRecordings(rec);
  };

  const uploadRecording = async (nameDetails, blobUrl) => {
    try {
      // vytvoření blobu obsahující nahrávku z URL blobu
      const responseBlob = await fetch(blobUrl);
      if (!responseBlob.ok) {
        throw new Error("Nahrávání blobu z blobURL selhalo"); // pokud nelze vytvořit blob - error
      }
      const blob = await responseBlob.blob();
      // příprava odesílaných dat do proměnné formData
      const formData = new FormData();
      formData.append("name", nameDetails.name);
      formData.append("location", nameDetails.location);
      formData.append("gender", nameDetails.gender);
      formData.append("age", nameDetails.age);
      formData.append("record_number", showAddPerson);
      formData.append("recorded_file", new File([blob], "recording.wav"));
      // příprava formátu zprávy s odesílanými daty
      const requestOptions = {
        method: "POST",
        body: formData,
      };

      try {
        // odesílání nahrávky na api serveru
        const response = await fetch(url_api, requestOptions);
        if (response.status === 201) {
          // pokud zápis do databáze byl vytvořen
          const data = await response.json();
          console.log("Nahrávka byla úspěšně nahrána:", data);
          setUploadRecordsID(data.spkr_id);
          // Nahrávka byla úspěšně uložena
          setPersonUploading(false); // po úspěšném uploadu není třeba dále zobrazovat info, že se uploaduje
          setPersonAdded(true); // osoba úspěšně přidaná (v useEffect se tímto triggerem i resetuje component recordVoice)
        } else {
          // Zpracování chyby v databázi
          setPersonUploading(false); // po uploadu není třeba dále zobrazovat info, že se uploaduje
          setPersonFailed(true); // alert, že se nepovedlo nahrát soubor
          throw new Error("Ukládání do databáze selhalo");
        }
      } catch (error) {
        // Chyba komunikace
        console.log("chyba v komunikaci se serverem");
        throw new Error(error);
      }
    } catch (error) {
      console.error("Chyba při uploadu na server:", error);
      setPersonUploading(false); // po uploadu není třeba dále zobrazovat info, že se uploaduje
      setPersonFailed(true); // alert, že se nepovedlo nahrát soubor
    }
  };

  // přidá danou nahrávku do databáze
  const addPersonToData = (nameDetails) => {
    // tady se přidá do databáze a až databáze potvrdí, že přijala, tak:
    setPersonUploading(true); // alert, že nyní se uploaduje
    setShowAddPerson(0); // již není třeba zobrazovat rozhraní pro přidání do databáze
    uploadRecording(nameDetails, selectedRecordings);
  };

  // při změně personAdded je volán tento effect, který zobrazí na 8s alert se statusem přidání nahrávky
  useEffect(() => {
    if (personAdded) {
      resetRecordVoice(); //resetování RecordVoice
      const timeout = setTimeout(() => {
        setPersonAdded(false);
      }, 1000 * ALERT_TIMER); // Alert zmizí po 8 sekundách (personAdded se vrátí ndo stavu FALSE)
      // Zrušení timeoutu, pokud komponenta je odstraněna před uplynutím timeoutu
      return () => clearTimeout(timeout);
    }
  }, [personAdded]);

  // vykreslení komponenty
  return (
    <div>
      <div className="mt-3">
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

          <div>
            <RecordVoice
              newRecordIsDone={buttonPressedSelect}
              ref={recordVoiceRef}
            />{" "}
          </div>
        </div>
      </div>

      {showAddPerson ? (
        <div className="mt-4">
          <AddPerson
            addPersonInfo={addPersonToData}
            showAddPerson={showAddPerson}
          />{" "}
        </div>
      ) : (
        <div />
      )}

      {personUploading && (
        <div
          className="alert alert-warning text-center custom-success shadow-lg mt-4 "
          role="alert"
        >
          <h4 className="alert-heading">The audio file is uploading!</h4>
          <p>
            Don't close your browser. Please wait until the uploading is done.
          </p>
        </div>
      )}

      {personFailed && (
        <div
          className="alert alert-danger alert-dismissible fade show text-center custom-success shadow-lg mt-4 "
          role="alert"
        >
          <h4 className="alert-heading">Something is wrong!</h4>
          <p>
            Your audio file has not been uploaded to the server. Please try it
            later.
          </p>
          <button
            type="button"
            className="btn-close position-absolute top-50 translate-middle"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setPersonFailed(false)} // Zavření alertu kliknutím na tlačítko Zavřít
          ></button>
        </div>
      )}

      {personAdded && (
        <div
          className="alert alert-success alert-dismissible fade show text-center custom-success shadow-lg mt-4 "
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
