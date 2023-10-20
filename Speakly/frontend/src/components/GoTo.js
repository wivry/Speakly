import React from "react";

// komponent tlačítka pro přechod na jinou stránku
function GoTo(props) {
  return (
    <div className="shadow-lg custom-card mt-4 mb-4">
      <div className="row">
        <div className="col-3" />
        <a
          className={
            props.GoToPage.blue
              ? "col-6 btn btn-lg shadow-lg btn-primary custom-rounded"
              : "col-6 btn btn-lg shadow-lg btn-secondary custom-rounded"
          }
          role="button"
          href={props.GoToPage.href}
        >
          {props.GoToPage.name}
        </a>
      </div>
    </div>
  );
}

export default GoTo;
