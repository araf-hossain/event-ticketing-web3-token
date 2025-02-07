/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function HeadingText({ title, description, status }) {
  return (
    <div className="flex flex-col gap-4">
      {status === "success" ? (
        <div>
          <p
            className={
              inter.className +
              " text-2xl md:text-6xl sm:text-xl text-black leading-[53px] m-0 p-0"
            }
          >
            {title}
          </p>
          <p
            className={
              inter.className + " text-xl md:text-2xl text-[#5E5E5E] m-0 p-0 "
            }
          >
            Welcome to the event!
          </p>
          <p
            className={
              inter.className + " text-xl md:text-2xl text-[#5E5E5E] m-0 p-0 "
            }
          >
            We are airdropping you a surprise. Enjoy!
          </p>
          <p
            className={
              inter.className + " text-base md:text-2xl text-[#5E5E5E] m-0 p-0"
            }
          >
            Check the NFT tab in "Assets"
          </p>
        </div>
      ) : (
        <>
          <p
            className={
              inter.className +
              " text-2xl md:text-6xl sm:text-xl text-black leading-[53px] m-0 p-0"
            }
          >
            {title}
          </p>
          <p
            className={
              inter.className + " text-xl md:text-2xl text-[#5E5E5E] m-0 p-0"
            }
          >
            {description}
          </p>
        </>
      )}
    </div>
  );
}

export default HeadingText;
