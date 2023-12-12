import React, { useState, useEffect } from "react";
import RecordVoice from "./RecordVoice";
import AnalyzePerson from "./AnalyzePerson";
import { url_analyze_record } from "./url_sredemo";

function NewAnalyze(props) {
  const [showAnalyzePerson, setShowAnalyzePerson] = useState(0); // 0 = žádná nahravka, číslo = poslední analyzovaná nahrávka
  const [fileAnalyzed, setFileAnalyzed] = useState(0); // nastaveno do true po úspěšném analyzování osoby // 1 - nalezena shoda, 2 - nenalezena shoda
  const [analyzingFailed, setAnalyzingFailed] = useState(false); // nastaveno do true po chybě při analyzování
  const [fileIsAnalyzing, setFileIsAnalyzing] = useState(false); // nastaveno do true při uploadovaní na server / analyzování
  const [selectedRecordings, setSelectedRecordings] = useState([]); // URL vybraných nahrávek k odeslání
  const [selectedSentences, setSelectedSentences] = useState([]); // věty vybraných nahrávek k odeslání
  const [uploadRecordsID, setUploadRecordsID] = useState(""); // ID zápisu v databázi, které vrátí server

  const recordVoiceRef = React.createRef(); // reference na volání resetu

  // Zde zavolá metodu resetRecordVoice na instanci komponenty RecordVoice
  const resetRecordVoice = () => {
    recordVoiceRef.current.resetRecordVoice();
  };

  const uploadRecording = async (analyzeDetails) => {
    try {
      // příprava odesílaných dat do proměnné formData
      const formData = new FormData();
      formData.append("method", analyzeDetails.method);
      formData.append("record_number", showAnalyzePerson);
      // pro každou zvolenou nahrávku je třeba nahrávku vložit jako audio soubor do formData
      for (let i = 0; i < selectedRecordings.length; i++) {
        // vytvoření blobu obsahující nahrávku z URL blobu
        const responseBlob = await fetch(selectedRecordings[i]);
        if (!responseBlob.ok) {
          throw new Error("Nahrávání blobu z blobURL selhalo"); // pokud nelze vytvořit blob - error
        }
        const blob = await responseBlob.blob();
        const fileField = `file_to_analyze_${i}`;
        const sentenceField = `recorded_sentence_${i}`;
        const fileName = `recording_${i}.wav`;
        // přidání nahrávky do formData
        formData.append(fileField, new File([blob], fileName));
        // přidání věty k nahrávce do formData
        formData.append(sentenceField, selectedSentences[i]);
      }

      // příprava formátu zprávy s odesílanými daty
      const requestOptions = {
        method: "POST",
        body: formData, // toto obsahuje veškeré odesílané informace
      };

      try {
        // odesílání nahrávky na api serveru
        const response = await fetch(url_analyze_record, requestOptions);
        if (response.status === 200) {
          // pokud zápis do databáze byl vytvořen
          const data = await response.json();
          console.log("Nahrávka byla úspěšně nahrána:", data);
          if (!data.spkr_id) {
            // v databazi nebyla nalezena shoda
            setUploadRecordsID("");
            setFileIsAnalyzing(false); // po úspěšném uploadu není třeba dále zobrazovat info, že se uploaduje
            setFileAnalyzed(2); // systém úspěšně vyhodnotil, že daná osoba není v databázi
          } else {
            // nalezena shoda v databazi
            setUploadRecordsID(data.spkr_id);
            setFileIsAnalyzing(false); // po úspěšném uploadu není třeba dále zobrazovat info, že se uploaduje
            setFileAnalyzed(1); // nalezena shoda
          }
        } else {
          // Zpracování chyby v databázi
          setFileIsAnalyzing(false); // po uploadu není třeba dále zobrazovat info, že se uploaduje
          setAnalyzingFailed(true); // alert, že se nepovedlo nahrát soubor
          // doplnit reset
          throw new Error("Ukládání do databáze selhalo", response.status);
        }
      } catch (error) {
        // Chyba komunikace
        console.log("chyba v komunikaci se serverem");
        // doplnit resetRecordVoice();
        throw new Error(error);
      }
    } catch (error) {
      console.error("Chyba při uploadu na server:", error);
      setFileIsAnalyzing(false); // po uploadu není třeba dále zobrazovat info, že se uploaduje
      setAnalyzingFailed(true); // alert, že se nepovedlo nahrát soubor
    }
  };

  // tlačítko Analyze zmáčknuto - vibírá se jaké nahrávky budou odeslány
  const buttonPressedAnalyze = (analyzeDetails) => {
    setFileAnalyzed(0); // vysledek z předchozí analýzy schovat
    setFileIsAnalyzing(true); // alert, že nyní se uploaduje
    setShowAnalyzePerson(0); // již není třeba zobrazovat rozhraní pro přidání do databáze
    uploadRecording(analyzeDetails);
  };

  // tlačítko Select zmáčknuto - vibírá se jaké nahrávky budou odeslány
  const buttonPressedSelect = (selectedList, allRecordings, allSentences) => {
    // součet prvků v poli
    let sum = 0;
    let selRecordings = []; // obsahuje URL zvolených nahrávek
    let selSentences = []; // obsahuje věty k daným nahrávkám
    for (let i = 0; i < selectedList.length; i++) {
      sum += selectedList[i];
      if (selectedList[i]) {
        selRecordings.push(allRecordings[i]);
        selSentences.push(allSentences[i]);
      }
    }
    setShowAnalyzePerson(sum); // 0 = žádná nahravka, číslo = počet zvolených nahrávek
    setSelectedRecordings(selRecordings);
    setSelectedSentences(selSentences);
    console.log(selRecordings);
  };

  // vykreslení komponenty
  return (
    <div>
      <div className="mt-3">
        <div className="shadow-lg custom-card">
          <div className="row">
            <div className=" d-flex align-items-center justify-content-center">
              <h4>Record your voice for recognition</h4>
            </div>
          </div>

          <div>
            <RecordVoice
              newRecordIsDone={buttonPressedSelect}
              ref={recordVoiceRef}
              info={"Say anything you want, or read the following sentence:"}
            />{" "}
          </div>
        </div>
      </div>

      {showAnalyzePerson ? (
        <div className="mt-3">
          <AnalyzePerson
            AnalyzePersonInfo={buttonPressedAnalyze}
            showAnalyzePerson={showAnalyzePerson}
          />
        </div>
      ) : (
        <div />
      )}

      {fileIsAnalyzing && (
        <div
          className="alert alert-warning text-center custom-success shadow-lg mt-3 "
          role="alert"
        >
          <h4 className="alert-heading">The audio file is analyzing!</h4>
          <p>
            Don't close your browser. Please wait until the analyzing is done.
          </p>
        </div>
      )}

      {analyzingFailed && (
        <div
          className="alert alert-danger alert-dismissible fade show text-center custom-success shadow-lg mt-3 "
          role="alert"
        >
          <h4 className="alert-heading">Something is wrong!</h4>
          <p>
            Your audio file has not been uploaded to the server or the server
            doesn't replying. Please try it later.
          </p>
          <button
            type="button"
            className="btn-close position-absolute top-50 translate-middle"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setAnalyzingFailed(false)} // Zavření alertu kliknutím na tlačítko Zavřít
          ></button>
        </div>
      )}

      {fileAnalyzed ? (
        <div
          className="alert alert-success alert-dismissible fade show text-center custom-success shadow-lg mt-3"
          role="alert"
        >
          <h4 className="alert-heading">Well done!</h4>

          {fileAnalyzed === 1 ? (
            <p>
              You have been successfully recognized. ID of your record is{" "}
              {uploadRecordsID}.
            </p>
          ) : (
            <p>
              Your voice has been successfully analyzed and you have no record
              in the databese. Please add your detailes to the database.
            </p>
          )}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

export default NewAnalyze;
