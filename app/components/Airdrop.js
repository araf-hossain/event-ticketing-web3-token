/* eslint-disable react/no-unescaped-entities */
"use client";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import { Inter } from "next/font/google";
import { getCoinbaseWalletProvider } from "./Providers";
import { AirdropLogo } from "./Icons";
import axios from "axios";
import Header from "./Header";
import Image from "next/image";
import AirdropBg from "../../public/images/nft-airdrop.png";

const inter = Inter({ subsets: ["latin"] });

const Airdrop = ({ email }) => {
  const [apiStatus, setApiStatus] = useState("in_progress");
  const [error, setError] = useState("Registration Failed. Please try again!");
  const [airdropStatus, setAirdropStatus] = useState("Processing...");

  useEffect(() => {
    const ethereum = getCoinbaseWalletProvider();

    const connectWallet = async () => {
      console.log("requested for address");
      await ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          accountChangedHandler(accounts[0]);
        });
    };
    connectWallet();
  }, []);

  const accountChangedHandler = async (walletAddress) => {
    // 1, check on excel sheet. if email address exist.
    // 2, if exist, insert the wallet address.
    // 3, after that, airdrop the NFT (tokenid 0) to the wallet address.

    try {
      setAirdropStatus("Checking info...");
      const checkingInfoRes = await checkingInfo(email);
      const { requestedEmail, isAirdropped } = checkingInfoRes.data;
      if (!requestedEmail) {
        throw new Error("Not found user data. Please try again!");
      }

      // if the user already airdropped, then return.
      if (isAirdropped && isAirdropped === "success") {
        setApiStatus("received");
        return;
      }

      // storing wallet address
      const storeWalletAddressRes = await storeInSheet(email, walletAddress);
      console.log(storeWalletAddressRes, "---- RESPONSE");
      const { walletAddr } = storeWalletAddressRes.data;
      if (!walletAddr) {
        throw new Error("Registation Failed. Please try again!");
      }

      // airdropping nft TOKENID 0;
      setAirdropStatus("Airdropping...");
      const airdroprRes = await airdropNFT(walletAddress);
      const { data } = airdroprRes;
      if (data && data.data === "already received") {
        setApiStatus("received");
        return;
      }
      if (!airdroprRes) {
        throw new Error("Airdrop Failed. Please try again!");
      }

      // storing success status for airdropping.
      setAirdropStatus("Registering...");
      const storeAirdroppedDataRes = await storeInSheet(
        email,
        walletAddress,
        "yes"
      );
      setApiStatus("success");
 
      window.location.href = "https://go.cb-w.com/nfcContent?nfc_id=shopify-cb-2023";

      console.log("you are registered and airdropped", storeAirdroppedDataRes);
    } catch (error) {
      console.error("Registration Failed", error);
      setApiStatus("failed");
      setError(error.message || "Registration Failed!");
      return NextResponse.json(
        { error: error.message || "Registration Failed!" },
        { status: 500 }
      );
    }
  };

  const checkingInfo = async (email) => {
    // throw new Error("Checking info failed!");
    try {
      if (typeof email !== "string" || !email) {
        throw new Error(`Invalid email address`);
      }
      const response = await axios
        .post(
          "/api/checking-info",
          { email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.log(err);
          const errMsg = err?.response?.data?.error;
          throw new Error(errMsg || err.message);
        });
      return response;
    } catch (error) {
      console.error("Checking Info Failed", error);
      throw new Error(error.message || "Checking info failed!");
    }
  };

  const storeInSheet = async (email, walletAddress, airdropped) => {
    try {
      if (typeof walletAddress !== "string" || typeof email !== "string") {
        throw new Error(`Invalid wallet address or email address`);
      }
      const response = await axios
        .post(
          "/api/store",
          { walletAddress, email, airdropped },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.log(err);
          const errMsg = err?.response?.data?.error;
          throw new Error(errMsg || err.message);
        });
      return response;
    } catch (error) {
      console.error("Storing Failed", error);
      throw new Error(error.message || "Storing data failed!");
    }
  };

  const airdropNFT = async (walletAddress, userType) => {
    try {
      if (typeof walletAddress !== "string") {
        console.error("Invalid input", walletAddress);
        throw new Error("Invalid wallet address");
      }
      const response = await axios
        .post(
          "/api/airdrop",
          { walletAddress, userType },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .catch((err) => {
          console.log(err);
          const errMsg = err?.response?.data?.error;
          throw new Error(errMsg || err.message);
        });

      // console.log("airdropNFT response", response.data);
      return response;
    } catch (error) {
      console.error("Airdrop NFT failed", error);
      throw new Error(error.message || "Airdrop request failed!");
    }
  };

  return (
    <div className="w-[100%] md:max-w-sm mx-auto">
      <div className="container pb-8">
        <Header />
      </div>
      <div className="pb-7 flex flex-col gap-4">
        {/* Already received the NFT */}
        {apiStatus === "received" && (
          <div className="flex flex-col gap-4">
            <p className={inter.className + " text-xl text-black m-0 p-0 mb-3"}>
              You've <strong>already claimed your ticket</strong>. Check the NFT
              tab under "Assets" to see it.
            </p>
          </div>
        )}

        {/* Success Message */}
        {apiStatus === "success" && (
          <div className="flex flex-col gap-4">
            <p
              className={
                inter.className +
                " text-[40px] text-black leading-[53px] m-0 p-0"
              }
            >
              Thank you for registering.
            </p>
            <p className={inter.className + " text-xl text-[#5E5E5E] m-0 p-0"}>
              Check the NFT tab under "Assets" to view it.
            </p>
          </div>
        )}
        {/* Error Message */}
        {apiStatus === "failed" && (
          <div className="flex items-center gap-3">
            <p className={inter.className + " text-lg text-black m-0 p-0"}>
              {error}
            </p>
          </div>
        )}
        {/* In progress Message */}
        {apiStatus === "in_progress" && (
          <div className="flex flex-col gap-3">
            <div className="items-center justify-center">
              <div className="flex justify-center items-center gap-3">
                <p className={inter.className + " text-xl text-black m-0 p-0"}>
                  {airdropStatus}
                </p>
                <div
                  className="inline-block text-center h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    {airdropStatus}
                  </span>
                </div>
              </div>
            </div>
            <p className={inter.className + " text-xl text-[#5E5E5E] m-0 p-0"}>
              We are airdropping your ticket to the event now. <br />
              Check the NFT tab under "Assets" to view it.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Image
          src={AirdropBg}
          className="max-w-[290px] max-h-[478px] object-contain"
          width={290}
          height={478}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Airdrop;
