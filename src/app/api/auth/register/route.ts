import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Email OTP verification is required. Please use verify-register-otp route.",
    },
    { status: 403 }
  );
}