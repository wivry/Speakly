import React, { useState, useEffect } from "react";

function AnalyzePerson(props) {
  const [method, setMethod] = useState("ivector"); // metoda analýzy

  // zmáčknuto tlačítko na odeslání nahrávek na server
  const buttonPressedSend = () => {
    // předání informací vyšší komponentě
    console.log("method: ", method);
    props.AnalyzePersonInfo({
      method: method,
    });
  };

  // vykreslení komponenty -  btn-secondary custom-rounded
  return (
    <div className="shadow-lg custom-card">
      <div className="row mt-2 ms-1">
        <div className="col-4">
          <h5>Choose analyzing method</h5>
        </div>
      </div>

      <div className="row">
        <div
          className="col-6 btn-group btn-group d-flex align-items-center"
          role="group"
          aria-label="select method"
        >
          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio1"
            autoComplete="off"
            defaultChecked
            onChange={() => setMethod("ivector")}
          />
          <label
            className="btn btn-outline-secondary custom-rounded-left"
            htmlFor="btnradio1"
          >
            i-Vector
          </label>

          <input
            type="radio"
            className="btn-check"
            name="btnradio"
            id="btnradio2"
            autoComplete="off"
            onChange={(e) => setMethod("xvector")}
          />
          <label
            className="btn btn-outline-secondary custom-rounded-right"
            htmlFor="btnradio2"
          >
            x-Vector
          </label>
        </div>
        <div className="col-2" />
        <button
          type="button"
          className="col-3 btn btn-lg btn-primary shadow-lg custom-rounded ms-5"
          onClick={buttonPressedSend}
        >
          {props.showAnalyzePerson > 1 ? (
            <span>Send {props.showAnalyzePerson} recordings</span>
          ) : (
            <span>Send {props.showAnalyzePerson} recording</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AnalyzePerson;
