"use client";
import Header from "./components/Header";

import React, { useEffect, useState } from "react";
import MainPage from "./components/pages/main";
import SuccessPage from "./components/pages/success";
import ErrorPage from "./components/pages/error";
import Loader from "./components/loader";
import { getCoinbaseWalletProvider } from "./components/Providers";
import axios from "axios";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // screen state
  const [screenState, setScreenState] = useState("main");

  // welcome states
  const [fName, setfName] = useState("");
  const [welcomeText, setWelcomeText] = useState(
    "Welcome to the event. We are airdropping you another surprise. Enjoy!"
  );

  useEffect(() => {
    const provider = getCoinbaseWalletProvider();
    // console.log(ethereum);
    setLoading(true);
    const connectWallet = async () => {
      console.log("requested for address");
      await provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setProvider(provider);
          accountChangedHandler(accounts[0]);
        });
    };
    connectWallet();
  }, []);

  const accountChangedHandler = async (walletAddress) => {
    // 1, check on excel sheet. if wallet address exist.
    // 2, if exist, insert the admit time.
    // 3, after that, airdrop the NFT to the wallet address.
    // 4, But, for airdropping check, if the wallet address is for GOV, then drop (tokenid 1).
    // 5, if the wallet address is for non-GOV, then drop (USDC 10).

    try {
      console.log("checking info...");
      const storeTimeRes = await checkingInfo(walletAddress); // checking info
      console.log(storeTimeRes, "---- RESPONSE");
      const { isGov, walletAddr } = storeTimeRes.data;
      if (!walletAddr && !isGov) {
        throw new Error("Data not found. Please try again!");
      }

      // airdrop for event
      if (isGov === "yes") {
        // airdrop to gov agent
        console.log("airdropping to gov agent.");
        const airdropGovRes = await airdropNFT(walletAddress, "gov");
        console.log(airdropGovRes, "airdrop Gov Res");
        if (airdropGovRes.status !== 200) {
          throw new Error("Airdrop Failed. Please try again!");
        }

        const storeAdmitTime = await storeInSheet(walletAddress, true);
        const { fName } = storeAdmitTime.data;
        if (fName) {
          setfName(fName);
          setScreenState("success");
        }
      } else if (isGov === "no") {
        // airdrop to non-gov agent
        console.log("airdropping to non-gov agent.");
        const airdropNonGovRes = await airdropNFT(walletAddress, "nongov");
        console.log(airdropNonGovRes, "airdrop NonGov Res");

        if (airdropNonGovRes.status !== 200) {
          throw new Error("Airdrop Failed. Please try again!");
        }

        const storeAdmitTime = await storeInSheet(walletAddress, true);
        const { fName } = storeAdmitTime.data;
        if (fName) {
          setfName(fName);
          setScreenState("success");
        }
      }
    } catch (error) {
      console.log(error);
      setScreenState("error");
      throw new Error(error.message || "Checking info failed!");
    } finally {
      setLoading(false);
    }
  };

  const checkingInfo = async (walletAddress) => {
    try {
      if (typeof walletAddress !== "string" || !walletAddress) {
        throw new Error(`Invalid wallet address`);
      }
      const response = await axios
        .post(
          "/api/checking-info",
          { walletAddress },
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

  const storeInSheet = async (walletAddress, event) => {
    try {
      if (typeof walletAddress !== "string" || !walletAddress) {
        throw new Error(`Invalid wallet address`);
      }
      const response = await axios
        .post(
          "/api/store",
          { walletAddress, event },
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
      throw new Error(error.message || "Checking info failed!");
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

  const renderScreen = (currentState) => {
    switch (currentState) {
      case "main":
        return <MainPage />;
      case "success":
        // setInterval(() => {
        //   provider.close();
        // }, 10000);
        return (
          <SuccessPage
            fName={fName}
            welcomeText={welcomeText}
            status="success"
          />
        );
      case "error":
        return (
          <ErrorPage
            failureTitle={"Oops, sorry about that"}
            failureText={"Please see the event co-ordinator for help."}
          />
        );
      default:
        return <MainPage />;
    }
  };

  return (
    <main className="lg:flex h-[100vh] flex-col items-center justify-center md:block">
      <div className="max-w-[834px] bg-[#EEF0F3] p-6 relative h-full">
        <div className="rounded-3xl bg-white p-[40px] h-full grid gap-8">
          <Header />
          {renderScreen(screenState)}
        </div>
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Loader />
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
