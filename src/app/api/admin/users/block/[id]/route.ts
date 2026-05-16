import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

import User from "@/models/User";

export async function PUT(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const currentUser =
      await verifyToken();

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
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

    const { id } =
      await context.params;

    if (
      currentUser._id.toString() === id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot block your own admin account",
        },
        {
          status: 400,
        }
      );
    }

    const targetUser =
      await User.findById(id);

    if (!targetUser) {
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

    if (
      targetUser.role === "admin"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin users cannot be blocked",
        },
        {
          status: 400,
        }
      );
    }

    targetUser.isBlocked =
      !targetUser.isBlocked;

    await targetUser.save();

    return NextResponse.json(
      {
        success: true,
        message:
          targetUser.isBlocked
            ? "User blocked successfully"
            : "User unblocked successfully",
        user: {
          _id: targetUser._id,
          isBlocked:
            targetUser.isBlocked,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "ADMIN USER BLOCK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to update user status",
      },
      {
        status: 500,
      }
    );
  }
}