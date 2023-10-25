import React, { useState, useEffect } from "react";

const ALERT_TIMER = 5; // doba zobrazení Alertu v sekundách

function AddPerson(props) {
  const [firstName, setFirstName] = useState(""); // křesní jméno
  const [lastName, setLastName] = useState(""); // příjmení
  const [age, setAge] = useState(); // věk
  const [gender, setGender] = useState(""); // pohlaví
  const [sendWarning, setSendWarning] = useState(false); // true - zobrazí alert o vyplnění údajů

  // zmáčknuto tlačítko na odeslání nahrávek na server
  const buttonPressedSend = () => {
    if (firstName === "" || lastName === "") {
      // pokud nejsou vyplněna pole jména
      setSendWarning(true); // zobrazí alert o vyplnění údajů
    } else {
      // předání informací vyšší komponentě
      props.addPersonInfo({
        firstName: firstName,
        lastName: lastName,
      });
      setSendWarning(false); // trigruje alert přes useEffect
      setFirstName(""); // smazání údajů v této komponentě
      setLastName("");
    }
  };

  // zobrazení Alertu a automatické smazání alertu po 5s
  useEffect(() => {
    if (sendWarning) {
      const timeout = setTimeout(() => {
        setSendWarning(false);
      }, 1000 * ALERT_TIMER); // Alert zmizí po 5 sekundách
      // Zrušení timeoutu, pokud komponenta je odstraněna před uplynutím timeoutu
      return () => clearTimeout(timeout);
    }
  }, [sendWarning]);

  // vykreslení komponenty
  return (
    <div className="shadow-lg custom-card mb-5">
      <div className="row mt-3">
        <div className="col-4">
          <h5>Fill your name</h5>
        </div>
      </div>

      <div className="row mb-4">
        <div class="col-4 form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="firstname-field"
            placeholder="Adam"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label for="floatingInput">First name:</label>
        </div>

        <div class="col-4 form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="lastname-field"
            placeholder="Dark"
            value={firstName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label for="floatingInput">Last name:</label>
        </div>
      </div>
      <div className="row">
        <div class="col-4 form-floating">
          <select
            class="form-select"
            id="genderSelect"
            onChange={(e) => setGender(e.target.value)}
          >
            <option selected>Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Different">Different</option>
          </select>
          <label for="floatingSelect">Gender</label>
        </div>
        <div class="col-4 form-floating mb-3">
          <input
            type="number"
            class="form-control"
            id="age-field"
            placeholder="Adam"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <label htmlFor="floatingInput">Age:</label>
        </div>

        <div className="col-4 text-end">
          <button
            type="button"
            className="col btn btn-primary  btn-lg shadow-lg custom-rounded"
            onClick={buttonPressedSend}
          >
            Send recording no. {props.showAddPerson}
          </button>
        </div>
      </div>

      {sendWarning && (
        <div
          className="alert alert-danger alert-dismissible fade show text-center custom-rounded mt-5"
          role="alert"
        >
          You have to fill your name!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setSendWarning(false)} // Zavření alertu kliknutím na tlačítko Zavřít
          ></button>
        </div>
      )}
    </div>
  );
}

export default AddPerson;
