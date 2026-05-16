"use client";

import Link from "next/link";
import axios from "axios";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  useEffect(() => {
  setMounted(true);

  checkUser();
}, []);

const checkUser = async () => {
  try {
    const res =
      await axios.get(
        "/api/auth/me",
        {
          withCredentials: true,
        }
      );

    if (res.data.success) {
      if (
        res.data.user.role ===
        "admin"
      ) {
        window.location.href =
          "/admin/dashboard";
      } else {
        window.location.href =
          "/";
      }
    }
  } catch (error) {}
};
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res =
        await axios.post(
          "/api/auth/login",
          formData,
          {
            withCredentials: true,
          }
        );

      toast.success(
        "Login successful"
      );

      // REFRESH NAVBAR
      window.dispatchEvent(
        new Event(
          "refreshNavbar"
        )
      );

      router.refresh();

      // ROLE BASED REDIRECT
      if (
  res.data.user.role ===
  "admin"
) {
  window.location.href =
    "/admin/dashboard";
} else {
  window.location.href =
    "/";
}
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120] text-white flex items-center justify-center px-4 py-10">

      {/* GLOW EFFECTS */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-semibold">

            <ShieldCheck className="w-4 h-4" />

            Secure Authentication
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-[40px] border border-gray-800 bg-[#111827]/80 backdrop-blur-2xl shadow-2xl shadow-cyan-500/5 overflow-hidden">

          {/* TOP GRADIENT */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          <div className="p-10">

            {/* LOGO */}
            <div className="flex justify-center">

              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">

                <span className="text-4xl font-black">
                  T
                </span>
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center mt-8">

              <h1 className="text-5xl font-black tracking-tight">
                Welcome Back
              </h1>

              <p className="text-gray-400 mt-4 text-lg leading-8">
                Sign in to continue
                your premium shopping
                experience.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleLogin
              }
              className="mt-10 space-y-6"
            >

              {/* EMAIL */}
              <div>

                <label className="text-sm text-gray-400 font-medium">
                  Email Address
                </label>

                <div className="relative mt-3">

                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-lg"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>

                <label className="text-sm text-gray-400 font-medium">
                  Password
                </label>

                <div className="relative mt-3">

                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 pl-14 pr-14 outline-none focus:border-cyan-500 transition text-lg"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* FORGOT */}
              <div className="flex items-center justify-end">

               <Link
  href="/forgot-password"
  className="text-cyan-400 text-sm"
>
  Forgot Password?
</Link>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />

                    Signing In...
                  </>
                ) : (
                  "Login To Account"
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center gap-4 my-8">

              <div className="flex-1 h-px bg-gray-800" />

              <span className="text-gray-500 text-sm">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* REGISTER */}
            <div className="text-center">

              <p className="text-gray-400 text-lg">
                Don't have an account?
              </p>

              <Link
                href="/register"
                className="inline-flex items-center justify-center mt-5 h-14 px-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold hover:bg-cyan-500/20 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <p className="text-center text-gray-500 text-sm mt-8 leading-7">
          By continuing, you agree
          to TechStore's Terms of
          Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}