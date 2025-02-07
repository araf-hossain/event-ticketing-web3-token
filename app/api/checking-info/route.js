import { NextResponse } from "next/server";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive",
  ],
});
const sheets = google.sheets({ auth, version: "v4" });
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export async function POST(request) {
  console.log("checking info route");
  try {
    const { walletAddress, email } = await request.json();
    console.log(walletAddress, email);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:O",
    });

    const rows = response.data.values;
    let rowIndex = -1; // default there is no row index
    if (email) {
      console.log("checking email",email);
      rowIndex = rows.findIndex((row) => row[2] == email);
    } else if (walletAddress) {
      console.log("checking wallet");
      rowIndex = rows.findIndex((row) => row[4] == walletAddress);
    }

    console.log(rowIndex, "rowIndex");

    if (rowIndex === -1) {
      throw Error(`Invalid input. Not found any data!`);
    }

    const isGov = rows[rowIndex][14]; // gov column: O
    const isGovLowerCase = (isGov && isGov.toLowerCase()) || "no";

    const successCol = rows[rowIndex][13]; // success column: N
    const successColLowerCase = (successCol && successCol.toLowerCase()) || "";

    return NextResponse.json(
      {
        walletAddr: walletAddress,
        requestedEmail: email,
        isGov: isGovLowerCase,
        isAirdropped: successColLowerCase,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Not found any data. Please try again!" },
      { status: 404 }
    );
  }
}
