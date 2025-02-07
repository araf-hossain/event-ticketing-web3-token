import React from "react";
import HeadingText from "../heading_text";
import { RegistrationFailureLogo } from "../Icons";

function ErrorPage({ failureTitle, failureText }) {
  return (
    <>
      <HeadingText title={failureTitle} description={failureText} />
      <div className="w-full flex flex-col items-center justify-between">
        <RegistrationFailureLogo />
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="bg-[#3773F5] w-full mt-5 text-[#0A0B0D] text-base leading-3 p-4 sm:text-2xl sm:leading-8 rounded-full sm:p-7"
        >
          Try again
        </button>
      </div>
    </>
  );
}

export default ErrorPage;
