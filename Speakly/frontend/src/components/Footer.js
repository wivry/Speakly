import React from "react";

// komponent tlačítka pro přechod na jinou stránku
function Footer(props) {
  return (
    <div className="shadow-lg custom-card mt-3 mb-4">
      <div className="row">
        <div className="d-flex justify-content-center">
          <p className="mt-2 mb-2">
            This SRE demo application was created as part of the master's thesis
            by Marek Vavřínek.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
