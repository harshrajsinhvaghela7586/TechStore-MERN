"use client";

import axios from "axios";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Suspense,
  useState,
} from "react";

import { toast } from "sonner";

function AddressPageContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const type =
    searchParams.get("type");

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleCheckout =
    async () => {
      try {
        if (
          !formData.fullName ||
          !formData.phone ||
          !formData.address ||
          !formData.city ||
          !formData.pincode
        ) {
          toast.error(
            "Please fill all fields"
          );

          return;
        }

        setLoading(true);

        const res =
          await axios.post(
            "/api/checkout",
            {
              address: formData,
              type,
            }
          );

        if (res.data.url) {
          window.location.href =
            res.data.url;
        }
      } catch (error: any) {
        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Checkout failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-black mb-12">
          Delivery Address
        </h1>

        <div className="rounded-[40px] border border-gray-800 bg-[#111827] p-10 space-y-6">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
          />

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="w-full h-40 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 py-5"
          />

          <div className="grid grid-cols-2 gap-5">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
            />

            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Redirecting..."
              : "Continue Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
          Loading checkout address...
        </div>
      }
    >
      <AddressPageContent />
    </Suspense>
  );
}