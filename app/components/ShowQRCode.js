"use client";
import React, { useEffect } from "react";
import QRCode from "qrcode-svg";

function ShowQRCode({ coinbaseLogoSrc, qrUrl }) {
  useEffect(() => {
    const coinbaseQrCode = new QRCode({
      content: qrUrl,
      width: 320,
      height: 320,
      color: "#000",
      padding: 3,
      ecl: "M",
      join: true,
      background: "#fff",
      container: "svg-viewbox",
    });
    const svgQr = coinbaseQrCode.svg();
    document.querySelector("#coinbaseQrCodeWrapper").innerHTML = svgQr;
  }, []);

  return (
    <div>
      <div className="relative w-[200px] h-[200px] mt-3 md:top-4 md:w-[220px] md:h-[220px] md:scale-150 lg:scale-125">
        <img
          src={coinbaseLogoSrc}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
        />
        <div id="coinbaseQrCodeWrapper" className="rounded-xl"></div>
      </div>
    </div>
  );
}

export default ShowQRCode;
