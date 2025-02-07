import React from "react";
import HeadingText from "../heading_text";
import { RegistrationSuccessLogo } from "../Icons";

function SuccessPage({ fName, welcomeText, status }) {
  return (
    <>
      <HeadingText
        title={`Hi there, ${fName}`}
        description={welcomeText}
        status="success"
      />
      <div className="w-full flex flex-col items-center mt-5">
        <RegistrationSuccessLogo />
      </div>
    </>
  );
}

export default SuccessPage;
