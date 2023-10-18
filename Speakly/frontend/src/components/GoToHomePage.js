import React from "react";

function GoToHomePage(props) {
  return (
    <div className="shadow-lg custom-card mt-5 mb-5">
      <div className="row">
        <div className="col-3" />
        <a
          className="col-6 btn btn-lg shadow-lg btn-secondary custom-rounded"
          role="button"
          href="/"
        >
          Go Back To Home Page
        </a>
      </div>
    </div>
  );
}

export default GoToHomePage;
