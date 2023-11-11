import React, { useState, useEffect } from "react";

const ALERT_TIMER = 5; // doba zobrazení Alertu v sekundách

function AddPerson(props) {
  const [name, setName] = useState(""); // jméno
  const [location, setLocation] = useState(""); // místo narození
  const [age, setAge] = useState(0); // věk
  const [gender, setGender] = useState("Different"); // pohlaví
  const [sendWarning, setSendWarning] = useState(false); // true - zobrazí alert o vyplnění údajů

  // zmáčknuto tlačítko na odeslání nahrávek na server
  const buttonPressedSend = () => {
    if (age === 0) {
      // pokud nejsou vyplněna pole jména
      setSendWarning(true); // zobrazí alert o vyplnění údajů
    } else {
      // předání informací vyšší komponentě
      props.addPersonInfo({
        name: name,
        location: location,
        gender: gender,
        age: age,
      });
      setSendWarning(false); // trigruje alert přes useEffect
      setName(""); // smazání údajů v této komponentě
      setLocation("");
      setGender("Different");
      setAge(0);
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
    <div className="shadow-lg custom-card">
      <div className="row mt-2 ms-1">
        <div className="col-4">
          <h5>Fill your details</h5>
        </div>
      </div>

      <div className="row">
        <div className="col-4" style={{ padding: 0 }}>
          <div className="form-floating mb-2 ms-2">
            <input
              type="text"
              className="form-control custom-rounded-input"
              id="name-field"
              placeholder="Adam"
              value={name}
              onChange={(e) =>
                setName(e.target.value.length < 49 ? e.target.value : name)
              }
            />
            <label htmlFor="name-field">Name (or nickname):</label>
          </div>
        </div>
        <div className="col-4" style={{ padding: 0 }}>
          <div className="form-floating mb-2 ms-2">
            <input
              type="text"
              className={
                sendWarning
                  ? "form-control is-invalid custom-rounded-input"
                  : "form-control custom-rounded-input"
              }
              id="location-field"
              placeholder="Prague"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value.length < 49 ? e.target.value : location
                )
              }
            />
            <label htmlFor="lastname-field">Place of birth:</label>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-4" style={{ padding: 0 }}>
          <div className="form-floating mb-2 ms-2">
            <select
              className="form-control custom-rounded-input"
              id="genderSelect"
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Different">Different</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label htmlFor="genderSelect">Gender</label>
          </div>
        </div>
        <div className="col-4" style={{ padding: 0 }}>
          <div className="form-floating mb-2 ms-2">
            <input
              type="number"
              className={
                sendWarning
                  ? "form-control is-invalid custom-rounded-input"
                  : "form-control custom-rounded-input"
              }
              id="age-field"
              placeholder="10"
              value={age}
              onChange={(e) =>
                setAge(e.target.value < 140 ? e.target.value : age)
              }
            />
            <label htmlFor="age-field">Age:</label>
          </div>
        </div>
        <button
          type="button"
          className="col-3 btn btn-lg btn-primary shadow-lg custom-rounded mb-2 ms-5"
          onClick={buttonPressedSend}
        >
          Send recording no. {props.showAddPerson}
        </button>
      </div>

      {sendWarning && (
        <div
          className="alert alert-danger alert-dismissible fade show text-center custom-rounded mt-3 mb-2"
          role="alert"
        >
          You have to fill your details!
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
