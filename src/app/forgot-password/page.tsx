"use client";

import axios from "axios";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  toast,
} from "sonner";

export default function ForgotPasswordPage() {
  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpVerified, setOtpVerified] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const sendOtp =
    async () => {
      try {
        if (!formData.email) {
          toast.error(
            "Enter email"
          );

          return;
        }

        setLoading(true);

        const res =
          await axios.post(
            "/api/auth/forgot-password",
            {
              email:
                formData.email,
            }
          );

        if (
          res.data.success
        ) {
          toast.success(
            "OTP sent successfully"
          );

          setOtpSent(true);
        }
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const verifyOtp =
    async () => {
      try {
        if (!formData.otp) {
          toast.error(
            "Enter OTP"
          );

          return;
        }

        setLoading(true);

        const res =
          await axios.post(
            "/api/auth/verify-reset-otp",
            {
              email:
                formData.email,

              otp:
                formData.otp,
            }
          );

        if (
          res.data.success
        ) {
          toast.success(
            "OTP verified"
          );

          setOtpVerified(
            true
          );
        }
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Invalid OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  const resetPassword =
    async () => {
      try {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (
          !passwordRegex.test(
            formData.password
          )
        ) {
          toast.error(
            "Weak password"
          );

          return;
        }

        if (
          formData.password !==
          formData.confirmPassword
        ) {
          toast.error(
            "Passwords do not match"
          );

          return;
        }

        setLoading(true);

        const res =
          await axios.post(
            "/api/auth/reset-password",
            {
              email:
                formData.email,

              password:
                formData.password,
            }
          );

        if (
          res.data.success
        ) {
          toast.success(
            "Password reset successful"
          );

          router.push(
            "/login"
          );
        }
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "Reset failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-xl rounded-[40px] border border-gray-800 bg-[#111827] p-10">

        <h1 className="text-5xl font-black text-center">
          Forgot Password
        </h1>

        <p className="text-gray-400 text-center mt-4">
          Reset your account password
        </p>

        <div className="space-y-6 mt-10">

          {/* EMAIL */}
          <div>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={
                formData.email
              }
              disabled={
                otpSent
              }
              onChange={
                handleChange
              }
              className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5 disabled:opacity-60"
            />

            {otpSent &&
              !otpVerified && (
                <button
                  onClick={() => {
                    setOtpSent(
                      false
                    );

                    setFormData({
                      ...formData,
                      otp: "",
                    });
                  }}
                  className="text-cyan-400 text-sm mt-3"
                >
                  Change Email
                </button>
              )}
          </div>

          {/* OTP */}
          {otpSent &&
            !otpVerified && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={
                    formData.otp
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
                />

                <button
                  onClick={
                    verifyOtp
                  }
                  disabled={
                    loading
                  }
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>
              </>
            )}

          {/* PASSWORD */}
          {otpVerified && (
            <>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                className="w-full h-14 rounded-2xl bg-[#0B1120] border border-gray-800 px-5"
              />

              <div className="text-sm text-gray-400 leading-7">
                Password must contain:
                <br />
                • 8 characters
                <br />
                • 1 uppercase
                <br />
                • 1 lowercase
                <br />
                • 1 number
                <br />
                • 1 special character
              </div>

              <button
                onClick={
                  resetPassword
                }
                disabled={
                  loading
                }
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </>
          )}

          {/* SEND OTP */}
          {!otpSent && (
            <button
              onClick={
                sendOtp
              }
              disabled={
                loading
              }
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold"
            >
              {loading
                ? "Sending..."
                : "Send OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}