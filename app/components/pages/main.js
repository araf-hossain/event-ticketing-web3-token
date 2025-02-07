import React, { useEffect, useState } from "react";
import HeadingText from "../heading_text";
import { HomePageLogo } from "../Icons";
import ShowQRCode from "../ShowQRCode";
import { Inter } from "next/font/google";
import {
  coinbaseLogo,
} from "../../components/Providers";

const inter = Inter({ subsets: ["latin"] });

function MainPage() {
  const [coinbaseLogoSrc, setCoinbaseLogoSrc] = useState();
  const HOST = process.env.HOST;
  const [qrUrl, setQrUrl] = useState(
    "https://go.cb-w.com/dapp?cb_url=" + encodeURI(HOST)
  );

  useEffect(() => {
    setCoinbaseLogoSrc(coinbaseLogo());
  }, [qrUrl, coinbaseLogoSrc]);

  return (
    <>
      <HeadingText
        title={"Welcome"}
        description={"Use the Coinbase Wallet to scan the QR code below"}
      />
      <div className="w-full flex justify-center relative">
        <HomePageLogo />

        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          {(qrUrl && coinbaseLogoSrc && (
            <ShowQRCode coinbaseLogoSrc={coinbaseLogoSrc} qrUrl={qrUrl} />
          )) || (
            <div className="flex justify-center items-center gap-3">
              <p className={inter.className + " text-xl text-white m-0 p-0"}>
                Processing...
              </p>
              <div
                className="inline-block text-center h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Processing...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MainPage;
