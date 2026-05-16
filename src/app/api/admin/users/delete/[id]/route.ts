import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

import User from "@/models/User";
import Order from "@/models/Order";

export async function DELETE(
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
            "You cannot delete your own admin account",
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
            "Admin users cannot be deleted",
        },
        {
          status: 400,
        }
      );
    }

    const orderCount =
      await Order.countDocuments({
        user: id,
      });

    if (orderCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This user has orders. Block the user instead of deleting.",
        },
        {
          status: 400,
        }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message:
          "User deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(
      "ADMIN USER DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}