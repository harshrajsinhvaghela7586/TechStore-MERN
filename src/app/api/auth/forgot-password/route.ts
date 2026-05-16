import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/sendEmail";

import User from "@/models/User";

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

const buildResetPasswordEmailHtml = ({
  name,
  otp,
}: {
  name: string;
  otp: string;
}) => {
  return `
<div style="margin:0;padding:0;background:#0B1120;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <div style="max-width:640px;margin:0 auto;padding:32px 18px;">
    <div style="background:#111827;border:1px solid #1f2937;border-radius:28px;overflow:hidden;">
      <div style="height:8px;background:linear-gradient(90deg,#06b6d4,#2563eb,#06b6d4);"></div>

      <div style="padding:34px;">
        <div style="text-align:center;">
          <div style="display:inline-block;width:72px;height:72px;line-height:72px;text-align:center;border-radius:24px;background:linear-gradient(135deg,#06b6d4,#2563eb);font-size:34px;font-weight:900;color:#ffffff;">
            T
          </div>

          <h1 style="font-size:32px;margin:24px 0 10px;font-weight:900;color:#ffffff;">
            Reset Your Password
          </h1>

          <p style="font-size:16px;line-height:26px;color:#9ca3af;margin:0;">
            Hi ${name || "there"}, use the OTP below to reset your TechStore password.
          </p>
        </div>

        <div style="margin:32px 0;padding:26px;border-radius:24px;background:#0B1120;border:1px solid #1f2937;text-align:center;">
          <p style="margin:0 0 12px;color:#9ca3af;font-size:14px;letter-spacing:2px;text-transform:uppercase;">
            Password Reset OTP
          </p>

          <div style="font-size:44px;font-weight:900;letter-spacing:10px;color:#22d3ee;">
            ${otp}
          </div>

          <p style="margin:16px 0 0;color:#facc15;font-size:14px;">
            This OTP will expire in 5 minutes.
          </p>
        </div>

        <div style="padding:18px;border-radius:18px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.18);">
          <p style="margin:0;color:#fecaca;font-size:14px;line-height:24px;">
            If you did not request a password reset, ignore this email. Do not share this OTP with anyone.
          </p>
        </div>

        <p style="text-align:center;color:#6b7280;font-size:13px;margin:28px 0 0;">
          © TechStore. Secure password recovery.
        </p>
      </div>
    </div>
  </div>
</div>
`;
};

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

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email required",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email address",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      email,
    });

    /*
      Generic response for unknown email.
      This avoids exposing whether an email exists.
    */
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If this email exists, an OTP has been sent.",
        },
        {
          status: 200,
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

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email before resetting password",
        },
        {
          status: 403,
        }
      );
    }

    const now = new Date();

    if (user.resetOtpLastSentAt) {
      const diff =
        now.getTime() -
        new Date(
          user.resetOtpLastSentAt
        ).getTime();

      if (diff < 60 * 1000) {
        const waitSeconds =
          Math.ceil(
            (60 * 1000 - diff) /
              1000
          );

        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${waitSeconds} seconds before resending OTP`,
          },
          {
            status: 429,
          }
        );
      }
    }

    const otp = generateOtp();

    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );
    user.resetOtpLastSentAt = now;

    await user.save();

    await sendEmail({
      to: user.email,
      subject:
        "Reset your TechStore password",
      html: buildResetPasswordEmailHtml({
        name: user.name,
        otp,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "OTP sent successfully. Please check your email.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "FORGOT PASSWORD ERROR:",
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