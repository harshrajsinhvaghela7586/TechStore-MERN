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

    const email = String(
      body.email || ""
    )
      .toLowerCase()
      .trim();

    const otp = String(
      body.otp || ""
    ).trim();

    const password = String(
      body.password || ""
    );

    if (
      !email ||
      !otp ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email, OTP and password are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP must be 6 digits",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters",
        },
        {
          status: 400,
        }
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
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid or expired OTP",
        },
        {
          status: 400,
        }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has been blocked",
        },
        {
          status: 403,
        }
      );
    }

    if (
      !user.resetOtp ||
      !user.resetOtpExpiry
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP not found. Please resend OTP.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      new Date(
        user.resetOtpExpiry
      ).getTime() < Date.now()
    ) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "OTP expired. Please resend OTP.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      String(user.resetOtp) !== otp
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    user.password =
      hashedPassword;

    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.resetOtpLastSentAt = null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset successful",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}