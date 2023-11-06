import React from "react";

// komponent tlačítka pro přechod na jinou stránku
function Footer(props) {
  return (
    <div className="shadow-lg custom-card mb-4">
      <div className="row">
        <div className="d-flex align-items-center justify-content-center">
          <p>
            This SRE demo application was created as part of the master's thesis
            by Marek Vavřínek.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
