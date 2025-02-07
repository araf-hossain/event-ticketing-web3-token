import { ethers, Wallet } from "ethers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { walletAddress, userType } = await request.json();
    const wallet = new Wallet(
      process.env.COINBASE_PK,
      new ethers.JsonRpcProvider("https://mainnet.base.org")
    );

    const domain = {
      name: "AirdropCommand",
      version: "1.0.0",
      chainId: 8453,
      verifyingContract: process.env.CONTRACT_ADDRESS,
    };

    const types = {
      AirdropCommandData: [
        { name: "userAddress", type: "address" },
        { name: "command", type: "string" },
      ],
    };
    // default, after clicking the DAPP link, will check (excel) is GOV or NON-GOV.
    let command = "shopify-1"; // token 0
    if (userType === "gov") {
      command = "shopify-2"; // token 1
    } else if (userType === "nongov") {
      command = "erc20-auth-lazer"; // usdc $10
    }

    const message = {
      userAddress: walletAddress,
      command: command,
    };

    const signature = ethers.Signature.from(
      await wallet.signTypedData(domain, types, message)
    );
    // console.log(JSON.stringify(signature));

    const postData = {
      ...message,
      signature: {
        r: signature.r,
        s: signature.s,
        v: signature.v,
      },
    };
    // console.log("postDataTest:", postData);

    const response = await axios
      .post("https://api.wallet.coinbase.com/rpc/v2/bot/mint", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((err) => {
        console.log("*** FROM AIRDROP API ERR: ****", err);
        const errMsg = err?.response?.data?.error;
        throw new Error(errMsg || err.message);
      });
    const responseData = response.data.result;
    const responseStatus = response.status;
    console.log("*** FROM AIRDROP API ****", response.data);

    return NextResponse.json(
      { data: responseData },
      { status: responseStatus }
    );
  } catch (error) {
    console.error("Error AIRDROP API:", error);
    return NextResponse.json(
      { message: error || "Error when airdropping." },
      { status: 500 }
    );
  }
}
