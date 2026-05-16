"use client";

import Link from "next/link";

import axios from "axios";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [emailLocked, setEmailLocked] =
    useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  const [otp, setOtp] =
    useState("");

  const [resendTimer, setResendTimer] =
    useState(0);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const interval =
      setInterval(() => {
        setResendTimer(
          (prev) =>
            prev > 0
              ? prev - 1
              : 0
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [resendTimer]);

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
        window.location.href =
          "/";
      }
    } catch (error) {}
  };

  const passwordRules =
    useMemo(() => {
      return {
        length:
          formData.password.length >=
          8,
        upper:
          /[A-Z]/.test(
            formData.password
          ),
        lower:
          /[a-z]/.test(
            formData.password
          ),
        number:
          /\d/.test(
            formData.password
          ),
        special:
          /[^A-Za-z\d]/.test(
            formData.password
          ),
      };
    }, [formData.password]);

  const isPasswordStrong =
    Object.values(
      passwordRules
    ).every(Boolean);

  const isBasicValid =
    formData.name.trim()
      .length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      formData.email
    ) &&
    isPasswordStrong;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (emailLocked) {
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const sendOtp = async (
    isResend = false
  ) => {
    try {
      if (!isBasicValid) {
        toast.error(
          "Please fill all details correctly before email verification"
        );
        return;
      }

      if (
        isResend &&
        resendTimer > 0
      ) {
        toast.error(
          `Please wait ${resendTimer}s before resending OTP`
        );
        return;
      }

      setOtpLoading(true);

      const res =
        await axios.post(
          "/api/auth/send-register-otp",
          formData,
          {
            withCredentials: true,
          }
        );

      if (res.data.success) {
        setEmailLocked(true);
        setOtpSent(true);
        setOtp("");
        setResendTimer(60);

        toast.success(
          isResend
            ? "OTP resent successfully"
            : "OTP sent successfully"
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to send OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const changeEmail = () => {
    setEmailLocked(false);
    setOtpSent(false);
    setOtp("");
    setResendTimer(0);

    toast.message(
      "You can update your details now"
    );
  };

  const handleVerifyOtpAndRegister =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        if (!otpSent) {
          toast.error(
            "Please verify your email first"
          );
          return;
        }

        if (
          otp.trim().length !== 6
        ) {
          toast.error(
            "Please enter valid 6 digit OTP"
          );
          return;
        }

        setLoading(true);

        const verifyRes =
          await axios.post(
            "/api/auth/verify-register-otp",
            {
              ...formData,
              otp,
            },
            {
              withCredentials: true,
            }
          );

        if (
          verifyRes.data.success
        ) {
          const loginRes =
            await axios.post(
              "/api/auth/login",
              {
                email:
                  formData.email,
                password:
                  formData.password,
              },
              {
                withCredentials: true,
              }
            );

          toast.success(
            "Email verified and account created successfully"
          );

          window.dispatchEvent(
            new Event(
              "refreshNavbar"
            )
          );

          window.dispatchEvent(
            new Event(
              "userUpdated"
            )
          );

          router.refresh();

          if (
            loginRes.data.user
              .role === "admin"
          ) {
            router.push(
              "/admin/dashboard"
            );
          } else {
            router.push("/");
          }
        }
      } catch (error: any) {
        toast.error(
          error.response?.data
            ?.message ||
            "OTP verification failed"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!mounted) {
    return null;
  }

  const RuleItem = ({
    valid,
    text,
  }: {
    valid: boolean;
    text: string;
  }) => {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${
          valid
            ? "text-green-400"
            : "text-gray-500"
        }`}
      >
        {valid ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}

        <span>{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120] text-white flex items-center justify-center px-4 py-10">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-[130px]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-purple-500/5 blur-[150px]" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_520px] gap-8 items-center">
          {/* LEFT INFO */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-7">
              <Sparkles className="w-4 h-4" />
              TechStore Secure Signup
            </div>

            <h1 className="text-7xl font-black tracking-tight leading-[1.05]">
              Create your
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                verified account.
              </span>
            </h1>

            <p className="text-gray-400 mt-7 text-lg leading-8 max-w-xl">
              Email OTP verification protects your
              TechStore account before registration.
              Once OTP is sent, your details are locked
              until you verify or choose Change Email.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-10 max-w-xl">
              <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 backdrop-blur-xl p-6">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />

                <h3 className="text-xl font-black mt-4">
                  OTP Protected
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-6">
                  Verification OTP expires in 5 minutes.
                </p>
              </div>

              <div className="rounded-[28px] border border-gray-800 bg-[#111827]/70 backdrop-blur-xl p-6">
                <RefreshCw className="w-8 h-8 text-blue-400" />

                <h3 className="text-xl font-black mt-4">
                  Resend Control
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-6">
                  Resend OTP allowed after every 1 minute.
                </p>
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="rounded-[40px] border border-gray-800 bg-[#111827]/85 backdrop-blur-2xl shadow-2xl shadow-cyan-500/5 overflow-hidden">
            {/* TOP BAR */}
            <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

            <div className="p-7 md:p-10">
              {/* BADGE */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-sm font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Secure Registration
                </div>
              </div>

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
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Create Account
                </h1>

                <p className="text-gray-400 mt-4 text-base md:text-lg leading-8">
                  Verify your email with OTP before
                  creating your TechStore account.
                </p>
              </div>

              {/* STATUS */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div
                  className={`rounded-2xl border p-3 text-center ${
                    !otpSent
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "border-green-500/20 bg-green-500/10 text-green-400"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    1. Details
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-3 text-center ${
                    otpSent
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "border-gray-800 bg-[#0B1120] text-gray-500"
                  }`}
                >
                  <p className="text-xs font-semibold">
                    2. OTP
                  </p>
                </div>

                <div
                  className="rounded-2xl border border-gray-800 bg-[#0B1120] text-gray-500 p-3 text-center"
                >
                  <p className="text-xs font-semibold">
                    3. Register
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={
                  handleVerifyOtpAndRegister
                }
                className="mt-8 space-y-6"
              >
                {/* NAME */}
                <div>
                  <label className="text-sm text-gray-400 font-medium">
                    Full Name
                  </label>

                  <div className="relative mt-3">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        emailLocked
                      }
                      required
                      className="w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

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
                      disabled={
                        emailLocked
                      }
                      required
                      className="w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 pl-14 pr-5 outline-none focus:border-cyan-500 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
                      placeholder="Create a strong password"
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        emailLocked
                      }
                      required
                      className="w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 pl-14 pr-14 outline-none focus:border-cyan-500 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={
                        emailLocked
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PASSWORD RULES */}
                {!emailLocked && (
                  <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-5 space-y-3">
                    <p className="text-sm text-cyan-300 font-semibold mb-2">
                      Password Security Rules
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <RuleItem
                        valid={
                          passwordRules.length
                        }
                        text="8+ characters"
                      />

                      <RuleItem
                        valid={
                          passwordRules.upper
                        }
                        text="Uppercase letter"
                      />

                      <RuleItem
                        valid={
                          passwordRules.lower
                        }
                        text="Lowercase letter"
                      />

                      <RuleItem
                        valid={
                          passwordRules.number
                        }
                        text="Number"
                      />

                      <RuleItem
                        valid={
                          passwordRules.special
                        }
                        text="Special character"
                      />
                    </div>
                  </div>
                )}

                {/* VERIFY EMAIL BUTTON */}
                {!otpSent && (
                  <button
                    type="button"
                    onClick={() =>
                      sendOtp(false)
                    }
                    disabled={
                      otpLoading ||
                      !isBasicValid
                    }
                    className="w-full h-16 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Verify Email
                      </>
                    )}
                  </button>
                )}

                {/* OTP SECTION */}
                {otpSent && (
                  <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/[0.06] p-5 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>

                      <div>
                        <h3 className="text-xl font-black">
                          OTP Sent
                        </h3>

                        <p className="text-gray-400 text-sm leading-6 mt-1">
                          We sent a 6 digit OTP to{" "}
                          <span className="text-cyan-300 font-semibold">
                            {
                              formData.email
                            }
                          </span>
                          . Enter it below to create your account.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 font-medium">
                        Enter OTP
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className="mt-3 w-full h-16 rounded-3xl bg-[#0B1120] border border-gray-800 px-6 text-center tracking-[14px] text-2xl font-black outline-none focus:border-cyan-500 transition"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={
                          changeEmail
                        }
                        className="h-14 rounded-2xl border border-gray-700 bg-[#0B1120] text-gray-300 font-semibold hover:border-cyan-500/40 hover:text-cyan-300 transition flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Change Email
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          sendOtp(true)
                        }
                        disabled={
                          otpLoading ||
                          resendTimer > 0
                        }
                        className="h-14 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 font-semibold hover:bg-cyan-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {otpLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resending...
                          </>
                        ) : resendTimer >
                          0 ? (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Resend in {resendTimer}s
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Resend OTP
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        loading ||
                        otp.length !== 6
                      }
                      className="w-full h-16 rounded-3xl bg-gradient-to-r from-green-500 to-cyan-600 font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying OTP...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Verify OTP & Register
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-800" />

                <span className="text-gray-500 text-sm">
                  OR
                </span>

                <div className="flex-1 h-px bg-gray-800" />
              </div>

              {/* LOGIN */}
              <div className="text-center">
                <p className="text-gray-400 text-lg">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center mt-5 h-14 px-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold hover:bg-cyan-500/20 transition"
                >
                  Login Instead
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <p className="text-center text-gray-500 text-sm mt-8 leading-7">
          By creating an account, you agree to
          TechStore's Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}