import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";

import User from "@/models/User";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      otp,
    } = body;

    if (
      !name ||
      !email ||
      !password ||
      !otp
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields are required",
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email address",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (
      !strongPasswordRegex.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must include uppercase, lowercase, number and special character",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please send OTP first",
        },
        { status: 404 }
      );
    }

    if (
      user.isEmailVerified &&
      user.password !==
        "__PENDING_EMAIL_VERIFICATION__"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User already exists",
        },
        { status: 400 }
      );
    }

    if (
      !user.emailVerifyOtp ||
      !user.emailVerifyOtpExpiry
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP not found. Please resend OTP.",
        },
        { status: 400 }
      );
    }

    if (
      new Date(
        user.emailVerifyOtpExpiry
      ).getTime() <
      Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP expired. Please resend OTP.",
        },
        { status: 400 }
      );
    }

    if (
      String(user.emailVerifyOtp) !==
      String(otp).trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid OTP",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    user.name = name.trim();
    user.email = normalizedEmail;
    user.password =
      hashedPassword;
    user.isEmailVerified = true;
    user.emailVerifyOtp = null;
    user.emailVerifyOtpExpiry =
      null;
    user.emailVerifyOtpLastSentAt =
      null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Email verified and account created successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(
      "VERIFY REGISTER OTP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while verifying OTP",
      },
      { status: 500 }
    );
  }
}