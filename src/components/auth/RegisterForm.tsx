"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="bg-[#111827] border border-gray-800 rounded-3xl p-8 shadow-2xl shadow-blue-950/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          Create Account
        </h2>

        <p className="text-gray-400 mt-2">
          Join TechStore and explore premium gadgets.
        </p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">
            Full Name
          </label>

          <Input
            placeholder="Harshrajsinh Vaghela"
            className="h-12 bg-[#1F2937] border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 block">
            Email Address
          </label>

          <Input
            type="email"
            placeholder="you@example.com"
            className="h-12 bg-[#1F2937] border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 mb-2 block">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create strong password"
              className="h-12 bg-[#1F2937] border-gray-700 text-white pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <Button className="w-full h-12 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700">
          Create Account
        </Button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </Card>
  );
}