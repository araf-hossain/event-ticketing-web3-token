"use client";
import React from "react";
import Header from "../components/Header";
import MainPage from "../components/pages/main";

function EventQRCode() {
  return (
    <main className="lg:flex h-[100vh] flex-col items-center justify-center md:block">
      <div className="max-w-[834px] bg-[#EEF0F3] p-6 relative h-full">
        <div className="rounded-3xl bg-white p-[40px] h-full grid gap-8">
          <Header />
          <MainPage />
        </div>
      </div>
    </main>
  );
}

export default EventQRCode;
