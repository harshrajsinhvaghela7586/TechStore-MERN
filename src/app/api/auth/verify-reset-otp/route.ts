import { NextResponse } from "next/server";

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

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and OTP are required",
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

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "VERIFY RESET OTP ERROR:",
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