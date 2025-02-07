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
  console.log("store route");
  try {
    let { walletAddress, email, airdropped, event } = await request.json();
    console.log(walletAddress, email, airdropped, event);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:O",
    });
    const rows = response.data.values;
    let rowIndex = -1; // default there is no row index
    if (email && walletAddress) {
      rowIndex = rows.findIndex((row) => row[2] == email);
    } else if (walletAddress && event === true) {
      // event is true, means it is for event. so updating the Admit Time column.
      rowIndex = rows.findIndex((row) => row[4] == walletAddress);
    }

    console.log(rowIndex, "rowIndex");

    if (rowIndex === -1) {
      throw Error(`Invalid input. Not found any data!`);
    }

    // updating column
    let range;
    let value;
    if (airdropped === "yes") {
      // success (col:N)
      range = `N${rowIndex + 1}`;
      value = "success";
    } else if (event == true) {
      // admit time (col:F)
      range = `F${rowIndex + 1}`;
      value = new Date().toLocaleString();
    } else {
      // wallet address (col:E)
      range = `E${rowIndex + 1}`;
      value = walletAddress;
    }
    // const range =
    //   airdropped === "yes" ? `N${rowIndex + 1}` : `E${rowIndex + 1}`;

    // const value = airdropped === "yes" ? "success" : walletAddress;

    // Call the update method with the constructed range and the data to append
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[value]],
      },
    });

    // Get the updated data
    const { data: updatedData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:O",
    });

    const updatedRows = updatedData.values;

    // console.log(updatedRows[rowIndex]);

    const fName = updatedRows[rowIndex][0]; // first name column: A
    const walletAddr = updatedRows[rowIndex][4]; // wallet address column: E

    const isGov = updatedRows[rowIndex][14]; // gov column: O
    const isGovLowerCase = (isGov && isGov.toLowerCase()) || "no";

    const isRegistered = updatedRows[rowIndex][13]; // registered/success column: N
    const isRegisteredLowerCase = isRegistered && isRegistered.toLowerCase();

    const admitTime = updatedRows[rowIndex][5]; // admit time column: F

    return NextResponse.json(
      {
        fName,
        walletAddr,
        isGov: isGovLowerCase,
        isRegistered: isRegisteredLowerCase,
        admitTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "An error occurred while appending data" },
      { status: 404 }
    );
  }
}
