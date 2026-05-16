import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";

import User from "@/models/User";

import { verifyToken } from "@/lib/verifyToken";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const user = await verifyToken();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      name,
      password,
      profileImage,
    } = body;

    const existingUser =
      await User.findById(user._id);

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    existingUser.name = name;

    existingUser.profileImage =
      profileImage || "";

    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (
        !passwordRegex.test(password)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Password must contain 8 characters, uppercase, lowercase, number and special character",
          },
          {
            status: 400,
          }
        );
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      existingUser.password =
        hashedPassword;
    }

    await existingUser.save();

    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Profile update failed",
      },
      {
        status: 500,
      }
    );
  }
}