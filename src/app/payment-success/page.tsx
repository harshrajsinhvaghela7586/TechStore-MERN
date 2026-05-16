"use client";

import {
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  const [countdown, setCountdown] =
    useState(5);

  useEffect(() => {
    if (countdown === 0) {

  window.dispatchEvent(
    new Event(
      "refreshNavbar"
    )
  );

  router.push("/orders");

  return;
}
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full rounded-[40px] border border-gray-800 bg-[#111827] p-14 text-center">

        <CheckCircle2 className="mx-auto text-green-400 mb-8 w-24 h-24" />

        <h1 className="text-5xl font-black">
          Payment Successful
        </h1>

        <p className="text-gray-400 text-lg mt-6 leading-8">
          Your order has been successfully placed.
        </p>

        <div className="mt-10">
          <div className="inline-flex px-8 py-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-3xl font-black">
            {countdown}s
          </div>
        </div>

        <p className="text-gray-400 mt-8 text-lg">
          Redirecting to orders page...
        </p>

        <button
          onClick={() =>
            router.push("/orders")
          }
          className="mt-10 h-14 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg"
        >
          Go To Orders
        </button>
      </div>
    </div>
  );
}