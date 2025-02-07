"use client";
import { useSearchParams } from "next/navigation";
import Airdrop from "../components/Airdrop";

export default function Registration() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 py-7">
      <Airdrop email={email} />
    </main>
  );
}
